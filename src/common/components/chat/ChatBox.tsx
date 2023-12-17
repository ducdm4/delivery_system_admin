import { Button } from 'primereact/button';
import { socket } from '../../config/socket';
import { useState } from 'react';
import { ChatItem, KeyValue } from '../../config/interfaces';
import ChatRow from './ChatRow';

interface Props {
  currentChatInfo: ChatItem;
  currentChatList: KeyValue[];
  currentUserName: string;
  updateMessageList: any;
  index: number;
}

const ChatBox = ({
  currentChatList,
  currentChatInfo,
  currentUserName,
  updateMessageList,
}: Props) => {
  const [currentMessage, setCurrentMessage] = useState('');

  function sendMessage() {
    socket.emit(
      'sendNewMessage',
      {
        message: currentMessage,
        from: currentUserName,
        roomName: currentChatInfo.roomName,
      },
      (res: boolean) => {
        if (res) {
          setCurrentMessage('');
          updateMessageList({
            fromSelf: true,
            message: currentMessage,
          });
        }
      },
    );
  }

  return (
    <>
      <div className="w-[calc(100%)] bg-white rounded-md h-[calc(100%-5rem)]">
        <>
          <div className="flex flex-col justify-end w-full h-full">
            {currentChatList.map((message: KeyValue, index) => (
              <ChatRow key={index} message={message} />
            ))}
          </div>
        </>
      </div>
      <div
        id="input-chat"
        className="absolute bottom-2 left-2 w-[calc(100%-1rem)] flex justify-between items-center"
      >
        <input
          value={currentMessage}
          className="h-10 p-2 rounded-md w-[calc(100%-7rem)]"
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <Button
          onClick={() => sendMessage()}
          label="Send"
          size="small"
          severity="success"
          icon="pi pi-send"
        />
      </div>
    </>
  );
};

export default ChatBox;
