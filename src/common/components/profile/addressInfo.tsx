import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { KeyValue } from '../../config/interfaces';
import { getCityListFilter } from '../../../features/city/citySlice';
import { getDistrictListFilter } from '../../../features/district/districtSlice';
import { getWardListFilter } from '../../../features/ward/wardSlice';
import { useAppDispatch } from '../../hooks';
import { getStreetListFilter } from '../../../features/street/streetSlice';

interface keyStringNumber {
  [key: string]: number;
}

interface keyStringValue {
  [key: string]: any;
}

interface Props {
  inputs: keyStringValue;
  errors?: keyStringValue;
  handleChangeAddressProp: any;
  handleChange: any;
}

interface CityDistrictWardItem {
  id: number;
  name: string;
  cityId?: number;
  districtId?: number;
  wardId?: number;
}

const ProfileAddressInfo = ({
  inputs,
  errors = {},
  handleChangeAddressProp,
  handleChange,
}: Props) => {
  const dispatch = useAppDispatch();
  const initialCityDistrictList: Array<CityDistrictWardItem> = [];

  const [cityList, setCityList] = useState(initialCityDistrictList);
  const [districtList, setDistrictList] = useState(initialCityDistrictList);
  const [wardList, setWardList] = useState(initialCityDistrictList);
  const [streetList, setStreetList] = useState(initialCityDistrictList);

  useEffect(() => {
    const promises = [];
    const getCity = dispatch(getCityListFilter({ query: '' })).unwrap();
    promises.push(getCity);
    const getDistrict = dispatch(getDistrictListFilter({ query: '' })).unwrap();
    promises.push(getDistrict);
    const getWard = dispatch(getWardListFilter({ query: '' })).unwrap();
    promises.push(getWard);
    const getStreet = dispatch(getStreetListFilter({ query: '' })).unwrap();
    promises.push(getStreet);

    Promise.all(promises).then((results) =>
      results.forEach((result, index) => {
        switch (index) {
          case 0:
            setCityList(result.data.list);
            break;
          case 1:
            setDistrictList(
              getListDetail(result.data.list, 'district', 'cityId'),
            );
            break;
          case 2:
            setWardList(getListDetail(result.data.list, 'ward', 'districtId'));
            break;
          case 3:
            setStreetList(getListDetail(result.data.list, 'street', 'wardId'));
            break;
        }
      }),
    );
  }, []);
  function getListDetail(
    result: KeyValue,
    key: string,
    key2: 'cityId' | 'districtId' | 'wardId',
  ) {
    if (result) {
      return result.map(
        (item: {
          id: number;
          name: string;
          cityId?: number;
          districtId?: number;
          wardId?: number;
        }) => {
          return {
            id: item.id,
            name: item.name,
            [key2]: item[key2],
          };
        },
      );
    }
    return [];
  }

  const districtListFiltered = () => {
    return districtList.filter((item) => {
      return item.cityId === inputs.address.city.id;
    });
  };

  const wardListFiltered = () => {
    return wardList.filter((item) => {
      return item.districtId === inputs.address.district.id;
    });
  };

  const streetListFiltered = () => {
    return streetList.filter((item) => {
      return item.wardId === inputs.address.ward.id;
    });
  };

  return (
    <>
      <div className={'flex-row flex gap-8 mt-8'}>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <Dropdown
              value={inputs.address.city}
              onChange={(e) => handleChangeAddressProp(e.value, 'city')}
              options={cityList}
              filter
              optionLabel="name"
              placeholder="Select a City"
              className={'w-full p-inputtext-sm'}
              name="city"
              id="city"
            />
            <label htmlFor="city">City</label>
          </span>
          <p className={'text-xs mt-1 text-red-300'}>{errors.city}</p>
        </div>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <Dropdown
              value={inputs.address.district}
              onChange={(e) => handleChangeAddressProp(e.value, 'district')}
              options={districtListFiltered()}
              filter
              optionLabel="name"
              placeholder="Select a District"
              className={'w-full p-inputtext-sm'}
              name="city"
              id="city"
            />
            <label htmlFor="city">District</label>
          </span>
          <p className={'text-xs mt-1 text-red-300'}>{errors.district}</p>
        </div>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <Dropdown
              value={inputs.address.ward}
              onChange={(e) => handleChangeAddressProp(e.value, 'ward')}
              options={wardListFiltered()}
              filter
              optionLabel="name"
              placeholder="Select a Ward"
              className={'w-full p-inputtext-sm'}
              name="ward"
              id="ward"
            />
            <label htmlFor="ward">Ward</label>
          </span>
          <p className={'text-xs mt-1 text-red-300'}>{errors.ward}</p>
        </div>
      </div>
      <div className={'flex-row flex gap-8 mt-8'}>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <Dropdown
              value={inputs.address.street}
              onChange={(e) => handleChangeAddressProp(e.value, 'street')}
              options={streetListFiltered()}
              optionLabel="name"
              filter
              placeholder="Select a Street"
              className={'w-full p-inputtext-sm'}
              name="street"
              id="street"
            />
            <label htmlFor="street">Street</label>
          </span>
          <p className={'text-xs mt-1 text-red-300'}>{errors.street}</p>
        </div>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <InputText
              id="detail"
              name="detail"
              value={inputs.address.detail}
              onChange={(e) => handleChange(e)}
              className={'w-full p-inputtext-sm'}
            />
            <label htmlFor="detail">Detail</label>
          </span>
          <p className={'text-xs mt-1 text-red-300'}>{errors.detail}</p>
        </div>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <InputText
              id="building"
              name="building"
              value={inputs.address.building}
              onChange={(e) => handleChange(e)}
              className={'w-full p-inputtext-sm'}
            />
            <label htmlFor="building">Building</label>
          </span>
        </div>
      </div>
    </>
  );
};

export default ProfileAddressInfo;
