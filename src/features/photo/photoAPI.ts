import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export const addNewPhoto = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: 'photos',
      method: 'POST',
      data,
    },
    true,
  );
  return response;
};

export const getPhotoById = async (data: KeyValue) => {
  const response = await useAPI({
    url: `photos/${data.id}`,
    method: 'GET',
  });
  return response;
};
