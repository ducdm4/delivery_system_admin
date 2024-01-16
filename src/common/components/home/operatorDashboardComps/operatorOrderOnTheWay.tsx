import { KeyValue } from '../../../config/interfaces';
import { Divider } from 'primereact/divider';
import { Image } from 'primereact/image';
import { Dialog } from 'primereact/dialog';
import Barcode from 'react-barcode';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../hooks';
import {
  confirmOrderArrivedAction,
  getOrderByStatus,
} from '../../../../features/order/orderSlice';
import { ORDER_STATUS, parcelWeightList } from '../../../config/constant';
import moment from 'moment';
import { getPhotoInfo } from '../../../../features/photo/photoSlice';
import { getFullAddressText } from '../../../functions';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const OperatorOrderOnTheWay = () => {
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [orderArrivedInfo, setOrderArrivedInfo] = useState({} as KeyValue);

  const dispatch = useAppDispatch();
  const [orderList, setOrderList] = useState([] as Array<KeyValue>);
  const barcodeProps = {
    width: 1.5,
    height: 30,
    fontSize: 15,
  };

  function getOrders() {
    const getStationNewOrder = dispatch(
      getOrderByStatus({
        status: [
          ORDER_STATUS.WAITING_CUSTOMER_BRING_TO_STATION,
          ORDER_STATUS.COLLECTOR_ON_THE_WAY_TO_STATION,
        ].join(','),
      }),
    ).unwrap();
    getStationNewOrder.then(async (res) => {
      if (res.data) {
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
      }
    });
  }

  useEffect(() => {
    getOrders();
  }, []);

  function prepareShowDialog(order: KeyValue) {
    setOrderArrivedInfo(order);
    setIsShowDialog(true);
  }

  async function confirmOrderArrived() {
    const res = await dispatch(
      confirmOrderArrivedAction({ id: orderArrivedInfo.uniqueTrackingId }),
    ).unwrap();
    if (res.isSuccess) {
      closeDialog();
      getOrders();
      toast(
        `Order ${orderArrivedInfo.uniqueTrackingId} confirmed successfully`,
        {
          hideProgressBar: true,
          autoClose: 2000,
          type: 'success',
        },
      );
    }
  }

  const getWeightText = (weight: number) => {
    return parcelWeightList[weight].name;
  };

  const footerDialog = (
    <div>
      <Button
        label="Print label"
        severity="success"
        size="small"
        icon="pi pi-print"
        onClick={() => printDocument()}
        autoFocus
      />
      <Button
        label="Confirm"
        icon="pi pi-check"
        onClick={() => confirmOrderArrived()}
        autoFocus
        size="small"
      />
    </div>
  );

  function closeDialog() {
    setOrderArrivedInfo({});
    setIsShowDialog(false);
  }

  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  function printDocument() {
    const input = document.getElementById('order-label-container');
    if (input) {
      html2canvas(input, {
        scale: 2,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'px', 'a4');
        pdf.addImage({
          imageData: imgData,
          format: 'JPEG',
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          rotation: 0,
        });
        pdf.save(`${orderArrivedInfo.uniqueTrackingId}.pdf`);
      });
    }
  }

  function hideInfo(info: string) {
    if (info) {
      let res = info.slice(0, 1);
      for (let i = 3; i < info.length - 1; i++) {
        res += '*';
      }
      res += info.slice(info.length - 3, info.length);
      return res;
    }
    return '';
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
                onClick={() => prepareShowDialog(item.order)}
                size="small"
                label="Confirm Arrived"
                rounded
                icon="pi pi-check"
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
        header={orderArrivedInfo.uniqueTrackingId}
        visible={isShowDialog}
        style={{ width: '35vw' }}
        onHide={() => closeDialog()}
        footer={footerDialog}
      >
        <div
          className="h-[397px] w-[562px] m-auto border px-4 py-2"
          id="order-label-container"
        >
          <div className="flex justify-between items-center">
            <div className="font-semibold text-xl">DELIVERY SYSTEM</div>
            {orderArrivedInfo.uniqueTrackingId !== '' && (
              <Barcode
                {...barcodeProps}
                value={orderArrivedInfo.uniqueTrackingId || ''}
              />
            )}
          </div>
          <div className="h-[80%] grid grid-cols-2 border-t py-3 mt-2">
            <div className="border-r h-full flex flex-col justify-center pr-2">
              <div>
                <p className="text-xs">From:</p>
                <p className="font-semibold">{orderArrivedInfo.senderName}</p>
                <p className="font-semibold">
                  {hideInfo(orderArrivedInfo.senderPhone)}
                </p>
              </div>
              <div className="border-t mt-3 pt-3">
                <p className="text-xs">To:</p>
                <p className="font-semibold">{orderArrivedInfo.receiverName}</p>
                <p className="font-semibold">
                  {hideInfo(orderArrivedInfo.receiverPhone)}
                </p>
                <p className="font-semibold text-sm">
                  {getFullAddressText(orderArrivedInfo.dropOffAddress)}
                </p>
              </div>
            </div>
            <div className="pl-3 flex flex-col justify-between">
              <div>
                <p className="text-xs">Parcels:</p>
                {orderArrivedInfo.parcels?.map(
                  (parcel: KeyValue, index: number) => (
                    <div className="font-semibold" key={index}>
                      <span className="mr-1">1:</span>
                      <span>{parcel.description}</span>
                    </div>
                  ),
                )}
              </div>
              <div className="border-t pt-2 font-semibold">
                <div className="flex items-center justify-between ">
                  <span className="text-sm">COD:</span>
                  <span>
                    {formatter.format(orderArrivedInfo.cashOnDelivery)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ship:</span>
                  <span>{formatter.format(orderArrivedInfo.shippingFare)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total:</span>
                  <span>
                    {formatter.format(
                      orderArrivedInfo.shippingFare +
                        orderArrivedInfo.cashOnDelivery,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default OperatorOrderOnTheWay;
