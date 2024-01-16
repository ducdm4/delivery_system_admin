import type { NextPage } from 'next';
import Head from 'next/head';

import Counter from '../features/counter/Counter';
import { useAppSelector } from '../common/hooks';
import { userLoggedIn } from '../features/auth/authSlice';
import { useEffect } from 'react';
import OperatorDashboard from '../common/components/home/operatorDashboard';
import { ROLE_LIST } from '../common/config/constant';
import { toast } from 'react-toastify';
import { KeyValue } from '../common/config/interfaces';

const IndexPage: NextPage = () => {
  const userInfo = useAppSelector(userLoggedIn);

  const eventSource = new EventSource(
    `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/orders/sse`,
  );

  useEffect(() => {
    eventSource.addEventListener('new-order', (e) => {
      console.log();
      const data = JSON.parse(e.data) as KeyValue;
      if (
        userInfo.role === ROLE_LIST.OPERATOR &&
        data.station === userInfo.employeeInfo.station.id
      ) {
        toast('Your station have a new order, please review it ASAP!', {
          hideProgressBar: true,
          autoClose: 200000,
          type: 'warning',
          theme: 'colored',
        });
      }
      console.log(e.data);
    });
  }, []);

  return <>{userInfo.role === ROLE_LIST.OPERATOR && <OperatorDashboard />}</>;
};

export default IndexPage;
