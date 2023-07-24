import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputMask } from 'primereact/inputmask';
import { SelectButton } from 'primereact/selectbutton';
import React from 'react';
import { useRouter } from 'next/router';
import { KeyValue } from '../../config/interfaces';

interface Props {
  inputs: KeyValue;
  inputsError?: KeyValue;
  handleChange: Function;
  setInputByValue: Function;
}

const ProfileBasicInfo = ({
  inputs,
  handleChange,
  setInputByValue,
  inputsError = {},
}: Props) => {
  const genderOption = [
    { name: 'Male', value: true },
    { name: 'Female', value: false },
  ];
  const router = useRouter();

  return (
    <>
      <div className={'flex-row flex gap-8 mt-8'}>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <InputText
              id="wardname"
              name="email"
              value={inputs.email}
              onChange={(e) => handleChange(e)}
              disabled={router.query.id !== 'add'}
              className={'w-full p-inputtext-sm'}
            />
            <label htmlFor="wardname">Email</label>
          </span>
          <p className={'text-xs mt-1 text-red-300'}>{inputsError.email}</p>
        </div>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <InputText
              id="firstname"
              name="firstName"
              value={inputs.firstName}
              onChange={(e) => handleChange(e)}
              className={'w-full p-inputtext-sm'}
            />
            <label htmlFor="firstname">First name</label>
          </span>
          <p className={'text-xs mt-1 text-red-300'}>{inputsError.firstName}</p>
        </div>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <InputText
              id="lastname"
              name="lastName"
              value={inputs.lastName}
              onChange={(e) => handleChange(e)}
              className={'w-full p-inputtext-sm'}
            />
            <label htmlFor="lastname">Last name</label>
          </span>
          <p className={'text-xs mt-1 text-red-300'}>{inputsError.lastName}</p>
        </div>
      </div>
      <div className={'flex-row flex gap-8 mt-8'}>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <Calendar
              inputId="birth_date"
              value={inputs.dob}
              dateFormat="dd/mm/yy"
              className={'w-full p-inputtext-sm'}
              onChange={(e) => setInputByValue('dob', e.value)}
            />
            <label htmlFor="birth_date">Birth Date</label>
          </span>
        </div>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <InputMask
              id="phone"
              name="phone"
              value={inputs.phone}
              mask="9999-999-999"
              placeholder="9999-999-999"
              onChange={(e) => setInputByValue('phone', e.value)}
              className={'w-full p-inputtext-sm'}
            />
            <label htmlFor="phone">Phone number</label>
          </span>
          <p className={'text-xs mt-1 text-red-300'}>{inputsError.phone}</p>
        </div>
        <div className={'basis-1/3'}>
          <div className={'basis-1/3'}>
            <SelectButton
              value={inputs.gender}
              onChange={(e) => setInputByValue('gender', e.value)}
              className={'w-full'}
              options={genderOption}
              optionLabel="name"
              pt={{
                button: { className: '!p-[0.55rem]' },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileBasicInfo;
