import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { KeyValue, ChatItem } from '../../config/interfaces';
import { socket } from '../../config/socket';
import { useAppSelector } from '../../hooks';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import { userLoggedIn } from '../../../features/auth/authSlice';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { toast } from 'react-toastify';

const ChatDialog = () => {
  const [isShowFullWindow, setIsShowFullWindow] = useState(false);
  const [isShowChatBox, setIsShowChatBox] = useState(false);
  // const [currentChatRoom, setCurrentChatRoom] = useState({} as KeyValue);
  const [chatList, setChatList] = useState([] as ChatItem[]);
  const [currentMessageList, setCurrentMessageList] = useState(
    [] as KeyValue[],
  );
  const [currentChatIndex, setCurrentChatIndex] = useState(-1);
  const [newRequestChat, setNewRequestChat] = useState({
    roomName: '',
    userName: '',
  } as KeyValue);
  const userLoggedInfo = useAppSelector(userLoggedIn);

  useEffect(() => {
    socket.emit('operatorReadyForChat', { instanceId: socket.id });
    socket.on('newUserRequest', (data: KeyValue) => {
      setNewRequestChat(data);
    });

    socket.on('newMessageReceived', (data: KeyValue) => {
      if (data.from !== currentUserName()) {
        updateMessageList({
          fromSelf: false,
          message: data.message,
        });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const currentUserName = () => {
    return `${userLoggedInfo.firstName} ${userLoggedInfo.lastName}`;
  };

  useEffect(() => {
    if (newRequestChat.roomName) {
      confirmDialog({
        message: `You have a new chat request from ${newRequestChat.userName}`,
        header: 'Incoming Chat Request',
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        accept: () => {
          socket.emit(
            'operatorJoinChatRequest',
            {
              instanceId: socket.id,
              roomName: newRequestChat.roomName,
              userName: currentUserName(),
            },
            (res: boolean) => {
              if (!res) {
                toast(`This chat has been taken by other Operator`, {
                  hideProgressBar: true,
                  autoClose: 2000,
                  type: 'error',
                });
              } else {
                onChatAccept();
              }
            },
          );
        },
        reject: () => {
          setNewRequestChat({
            roomName: '',
            userName: '',
          });
        },
      });
    }
  }, [newRequestChat]);

  function onChatAccept() {
    setChatList((current) => {
      const empty = [] as ChatItem[];
      const res = empty.concat(current);
      res.push({
        roomName: newRequestChat.roomName,
        from: newRequestChat.userName,
        messageList: [],
      });
      return res;
    });
    // setIsShowChatBox(true);
  }

  function selectChat(index: number) {
    setCurrentChatIndex(index);
    setCurrentMessageList(chatList[index].messageList);
    setIsShowChatBox(true);
  }

  function updateMessageList(message: KeyValue) {
    setCurrentMessageList((current) => {
      current.push(message);
      current = JSON.parse(JSON.stringify(current));
      return current;
    });
  }

  useEffect(() => {
    if (currentChatIndex > -1) {
      setChatList((current) => {
        const res = ([] as ChatItem[]).concat(current);
        res[currentChatIndex].messageList = ([] as KeyValue[]).concat(
          currentMessageList,
        );
        return res;
      });
    }
  }, [currentMessageList]);

  function backToList() {
    setIsShowChatBox(false);
    setCurrentChatIndex(-1);
  }

  return (
    <>
      <ConfirmDialog />
      <div className="fixed right-10 bottom-16 ">
        {!isShowFullWindow && (
          <div
            onClick={() => setIsShowFullWindow(true)}
            className="cursor-pointer flex items-center justify-center bg-blue-400 rounded-lg p-4 text-white"
          >
            <i className="pi pi-comment mr-2 !text-4xl"></i>
            <span>Current chat</span>
          </div>
        )}
        {isShowFullWindow && (
          <div className="lg:h-[70vh] lg:w-[400px] bg-gray-200 rounded-lg p-2 flex flex-col">
            <div className="flex justify-between">
              <div>
                {currentChatIndex > -1 && (
                  <div className="flex items-center">
                    <button
                      className="mr-2"
                      aria-label="Cancel"
                      onClick={() => backToList()}
                    >
                      <i className="pi pi-arrow-left text-white !text-xl"></i>
                    </button>
                    <span>{chatList[currentChatIndex].from}</span>
                  </div>
                )}
              </div>

              <button
                className=""
                aria-label="Cancel"
                onClick={() => setIsShowFullWindow(false)}
              >
                <i className="pi pi-times text-white !text-xl"></i>
              </button>
            </div>

            {isShowChatBox && (
              <ChatBox
                currentChatInfo={chatList[currentChatIndex]}
                currentChatList={currentMessageList}
                index={currentChatIndex}
                currentUserName={currentUserName()}
                updateMessageList={updateMessageList}
              />
            )}
            {!isShowChatBox && (
              <ChatList chatList={chatList} selectChat={selectChat} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatDialog;
