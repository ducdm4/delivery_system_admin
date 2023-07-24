import {
  APIInfo,
  FailedResponse,
  KeyValue,
  SuccessResponse,
} from '../config/interfaces';
import { toast } from 'react-toastify';
import Router from 'next/router';
import { imageType } from '../config/constant';

export async function useAPI(
  apiInfo: APIInfo,
  isAuthorized = true,
): Promise<KeyValue> {
  const baseHeader: KeyValue = {};
  if (isAuthorized)
    baseHeader['Authorization'] = `Bearer ${localStorage.getItem(
      process.env.NEXT_PUBLIC_API_KEY as string,
    )}`;
  const returnData: KeyValue = {
    statusCode: 200,
    data: {} as KeyValue,
    message: '',
    isSuccess: true,
  };
  try {
    const apiInit: KeyValue = {
      method: apiInfo.method,
      headers: {
        ...baseHeader,
        ...apiInfo.header,
      },
    };
    apiInit.body = apiInfo.data;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/${apiInfo.url}`,
      apiInit,
    );
    if (
      imageType.findIndex((x) => x === response.headers.get('Content-Type')) >
      -1
    ) {
      returnData.data = await response.blob();
    } else {
      const result = await response.json();
      if (!response.ok) {
        const res = result as FailedResponse;
        handleError(res);
        returnData.isSuccess = false;
        returnData.statusCode = res.statusCode;
        returnData.message = res.message;
      } else {
        const res = result as SuccessResponse;
        returnData.data = res.data;
      }
    }
  } catch (e) {
    returnData.isSuccess = false;
    returnData.message = 'Unknown Error';
  }
  return returnData;
}

async function handleError(res: FailedResponse) {
  if (res.statusCode === 401 || res.statusCode === 403) {
    await Router.push('/admin/login');
  } else {
    const message =
      typeof res.message === 'string' ? res.message : 'Something went wrong!';
    toast(message, {
      hideProgressBar: true,
      autoClose: 2000,
      type: 'error',
    });
  }
}
