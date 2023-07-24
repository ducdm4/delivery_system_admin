import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import TableList from '../../common/components/default/tableList';
import { KeyValue, TableListRefObject } from '../../common/config/interfaces';
import { useRouter } from 'next/router';
import {
  deleteDistrictThunk,
  getDistrictListFilter,
  districtLoading,
} from '../../features/district/districtSlice';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import DialogConfirm from '../../common/components/default/dialogConfirm';
import { toast } from 'react-toastify';
import { getCityListFilter } from '../../features/city/citySlice';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import BasicListHeader from '../../common/components/default/masterData/basicListHeader';

const DistrictList: NextPage = () => {
  const [tableConfig, setTableConfig] = useState({
    url: '/district',
    header: [
      {
        label: 'Name',
        key: 'name',
        isSort: true,
      },
      {
        label: 'Search name',
        key: 'slug',
      },
      {
        label: 'City',
        key: 'city',
        isSort: true,
      },
      {
        label: '',
        key: '',
      },
    ],
    filters: [
      {
        key: 'city',
        label: 'City',
        data: [],
      },
    ],
  });
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [currentDistrictDelete, setCurrentDistrictDelete] = useState({
    id: -1,
    name: '',
  });
  const districtLoadingStatus = useAppSelector(districtLoading);
  const tableListElement = useRef<TableListRefObject>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function goToEdit(id: number) {
    await router.push(`/district/${id}`);
  }

  async function getData(query = '') {
    const res = await dispatch(getDistrictListFilter({ query })).unwrap();
    if (res.isSuccess) {
      return res.data;
    } else {
      return [];
    }
  }

  function confirmDeleteDistrict(id: number, name: string) {
    setCurrentDistrictDelete({
      id,
      name,
    });
    setIsShowDeleteDialog(true);
  }

  function deleteDistrict() {
    const res = dispatch(
      deleteDistrictThunk({ id: currentDistrictDelete.id }),
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
        refusedDeleteDistrict();
      }
    });
  }

  function refusedDeleteDistrict() {
    setIsShowDeleteDialog(false);
    setCurrentDistrictDelete({
      id: -1,
      name: '',
    });
  }

  useEffect(() => {
    const getCity = dispatch(getCityListFilter({ query: '' })).unwrap();
    getCity.then((listCityData) => {
      setTableConfig((old) => {
        const indexCity = old.filters.findIndex((x) => x.key === 'city');
        const newValue = old;
        newValue.filters[indexCity].data = listCityData.data.list;
        return newValue;
      });
    });
  }, []);

  function rowList(data: Array<KeyValue>) {
    const tdClasses = 'p-4 border-b border-blue-gray-50';
    return (
      <>
        {data?.map((row, index: number) => (
          <tr key={index}>
            <td className={tdClasses}>{row.name}</td>
            <td className={tdClasses}>{row.slug}</td>
            <td className={tdClasses}>{row.cityName}</td>
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
                onClick={() => confirmDeleteDistrict(row.id, row.name)}
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

  return (
    <>
      <Head>
        <title>District management</title>
      </Head>
      <div>
        <Card
          header={BasicListHeader({
            title: 'District list',
            smallTitle: 'See information about all district',
            addButton: {
              label: 'Add district',
              url: '/district/add',
            },
          })}
          className="!border-none !rounded-none mx-auto my-5 table-list"
        >
          <TableList
            ref={tableListElement}
            tableConfig={tableConfig}
            rowList={rowList}
            getData={getData}
            loadingStatus={districtLoadingStatus}
          />
        </Card>
      </div>

      <DialogConfirm
        isShow={isShowDeleteDialog}
        title={'Delete district'}
        body={'Do you want to delete this District?'}
        refusedCallback={refusedDeleteDistrict}
        acceptedCallback={deleteDistrict}
      ></DialogConfirm>
    </>
  );
};

export default DistrictList;
