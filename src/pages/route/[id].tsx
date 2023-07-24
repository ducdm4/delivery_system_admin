import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import { KeyValue } from '../../common/config/interfaces';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import BasicEditHeader from '../../common/components/default/masterData/basicEditHeader';
import {
  getChildStation,
  getStationListFilter,
} from '../../features/station/stationSlice';
import { getListEmployeeFilter } from '../../features/employee/employeeSlice';
import {
  setInputByValue,
  validateArrayRequired,
  validateRequired,
} from '../../common/functions';
import {
  createNewRoute,
  editRouteInfo,
  getRouteInfo,
  routeLoading,
} from '../../features/route/routeSlice';
import { SelectButton } from 'primereact/selectbutton';
import { MultiSelect } from 'primereact/multiselect';
import { getStreetNotInRoute } from '../../features/street/streetSlice';
import { Checkbox } from 'primereact/checkbox';

const DetailRoute: NextPage = () => {
  const initState: KeyValue = {
    station: {},
    employee: {},
    type: 0,
    streets: [],
    childStation: [],
    isGoToParent: null,
  };
  const [inputsInitialState, setInputsInitialState] = useState(initState);
  const [inputs, setInputs] = useState(initState);
  const [inputsError, setInputErrors] = useState({
    employee: '',
    station: '',
    streets: '',
  });
  const arrayKeyValue: Array<KeyValue> = [];
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loadingStatus = useAppSelector(routeLoading);
  const [stationList, setStationList] = useState(arrayKeyValue);
  const [employeeList, setEmployeeList] = useState(arrayKeyValue);
  const [streetsListNotInRoute, setStreetsListNotInRoute] =
    useState(arrayKeyValue);
  const typeOption = [
    { name: 'Pickup', value: 0 },
    { name: 'Delivery', value: 1 },
  ];
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [childStationList, setChildStationList] = useState(arrayKeyValue);
  function handleSubmit() {
    if (validate()) {
      let result: Promise<KeyValue>;
      if (router.query.id !== 'add') {
        result = dispatch(editRouteInfo(inputs)).unwrap();
      } else {
        result = dispatch(createNewRoute(inputs)).unwrap();
      }
      result.then((res) => {
        if (res.isSuccess) {
          toast(
            `Route ${
              router.query.id !== 'add' ? 'edited' : 'added'
            } successfully`,
            {
              hideProgressBar: true,
              autoClose: 2000,
              type: 'success',
            },
          );
          router.push('/route');
        }
      });
    }
  }

  function validate() {
    let check = true;
    const errors = Object.assign({}, inputsError);

    errors.station = validateRequired(inputs.station, 'station');
    if (errors.station) check = !errors.station;

    errors.employee = validateRequired(inputs.employee, 'employee');
    if (errors.employee) check = !errors.employee;

    errors.streets = validateArrayRequired(inputs.streets, 'streets');
    if (errors.streets) check = !errors.streets;

    setInputErrors(errors);
    return check;
  }

  function resetInput() {
    setInputs(inputsInitialState);
  }

  useEffect(() => {
    const prepareData = () => {
      const promiseList = [];
      const getListStation = dispatch(
        getStationListFilter({ query: '' }),
      ).unwrap();
      promiseList.push(getListStation);
      if (router.query.id !== 'add') {
        const id = parseInt(router.query.id as string);
        if (!isNaN(id)) {
          const getRoute = dispatch(getRouteInfo({ id })).unwrap();
          promiseList.push(getRoute);
        }
      }
      Promise.all(promiseList).then(async (results) => {
        for (const res of results) {
          const index = results.indexOf(res);
          if (res.isSuccess) {
            if (index === 0) {
              setStationList(res.data.list);
            } else {
              const data = res.data.route;
              const returnData = {
                ...data,
                station: {
                  id: data.station.id,
                  name: data.station.name,
                },
                employee: {
                  id: data.employee.id,
                  name: `${data.employee.user.firstName} ${data.employee.user.lastName}`,
                },
                streets: data.streets.map((item: KeyValue) => {
                  return {
                    id: item.id,
                    name: item.name,
                  };
                }),
                childStation: data.childStation.map((item: KeyValue) => {
                  return {
                    id: item.id,
                    name: item.name,
                  };
                }),
              };
              await getEmployeeList(data.station.id, data.type);
              getStreetList(data.station.id, data.type).then((res) => {
                const streetList = [...res, ...returnData.streets];
                setStreetsListNotInRoute(streetList);
              });
              getChildStationList(data.station.id).then((res) => {
                const stationList = [...res, ...returnData.childStation];
                setChildStationList(stationList);
              });
              setInputs(returnData);
            }
          }
        }
      });
    };
    if (router.query.id !== undefined) {
      prepareData();
    }
  }, [router.query.id]);

  async function getEmployeeList(station: number, type: number) {
    const employeeSlice = dispatch(
      getListEmployeeFilter({
        query: `?filter[station]=${station}&filter[role]=${type === 0 ? 3 : 4}`,
      }),
    ).unwrap();
    employeeSlice.then((res) => {
      if (res.isSuccess) {
        setEmployeeList(
          res.data.list.map((employee: KeyValue) => {
            return {
              id: employee.id,
              name: `${employee.firstName} ${employee.lastName}`,
            };
          }),
        );
      }
    });
  }

  async function getStreetList(station: number, type: number) {
    const streetsSlice = await dispatch(
      getStreetNotInRoute({
        station,
        type,
      }),
    ).unwrap();
    if (streetsSlice.isSuccess) {
      const data = streetsSlice.data.streets.map((item: KeyValue) => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      setStreetsListNotInRoute(data);
      return data;
    }
  }

  async function getChildStationList(station: number) {
    const childStation = await dispatch(
      getChildStation({ id: station }),
    ).unwrap();
    if (childStation.isSuccess) {
      const data = childStation.data.stations.map((item: KeyValue) => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      setChildStationList(data);
      return data;
    }
  }

  useEffect(() => {
    if (inputs.station.id) {
      if (!isFirstLoad) {
        setInputByValue('employee', {}, setInputs);
        setInputByValue('streets', [], setInputs);
        setInputByValue('isGoToParent', null, setInputs);
        getEmployeeList(inputs.station.id, inputs.type).then();
        getStreetList(inputs.station.id, inputs.type).then();
        setInputByValue('childStation', [], setInputs);
        if (inputs.type === 0) {
          getChildStationList(inputs.station.id).then();
        }
      } else {
        setIsFirstLoad(false);
      }
    }
  }, [inputs.station, inputs.type]);

  const stationListSelect = () => {
    return stationList.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
  };

  const isShowChildStationAndParent = () => {
    const res = {
      child: false,
      parent: true,
    };
    const station = stationList.find((x) => x.id === inputs.station.id);
    if (station) {
      res.child = station.type > 0 && inputs.type === 0;
      res.parent = station.type < 2;
    }
    return res;
  };

  const childStationListFiltered = () => {
    return childStationList.map((item: KeyValue) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
  };

  const header = () => {
    return (
      <BasicEditHeader
        isEdit={router.query.id !== 'add'}
        titleAdd={{ big: `Add Route`, small: `Add a new Route` }}
        titleEdit={{
          big: `Edit Route`,
          small: `Edit a route information`,
        }}
        handleSubmit={handleSubmit}
        resetInput={resetInput}
        url={`/route`}
      />
    );
  };

  return (
    <>
      <Head>
        <title>Route management</title>
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
              <div className={'basis-1/3'}>
                <span className="p-float-label">
                  <Dropdown
                    value={inputs.station}
                    onChange={(e) =>
                      setInputByValue('station', e.value, setInputs)
                    }
                    filter
                    options={stationListSelect()}
                    optionLabel="name"
                    className={
                      (inputsError.station !== '' ? 'p-invalid' : '') +
                      ' w-full p-inputtext-sm'
                    }
                    name="station"
                    id="station"
                  />
                  <label htmlFor="city">Select station</label>
                </span>
                <p className={'text-xs mt-1 text-red-300'}>
                  {inputsError.station}
                </p>
              </div>
              <div className={'basis-1/3'}>
                <span className="p-float-label">
                  <Dropdown
                    value={inputs.employee}
                    onChange={(e) =>
                      setInputByValue('employee', e.value, setInputs)
                    }
                    options={employeeList}
                    filter
                    optionLabel="name"
                    className={
                      (inputsError.employee !== '' ? 'p-invalid' : '') +
                      ' w-full p-inputtext-sm'
                    }
                    name="employee"
                    id="employee"
                  />
                  <label htmlFor="employee">Person In Charge</label>
                </span>
                <p className={'text-xs mt-1 text-red-300'}>
                  {inputsError.employee}
                </p>
              </div>
              <div className={'basis-1/3'}>
                <SelectButton
                  value={inputs.type}
                  onChange={(e) => setInputByValue('type', e.value, setInputs)}
                  className={'w-full'}
                  options={typeOption}
                  optionLabel="name"
                  pt={{
                    button: { className: '!p-[0.55rem]' },
                  }}
                />
              </div>
            </div>
            <div className={'flex-row flex gap-8 mt-8'}>
              <div className={'basis-2/3'}>
                <span className="p-float-label">
                  <MultiSelect
                    value={inputs.streets}
                    onChange={(e) =>
                      setInputByValue('streets', e.value, setInputs)
                    }
                    options={streetsListNotInRoute}
                    optionLabel="name"
                    filter
                    placeholder="Select Wards"
                    maxSelectedLabels={10}
                    className={
                      (inputsError.employee !== '' ? 'p-invalid' : '') +
                      ' w-full p-inputtext-sm md:w-20rem'
                    }
                  />
                  <label htmlFor="ward">Street in route</label>
                </span>
                <p className={'text-xs mt-1 text-red-300'}>
                  {inputsError.streets}
                </p>
              </div>
              {isShowChildStationAndParent().parent && (
                <div className={'basis-1/3 flex items-center'}>
                  <Checkbox
                    inputId="isGoToParent"
                    name="pizza"
                    disabled={inputs.type === 1}
                    value="Onion"
                    onChange={(e) =>
                      setInputByValue('isGoToParent', e.checked, setInputs)
                    }
                    checked={inputs.isGoToParent}
                  />
                  <label htmlFor="isGoToParent" className="ml-2">
                    Go to parent station
                  </label>
                </div>
              )}
            </div>
            {isShowChildStationAndParent().child && (
              <div className={'flex-row flex gap-8 mt-8'}>
                <div className={'basis-2/3'}>
                  <span className="p-float-label">
                    <MultiSelect
                      value={inputs.childStation}
                      onChange={(e) =>
                        setInputByValue('childStation', e.value, setInputs)
                      }
                      options={childStationListFiltered()}
                      optionLabel="name"
                      filter
                      maxSelectedLabels={10}
                      className={' w-full p-inputtext-sm md:w-20rem'}
                    />
                    <label htmlFor="ward">Child station</label>
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  );
};

export default DetailRoute;
