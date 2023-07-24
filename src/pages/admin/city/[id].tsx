import { NextPage } from 'next';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import {
  cityLoading,
  createNewCity,
  getCityInfo,
  editCityInfo,
} from '../../../features/city/citySlice';
import { KeyValue } from '../../../common/config/interfaces';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import BasicEditHeader from '../../../common/components/default/masterData/basicEditHeader';

const DetailCity: NextPage = () => {
  const [inputsInitialState, setInputsInitialState] = useState({
    name: '',
    slug: '',
  });
  const [inputs, setInputs] = useState(inputsInitialState);
  const [inputsError, setInputErrors] = useState({ name: '' });
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loadingStatus = useAppSelector(cityLoading);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => {
      return { ...values, [name]: value };
    });
  }

  function handleSubmit() {
    if (validate()) {
      try {
        const res = dispatch(
          isEdit ? editCityInfo(inputs) : createNewCity(inputs),
        ).unwrap();
        res.then(async (data: KeyValue) => {
          if (data.isSuccess) {
            toast(`City ${isEdit ? 'edited' : 'added'} successfully`, {
              hideProgressBar: true,
              autoClose: 2000,
              type: 'success',
            });
            await router.push('/admin/city');
          }
        });
      } catch (e) {}
    }
  }

  function validate() {
    let isValid = true;
    if (!inputs.name) {
      isValid = false;
      setInputErrors((values) => ({
        ...values,
        name: 'City name can not be empty',
      }));
    } else {
      setInputErrors((values) => ({ ...values, name: '' }));
    }
    return isValid;
  }

  function resetInput() {
    setInputs(inputsInitialState);
  }

  useEffect(() => {
    const cityId = router.query.id;
    if (cityId && cityId !== 'add') {
      const cityIdNum = parseInt(cityId as string);
      if (!isNaN(cityIdNum)) {
        setIsEdit(true);
        const response = dispatch(getCityInfo({ id: cityIdNum })).unwrap();
        response.then((resData) => {
          if (resData.isSuccess) {
            setInputs(resData.data.city);
            setInputsInitialState(resData.data.city);
          }
        });
      }
    }
  }, [router.query]);

  async function goToList() {
    await router.push(`/admin/city`);
  }

  const header = () => {
    return (
      <BasicEditHeader
        isEdit={isEdit}
        titleAdd={{ big: `Add City`, small: `Add a new City` }}
        titleEdit={{
          big: `Edit City`,
          small: `Edit a city information`,
        }}
        handleSubmit={handleSubmit}
        resetInput={resetInput}
        url={`/admin/city`}
      />
    );
  };

  return (
    <>
      <Head>
        <title>City management</title>
      </Head>
      {loadingStatus === 'loading' && (
        <ProgressSpinner className="h-12 w-12 absolute top-[100px] left-[calc(50%-50px)] z-20" />
      )}
      {loadingStatus === 'idle' && (
        <Card
          header={header}
          className="!border-none !rounded-none mx-auto my-5"
        >
          <div>
            <div className={'flex-row flex gap-8'}>
              <div className={'basis-1/2'}>
                <span className="p-float-label">
                  <InputText
                    id="cityname"
                    name="name"
                    value={inputs.name}
                    onChange={handleChange}
                    className={
                      (inputsError.name !== '' ? 'p-invalid' : '') +
                      ' w-full p-inputtext-sm'
                    }
                  />
                  <label htmlFor="cityname">City name</label>
                </span>
                <p className={'text-xs mt-1 text-red-300'}>
                  {inputsError.name}
                </p>
              </div>
              <div className={'basis-1/2'}>
                <span className="p-float-label">
                  <InputText
                    id="slug"
                    name="slug"
                    value={inputs.slug}
                    onChange={handleChange}
                    className={'w-full p-inputtext-sm'}
                  />
                  <label htmlFor="slug">Search name</label>
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default DetailCity;
