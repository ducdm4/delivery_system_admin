import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useRouter } from 'next/router';
import { Avatar } from 'primereact/avatar';
import { useAppSelector } from '../../hooks';
import { logout, userLoggedIn } from '../../../features/auth/authSlice';
import { profileImageState } from '../../../features/photo/photoSlice';
import { Badge } from 'primereact/badge';
import { useDispatch } from 'react-redux';
import { ROLE_LIST } from '../../config/constant';

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useAppSelector(userLoggedIn);
  const userProfileImage = useAppSelector(profileImageState);

  const items = [
    {
      label: 'Master Data',
      icon: 'pi pi-fw pi-file',
      items: [
        {
          label: 'City',
          command: () => {
            router.push('/city');
          },
        },
        {
          label: 'District',
          command: () => {
            router.push('/district');
          },
        },
        {
          label: 'Ward',
          command: () => {
            router.push('/ward');
          },
        },
        {
          label: 'Street',
          command: () => {
            router.push('/street');
          },
        },
        {
          separator: true,
        },
        {
          label: 'Route config',
          command: () => {
            router.push('/route');
          },
        },
        {
          label: 'Master config',
        },
      ],
    },
    {
      label: 'Business',
      icon: 'pi pi-fw pi-truck',
      items: [
        {
          label: 'Order',
          icon: 'pi pi-fw pi-file',
        },
        {
          label: 'Customer',
          icon: 'pi pi-fw pi-users',
        },
        {
          label: 'Employee',
          icon: 'pi pi-fw pi-user',
          command: () => {
            router.push('/employee');
          },
        },
        {
          label: 'Station',
          icon: 'pi pi-fw pi-building',
          command: () => {
            router.push('/station');
          },
        },
      ],
    },
    {
      label: `${userInfo.firstName} ${userInfo.lastName}`,
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Profile',
          command: () => {
            router.push('/profile');
          },
        },
        {
          label: 'Logout',
          command: () => {
            doLogout();
          },
        },
      ],
    },
  ];

  const itemsOperator = [
    {
      label: 'Master Data',
      icon: 'pi pi-fw pi-file',
      items: [
        {
          label: 'Route config',
          command: () => {
            router.push('/route');
          },
        },
      ],
    },
    {
      label: 'Business',
      icon: 'pi pi-fw pi-truck',
      items: [
        {
          label: 'Order',
          icon: 'pi pi-fw pi-file',
        },
        {
          label: 'Customer',
          icon: 'pi pi-fw pi-users',
        },
        {
          label: 'Employee',
          icon: 'pi pi-fw pi-user',
          command: () => {
            router.push('/employee');
          },
        },
      ],
    },
    {
      label: `${userInfo.firstName} ${userInfo.lastName}`,
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Profile',
          command: () => {
            router.push('/profile');
          },
        },
        {
          label: 'Logout',
          command: () => {
            doLogout();
          },
        },
      ],
    },
  ];

  function doLogout() {
    dispatch(logout());
    router.push('/login');
  }

  const start = (
    <p
      className={'font-bold text-xl text-gray-700 pr-5 cursor-pointer'}
      onClick={() => router.push('/')}
    >
      Delivery System
    </p>
  );

  const end = (
    <div className={'flex items-center '}>
      <Avatar className={'lg:!w-[3.5rem] lg:!h-[3.5rem]'} shape="circle">
        {userProfileImage && (
          <img className={'object-cover'} src={userProfileImage} />
        )}
        {!userProfileImage && <i className="fa-solid fa-user text-xl"></i>}
      </Avatar>
    </div>
  );

  return (
    <Menubar
      className={`${
        userInfo.role === ROLE_LIST.ADMIN ? '!bg-[#FDE612FF]' : '!bg-[#4fda00]'
      } fixed lg:w-full left-0 !px-[calc((100vw-1400px)/2)] z-10 justify-between !rounded-none !border-none`}
      model={userInfo.role === ROLE_LIST.ADMIN ? items : itemsOperator}
      start={start}
      end={end}
    />
  );
}
