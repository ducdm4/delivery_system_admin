import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export const addNewRoute = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: 'routes',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    },
    true,
  );
  return response;
};

export const getRouteById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `routes/${data.id}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const editRouteById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `routes/${data.id}`,
      method: 'PUT',
      header: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    },
    true,
  );
  return response;
};

export const getAllRoutesFilter = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `routes${data.query}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const deleteRouteById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `routes/${data.id}`,
      method: 'DELETE',
    },
    true,
  );
  return response;
};
