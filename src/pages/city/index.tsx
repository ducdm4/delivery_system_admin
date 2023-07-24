import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import TableList from '../../common/components/default/tableList';
import { Card } from 'primereact/card';
import { KeyValue, TableListRefObject } from '../../common/config/interfaces';
import { useRouter } from 'next/router';
import {
  deleteCityThunk,
  getCityListFilter,
  cityLoading,
} from '../../features/city/citySlice';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import DialogConfirm from '../../common/components/default/dialogConfirm';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import BasicListHeader from '../../common/components/default/masterData/basicListHeader';

const CityList: NextPage = () => {
  const [tableConfig, setTableConfig] = useState({
    url: '/city',
    header: [
      {
        label: 'Name',
        key: 'name',
        isSort: true,
      },
      {
        label: 'Search name',
        key: 'slug',
        isSort: true,
      },
      {
        label: '',
        key: '',
      },
    ],
    filters: [],
  });
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [currentCityDelete, setCurrentCityDelete] = useState({
    id: -1,
    name: '',
  });
  const cityLoadingStatus = useAppSelector(cityLoading);
  const tableListElement = useRef<TableListRefObject>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function goToEdit(id: number) {
    await router.push(`/city/${id}`);
  }

  async function getData(query = '') {
    const res = await dispatch(getCityListFilter({ query })).unwrap();
    if (res.isSuccess) {
      return res.data;
    } else {
      return [];
    }
  }

  function confirmDeleteCity(id: number, name: string) {
    setCurrentCityDelete({
      id,
      name,
    });
    setIsShowDeleteDialog(true);
  }
  function deleteCity() {
    const res = dispatch(
      deleteCityThunk({ id: currentCityDelete.id }),
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
        refusedDeleteCity();
      }
    });
  }

  function refusedDeleteCity() {
    setIsShowDeleteDialog(false);
    setCurrentCityDelete({
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
              <td className={tdClasses}>{row.slug}</td>
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
                  onClick={() => confirmDeleteCity(row.id, row.name)}
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
        <title>City management</title>
      </Head>
      <div>
        <Card
          header={BasicListHeader({
            title: 'City list',
            smallTitle: 'See information about all city',
            addButton: {
              label: 'Add city',
              url: '/city/add',
            },
          })}
          className="!border-none !rounded-none mx-auto my-5 table-list"
        >
          <TableList
            ref={tableListElement}
            tableConfig={tableConfig}
            rowList={rowList}
            getData={getData}
            loadingStatus={cityLoadingStatus}
          />
        </Card>
      </div>

      <DialogConfirm
        isShow={isShowDeleteDialog}
        title={'Delete district'}
        body={'Do you want to delete this District?'}
        refusedCallback={refusedDeleteCity}
        acceptedCallback={deleteCity}
      ></DialogConfirm>
    </>
  );
};

export default CityList;
