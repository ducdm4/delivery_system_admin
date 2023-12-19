import Header from './header';
import React, {
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  userLoggedIn,
  verifyUserLogin,
} from '../../../features/auth/authSlice';
import { useRouter } from 'next/router';
import { getUserProfilePicture } from '../../../features/photo/photoSlice';
import ChatDialog from '../chat/ChatDialog';
import { KeyValue } from '../../config/interfaces';

export default function Layout({ children }: PropsWithChildren) {
  const userInfo = useAppSelector(userLoggedIn);
  const dispatch = useAppDispatch();
  const [isShowHeader, setIsShowHeader] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const router = useRouter();

  if (typeof window !== 'undefined') {
    useLayoutEffect(() => {
      const token = localStorage.getItem(
        process.env.NEXT_PUBLIC_API_KEY || 'DSAccessToken',
      );
      if (router.pathname.split('/').indexOf('login') === -1) {
        if (token) {
          const verify = dispatch(verifyUserLogin()).unwrap();
          verify.then((res: KeyValue) => {
            if (res.isSuccess) {
              setIsVerified(true);
              if (res.data.profilePicture) {
                const getUserProfileImage = dispatch(
                  getUserProfilePicture({
                    id: res.data.profilePicture.id,
                  }),
                ).unwrap();
                getUserProfileImage.then();
              }
            }
          });
        } else if (!token) {
          router.push('/login');
        }
      }
    }, []);
  }

  useEffect(() => {
    if (router.pathname.split('/').indexOf('login') > -1) {
      setIsVerified(true);
    }
    checkShowHeader();
  }, [router.pathname]);

  const checkShowHeader = () => {
    setIsShowHeader(router.pathname.split('/').indexOf('login') === -1);
  };

  const header = () => {
    if (isVerified && router.pathname.split('/').indexOf('login') === -1) {
      return <Header />;
    }
    return '';
  };

  return (
    <>
      <main className={'bg-gray-100'}>
        {header()}
        <div className={'flex'}>
          <div
            className={
              (isShowHeader ? 'mt-[4.5rem]' : '') +
              ' lg:w-[1440px] relative min-h-[calc(100vh-74px)] m-auto'
            }
          >
            {isVerified && children}
          </div>
        </div>

        {userInfo.id && <ChatDialog />}
      </main>
    </>
  );
}
