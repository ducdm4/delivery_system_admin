import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export const addNewCity = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: 'cities',
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

export const getCityById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `cities/${data.id}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const editCityById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `cities/${data.id}`,
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

export const getAllCitiesFilter = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `cities${data.query}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const deleteCityById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `cities/${data.id}`,
      method: 'DELETE',
    },
    true,
  );
  return response;
};
