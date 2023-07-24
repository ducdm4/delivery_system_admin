import { InputText } from 'primereact/inputtext';
import React, { ChangeEvent, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { updatePassword } from '../../../features/user/userSlice';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../hooks';

interface keyStringValue {
  [key: string]: any;
}

interface Props {
  showPopupPassword: boolean;
  setShowPopupPassword: Function;
}

const PasswordInfo = ({ showPopupPassword, setShowPopupPassword }: Props) => {
  const keyStringValueObj: keyStringValue = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  const [inputs, setInputs] = useState(keyStringValueObj);
  const [errors, setErrors] = useState(keyStringValueObj);
  const dispatch = useAppDispatch();

  function setInputByValue(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => {
      return { ...values, [name]: value };
    });
  }

  function handleSubmit() {
    if (validate()) {
      const res = dispatch(updatePassword(inputs)).unwrap();
      res.then((data) => {
        if (data.isSuccess) {
          toast(`Password changed successfully`, {
            hideProgressBar: true,
            autoClose: 2000,
            type: 'success',
          });
        }
      });
    }
  }

  function validate() {
    let check = true;
    const errorInfo = Object.assign({}, errors);
    const reg =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/;
    const keyArr: keyStringValue = [
      { key1: 'oldPassword', key2: 'current' },
      { key1: 'newPassword', key2: 'new' },
    ];
    keyArr.forEach((item: { key1: string; key2: string }) => {
      if (!inputs[item.key1].length) {
        errorInfo[item.key1] = `Please input ${item.key2} password`;
        check = false;
      } else if (!reg.test(inputs[item.key1])) {
        errorInfo[item.key1] = 'Password does not meets requirement';
        check = false;
      } else {
        errorInfo[item.key1] = '';
      }
    });

    if (inputs.confirmPassword !== inputs.newPassword) {
      errorInfo.confirmPassword = 'Confirm password does not match';
      check = false;
    } else {
      errorInfo.confirmPassword = '';
    }

    setErrors(errorInfo);
    return check;
  }

  return (
    <>
      <Dialog
        header="Change password"
        visible={showPopupPassword}
        style={{ width: '700px' }}
        onHide={() => setShowPopupPassword(false)}
      >
        <div className="card flex justify-content-center">
          <Message text="Password must have at least 6 characters and contain 1 uppercase, 1 lowercase, 1 digit" />
        </div>
        <div className={'flex-col flex mt-8'}>
          <span className="p-float-label w-full">
            <InputText
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={inputs.oldPassword}
              onChange={(e) => setInputByValue(e)}
              className={'w-full p-inputtext-sm'}
            />
            <label htmlFor="oldPassword">Current Password</label>
          </span>
          <p className={'text-sm text-red-500 mt-1 pl-1'}>
            {errors.oldPassword}
          </p>
        </div>
        <div className={'flex-col flex mt-8'}>
          <span className="p-float-label w-full">
            <InputText
              id="newPassword"
              name="newPassword"
              type="password"
              value={inputs.newPassword}
              onChange={(e) => setInputByValue(e)}
              className={'w-full p-inputtext-sm'}
            />
            <label htmlFor="newPassword">New Password</label>
          </span>
          <p className={'text-sm text-red-500 mt-1 pl-1'}>
            {errors.newPassword}
          </p>
        </div>
        <div className={'flex-col flex mt-8'}>
          <span className="p-float-label w-full">
            <InputText
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={inputs.confirmPassword}
              onChange={(e) => setInputByValue(e)}
              className={'w-full p-inputtext-sm'}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </span>
          <p className={'text-sm text-red-500 mt-1 pl-1'}>
            {errors.confirmPassword}
          </p>
        </div>
        <div className={'flex items-center mt-8 justify-center'}>
          <Button
            className="flex items-center gap-3"
            severity="info"
            size="small"
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default PasswordInfo;
