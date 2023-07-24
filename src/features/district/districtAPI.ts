import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export const addNewDistrict = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: 'districts',
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

export const getDistrictById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `districts/${data.id}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const editDistrictById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `districts/${data.id}`,
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

export const getAllDistrictsFilter = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `districts${data.query}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const deleteDistrictById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `districts/${data.id}`,
      method: 'DELETE',
    },
    true,
  );
  return response;
};
