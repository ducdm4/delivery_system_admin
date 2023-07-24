import React, { useRef, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { useRouter } from 'next/router';
import { Avatar } from 'primereact/avatar';
import { useAppSelector } from '../../hooks';
import { logout, userLoggedIn } from '../../../features/auth/authSlice';
import { profileImageState } from '../../../features/photo/photoSlice';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useDispatch } from 'react-redux';

export default function HeaderForUser() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useAppSelector(userLoggedIn);
  const userProfileImage = useAppSelector(profileImageState);

  const items = [
    {
      label: 'About us',
    },
    {
      label: 'Contact',
    },
    {
      label: 'Hiring',
    },
  ];

  function doLogout() {
    dispatch(logout());
    router.push('/');
  }

  const start = (
    <p className={'font-bold text-xl text-white pr-5'}>Delivery System</p>
  );

  const end = (
    <div className={'flex items-center '}>
      <i
        className="pi pi-bell p-overlay-badge mr-6"
        style={{ fontSize: '1.5rem' }}
      >
        <Badge value="2"></Badge>
      </i>
      <Avatar className={'lg:!w-[3.5rem] lg:!h-[3.5rem]'} shape="circle">
        <img className={'object-cover'} src={userProfileImage} />
      </Avatar>
    </div>
  );

  const endLogin = <p className={'text-white'}>Login</p>;

  return (
    <Menubar
      className={
        'user-header min-h-[5rem] !bg-[#4db542] fixed lg:w-full left-0 !px-[calc((100vw-1400px)/2)] z-10 justify-between !rounded-none !border-none'
      }
      model={items}
      start={start}
      end={endLogin}
      pt={{
        label: {
          className: '!text-white',
        },
        menuitem: (el) => ({
          className: el?.context.active ? '!bg-[#4db542]' : undefined,
        }),
      }}
    />
  );
}
