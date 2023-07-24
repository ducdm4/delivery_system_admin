import { NextPage } from 'next';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import {
  districtLoading,
  createNewDistrict,
  getDistrictInfo,
  editDistrictInfo,
} from '../../../features/district/districtSlice';
import { KeyValue } from '../../../common/config/interfaces';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { getCityListFilter } from '../../../features/city/citySlice';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import BasicEditHeader from '../../../common/components/default/masterData/basicEditHeader';

interface CityItem {
  id: number;
  name: string;
}

const DetailDistrict: NextPage = () => {
  const [inputsInitialState, setInputsInitialState] = useState({
    name: '',
    slug: '',
    city: {},
  });
  const initialCityList: Array<CityItem> = [];
  const [inputs, setInputs] = useState(inputsInitialState);
  const [inputsError, setInputErrors] = useState({ name: '', city: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [cityList, setCityList] = useState(initialCityList);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loadingStatus = useAppSelector(districtLoading);

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
          isEdit ? editDistrictInfo(inputs) : createNewDistrict(inputs),
        ).unwrap();
        res.then(async (data: KeyValue) => {
          if (data.isSuccess) {
            toast(`District ${isEdit ? 'edited' : 'added'} successfully`, {
              hideProgressBar: true,
              autoClose: 2000,
              type: 'success',
            });
            await router.push('/admin/district');
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
        name: 'District name can not be empty',
      }));
    } else {
      setInputErrors((values) => ({ ...values, name: '' }));
    }
    if (Object.keys(inputs.city).length === 0) {
      isValid = false;
      setInputErrors((values) => ({
        ...values,
        city: 'Please select city',
      }));
    } else {
      setInputErrors((values) => ({ ...values, city: '' }));
    }
    return isValid;
  }

  function resetInput() {
    setInputs(inputsInitialState);
  }

  useEffect(() => {
    const districtId = router.query.id;
    if (districtId && districtId !== 'add') {
      const districtIdNum = parseInt(districtId as string);
      if (!isNaN(districtIdNum)) {
        setIsEdit(true);
        const response = dispatch(
          getDistrictInfo({ id: districtIdNum }),
        ).unwrap();
        response.then((resData) => {
          if (resData.isSuccess) {
            setInputs((old) => {
              return {
                ...resData.data.district,
                city: {
                  id: resData.data.district.city.id,
                  name: resData.data.district.city.name,
                },
              };
            });
            setInputsInitialState(resData.data.district);
          }
        });
      }
    }
    const getCity = dispatch(getCityListFilter({ query: '' })).unwrap();
    getCity.then((listCityData) => {
      setCityList(listCityData.data.list);
    });
  }, [router.query]);

  const handleChangeCity = (val: { id: number; name: string }) => {
    return setInputs((old) => {
      return {
        ...old,
        city: val,
      };
    });
  };

  const header = () => {
    return (
      <BasicEditHeader
        isEdit={isEdit}
        titleAdd={{ big: `Add District`, small: `Add a new District` }}
        titleEdit={{
          big: `Edit District`,
          small: `Edit a district information`,
        }}
        handleSubmit={handleSubmit}
        resetInput={resetInput}
        url={`/admin/district`}
      />
    );
  };

  return (
    <>
      <Head>
        <title>District management</title>
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
                    id="districtname"
                    name="name"
                    value={inputs.name}
                    onChange={handleChange}
                    className={
                      (inputsError.name !== '' ? 'p-invalid' : '') +
                      ' w-full p-inputtext-sm'
                    }
                  />
                  <label htmlFor="districtname">District name</label>
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
            <div className={'flex-row flex gap-8 mt-8'}>
              <div className={'basis-1/2'}>
                <span className="p-float-label">
                  <Dropdown
                    value={inputs.city}
                    onChange={(e) => handleChangeCity(e.value)}
                    filter
                    options={cityList}
                    optionLabel="name"
                    placeholder="Select a City"
                    className={
                      (inputsError.city !== '' ? 'p-invalid' : '') +
                      ' w-full p-inputtext-sm'
                    }
                    name="city"
                    id="city"
                  />
                  <label htmlFor="city">Select a City</label>
                </span>
                <p className={'text-xs mt-1 text-red-300'}>
                  {inputsError.city}
                </p>
              </div>
              <div className={'basis-1/2'}> </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default DetailDistrict;
