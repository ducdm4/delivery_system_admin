import { NextPage } from 'next';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import {
  streetLoading,
  createNewStreet,
  getStreetInfo,
  editStreetInfo,
} from '../../features/street/streetSlice';
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
import { getWardListFilter } from '../../features/ward/wardSlice';

interface CityDistrictItem {
  id: number;
  name: string;
  cityId?: number;
  districtId?: number;
}

const DetailStreet: NextPage = () => {
  const keyStringNumber: { [key: string]: number } = {};
  const [inputsInitialState, setInputsInitialState] = useState({
    name: '',
    slug: '',
    city: keyStringNumber,
    district: keyStringNumber,
    ward: keyStringNumber,
  });
  const initialCityDistrictList: Array<CityDistrictItem> = [];
  const [inputs, setInputs] = useState(inputsInitialState);
  const [inputsError, setInputErrors] = useState({
    name: '',
    ward: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [cityList, setCityList] = useState(initialCityDistrictList);
  const [districtList, setDistrictList] = useState(initialCityDistrictList);
  const [wardList, setWardList] = useState(initialCityDistrictList);
  const [districtListFiltered, setDistrictListFiltered] = useState(
    initialCityDistrictList,
  );
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loadingStatus = useAppSelector(streetLoading);

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
          isEdit ? editStreetInfo(inputs) : createNewStreet(inputs),
        ).unwrap();
        res.then(async (data: KeyValue) => {
          if (data.isSuccess) {
            toast(`Street ${isEdit ? 'edited' : 'added'} successfully`, {
              hideProgressBar: true,
              autoClose: 2000,
              type: 'success',
            });
            await router.push('/street');
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
        name: 'Street name can not be empty',
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
    const streetId = router.query.id;
    const promises = [];
    if (streetId) {
      const getCity = dispatch(getCityListFilter({ query: '' })).unwrap();
      promises.push(getCity);
      const getDistrict = dispatch(
        getDistrictListFilter({ query: '' }),
      ).unwrap();
      promises.push(getDistrict);
      const getWard = dispatch(getWardListFilter({ query: '' })).unwrap();
      promises.push(getWard);
      if (streetId !== 'add') {
        const streetIdNum = parseInt(streetId as string);
        if (!isNaN(streetIdNum)) {
          setIsEdit(true);
          const response = dispatch(
            getStreetInfo({ id: streetIdNum }),
          ).unwrap();
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
            setDataListDetail(result.data.list, 'district');
            break;
          case 2:
            setDataListDetail(result.data.list, 'ward');
            break;
          case 3:
            setInputDetail(result);
            break;
        }
      }),
    );
  }, [router.query]);

  function setDataListDetail(result: KeyValue, key: string) {
    const keySet = key === 'ward' ? 'districtId' : 'cityId';
    const dataToSet = result.map(
      (item: {
        id: number;
        name: string;
        cityId?: number;
        districtId?: number;
      }) => {
        return {
          id: item.id,
          name: item.name,
          [keySet]: item[keySet],
        };
      },
    );
    if (key === 'district') setDistrictList(dataToSet);
    if (key === 'ward') setWardList(dataToSet);
  }

  function setInputDetail(result: KeyValue) {
    if (result.isSuccess) {
      setInputs((old) => {
        return {
          ...result.data.street,
          ward: {
            id: result.data.street.ward.id,
            name: result.data.street.ward.name,
            districtId: result.data.street.ward.district.id,
          },
          district: {
            id: result.data.street.ward.district.id,
            name: result.data.street.ward.district.name,
            cityId: result.data.street.ward.district.city.id,
          },
          city: {
            id: result.data.street.ward.district.city.id,
            name: result.data.street.ward.district.city.name,
          },
        };
      });
      setInputsInitialState(result.data.street);
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

  const listWardFiltered = () => {
    return wardList.filter((item) => {
      return item.districtId === inputs.district.id;
    });
  };

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
        titleAdd={{ big: `Add Street`, small: `Add a new Street` }}
        titleEdit={{ big: `Edit Street`, small: `Edit a street information` }}
        handleSubmit={handleSubmit}
        resetInput={resetInput}
        url={`/street`}
      />
    );
  };

  return (
    <>
      <Head>
        <title>Street management</title>
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
                    id="streetname"
                    name="name"
                    value={inputs.name}
                    onChange={handleChange}
                    className={
                      (inputsError.name !== '' ? 'p-invalid' : '') +
                      ' w-full p-inputtext-sm'
                    }
                  />
                  <label htmlFor="streetname">Street name</label>
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
              <div className={'basis-1/3'}>
                <span className="p-float-label">
                  <Dropdown
                    value={inputs.city}
                    onChange={(e) => handleChangeAddressProp(e.value, 'city')}
                    options={cityList}
                    filter
                    optionLabel="name"
                    placeholder="Select a City"
                    className={'w-full p-inputtext-sm'}
                    name="city"
                    id="city"
                  />
                  <label htmlFor="city">Select a City</label>
                </span>
              </div>
              <div className={'basis-1/3'}>
                <span className="p-float-label">
                  <Dropdown
                    value={inputs.district}
                    onChange={(e) =>
                      handleChangeAddressProp(e.value, 'district')
                    }
                    options={districtListFiltered}
                    filter
                    optionLabel="name"
                    placeholder="Select a City"
                    className={'w-full p-inputtext-sm'}
                    name="city"
                    id="city"
                  />
                  <label htmlFor="city">Select a District</label>
                </span>
              </div>
              <div className={'basis-1/3'}>
                <span className="p-float-label">
                  <Dropdown
                    value={inputs.ward}
                    onChange={(e) => handleChangeAddressProp(e.value, 'ward')}
                    options={listWardFiltered()}
                    optionLabel="name"
                    filter
                    placeholder="Select a Ward"
                    className={
                      (inputsError.ward !== '' ? 'p-invalid' : '') +
                      'w-full p-inputtext-sm'
                    }
                    name="ward"
                    id="ward"
                  />
                  <label htmlFor="ward">Select a Ward</label>
                </span>
                <p className={'text-xs mt-1 text-red-300'}>
                  {inputsError.ward}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default DetailStreet;
