import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { KeyValue } from '../../config/interfaces';
import { useRouter } from 'next/router';
import { Dropdown } from 'primereact/dropdown';
import { STATION_TYPE } from '../../config/constant';
import { MultiSelect } from 'primereact/multiselect';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Message } from 'primereact/message';
import { getWardNotUnderManage } from '../../../features/ward/wardSlice';

interface Props {
  inputs: KeyValue;
  errors: KeyValue;
  handleChange: any;
  setInput: any;
  stationList: Array<KeyValue>;
  stationSameTypeList: Array<KeyValue>;
}

function StationBasicInfo({
  inputs,
  handleChange,
  stationList,
  stationSameTypeList,
  setInput,
  errors,
}: Props) {
  const dispatch = useAppDispatch();
  const stationTypeList = () => {
    return STATION_TYPE;
  };
  const [wardNotManagedList, setWardNotManagedList] = useState([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (inputs.address.district.id) {
      if (!isFirstRender) {
        setInput('wards', []);
      } else {
        setIsFirstRender(false);
      }
      const getListWard = dispatch(
        getWardNotUnderManage({ id: inputs.address.district.id }),
      ).unwrap();
      getListWard.then((res) => {
        if (res.isSuccess) {
          const dataToAdd = res.data.list;
          if (!wardNotManagedList.length) {
            dataToAdd.unshift(
              ...inputs.wards.map((item: { id: number; name: string }) => {
                return {
                  id: item.id,
                  name: item.name,
                };
              }),
            );
          }
          setWardNotManagedList(() => {
            return dataToAdd.map((item: { id: number; name: string }) => {
              return {
                id: item.id,
                name: item.name,
              };
            });
          });
        }
      });
    }
  }, [inputs.address.district]);

  const stationListReduced = () => {
    if (inputs.type?.id !== STATION_TYPE[2].id) {
      return stationList
        ?.map((item) => {
          return {
            id: item.id,
            name: item.name,
            type: item.type,
          };
        })
        .filter((item) => {
          const condition = item.type - inputs.type.id === 1;
          if (router.query.id !== 'add') {
            return condition && item.id !== inputs.id;
          }
          return condition;
        });
    }
    return [];
  };

  const stationSameTypeListReduced = () => {
    return stationSameTypeList
      ?.map((item) => {
        return {
          id: item.id,
          name: item.name,
          type: item.type,
        };
      })
      .filter((item) => {
        if (router.query.id !== 'add') {
          return item.id !== inputs.id;
        }
        return true;
      });
  };

  function didChangeType(val: Array<KeyValue>) {
    if (val !== null) {
      setInput('parentStation', null);
      setInput('type', val);
    }
  }

  return (
    <>
      <div className={'flex-row flex gap-8 mt-8'}>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <InputText
              id="name"
              name="name"
              value={inputs.name}
              onChange={(e) => handleChange(e)}
              className={'w-full p-inputtext-sm'}
            />
            <label htmlFor="wardname">Station Name</label>
          </span>
          <p className={'text-xs mt-1 text-red-300'}>{errors.name}</p>
        </div>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <Dropdown
              value={inputs.type}
              onChange={(e) => didChangeType(e.value)}
              options={stationTypeList()}
              filter
              optionLabel="name"
              placeholder="Select station type"
              className={'w-full p-inputtext-sm'}
              name="type"
              id="type"
            />
            <label htmlFor="type">Station type</label>
          </span>
        </div>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <Dropdown
              value={inputs.parentStation}
              onChange={(e) => setInput('parentStation', e.value)}
              options={stationListReduced()}
              optionLabel="name"
              filter
              placeholder="Select parent station"
              className={'w-full p-inputtext-sm'}
              name="parentStation"
              id="ward"
            />
            <label htmlFor="ward">Parent station</label>
          </span>
          <p className={'text-xs mt-1 text-red-300'}>{errors.parentStation}</p>
        </div>
      </div>
      <div className={'flex-row flex gap-8 mt-8 mb-4'}>
        <div className={'w-full'}>
          <span className="p-float-label">
            <MultiSelect
              value={inputs.wards}
              onChange={(e) => setInput('wards', e.value)}
              options={wardNotManagedList}
              optionLabel="name"
              filter
              placeholder="Select Wards"
              maxSelectedLabels={10}
              className="w-full md:w-20rem"
            />
            <label htmlFor="ward">Wards under management</label>
          </span>
          <p className={'text-xs mt-1 text-red-300'}>{errors.wards}</p>
        </div>
      </div>
      <div className="mt-4 card flex justify-content-center">
        <Message
          severity="warn"
          text="Please select address before select wards under management"
          pt={{
            text: { className: '!text-sm' },
          }}
        />
      </div>
      <div className={'flex-row flex gap-8 mt-8 mb-4'}>
        <div className={'w-full'}>
          <span className="p-float-label">
            <MultiSelect
              value={inputs.stationConnected}
              onChange={(e) => setInput('stationConnected', e.value)}
              options={stationSameTypeListReduced()}
              optionLabel="name"
              filter
              placeholder="Select connected station"
              maxSelectedLabels={10}
              className="w-full md:w-20rem"
            />
            <label htmlFor="ward">Connected station</label>
          </span>
        </div>
      </div>
    </>
  );
}

export default StationBasicInfo;
