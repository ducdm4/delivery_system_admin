import { KeyValue } from "../../common/config/interfaces";
import { useAPI } from "../../common/hooks/useAPI";

export const getNewOrderByStatusAPI = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `orders/status/${data.status}`,
      method: 'GET',
    },
    true,
  )
  return response;
}