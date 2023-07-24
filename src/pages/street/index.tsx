import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import TableList from '../../common/components/default/tableList';
import { KeyValue, TableListRefObject } from '../../common/config/interfaces';
import { useRouter } from 'next/router';
import {
  deleteStreetThunk,
  getStreetListFilter,
  streetLoading,
} from '../../features/street/streetSlice';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import DialogConfirm from '../../common/components/default/dialogConfirm';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import BasicListHeader from '../../common/components/default/masterData/basicListHeader';
import { getDistrictListFilter } from '../../features/district/districtSlice';
import { getWardListFilter } from '../../features/ward/wardSlice';

const WardList: NextPage = () => {
  const [tableConfig, setTableConfig] = useState({
    url: '/street',
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
        label: 'Ward',
        key: 'ward',
        isSort: true,
      },
      {
        label: 'District',
        key: 'district',
        isSort: true,
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
        key: 'ward',
        label: 'Ward',
        data: [],
      },
    ],
  });
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [currentStreetDelete, setCurrentStreetDelete] = useState({
    id: -1,
    name: '',
  });
  const streetLoadingStatus = useAppSelector(streetLoading);
  const tableListElement = useRef<TableListRefObject>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function goToEdit(id: number) {
    await router.push(`/street/${id}`);
  }

  async function getData(query = '') {
    const res = await dispatch(getStreetListFilter({ query })).unwrap();
    if (res.isSuccess) {
      return res.data;
    } else {
      return [];
    }
  }

  function confirmDeleteStreet(id: number, name: string) {
    setCurrentStreetDelete({
      id,
      name,
    });
    setIsShowDeleteDialog(true);
  }

  function deleteStreet() {
    const res = dispatch(
      deleteStreetThunk({ id: currentStreetDelete.id }),
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
        refusedDeleteStreet();
      }
    });
  }

  function refusedDeleteStreet() {
    setIsShowDeleteDialog(false);
    setCurrentStreetDelete({
      id: -1,
      name: '',
    });
  }

  useEffect(() => {
    const getWard = dispatch(getWardListFilter({ query: '' })).unwrap();
    getWard.then((listWard) => {
      setTableConfig((old) => {
        const indexWard = old.filters.findIndex((x) => x.key === 'ward');
        const newVal = old;
        newVal.filters[indexWard].data = listWard.data.list.map(
          (ward: {
            id: number;
            name: string;
            districtName: string;
            cityName: string;
          }) => {
            return {
              id: ward.id,
              name: `${ward.name}, ${ward.districtName}, ${ward.cityName}`,
            };
          },
        );
        return newVal;
      });
    });
  }, []);

  function rowList(data: Array<KeyValue>) {
    const tdClasses = 'p-4 border-b border-blue-gray-50';
    return (
      <>
        {data.map((row, index: number) => (
          <tr key={index}>
            <td className={tdClasses}>{row.name}</td>
            <td className={tdClasses}>{row.slug}</td>
            <td className={tdClasses}>{row.wardName}</td>
            <td className={tdClasses}>{row.districtName}</td>
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
                onClick={() => confirmDeleteStreet(row.id, row.name)}
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
        <title>Street management</title>
      </Head>
      <div>
        <Card
          header={BasicListHeader({
            title: 'Street list',
            smallTitle: 'See information about all street',
            addButton: {
              label: 'Add street',
              url: '/street/add',
            },
          })}
          className="!border-none !rounded-none mx-auto my-5 table-list"
        >
          <TableList
            ref={tableListElement}
            tableConfig={tableConfig}
            rowList={rowList}
            getData={getData}
            loadingStatus={streetLoadingStatus}
          />
        </Card>
      </div>

      <DialogConfirm
        isShow={isShowDeleteDialog}
        title={'Delete ward'}
        body={'Do you want to delete this Ward?'}
        refusedCallback={refusedDeleteStreet}
        acceptedCallback={deleteStreet}
      ></DialogConfirm>
    </>
  );
};

export default WardList;
