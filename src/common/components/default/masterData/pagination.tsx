import { Button } from 'primereact/button';
import React from 'react';

interface Props {
  pagingInfo: {
    currentPage: number;
    totalPage: number;
    total: number;
  };
  loadingStatus: string;
  handleChangePage: any;
}

const BasicTablePagination = ({
  pagingInfo,
  loadingStatus,
  handleChangePage,
}: Props) => {
  return (
    <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
      <div>
        <p className="text-sm">
          Page {pagingInfo.currentPage} of {pagingInfo.totalPage}
        </p>
        <p className="text-sm">Total {pagingInfo.total} record(s)</p>
      </div>
      <div className="flex gap-2">
        <Button
          disabled={pagingInfo.currentPage === 1 || loadingStatus === 'loading'}
          text
          raised
          severity="info"
          size="small"
          onClick={() => handleChangePage('desc')}
        >
          Previous
        </Button>
        <Button
          disabled={
            pagingInfo.currentPage === pagingInfo.totalPage ||
            loadingStatus === 'loading'
          }
          text
          raised
          severity="info"
          size="small"
          onClick={() => handleChangePage('asc')}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default BasicTablePagination;
