import React, { ChangeEvent, useState } from 'react';

interface keyStringValue {
  [key: string]: any;
}

interface Props {
  inputs: keyStringValue;
  inputsError: keyStringValue;
  setInputByValue: any;
}

const ProfileImageInfo = ({ inputs, inputsError, setInputByValue }: Props) => {
  const [imageSelected, setImageSelected] = useState('');

  const imageContent = () => {
    const imgTag = (
      <img
        src={imageSelected}
        className={'w-full h-full object-cover'}
        alt={'Profile'}
        id="img-profile"
      />
    );
    const iTag = (
      <i
        className="pi pi-user p-5"
        style={{
          fontSize: '7rem',
          borderRadius: '50%',
          backgroundColor: 'var(--surface-b)',
          color: 'var(--surface-d)',
        }}
      ></i>
    );
    return imageSelected || (inputs.profilePicture && inputs.profilePicture.id)
      ? imgTag
      : iTag;
  };

  function onSelectedImage(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        setImageSelected(reader.result as string);
      };
    }
  }

  function removeProfileImage() {
    setImageSelected('');
    setInputByValue('profilePicture', { id: null });
    const img = document.getElementById('img-profile');
    if (img) {
      img.setAttribute('src', '');
    }
  }

  return (
    <>
      <div className={'flex-col flex items-center'}>
        <div className={'relative'}>
          {(imageSelected ||
            (inputs.profilePicture && inputs.profilePicture.id)) && (
            <i
              onClick={removeProfileImage}
              className="fa-regular fa-trash-can text-xl text-gray-400 hover:cursor-pointer absolute bottom-0 right-0"
            ></i>
          )}
          <div
            className={
              'w-[10rem] h-[10rem] rounded-[50%] overflow-hidden relative'
            }
          >
            {imageContent()}
          </div>
        </div>
        <input
          id="file-upload"
          accept="image/*"
          className={'custom-file-input lg:w-[172px] mt-4'}
          type="file"
          onChange={onSelectedImage}
        />
        <p className={'text-red-500 text-sm'}>{inputsError.image}</p>
      </div>
    </>
  );
};

export default ProfileImageInfo;
