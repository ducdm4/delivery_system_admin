import { KeyValue } from '../../../config/interfaces';
import { Divider } from 'primereact/divider';
import { Image } from 'primereact/image';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../hooks';
import {
  cancelOrderOperator,
  confirmOrderOperator,
  getOrderByStatus,
} from '../../../../features/order/orderSlice';
import { ORDER_STATUS, parcelWeightList } from '../../../config/constant';
import moment from 'moment';
import { getPhotoInfo } from '../../../../features/photo/photoSlice';
import { getFullAddressText } from '../../../functions';

const OperatorOrderNewlyCreate = () => {
  const [isShowCancelDialog, setIsShowCancelDialog] = useState(false);
  const [orderCancelInfo, setOrderCancelInfo] = useState({} as KeyValue);
  const [orderCancelNote, setOrderCancelNote] = useState('');

  const dispatch = useAppDispatch();
  const [orderList, setOrderList] = useState([] as Array<KeyValue>);

  const reasonList = [
    { name: 'Spam' },
    { name: 'Parcel is not meets the description' },
  ];

  function getOrders() {
    const getStationNewOrder = dispatch(
      getOrderByStatus({
        status: [ORDER_STATUS.ORDER_CREATED].join(','),
      }),
    ).unwrap();
    getStationNewOrder.then(async (res) => {
      if (res.isSuccess) {
        if (res.data.orders.length) {
          const orders = res.data.orders;
          for (let j = 0; j < orders.length; j++) {
            let i = 0;
            for (const _ in orders[j].order.parcels) {
              const getPhoto = await dispatch(
                getPhotoInfo({ id: orders[j].order.parcels[i].photo.id }),
              ).unwrap();

              const url = URL.createObjectURL(getPhoto.data);
              orders[j].order.parcels[i].photo = {
                ...orders[j].order.parcels[i].photo,
                url,
              };
              i++;
            }
          }
          setOrderList(orders);
        } else {
          setOrderList([]);
        }
      }
    });
  }

  useEffect(() => {
    getOrders();
  }, []);

  async function confirmCancelOrder() {
    const cancelResponse = await dispatch(
      cancelOrderOperator({
        order: orderCancelInfo.id,
        payload: { note: orderCancelNote },
      }),
    ).unwrap();
    if (cancelResponse.isSuccess) {
      closeCancelDialog();
    }
  }

  async function confirmOrderOK(data: KeyValue) {
    const res = await dispatch(confirmOrderOperator({ id: data.id })).unwrap();
    if (res.isSuccess) {
      getOrders();
      toast(`Order ${data.uniqueTrackingId} confirmed successfully`, {
        hideProgressBar: true,
        autoClose: 2000,
        type: 'success',
      });
    }
  }

  const getWeightText = (weight: number) => {
    return parcelWeightList[weight].name;
  };

  function prepareShowCancelOrder(order: KeyValue) {
    setOrderCancelInfo(order);
    setIsShowCancelDialog(true);
  }

  const footerCancelDialog = (
    <div>
      <Button
        label="Confirm"
        icon="pi pi-check"
        onClick={() => confirmCancelOrder()}
        autoFocus
      />
    </div>
  );

  function closeCancelDialog() {
    setOrderCancelInfo({});
    setOrderCancelNote('');
    getOrders();
    setIsShowCancelDialog(false);
  }

  return (
    <>
      {orderList.map((item, index) => (
        <div
          key={index}
          className="bg-gray-50 border-stone-200 border-solid border rounded p-4 mb-4"
        >
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-600">
              Tracking ID:{' '}
              <span className="text-xl font-semibold text-black">
                {item.order.uniqueTrackingId}
              </span>
            </p>
            <div className="flex justify-between gap-4 items-center">
              <Button
                onClick={() => confirmOrderOK(item.order)}
                size="small"
                label="Confirm OK"
                rounded
                icon="pi pi-check"
              />
              <Button
                onClick={() => prepareShowCancelOrder(item.order)}
                size="small"
                severity="danger"
                rounded
                label="Cancel"
                icon="fa fa-xmark"
              />
            </div>
          </div>
          <Divider />
          <div className="grid grid-cols-12 gap-8 mt-4">
            <div className="col-span-3">
              <p className="text-gray-600 text-sm">Sender</p>
              <p className="mb-1 mt-3">{item.order.senderName}</p>
              <p className="mb-1">{item.order.senderEmail}</p>
              <p className="mb-1">{item.order.senderPhone}</p>
              <p>{getFullAddressText(item.order.pickupAddress)}</p>
            </div>
            <div className="col-span-3">
              <p className="text-gray-600 text-sm">Recipient</p>
              <p className="mb-1 mt-3">{item.order.receiverName}</p>
              <p className="mb-1">{item.order.receiverEmail}</p>
              <p className="mb-1">{item.order.receiverPhone}</p>
              <p>{getFullAddressText(item.order.dropOffAddress)}</p>
            </div>
            <div className="col-span-6">
              <p className="text-gray-600 text-sm">Parcels</p>
              <div className="grid grid-cols-3 gap-8 mt-3">
                {item.order.parcels.map(
                  (parcel: KeyValue, indexParcel: number) => (
                    <div
                      key={indexParcel}
                      className="flex-col gap-4 items-center"
                    >
                      <div>
                        <p>{parcel.description}</p>
                        <p>{getWeightText(parcel.weight)}</p>
                      </div>
                      <Image
                        className="mt-2 mr-2"
                        src={parcel.photo.url}
                        width="100%"
                        preview
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
          <Divider />
          <p className="mt-4 text-sm">
            Created at:{' '}
            {moment(new Date(item.order.createdAt)).format('DD/MM/YYYY HH:mm')}
          </p>
        </div>
      ))}
      {!orderList.length && <p>There is no new order, try again later!</p>}
      <Dialog
        header={orderCancelInfo.uniqueTrackingId}
        visible={isShowCancelDialog}
        style={{ width: '30vw' }}
        onHide={() => closeCancelDialog()}
        footer={footerCancelDialog}
      >
        <Dropdown
          value={orderCancelNote}
          onChange={(e) => setOrderCancelNote(e.value.name)}
          options={reasonList}
          optionLabel="name"
          placeholder="Select a reason or type in below"
          className="w-full md:w-14rem mb-4"
        />
        <InputText
          value={orderCancelNote}
          className="w-full"
          onChange={(e) => setOrderCancelNote(e.target.value)}
          placeholder="Reason to cancel"
        />
      </Dialog>
    </>
  );
};

export default OperatorOrderNewlyCreate;
