import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import {
  cancelOrderOperator,
  confirmOrderOperator,
  getOrderByStatus,
} from '../../../features/order/orderSlice';
import { ORDER_STATUS, parcelWeightList } from '../../config/constant';
import { KeyValue } from '../../config/interfaces';
import moment from 'moment';
import { Divider } from 'primereact/divider';
import { getPhotoInfo } from '../../../features/photo/photoSlice';
import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';

const OperatorDashboard = () => {
  const dispatch = useAppDispatch();
  const [orderList, setOrderList] = useState([] as Array<KeyValue>);
  const [isShowCancelDialog, setIsShowCancelDialog] = useState(false);
  const [orderCancelInfo, setOrderCancelInfo] = useState({} as KeyValue);
  const [orderCancelNote, setOrderCancelNote] = useState('');

  const reasonList = [
    { name: 'Spam' },
    { name: 'Parcel is not meets the description' },
  ];

  function getOrders() {
    const getStationNewOrder = dispatch(
      getOrderByStatus({ status: ORDER_STATUS.ORDER_CREATED }),
    ).unwrap();
    getStationNewOrder.then(async (res) => {
      if (res.data) {
        const orders = res.data.orders;
        for (let j = 0; j < orders.length; j++) {
          let i = 0;
          for (const _ in orders[j].parcels) {
            const getPhoto = await dispatch(
              getPhotoInfo({ id: orders[j].parcels[i].photo.id }),
            ).unwrap();

            const url = URL.createObjectURL(getPhoto.data);
            orders[j].parcels[i].photo = {
              ...orders[j].parcels[i].photo,
              url,
            };
            i++;
          }
        }
        setOrderList(orders);
      }
    });
  }

  useEffect(() => {
    getOrders();
  }, []);

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
      toast(`Order ${data.uniqueTrackingId} confirmed successfully`, {
        hideProgressBar: true,
        autoClose: 2000,
        type: 'success',
      });
      getOrders();
    }
  }

  return (
    <>
      <h3 className="mt-8 text-3xl font-bold text-green-800">
        Newly created orders
      </h3>
      {orderList.map((order, index) => (
        <div key={index} className="bg-white rounded my-4 p-3">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-600">
              Tracking ID:{' '}
              <span className="text-xl font-semibold text-black">
                {order.uniqueTrackingId}
              </span>
            </p>
            <div className="flex justify-between gap-4 items-center">
              <Button
                onClick={() => confirmOrderOK(order)}
                size="small"
                label="Confirm OK"
                rounded
                icon="pi pi-check"
              />
              <Button
                onClick={() => prepareShowCancelOrder(order)}
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
              <p className="mb-1 mt-3">{order.senderName}</p>
              <p className="mb-1">{order.senderEmail}</p>
              <p className="mb-1">{order.senderPhone}</p>
              <p>{`${order.pickupAddress.building} ${order.pickupAddress.detail} ${order.pickupAddress.street.name}, 
              ${order.pickupAddress.ward.name}, ${order.pickupAddress.district.name}, ${order.pickupAddress.city.name}`}</p>
            </div>
            <div className="col-span-3">
              <p className="text-gray-600 text-sm">Recipinient</p>
              <p className="mb-1 mt-3">{order.receiverName}</p>
              <p className="mb-1">{order.receiverEmail}</p>
              <p className="mb-1">{order.receiverPhone}</p>
              <p>{`${order.dropOffAddress.building} ${order.dropOffAddress.detail} ${order.dropOffAddress.street.name}, 
              ${order.dropOffAddress.ward.name}, ${order.dropOffAddress.district.name}, ${order.dropOffAddress.city.name}`}</p>
            </div>
            <div className="col-span-6">
              <p className="text-gray-600 text-sm">Parcels</p>
              <div className="grid grid-cols-3 gap-8 mt-3">
                {order.parcels.map((parcel: KeyValue, indexParcel: number) => (
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
                ))}
              </div>
            </div>
          </div>
          <Divider />
          <p className="mt-4 text-sm">
            Created at:{' '}
            {moment(new Date(order.createdAt)).format('DD/MM/YYYY HH:mm')}
          </p>
        </div>
      ))}

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

export default OperatorDashboard;
