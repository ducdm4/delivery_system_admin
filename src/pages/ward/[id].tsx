import { NextPage } from 'next';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import {
  wardLoading,
  createNewWard,
  getWardInfo,
  editWardInfo,
} from '../../features/ward/wardSlice';
import { KeyValue } from '../../common/config/interfaces';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { getCityListFilter } from '../../features/city/citySlice';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { getDistrictListFilter } from '../../features/district/districtSlice';
import BasicEditHeader from '../../common/components/default/masterData/basicEditHeader';

interface CityDistrictItem {
  id: number;
  name: string;
  cityId?: number;
}

const DetailWard: NextPage = () => {
  const keyStringNumber: { [key: string]: number } = {};
  const [inputsInitialState, setInputsInitialState] = useState({
    name: '',
    slug: '',
    city: keyStringNumber,
    district: keyStringNumber,
  });
  const initialCityDistrictList: Array<CityDistrictItem> = [];
  const [inputs, setInputs] = useState(inputsInitialState);
  const [inputsError, setInputErrors] = useState({
    name: '',
    district: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [cityList, setCityList] = useState(initialCityDistrictList);
  const [districtList, setDistrictList] = useState(initialCityDistrictList);
  const [districtListFiltered, setDistrictListFiltered] = useState(
    initialCityDistrictList,
  );
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loadingStatus = useAppSelector(wardLoading);

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
          isEdit ? editWardInfo(inputs) : createNewWard(inputs),
        ).unwrap();
        res.then(async (data: KeyValue) => {
          if (data.isSuccess) {
            toast(`Ward ${isEdit ? 'edited' : 'added'} successfully`, {
              hideProgressBar: true,
              autoClose: 2000,
              type: 'success',
            });
            await router.push('/ward');
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
        name: 'Ward name can not be empty',
      }));
    } else {
      setInputErrors((values) => ({ ...values, name: '' }));
    }
    if (!inputs.district.id) {
      isValid = false;
      setInputErrors((values) => ({
        ...values,
        district: 'Please select district',
      }));
    } else {
      setInputErrors((values) => ({ ...values, district: '' }));
    }
    return isValid;
  }

  function resetInput() {
    setInputs(inputsInitialState);
  }

  useEffect(() => {
    const wardId = router.query.id;
    const promises = [];
    if (wardId) {
      const getCity = dispatch(getCityListFilter({ query: '' })).unwrap();
      promises.push(getCity);
      const getDistrict = dispatch(
        getDistrictListFilter({ query: '' }),
      ).unwrap();
      promises.push(getDistrict);
      if (wardId !== 'add') {
        const wardIdNum = parseInt(wardId as string);
        if (!isNaN(wardIdNum)) {
          setIsEdit(true);
          const response = dispatch(getWardInfo({ id: wardIdNum })).unwrap();
          promises.push(response);
        }
      }
    }

    Promise.all(promises).then((results) =>
      results.forEach((result, index) => {
        switch (index) {
          case 0:
            setCityList(result.data.list);
            break;
          case 1:
            setDistrictListDetail(result.data.list);
            break;
          case 2:
            setInputDetail(result);
            break;
        }
      }),
    );
  }, [router.query]);

  function setDistrictListDetail(result: KeyValue) {
    setDistrictList((old) => {
      return result.map(
        (item: { id: number; name: string; cityId: number }) => {
          return {
            id: item.id,
            name: item.name,
            cityId: item.cityId,
          };
        },
      );
    });
  }

  function setInputDetail(result: KeyValue) {
    if (result.isSuccess) {
      setInputs((old) => {
        return {
          ...result.data.ward,
          district: {
            id: result.data.ward.district.id,
            name: result.data.ward.district.name,
            cityId: result.data.ward.district.city.id,
          },
          city: {
            id: result.data.ward.district.city.id,
            name: result.data.ward.district.city.name,
          },
        };
      });
      setInputsInitialState(result.data.ward);
    }
  }

  const handleChangeAddressProp = (
    val: { id: number; name: string },
    key: string,
  ) => {
    return setInputs((old) => {
      return {
        ...old,
        [key]: val,
      };
    });
  };

  function setListDistrictFilter() {
    const districtFiltered = districtList.filter((item) => {
      return item.cityId === inputs.city.id;
    });
    setDistrictListFiltered(districtFiltered);
  }

  useEffect(() => {
    if (isFirstLoad && router.query.id !== 'add' && inputs.city.id) {
      setIsFirstLoad(false);
      setListDistrictFilter();
    } else if (inputs.city && inputs.city.id && !isFirstLoad) {
      setListDistrictFilter();
      setInputs((oldValue) => {
        return {
          ...oldValue,
          district: {},
        };
      });
    } else {
      setListDistrictFilter();
    }
  }, [inputs.city]);

  const header = () => {
    return (
      <BasicEditHeader
        isEdit={isEdit}
        titleAdd={{ big: `Add Ward`, small: `Add a new Ward` }}
        titleEdit={{ big: `Edit Ward`, small: `Edit a ward information` }}
        handleSubmit={handleSubmit}
        resetInput={resetInput}
        url={`/ward`}
      />
    );
  };

  return (
    <>
      <Head>
        <title>Ward management</title>
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
                    id="wardname"
                    name="name"
                    value={inputs.name}
                    onChange={handleChange}
                    className={
                      (inputsError.name !== '' ? 'p-invalid' : '') +
                      ' w-full p-inputtext-sm'
                    }
                  />
                  <label htmlFor="wardname">Ward name</label>
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
                    onChange={(e) => handleChangeAddressProp(e.value, 'city')}
                    filter
                    options={cityList}
                    optionLabel="name"
                    placeholder="Select a City"
                    className={'w-full p-inputtext-sm'}
                    name="city"
                    id="city"
                  />
                  <label htmlFor="city">Select a City</label>
                </span>
              </div>
              <div className={'basis-1/2'}>
                <span className="p-float-label">
                  <Dropdown
                    value={inputs.district}
                    onChange={(e) =>
                      handleChangeAddressProp(e.value, 'district')
                    }
                    filter
                    options={districtListFiltered}
                    optionLabel="name"
                    placeholder="Select a City"
                    className={
                      (inputsError.district !== '' ? 'p-invalid' : '') +
                      ' w-full p-inputtext-sm'
                    }
                    name="city"
                    id="city"
                  />
                  <label htmlFor="city">Select a District</label>
                </span>
                <p className={'text-xs mt-1 text-red-300'}>
                  {inputsError.district}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default DetailWard;
