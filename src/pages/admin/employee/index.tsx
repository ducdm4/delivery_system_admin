import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import TableList from '../../../common/components/default/tableList';
import {
  KeyValue,
  TableListRefObject,
} from '../../../common/config/interfaces';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import DialogConfirm from '../../../common/components/default/dialogConfirm';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import BasicListHeader from '../../../common/components/default/masterData/basicListHeader';
import {
  deleteEmployeeThunk,
  employeeLoading,
  getListEmployeeFilter,
} from '../../../features/employee/employeeSlice';
import { getStationListFilter } from '../../../features/station/stationSlice';
import { employeeRoleList } from '../../../common/config/constant';

const EmployeeList: NextPage = () => {
  const [tableConfig, setTableConfig] = useState({
    url: '/employee',
    header: [
      {
        label: 'Full name',
        key: 'name',
        isSort: true,
      },
      {
        label: 'Role',
        key: 'role',
        isSort: true,
      },
      {
        label: 'Station',
        key: 'stationName',
      },
      {
        label: 'Verified',
        key: 'verified',
      },
      {
        label: '',
        key: '',
      },
    ],
    filters: [
      {
        key: 'role',
        label: 'Role',
        data: employeeRoleList,
      },
      {
        key: 'isVerified',
        label: 'Verified',
        data: [
          { id: 1, name: 'Yes' },
          { id: 0, name: 'No' },
        ],
      },
      {
        key: 'station',
        label: 'Station',
        data: [],
      },
    ],
  });
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [currentEmployeeDelete, setCurrentEmployeeDelete] = useState({
    id: -1,
    name: '',
  });
  const employeeLoadingStatus = useAppSelector(employeeLoading);
  const tableListElement = useRef<TableListRefObject>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function goToEdit(id: number) {
    await router.push(`/admin/employee/${id}`);
  }

  async function getData(query = '') {
    const res = await dispatch(getListEmployeeFilter({ query })).unwrap();
    if (res.isSuccess) {
      return res.data;
    } else {
      return [];
    }
  }

  function confirmDeleteEmployee(id: number, name: string) {
    setCurrentEmployeeDelete({
      id,
      name,
    });
    setIsShowDeleteDialog(true);
  }

  function deleteEmployee() {
    const res = dispatch(
      deleteEmployeeThunk({ id: currentEmployeeDelete.id }),
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
        refusedDeleteEmployee();
      }
    });
  }

  function refusedDeleteEmployee() {
    setIsShowDeleteDialog(false);
    setCurrentEmployeeDelete({
      id: -1,
      name: '',
    });
  }

  useEffect(() => {
    const getListStation = dispatch(
      getStationListFilter({ query: '' }),
    ).unwrap();
    getListStation.then((res) => {
      if (res.isSuccess) {
        const indexStation = tableConfig.filters.findIndex(
          (x) => x.key === 'station',
        );
        if (indexStation) {
          setTableConfig((old) => {
            const filters = old.filters;
            filters[indexStation].data = res.data.list;
            return {
              ...old,
              filters,
            };
          });
        }
      }
    });
  }, []);

  const roleDetail = (id: number) => {
    const role = employeeRoleList.find((x) => x.id === id);
    if (role) {
      return role.name;
    }
    return '';
  };

  function rowList(data: Array<KeyValue>) {
    const tdClasses = 'p-4 border-b border-blue-gray-50';
    return (
      <>
        {data?.map((row, index: number) => (
          <tr key={index}>
            <td className={tdClasses}>{`${row.firstName} ${row.lastName}`}</td>
            <td className={tdClasses}>{roleDetail(row.role)}</td>
            <td className={tdClasses}>{row.stationName}</td>
            <td className={tdClasses}>{row.isVerified ? 'Yes' : 'No'}</td>
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
                onClick={() => confirmDeleteEmployee(row.id, row.name)}
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
        <title>Employee management</title>
      </Head>
      <div>
        <Card
          header={BasicListHeader({
            title: 'Employee list',
            smallTitle: 'See information about all district',
            addButton: {
              label: 'Add employee',
              url: '/admin/employee/add',
            },
          })}
          className="!border-none !rounded-none mx-auto my-5 table-list"
        >
          <TableList
            ref={tableListElement}
            tableConfig={tableConfig}
            rowList={rowList}
            getData={getData}
            loadingStatus={employeeLoadingStatus}
          />
        </Card>
      </div>

      <DialogConfirm
        isShow={isShowDeleteDialog}
        title={'Delete district'}
        body={'Do you want to delete this Employee?'}
        refusedCallback={refusedDeleteEmployee}
        acceptedCallback={deleteEmployee}
      ></DialogConfirm>
    </>
  );
};

export default EmployeeList;
