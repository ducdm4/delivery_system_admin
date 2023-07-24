import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export async function getSelfProfile() {
  const response = await useAPI(
    {
      url: `users/self`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
    },
    true,
  );
  return response;
}

export async function updateSelfProfileAPI(data: KeyValue) {
  const response = await useAPI(
    {
      url: `users/self`,
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

export async function updatePasswordAPI(data: KeyValue) {
  const response = await useAPI(
    {
      url: `users/change-password`,
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
