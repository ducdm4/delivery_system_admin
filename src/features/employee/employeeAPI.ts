import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export async function createNewEmployeeAPI(data: KeyValue) {
  const response = await useAPI(
    {
      url: `employees`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    },
    true,
  );
  return response;
}

export async function updateEmployeeInfoAPI(data: KeyValue) {
  const response = await useAPI(
    {
      url: `employees/${data.id}`,
      method: 'PUT',
      header: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    },
    true,
  );
  return response;
}

export const getEmployeeById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `employees/${data.id}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const getAllEmployeeFilter = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `employees${data.query}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const deleteEmployeeById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `employees/${data.id}`,
      method: 'DELETE',
    },
    true,
  );
  return response;
};

export const patchEmployeeById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `employees/${data.id}`,
      method: 'PATCH',
      header: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    },
    true,
  );
  return response;
};
