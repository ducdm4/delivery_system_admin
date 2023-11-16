import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { getOrderByStatus } from '../../../features/order/orderSlice';
import { ORDER_STATUS, parcelWeightList } from '../../config/constant';
import { KeyValue } from '../../config/interfaces';
import moment from 'moment';
import { Divider } from 'primereact/divider';
import { getPhotoInfo } from '../../../features/photo/photoSlice';
import { Image } from 'primereact/image';
import { Button } from 'primereact/button';

const OperatorDashboard = () => {
  const dispatch = useAppDispatch()
  const [orderList, setOrderList] = useState([] as Array<KeyValue>)

  useEffect(() => {
    const getStationNewOrder = dispatch(getOrderByStatus({ status: ORDER_STATUS.ORDER_CREATED })).unwrap()
    getStationNewOrder.then(async res => {
      if (res.data) {
        let orders = res.data.orders
        for (let j = 0; j < orders.length; j++) {
          let i = 0
          for (const _parcel in orders[j].parcels) {
            const getPhoto = await dispatch(
              getPhotoInfo({ id: orders[j].parcels[i].photo.id }),
            ).unwrap();
            console.log(orders[j].parcels[i].photo.id)

            const url = URL.createObjectURL(getPhoto.data)
            orders[j].parcels[i].photo = {
              ...orders[j].parcels[i].photo,
              url
            }
            console.log(JSON.parse(JSON.stringify(orders)))
            i++
          }
        }
        setOrderList(orders)
      }
      console.log(res.data)
    })
  }, [])

  const getWeightText = (weight: number) => {
    return parcelWeightList[weight].name
  }

  return (
    <>
      <h3 className='mt-4 text-3xl font-bold text-green-800'>Newly created orders</h3>
      {orderList.map((order, index) => (
        <div key={index} className='bg-white rounded my-4 p-3'>
          <div className='flex justify-between items-center'>
            <p className='font-semibold text-gray-600'>Tracking ID: <span className='text-xl font-semibold text-black'>{order.uniqueTrackingId}</span></p>
            <div className='flex justify-between gap-4 items-center'>
              <Button size="small" label="Confirm OK" rounded icon="pi pi-check" />
              <Button size="small" severity='danger' rounded label="Cancel" icon="fa fa-xmark" />
            </div>
          </div>
          <Divider />
          <div className="grid grid-cols-12 gap-8 mt-4">
            <div className='col-span-3'>
              <p className='text-gray-600 text-sm'>Sender</p>
              <p className='mb-1'>{order.senderName}</p>
              <p className='mb-1'>{order.senderEmail}</p>
              <p className='mb-1'>{order.senderPhone}</p>
              <p>{`${order.pickupAddress.building} ${order.pickupAddress.detail} ${order.pickupAddress.street.name}, 
              ${order.pickupAddress.ward.name}, ${order.pickupAddress.district.name}, ${order.pickupAddress.city.name}`}</p>
            </div>
            <div className='col-span-3'>
              <p className='text-gray-600 text-sm'>Recipinient</p>
              <p className='mb-1'>{order.receiverName}</p>
              <p className='mb-1'>{order.receiverEmail}</p>
              <p className='mb-1'>{order.receiverPhone}</p>
              <p>{`${order.dropOffAddress.building} ${order.dropOffAddress.detail} ${order.dropOffAddress.street.name}, 
              ${order.dropOffAddress.ward.name}, ${order.dropOffAddress.district.name}, ${order.dropOffAddress.city.name}`}</p>
            </div>
            <div className='col-span-6'>
              <p className='text-gray-600 text-sm'>Parcels</p>
              <div className='grid grid-cols-3 gap-8'>
                {order.parcels.map((parcel: KeyValue, indexParcel: number) => (
                  <div key={indexParcel} className='flex gap-4 items-center'>
                    <div>
                      <p>{parcel.description}</p>
                      <p>{getWeightText(parcel.weight)}</p>
                    </div>
                    <Image className='mt-2 mr-2' src={parcel.photo.url} width='100' preview />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Divider />
          <p className='mt-4 text-sm'>Created at: {moment(new Date(order.createdAt)).format('DD/MM/YYYY HH:mm')}</p>
        </div>
      ))}
    </>
  );
};

export default OperatorDashboard;
