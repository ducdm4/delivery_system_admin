import type { NextPage } from 'next';
import Head from 'next/head';

import { useAppSelector } from '../../common/hooks';
import { userLoggedIn } from '../../features/auth/authSlice';
import { useEffect } from 'react';

const IndexPage: NextPage = () => {
  const userInfo = useAppSelector(userLoggedIn);

  return (
    <>
      <Head>
        <title>Admin home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default IndexPage;
