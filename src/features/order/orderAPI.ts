import { KeyValue } from '../../common/config/interfaces';
import { useAPI } from '../../common/hooks/useAPI';

export const getNewOrderByStatusAPI = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `orders/status/${data.status}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const cancelOrderOperatorAPI = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `orders/cancelOrderOperator/${data.order}`,
      method: 'PATCH',
      header: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data.payload),
    },
    true,
  );
  return response;
};

export const confirmOrderOperatorAPI = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `orders/operatorConfirmOrder/${data.id}`,
      method: 'PATCH',
      header: {
        'Content-Type': 'application/json',
      },
    },
    true,
  );
  return response;
};

export const confirmOrderArrivedAPI = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `orders/orderArrivedStation/${data.id}`,
      method: 'PATCH',
      header: {
        'Content-Type': 'application/json',
      },
    },
    true,
  );
  return response;
};
