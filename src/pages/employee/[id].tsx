import { NextPage } from 'next';
import UserInfo from '../../common/components/profile/userInfo';
import EmployeeInfo from '../../common/components/employee/employeeInfo';
import { TabMenu } from 'primereact/tabmenu';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import { KeyValue } from '../../common/config/interfaces';
import Head from 'next/head';
import { Card } from 'primereact/card';
import { getStationListFilter } from '../../features/station/stationSlice';
import {
  prepareAddress,
  validateEmailText,
  validateImageFile,
  validateRequired,
} from '../../common/functions';
import { useRouter } from 'next/router';
import BasicEditHeader from '../../common/components/default/masterData/basicEditHeader';
import { createNewPhoto, getPhotoInfo } from '../../features/photo/photoSlice';
import {
  createNewEmployee,
  employeeLoading,
  getEmployeeInfo,
  updateEmployeeInfo,
} from '../../features/employee/employeeSlice';
import { toast } from 'react-toastify';
import { employeeRoleList } from '../../common/config/constant';
import { format } from 'date-fns';

const DetailEmployee: NextPage = () => {
  const keyStringAnyObj: KeyValue = {};
  const items = [
    { label: 'Personal Info', icon: 'pi pi-fw pi-home' },
    { label: 'Work Info', icon: 'pi pi-fw pi-id-card' },
  ];
  const [isEdit, setIsEdit] = useState(false);

  const arrayKeyValue: Array<KeyValue> = [];
  const [stationList, setStationList] = useState(arrayKeyValue);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputInitialState: KeyValue = {
    id: null,
    isVerified: false,
    isActive: false,
    identityCardImage1: {
      id: null,
      render: '',
      file: null,
    },
    identityCardImage2: {
      id: null,
      render: '',
      file: null,
    },
    station: {},
    role: {
      id: 2,
      name: 'Station Operator',
    },
    email: '',
    firstName: '',
    lastName: '',
    dob: null,
    gender: true,
    phone: '',
    profilePicture: {
      id: null,
    },
    address: {
      building: '',
      detail: '',
      street: keyStringAnyObj,
      ward: keyStringAnyObj,
      district: keyStringAnyObj,
      city: keyStringAnyObj,
    },
  };
  const [inputs, setInputs] = useState(inputInitialState);
  const initError: KeyValue = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    station: '',
    image1: '',
    image2: '',
  };
  const [inputErrors, setInputErrors] = useState(initError);
  const dispatch = useAppDispatch();
  const employeeLoadingStatus = useAppSelector(employeeLoading);
  const router = useRouter();

  useEffect(() => {
    const prepareData = () => {
      const promiseList = [];
      const getListStation = dispatch(
        getStationListFilter({ query: '' }),
      ).unwrap();
      promiseList.push(getListStation);
      if (router.query.id !== 'add') {
        const id = parseInt(router.query.id as string);
        if (!isNaN(id)) {
          const getEmployee = dispatch(getEmployeeInfo({ id })).unwrap();
          promiseList.push(getEmployee);
        }
      }
      Promise.all(promiseList).then((results) => {
        results.forEach((res, index) => {
          if (index === 0) {
            if (res.isSuccess) {
              setStationList(res.data.list);
            }
          } else {
            const address = res.data.employeeInfo.user.address;
            address.city = prepareAddress(address, 'city');
            address.district = prepareAddress(address, 'district', 'city');
            address.ward = prepareAddress(address, 'ward', 'district');
            address.street = prepareAddress(address, 'street', 'ward');
            const user = res.data.employeeInfo.user;
            user.dob = new Date(user.dob);
            const userId = user.id;
            delete res.data.employeeInfo.user;
            delete user.id;
            const data = {
              ...res.data.employeeInfo,
              ...user,
              address,
              uid: userId,
              station: {
                id: res.data.employeeInfo.station.id,
                name: res.data.employeeInfo.station.name,
              },
              role: employeeRoleList.find((x) => x.id === user.role),
            };
            const promisePhoto: Array<Promise<KeyValue>> = [];
            let total = 0;
            [1, 2].forEach((item) => {
              const photo = res.data.employeeInfo[`identityCardImage${item}`];
              data[`identityCardImage${item}`] = {
                id: null,
                file: null,
                render: '',
              };
              if (photo) {
                const getPhoto = dispatch(
                  getPhotoInfo({ id: photo.id }),
                ).unwrap();
                promisePhoto.push(getPhoto);
                total += item;
              }
            });
            if (promisePhoto.length) {
              Promise.all(promisePhoto).then((results) => {
                results.forEach((res, index) => {
                  let decideIndex = 1;
                  if (total === 2) {
                    decideIndex = 2;
                  } else if (total === 3) {
                    decideIndex = index + 1;
                  }
                  if (res.isSuccess) {
                    data[`identityCardImage${decideIndex}`] = {
                      id: data[`identityCardImage${decideIndex}`].id,
                      file: null,
                      render: URL.createObjectURL(res.data),
                    };
                  }
                });
                setInputs(data);
              });
            } else {
              setInputs(data);
            }
          }
        });
      });
    };
    if (router.query.id !== undefined) {
      prepareData();
    }
  }, [router.query.id]);

  async function handleSubmit() {
    if (validate()) {
      await handleUploadImage();
      const dataToSend: KeyValue = {
        user: {
          address: inputs.address,
          email: inputs.email,
          firstName: inputs.firstName,
          lastName: inputs.lastName,
          phone: inputs.phone,
          dob: inputs.dob ? format(new Date(inputs.dob), 'yyyy-MM-dd') : null,
          gender: inputs.gender,
        },
        station: {
          id: inputs.station.id,
        },
        role: inputs.role.id,
        isVerified: inputs.isVerified,
      };
      if (inputs.identityCardImage1.id)
        dataToSend.identityCardImage1 = {
          id: inputs.identityCardImage1.id,
        };
      if (inputs.identityCardImage2.id)
        dataToSend.identityCardImage2 = {
          id: inputs.identityCardImage2.id,
        };

      if (inputs.id) dataToSend.id = inputs.id;
      if (inputs.uid) dataToSend.user.id = inputs.uid;

      const submitData = dispatch(
        router.query.id === 'add'
          ? createNewEmployee(dataToSend)
          : updateEmployeeInfo(dataToSend),
      ).unwrap();
      submitData.then(async (data) => {
        if (data.isSuccess) {
          toast(`Employee ${isEdit ? 'edited' : 'added'} successfully`, {
            hideProgressBar: true,
            autoClose: 2000,
            type: 'success',
          });
          await router.push('/employee');
        }
      });
    }
    return true;
  }

  async function handleUploadImage() {
    const inputData = Object.assign({}, inputs);
    for (const item of [1, 2]) {
      if (inputs[`identityCardImage${item}`].file) {
        const formData = new FormData();
        formData.append(
          'image',
          inputs[`identityCardImage${item}`].file as Blob,
        );
        const imageUpload = await dispatch(createNewPhoto(formData)).unwrap();
        if (imageUpload.isSuccess) {
          inputData[`identityCardImage${item}`].id =
            imageUpload.data.photoInfo.id;
        }
      }
    }
    setInputs(inputData);
  }

  function validateIdentityCardImage() {
    let check = true;
    const errorImage: KeyValue = {
      image1: '',
      image2: '',
    };
    [1, 2].forEach((item) => {
      if (inputs[`identityCardImage${item}`].file) {
        const validImage = validateImageFile(
          inputs[`identityCardImage${item}`].file,
        );
        if (!validImage.check) {
          errorImage[`image${item}`] = validImage.error;
          check = false;
        }
      }
    });
    return { errorImage, check };
  }

  function validate() {
    let check = true;
    let errors = Object.assign({}, inputErrors);

    errors.email = validateEmailText(inputs.email);
    if (errors.email) check = !errors.email;

    errors.firstName = validateRequired(inputs.firstName, 'first name');
    if (errors.firstName) check = !errors.firstName;

    errors.lastName = validateRequired(inputs.lastName, 'last name');
    if (errors.lastName) check = !errors.lastName;

    errors.phone = validateRequired(inputs.phone, 'phone');
    if (errors.phone) check = !errors.phone;

    errors.station = validateRequired(inputs.phone, 'station');
    if (errors.station) check = !errors.station;

    if (check) {
      const checkImage = validateIdentityCardImage();
      if (!checkImage.check) {
        errors = {
          ...errors,
          ...checkImage.errorImage,
        };
        check = false;
      }
    }
    setInputErrors(errors);
    return check;
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => {
      return { ...values, [name]: value };
    });
  }

  function resetInput() {
    setInputs(inputInitialState);
  }

  function header() {
    return (
      <>
        <BasicEditHeader
          isEdit={isEdit}
          titleAdd={{ big: `Add Employee`, small: `Add a new Employee` }}
          titleEdit={{ big: `Edit Employee`, small: `Edit a new Employee` }}
          handleSubmit={handleSubmit}
          resetInput={resetInput}
          url={'/employee'}
          loading={employeeLoadingStatus}
        />
        <TabMenu
          model={items}
          className="mx-auto"
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          pt={{
            menu: {
              className: 'justify-center',
            },
          }}
        />
      </>
    );
  }

  const pageToDisplay = () => {
    return !activeIndex ? (
      <UserInfo
        inputs={inputs}
        inputsError={inputErrors}
        isShowProfilePicture={false}
        setInputs={setInputs}
      />
    ) : (
      <EmployeeInfo
        inputs={inputs}
        handleChange={handleChange}
        setInputs={setInputs}
        stationList={stationList}
        errors={inputErrors}
      />
    );
  };

  return (
    <>
      <Head>
        <title>Employee Profile</title>
      </Head>
      <Card header={header} className="!border-none !rounded-none mx-auto my-5">
        {pageToDisplay()}
      </Card>
    </>
  );
};

export default DetailEmployee;
