import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import React from 'react';
import { KeyValue } from '../../../config/interfaces';

interface Props {
  keyword: string;
  tableFilter: Array<{ key: string; label: string; data: Array<KeyValue> }>;
  filterData: Array<filterItem>;
  setKeyword: any;
  handleReset: any;
  handleSubmitSearch: any;
  handleChangeFilter: any;
  loadingStatus: string;
}

interface filterItem {
  key: string;
  value: {
    id: number | null;
    name: string;
  };
}

const BasicListFilter = ({
  keyword,
  tableFilter,
  filterData,
  setKeyword,
  loadingStatus,
  handleSubmitSearch,
  handleChangeFilter,
  handleReset,
}: Props) => {
  return (
    <div className="rounded-none px-4">
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <div className="">
          <span className="p-input-icon-left w-80">
            <i className="pi pi-search" />
            <InputText
              className="w-80"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search"
            />
          </span>
        </div>
        <Button
          severity="success"
          size="small"
          disabled={loadingStatus === 'loading'}
          onClick={() => handleSubmitSearch()}
        >
          {loadingStatus === 'loading' ? (
            <ProgressSpinner
              style={{ width: '22px', height: '22px' }}
              strokeWidth="8"
              animationDuration="2s"
            />
          ) : (
            'Submit'
          )}
        </Button>
        <Button
          disabled={loadingStatus === 'loading'}
          onClick={() => handleReset()}
          size="small"
          severity="secondary"
        >
          {loadingStatus === 'loading' ? (
            <ProgressSpinner
              style={{ width: '22px', height: '22px' }}
              strokeWidth="8"
              animationDuration="2s"
            />
          ) : (
            'Reset'
          )}
        </Button>
      </div>
      <div className={'flex-row flex gap-8 mt-5'}>
        {tableFilter.map((filterItem, index) => (
          <div key={`${filterItem.key}-div`} className={'basis-1/4'}>
            <Dropdown
              value={filterData[index].value}
              onChange={(e) => handleChangeFilter(e.value, index)}
              options={filterItem.data}
              optionLabel="name"
              filter
              className={'w-full p-inputtext-sm'}
              placeholder={filterItem.label}
              name={filterItem.key}
              key={`${filterItem.key}-sel`}
              showClear
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicListFilter;
