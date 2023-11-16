import type { NextPage } from 'next';
import Head from 'next/head';

import Counter from '../features/counter/Counter';
import { useAppSelector } from '../common/hooks';
import { userLoggedIn } from '../features/auth/authSlice';
import { useEffect } from 'react';
import OperatorDashboard from '../common/components/home/operatorDashboard';
import { ROLE_LIST } from '../common/config/constant';

const IndexPage: NextPage = () => {
  const userInfo = useAppSelector(userLoggedIn);

  return <>{userInfo.role === ROLE_LIST.OPERATOR && <OperatorDashboard />}</>;
};

export default IndexPage;
