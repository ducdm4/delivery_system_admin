import React, { ChangeEvent } from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import ProfileAddressInfo from '../../../common/components/profile/addressInfo';
import ProfileBasicInfo from '../../../common/components/profile/basicInfo';
import ProfileImageInfo from '../../../common/components/profile/imageInfo';
import { KeyValue } from '../../config/interfaces';
import {
  handleChange,
  handleChangeAddressProp,
  setInputByValue,
} from '../../functions';

interface Props {
  inputs: KeyValue;
  inputsError: object;
  setInputs: Function;
  isShowProfilePicture: boolean;
}

const UserInfo = ({
  inputs,
  inputsError,
  setInputs,
  isShowProfilePicture,
}: Props) => {
  const keyStringAnyObj: KeyValue = {};

  const handleSelectChanged = (
    val: { id: number; name: string },
    key: string,
  ) => {
    handleChangeAddressProp(val, key, inputs, setInputs);
  };

  function handleInputChanged(e: ChangeEvent<HTMLInputElement>) {
    handleChange(e, inputs, setInputs);
  }

  function setInput(key: string, val: any) {
    setInputByValue(key, val, setInputs);
  }

  return (
    <div>
      {isShowProfilePicture && (
        <ProfileImageInfo
          inputs={inputs}
          inputsError={inputsError}
          setInputByValue={setInput}
        />
      )}
      <Divider align="center" className={'!mt-10'}>
        <span className="text-xl font-bold text-green-700">BASIC INFO</span>
      </Divider>
      <ProfileBasicInfo
        inputs={inputs}
        handleChange={handleInputChanged}
        setInputByValue={setInput}
        inputsError={inputsError}
      />
      <Divider align="center" className={'!mt-10'}>
        <span className="text-xl font-bold text-green-700">ADDRESS INFO</span>
      </Divider>
      <ProfileAddressInfo
        inputs={inputs}
        handleChangeAddressProp={handleSelectChanged}
        handleChange={handleInputChanged}
      />
    </div>
  );
};

export default UserInfo;
