import React, { ChangeEvent, useEffect, useState } from 'react';
import { Message } from 'primereact/message';
import { KeyValue } from '../../config/interfaces';
import { Button } from 'primereact/button';

interface Props {
  inputs: KeyValue;
  setInputs: any;
}

function StationImageList({ inputs, setInputs }: Props) {
  function onSelectedImage(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        const fileToAdd = {
          file,
          render: reader.result as string,
        };
        setInputs((old: KeyValue) => {
          const images: Array<KeyValue> = [].concat(old.imageFileSelected);
          images.push(fileToAdd);
          return {
            ...old,
            imageFileSelected: images,
          };
        });
      };
    }
  }

  function removeImage(index: number) {
    setInputs((old: KeyValue) => {
      const images: Array<KeyValue> = [].concat(old.imageFileSelected);
      images.splice(index, 1);
      return {
        ...old,
        imageFileSelected: images,
      };
    });
  }

  return (
    <>
      <div className="mt-8 card flex justify-center flex-col">
        <div className="flex items-center justify-center">
          <div
            className={'w-full flex gap-10 items-center justify-center mb-6'}
          >
            {inputs.imageFileSelected.map(
              (image: { render: string }, index: number) => (
                <div
                  key={`image-${index}`}
                  className={'w-[10vw] h-[10vw] bg-gray-200 rounded relative'}
                >
                  <Button
                    rounded
                    severity={'danger'}
                    icon="pi pi-times"
                    className={
                      '!absolute top-[-1rem] right-[-1rem] !w-[2rem] !h-[2rem]'
                    }
                    onClick={() => removeImage(index)}
                  />
                  <img
                    src={image.render}
                    className={'w-full h-full object-contain'}
                  />
                </div>
              ),
            )}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <input
            id="file-upload"
            accept="image/*"
            className={
              'custom-file-input-2 custom-file-input lg:w-[118px] mt-4 mb-4'
            }
            type="file"
            onChange={onSelectedImage}
          />
        </div>
        <div className="flex items-center justify-center">
          <Message
            severity="info"
            text="Please select maximum 5 images, image size must less than 2mb"
            pt={{
              text: { className: '!text-sm' },
            }}
          />
        </div>
      </div>
    </>
  );
}

export default StationImageList;
