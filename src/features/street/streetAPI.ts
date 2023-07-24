import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export const addNewStreet = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: 'streets',
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

export const getStreetById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `streets/${data.id}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const editStreetById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `streets/${data.id}`,
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

export const getStreetNotInRouteAPI = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `streets/streetsNotInAnyRoute/${data.station}/${data.type}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const getAllStreetsFilter = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `streets${data.query}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const deleteStreetById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `streets/${data.id}`,
      method: 'DELETE',
    },
    true,
  );
  return response;
};
