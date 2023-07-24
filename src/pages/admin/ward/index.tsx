import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import TableList from '../../../common/components/default/tableList';
import {
  KeyValue,
  TableListRefObject,
} from '../../../common/config/interfaces';
import { useRouter } from 'next/router';
import {
  deleteWardThunk,
  getWardListFilter,
  wardLoading,
} from '../../../features/ward/wardSlice';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import DialogConfirm from '../../../common/components/default/dialogConfirm';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import BasicListHeader from '../../../common/components/default/masterData/basicListHeader';
import { getDistrictListFilter } from '../../../features/district/districtSlice';

const WardList: NextPage = () => {
  const [tableConfig, setTableConfig] = useState({
    url: '/ward',
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
        key: 'district',
        label: 'District',
        data: [],
      },
    ],
  });
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [currentWardDelete, setCurrentWardDelete] = useState({
    id: -1,
    name: '',
  });
  const wardLoadingStatus = useAppSelector(wardLoading);
  const tableListElement = useRef<TableListRefObject>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function goToEdit(id: number) {
    await router.push(`/admin/ward/${id}`);
  }

  async function getData(query = '') {
    const res = await dispatch(getWardListFilter({ query })).unwrap();
    if (res.isSuccess) {
      return res.data;
    } else {
      return [];
    }
  }

  function confirmDeleteWard(id: number, name: string) {
    setCurrentWardDelete({
      id,
      name,
    });
    setIsShowDeleteDialog(true);
  }

  function deleteWard() {
    const res = dispatch(
      deleteWardThunk({ id: currentWardDelete.id }),
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
        refusedDeleteWard();
      }
    });
  }

  function refusedDeleteWard() {
    setIsShowDeleteDialog(false);
    setCurrentWardDelete({
      id: -1,
      name: '',
    });
  }

  useEffect(() => {
    const getDistrict = dispatch(getDistrictListFilter({ query: '' })).unwrap();
    getDistrict.then((listDistrict) => {
      setTableConfig((old) => {
        const indexDistrict = old.filters.findIndex(
          (x) => x.key === 'district',
        );
        const newVal = old;
        newVal.filters[indexDistrict].data = listDistrict.data.list.map(
          (district: { id: number; name: string; cityName: string }) => {
            return {
              id: district.id,
              name: `${district.name}, ${district.cityName}`,
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
                onClick={() => confirmDeleteWard(row.id, row.name)}
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
        <title>Ward management</title>
      </Head>
      <div>
        <Card
          header={BasicListHeader({
            title: 'Ward list',
            smallTitle: 'See information about all ward',
            addButton: {
              label: 'Add ward',
              url: '/admin/ward/add',
            },
          })}
          className="!border-none !rounded-none mx-auto my-5 table-list"
        >
          <TableList
            ref={tableListElement}
            tableConfig={tableConfig}
            rowList={rowList}
            getData={getData}
            loadingStatus={wardLoadingStatus}
          />
        </Card>
      </div>

      <DialogConfirm
        isShow={isShowDeleteDialog}
        title={'Delete ward'}
        body={'Do you want to delete this Ward?'}
        refusedCallback={refusedDeleteWard}
        acceptedCallback={deleteWard}
      ></DialogConfirm>
    </>
  );
};

export default WardList;
