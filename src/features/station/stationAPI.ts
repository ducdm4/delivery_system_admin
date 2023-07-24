import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export const addNewStation = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: 'stations',
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

export const getStationById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `stations/${data.id}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const getChildStationAPI = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `stations/child/${data.id}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const editStationById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `stations/${data.id}`,
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

export const getAllStationsFilter = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `stations${data.query}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const deleteStationById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `stations/${data.id}`,
      method: 'DELETE',
    },
    true,
  );
  return response;
};
