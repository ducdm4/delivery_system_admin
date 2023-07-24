import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import TableList from '../../../common/components/default/tableList';
import { Card } from 'primereact/card';
import {
  KeyValue,
  TableListRefObject,
} from '../../../common/config/interfaces';
import { useRouter } from 'next/router';
import {
  deleteStationThunk,
  getStationListFilter,
  stationLoading,
} from '../../../features/station/stationSlice';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import DialogConfirm from '../../../common/components/default/dialogConfirm';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import BasicListHeader from '../../../common/components/default/masterData/basicListHeader';
import { STATION_TYPE } from '../../../common/config/constant';
import { getCityListFilter } from '../../../features/city/citySlice';
import { getDistrictListFilter } from '../../../features/district/districtSlice';

const StationList: NextPage = () => {
  const [tableConfig, setTableConfig] = useState({
    url: '/station',
    header: [
      {
        label: 'Name',
        key: 'name',
        isSort: true,
      },
      {
        label: 'Type',
        key: 'type',
      },
      {
        label: 'Address',
        key: 'address',
      },
      {
        label: 'Parent station',
        key: 'parentStation',
        isSort: true,
      },
      {
        label: '',
        key: '',
      },
    ],
    filters: [
      {
        key: 'type',
        label: 'Type',
        data: STATION_TYPE,
      },
      {
        key: 'district',
        label: 'District',
        data: [],
      },
    ],
  });
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [currentStationDelete, setCurrentStationDelete] = useState({
    id: -1,
    name: '',
  });
  const stationLoadingStatus = useAppSelector(stationLoading);
  const tableListElement = useRef<TableListRefObject>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const getDistrict = dispatch(getDistrictListFilter({ query: '' })).unwrap();
    getDistrict.then((listDistrictData) => {
      setTableConfig((old) => {
        const index = old.filters.findIndex((x) => x.key === 'district');
        const newValue = old;
        newValue.filters[index].data = listDistrictData.data.list.map(
          (item: KeyValue) => {
            return {
              id: item.id,
              name: `${item.name}, ${item.cityName}`,
            };
          },
        );
        return newValue;
      });
    });
  }, []);

  async function goToEdit(id: number) {
    await router.push(`/admin/station/${id}`);
  }

  async function getData(query = '') {
    const res = await dispatch(getStationListFilter({ query })).unwrap();
    if (res.isSuccess) {
      return res.data;
    } else {
      return [];
    }
  }

  function confirmDeleteStation(id: number, name: string) {
    setCurrentStationDelete({
      id,
      name,
    });
    setIsShowDeleteDialog(true);
  }
  function deleteStation() {
    const res = dispatch(
      deleteStationThunk({ id: currentStationDelete.id }),
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
        refusedDeleteStation();
      }
    });
  }

  function refusedDeleteStation() {
    setIsShowDeleteDialog(false);
    setCurrentStationDelete({
      id: -1,
      name: '',
    });
  }

  function rowList(data: Array<KeyValue>) {
    const tdClasses = 'p-2 border-b border-blue-gray-50';
    if (data && data.length) {
      return (
        <>
          {data.map((row, index: number) => (
            <tr key={index}>
              <td className={tdClasses}>{row.name}</td>
              <td className={tdClasses}>{STATION_TYPE[row.type].name}</td>
              <td className={tdClasses}>{`${row.address_detail} ${
                row.streetName || ''
              }, ${row.wardName || ''}, ${row.districtName || ''}, ${
                row.cityName || ''
              }`}</td>
              <td className={tdClasses}>
                {row.parentStationName || 'Not Available'}
              </td>
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
                  onClick={() => confirmDeleteStation(row.id, row.name)}
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
        <title>Station management</title>
      </Head>
      <div>
        <Card
          header={BasicListHeader({
            title: 'Station list',
            smallTitle: 'See information about all station',
            addButton: {
              label: 'Add station',
              url: '/admin/station/add',
            },
          })}
          className="!border-none !rounded-none mx-auto my-5 table-list"
        >
          <TableList
            ref={tableListElement}
            tableConfig={tableConfig}
            rowList={rowList}
            getData={getData}
            loadingStatus={stationLoadingStatus}
          />
        </Card>
      </div>

      <DialogConfirm
        isShow={isShowDeleteDialog}
        title={'Delete district'}
        body={'Do you want to delete this Station?'}
        refusedCallback={refusedDeleteStation}
        acceptedCallback={deleteStation}
      ></DialogConfirm>
    </>
  );
};

export default StationList;
