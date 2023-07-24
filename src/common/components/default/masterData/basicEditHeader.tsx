import { Button } from 'primereact/button';
import {
  ArrowLeftIcon,
  BackspaceIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';
import React from 'react';
import { useRouter } from 'next/router';

interface Props {
  isEdit: boolean;
  titleAdd: {
    big: string;
    small: string;
  };
  titleEdit: {
    big: string;
    small: string;
  };
  handleSubmit: Function;
  resetInput: Function;
  url: string;
  loading?: string;
}

const BasicEditHeader = ({
  isEdit,
  titleEdit,
  titleAdd,
  handleSubmit,
  resetInput,
  url,
}: Props) => {
  const router = useRouter();
  async function goToList() {
    await router.push(url);
  }

  return (
    <div className="rounded-none p-4">
      <div className="mb-8 flex items-center justify-between gap-8">
        <div>
          <p className={'text-xl font-bold'}>
            {isEdit ? titleEdit.big : titleAdd.big}
          </p>
          <p className={'text-sm'}>
            {isEdit ? titleEdit.small : titleAdd.small}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button
            className="flex items-center gap-3"
            severity="success"
            size="small"
            onClick={() => handleSubmit()}
          >
            <PlusCircleIcon strokeWidth={2} className="h-4 w-4" />
            Submit
          </Button>
          <Button
            className="flex items-center gap-3"
            color="yellow"
            onClick={() => resetInput()}
            severity="warning"
            outlined
            size="small"
          >
            <BackspaceIcon strokeWidth={2} className="h-4 w-4" />
            Reset
          </Button>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button
            className="flex items-center gap-3"
            color="blue"
            size="small"
            severity="info"
            onClick={goToList}
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Back to list
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasicEditHeader;
