import { ChatItem, KeyValue } from '../../config/interfaces';

interface Props {
  chatList: ChatItem[];
  selectChat: any;
}

const ChatList = ({ chatList, selectChat }: Props) => {
  return (
    <>
      {chatList.length === 0 && (
        <div>
          <p className="text-xl font-semibold text-center">There is no chat</p>
        </div>
      )}
      {chatList.map((item: ChatItem, index) => (
        <div
          className="mt-2 bg-white rounded-md p-2 cursor-pointer"
          onClick={() => selectChat(index)}
          key={index}
        >
          <p className="font-semibold text-lg">
            <span className="text-gray-400 mr-2">From:</span> {item.from}
          </p>
          <p className="text-sm">
            <span className="text-gray-400 mr-2 font-semibold">
              Last message:
            </span>
            {item.messageList[item.messageList.length - 1]?.message ||
              'No message yet'}
          </p>
        </div>
      ))}
    </>
  );
};

export default ChatList;
