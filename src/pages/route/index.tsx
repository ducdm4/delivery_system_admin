import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import TableList from '../../common/components/default/tableList';
import { Card } from 'primereact/card';
import { KeyValue, TableListRefObject } from '../../common/config/interfaces';
import { useRouter } from 'next/router';
import {
  deleteRouteThunk,
  getRouteListFilter,
  routeLoading,
} from '../../features/route/routeSlice';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import DialogConfirm from '../../common/components/default/dialogConfirm';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import BasicListHeader from '../../common/components/default/masterData/basicListHeader';
import { routeTypeList } from '../../common/config/constant';
import { getStationListFilter } from '../../features/station/stationSlice';

const RouteList: NextPage = () => {
  const [tableConfig, setTableConfig] = useState({
    url: '/route',
    header: [
      {
        label: 'Station',
        key: 'station',
        isSort: true,
      },
      {
        label: 'Type',
        key: 'type',
      },
      {
        label: 'PIC',
        key: 'employee',
      },
      {
        label: 'Street list',
        key: 'streets',
      },
      {
        label: '',
        key: '',
      },
    ],
    filters: [
      {
        key: 'station',
        label: 'Station',
        data: [],
      },
      {
        key: 'type',
        label: 'Type',
        data: routeTypeList,
      },
    ],
  });
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [currentRouteDelete, setCurrentRouteDelete] = useState({
    id: -1,
    name: '',
  });
  const routeLoadingStatus = useAppSelector(routeLoading);
  const tableListElement = useRef<TableListRefObject>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const getListStation = dispatch(
      getStationListFilter({ query: '' }),
    ).unwrap();
    getListStation.then((res) => {
      if (res.isSuccess) {
        setTableConfig((old) => {
          const data = old;
          const stationIndex = data.filters.findIndex(
            (x) => x.key === 'station',
          );
          if (stationIndex > -1) {
            data.filters[stationIndex].data = res.data.list;
          }
          return data;
        });
      }
    });
  }, []);

  async function goToEdit(id: number) {
    await router.push(`/route/${id}`);
  }

  async function getData(query = '') {
    const res = await dispatch(getRouteListFilter({ query })).unwrap();
    if (res.isSuccess) {
      return res.data;
    } else {
      return [];
    }
  }

  function confirmDeleteRoute(id: number, name: string) {
    setCurrentRouteDelete({
      id,
      name,
    });
    setIsShowDeleteDialog(true);
  }

  function deleteRoute() {
    const res = dispatch(
      deleteRouteThunk({ id: currentRouteDelete.id }),
    ).unwrap();
    res.then((successData) => {
      if (successData.isSuccess) {
        toast(`Deleted successfully`, {
          hideProgressBar: true,
          autoClose: 2000,
          type: 'success',
        });
        if (tableListElement.current) {
          tableListElement.current.handleSearch();
        }
        refusedDeleteRoute();
      }
    });
  }

  function refusedDeleteRoute() {
    setIsShowDeleteDialog(false);
    setCurrentRouteDelete({
      id: -1,
      name: '',
    });
  }

  const getTypeText = (type: number) => {
    return routeTypeList.find((x) => x.id === type)?.name;
  };

  const getStreetText = (streets: Array<KeyValue>) => {
    return streets.map((item) => item.name).join(', ');
  };

  function rowList(data: Array<KeyValue>) {
    const tdClasses = 'p-2 border-b border-blue-gray-50';
    if (data && data.length) {
      return (
        <>
          {data.map((row, index: number) => (
            <tr key={index}>
              <td className={tdClasses}>{row.station.name}</td>
              <td className={tdClasses}>{getTypeText(row.type)}</td>
              <td
                className={tdClasses}
              >{`${row.employee?.user.firstName} ${row.employee?.user.lastName}`}</td>
              <td className={tdClasses}>{getStreetText(row.streets)}</td>
              <td className={tdClasses}>
                <Button
                  icon="pi pi-pencil"
                  onClick={() => goToEdit(row.id)}
                  rounded
                  aria-label="Filter"
                  size="small"
                  severity="success"
                />
                <Button
                  icon="pi pi-trash"
                  onClick={() => confirmDeleteRoute(row.id, row.name)}
                  rounded
                  aria-label="Filter"
                  size="small"
                  severity="danger"
                  className={'!ml-4'}
                />
              </td>
            </tr>
          ))}
        </>
      );
    }
  }

  return (
    <>
      <Head>
        <title>Route management</title>
      </Head>
      <div>
        <Card
          header={BasicListHeader({
            title: 'Route list',
            smallTitle: 'See information about all route',
            addButton: {
              label: 'Add route',
              url: '/route/add',
            },
          })}
          className="!border-none !rounded-none mx-auto my-5 table-list"
        >
          <TableList
            ref={tableListElement}
            tableConfig={tableConfig}
            rowList={rowList}
            getData={getData}
            loadingStatus={routeLoadingStatus}
          />
        </Card>
      </div>

      <DialogConfirm
        isShow={isShowDeleteDialog}
        title={'Delete district'}
        body={'Do you want to delete this Route?'}
        refusedCallback={refusedDeleteRoute}
        acceptedCallback={deleteRoute}
      ></DialogConfirm>
    </>
  );
};

export default RouteList;
