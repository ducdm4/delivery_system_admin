import type { NextPage } from 'next';
import Head from 'next/head';

import Counter from '../features/counter/Counter';
import { useAppSelector } from '../common/hooks';
import { userLoggedIn } from '../features/auth/authSlice';
import { useEffect } from 'react';

const IndexPage: NextPage = () => {
  const userInfo = useAppSelector(userLoggedIn);

  return (
    <>
      <div id="banner-block">
        <button>new order</button>
        <input type="text" />
        <button>track your order</button>
      </div>
    </>
  );
};

export default IndexPage;
