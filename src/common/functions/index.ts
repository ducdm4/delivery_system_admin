import { KeyValue } from '../config/interfaces';
import { ChangeEvent } from 'react';
import { imageType } from '../config/constant';

export const ValidateEmail = (email: string) => {
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export const handleChangeAddressProp = (
  val: { id: number; name: string },
  key: string,
  inputs: KeyValue,
  setInputs: Function,
) => {
  let addressNew = inputs.address;
  const addressToAdd: KeyValue = {};
  const levelKey = ['street', 'ward', 'district', 'city'];
  const levelValue = [0, 1, 2, 4];
  let total = 0;
  let count = 0;
  while (total < levelValue[levelKey.findIndex((x) => x === key)]) {
    addressToAdd[levelKey[count]] = {};
    total += levelValue[count];
    count++;
  }
  addressToAdd[key] = val;
  addressNew = {
    ...inputs.address,
    ...addressToAdd,
  };
  setInputByValue('address', addressNew, setInputs);
};

export function handleChange(
  e: ChangeEvent<HTMLInputElement>,
  inputs: KeyValue,
  setInputs: Function,
) {
  const name = e.target.name;
  const value = e.target.value;
  if (['building', 'detail'].includes(name)) {
    const oldAddress = inputs.address;
    const newAddress = {
      ...oldAddress,
      [name]: value,
    };
    setInputByValue('address', newAddress, setInputs);
  } else {
    setInputByValue(name, value, setInputs);
  }
}

export function setInputByValue(key: string, val: any, setInputs: Function) {
  setInputs((values: KeyValue) => {
    return { ...values, [key]: val };
  });
}

export function validateImageFile(image: File) {
  let check = true;
  let error = '';
  if (image.size > 1024000) {
    error = 'Image must smaller than 1mb';
    check = false;
  } else if (imageType.findIndex((x) => x === image.type) < 0) {
    error = 'Please select an image';
    check = false;
  } else {
    error = '';
  }
  return { error, check };
}

export function prepareAddress(address: KeyValue, key: string, key2 = '') {
  if (!address[key]) {
    const keyStringAnyObj: KeyValue = {};
    return keyStringAnyObj;
  } else {
    const res: KeyValue = {
      id: address[key].id,
      name: address[key].name,
    };
    if (key2) res[`${key2}Id`] = address[key2].id;
    return res;
  }
}

export function validateAddress(address: KeyValue) {
  const error: KeyValue = {};
  if (!address.city.id) {
    error.city = 'Please input city';
  }
  if (!address.district.id) {
    error.district = 'Please input district';
  }
  if (!address.ward.id) {
    error.ward = 'Please input ward';
  }
  if (!address.street.id) {
    error.street = 'Please input street';
  }
  if (!address.detail) {
    error.detail = 'Please input address detail';
  }
  return error;
}

export function processSelectedImage(
  e: ChangeEvent<HTMLInputElement>,
  callback: Function,
) {
  if (e.target.files && e.target.files.length) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      callback(reader.result as string);
    };
  }
}

export function validateRequired(input: string | object, key: string) {
  if (
    (typeof input === 'string' && input === '') ||
    (typeof input === 'object' && !Object.keys(input).length)
  ) {
    return `Please input ${key}`;
  }
  return '';
}

export function validateArrayRequired(
  inputArray: Array<KeyValue>,
  key: string,
) {
  if (inputArray.length === 0) {
    return `Please input ${key}`;
  }
  return '';
}

export function validateEmailText(input: string) {
  let message = validateRequired(input, 'email');
  if (!message) {
    if (!ValidateEmail(input)) {
      message = 'Wrong email format';
    }
  }
  return message;
}
