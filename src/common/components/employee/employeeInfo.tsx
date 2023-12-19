import { Dropdown } from 'primereact/dropdown';
import React, { ChangeEvent } from 'react';
import { KeyValue } from '../../config/interfaces';
import { employeeRoleList } from '../../config/constant';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { processSelectedImage, setInputByValue } from '../../functions';
import { Message } from 'primereact/message';

interface Props {
  inputs: KeyValue;
  errors: KeyValue;
  setInputs: any;
  stationList: Array<KeyValue>;
}

const EmployeeInfo = ({ inputs, setInputs, stationList, errors }: Props) => {
  function onVerifiedChange(e: CheckboxChangeEvent, key: string) {
    setInputByValue(key, e.checked, setInputs);
  }

  function onSelectedImage(e: ChangeEvent<HTMLInputElement>, key: string) {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      processSelectedImage(e, (res: string) => {
        const image = Object.assign({}, inputs[key]);
        image.render = res;
        image.file = file;
        setInputByValue(key, image, setInputs);
      });
    }
  }

  const stationListReduced = () => {
    return stationList.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
  };

  return (
    <>
      <div className={'flex-row flex gap-8 mt-8'}>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <Dropdown
              value={inputs.role}
              onChange={(e) => setInputByValue('role', e.value, setInputs)}
              options={employeeRoleList}
              filter
              optionLabel="name"
              placeholder="Select employee role"
              className={'w-full p-inputtext-sm'}
              name="role"
              id="role"
            />
            <label htmlFor="role">Employee role</label>
          </span>
        </div>
        <div className={'basis-1/3'}>
          <span className="p-float-label">
            <Dropdown
              value={inputs.station}
              onChange={(e) => setInputByValue('station', e.value, setInputs)}
              filter
              options={stationListReduced()}
              optionLabel="name"
              placeholder="Select station"
              className={'w-full p-inputtext-sm'}
              name="station"
              id="station"
            />
            <label htmlFor="type">Station</label>
          </span>
          <p className={'text-xs mt-1 text-red-300'}>{errors.station}</p>
        </div>
        <div className={'basis-1/3 flex items-center justify-start'}>
          <Checkbox
            name="isVerified"
            id="isVerified"
            value="1"
            onChange={(e) => onVerifiedChange(e, 'isVerified')}
            checked={inputs.isVerified}
          />
          <label className={'ml-2'} htmlFor="isVerified">
            Verified
          </label>
        </div>
      </div>
      <div className={'flex-row flex gap-8 mt-8'}>
        <div className={'basis-1/2'}>
          <div className="flex flex-col justify-center items-center">
            <Message
              text="IDENTITY CARD FRONT"
              pt={{
                text: { className: '!text-sm' },
              }}
            />
            <input
              id="file-upload"
              accept="image/*"
              className={
                'custom-file-input-2 custom-file-input lg:w-[118px] mt-4 mb-4'
              }
              type="file"
              onChange={(e) => onSelectedImage(e, 'identityCardImage1')}
            />
            <p className={'text-xs mt-1 text-red-300'}>{errors.image1}</p>
            <img src={inputs.identityCardImage1.render} width="70%" />
          </div>
        </div>
        <div className={'basis-1/2'}>
          <div className="flex flex-col justify-center items-center">
            <Message
              text="IDENTITY CARD BACK"
              pt={{
                text: { className: '!text-sm' },
              }}
            />
            <input
              id="file-upload"
              accept="image/*"
              className={
                'custom-file-input-2 custom-file-input lg:w-[118px] mt-4 mb-4'
              }
              type="file"
              onChange={(e) => onSelectedImage(e, 'identityCardImage2')}
            />
            <p className={'text-xs mt-1 text-red-300'}>{errors.image2}</p>
            <img src={inputs.identityCardImage2.render} width="70%" />
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeInfo;
