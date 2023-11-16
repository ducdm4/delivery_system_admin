import { KeyValue, TableListRefObject } from '../../config/interfaces';
import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { PER_PAGE_ITEM } from '../../config/constant';
import { ProgressSpinner } from 'primereact/progressspinner';
import BasicTablePagination from './masterData/pagination';
import BasicListFilter from './masterData/basicListFilter';

interface Props {
  tableConfig: {
    header: Array<{ label: string; key: string; isSort?: boolean }>;
    url: string;
    filters: Array<{ key: string; label: string; data: Array<KeyValue> }>;
  };
  rowList: Function;
  getData: Function;
  loadingStatus: string;
}

interface sortItem {
  key: string;
  value: number | null;
}
interface filterItem {
  key: string;
  value: {
    id: number | null;
    name: string;
  };
}

const TableList = forwardRef(
  (
    { tableConfig, rowList, getData, loadingStatus }: Props,
    ref: Ref<TableListRefObject>,
  ) => {
    const [tableData, setTableData] = useState([]);
    const [sortData, setSortData] = useState(() => {
      const defaultData: Array<sortItem> = [];
      return defaultData;
    });
    const [filterData, setFilterData] = useState(() => {
      let defaultData: Array<filterItem> = [];
      if (tableConfig.filters.length) {
        defaultData = tableConfig.filters.map((filterItem) => {
          return {
            key: filterItem.key,
            value: {
              id: null,
              name: '',
            },
          };
        });
      }
      return defaultData;
    });
    const [keyword, setKeyword] = useState('');
    const [triggerGetData, setTriggerGetData] = useState(0);
    const [pagingInfo, setPagingInfo] = useState({
      currentPage: 1,
      totalPage: 0,
      total: 0,
    });

    useImperativeHandle(ref, () => ({ handleSearch }));

    useEffect(() => {
      const sorts: Array<sortItem> = [];
      tableConfig.header.forEach((item) => {
        if (item.isSort) {
          sorts.push({
            key: item.key,
            value: 0,
          });
        }
      });
      setSortData(sorts);
    }, []);

    useEffect(() => {
      handleSearch();
    }, [triggerGetData]);

    function handleSubmitSearch() {
      setPagingInfo((old) => {
        return {
          ...old,
          currentPage: 1,
        };
      });
      setTriggerGetData((old) => old + 1);
    }

    async function handleSort(key: string) {
      const index = sortData.findIndex((x) => x.key === key);
      setSortData((values) => {
        switch (values[index].value) {
          case 0:
            values[index].value = 1;
            break;
          case 1:
            values[index].value = -1;
            break;
          case -1:
            values[index].value = 0;
            break;
          default:
            values[index].value = 0;
            break;
        }
        return values;
      });
      setTriggerGetData((old) => old + 1);
    }

    async function handleReset() {
      setKeyword('');
      setSortData((values) => {
        return values.map((item) => {
          item.value = 0;
          return item;
        });
      });
      setTriggerGetData((old) => old + 1);
    }

    async function handleSearch() {
      let query = `?page=${pagingInfo.currentPage}&limit=${PER_PAGE_ITEM}`;
      if (keyword) {
        query += `&keyword=${keyword}`;
      }
      sortData.forEach((sortItem) => {
        if (sortItem.value !== 0) {
          query += `&sort[${sortItem.key}]=${
            sortItem.value === 1 ? 'asc' : 'desc'
          }`;
        }
      });
      filterData.forEach((filterItem) => {
        if (
          filterItem.value &&
          filterItem.value.id !== null &&
          filterItem.value.id !== undefined
        ) {
          query += `&filter[${filterItem.key}]=${filterItem.value.id}`;
        }
      });
      const res = await getData(query);
      setTableData(res.list);
      setPagingInfo((oldState) => {
        return {
          currentPage: res.page,
          totalPage: Math.ceil(res.total / PER_PAGE_ITEM),
          total: res.total,
        };
      });
    }

    function checkUpDownIcon(key: string) {
      const sortIdx = sortData.findIndex((x) => x.key === key);
      if (sortIdx > -1) {
        return sortData[sortIdx].value;
      }
      return 0;
    }

    function handleChangePage(type: string) {
      setPagingInfo((old) => {
        return {
          ...old,
          currentPage:
            type === 'asc' ? old.currentPage + 1 : old.currentPage - 1,
        };
      });
      setTriggerGetData((old) => old + 1);
    }

    function handleChangeFilter(
      value: { id: number; name: string },
      index: number,
    ) {
      setFilterData((old) => {
        const res = old;
        res[index].value = value;
        return JSON.parse(JSON.stringify(res));
      });
    }

    return (
      <>
        <BasicListFilter
          keyword={keyword}
          tableFilter={tableConfig.filters}
          filterData={filterData}
          setKeyword={setKeyword}
          handleReset={handleReset}
          handleSubmitSearch={handleSubmitSearch}
          handleChangeFilter={handleChangeFilter}
          loadingStatus={loadingStatus}
        />
        <div className="p-0 relative min-h-0">
          {loadingStatus === 'loading' && (
            <ProgressSpinner
              style={{ width: '22px', height: '22px' }}
              strokeWidth="8"
              animationDuration="2s"
            />
          )}
          {loadingStatus !== 'loading' && (
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {tableConfig.header.map((headerItem, index: number) => (
                    <th
                      key={index}
                      onClick={() => {
                        return headerItem.isSort
                          ? handleSort(headerItem.key)
                          : false;
                      }}
                      style={!headerItem.label ? { width: '15%' } : {}}
                      className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                    >
                      <p
                        color="blue-gray"
                        className="flex text-sm items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        {headerItem.label}{' '}
                        {headerItem.isSort &&
                          checkUpDownIcon(headerItem.key) === 0 && (
                            <i className="pi pi-sort-alt"></i>
                          )}
                        {headerItem.isSort &&
                          checkUpDownIcon(headerItem.key) === 1 && (
                            <i className="pi pi-sort-alpha-down"></i>
                          )}
                        {headerItem.isSort &&
                          checkUpDownIcon(headerItem.key) === -1 && (
                            <i className="pi pi-sort-alpha-up"></i>
                          )}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData && tableData.length === 0 && (
                  <tr>
                    <td
                      className={'p-4 border-b border-blue-gray-50'}
                      colSpan={tableConfig.header.length}
                    >
                      No item found!
                    </td>
                  </tr>
                )}
                {rowList(tableData)}
              </tbody>
            </table>
          )}
        </div>
        {tableData && tableData.length > 0 && (
          <BasicTablePagination
            pagingInfo={pagingInfo}
            loadingStatus={loadingStatus}
            handleChangePage={handleChangePage}
          />
        )}
      </>
    );
  },
);

export default TableList;
