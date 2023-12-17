import { KeyValue } from '../../config/interfaces';

interface Props {
  message: KeyValue;
}

const ChatRow = ({ message }: Props) => {
  const messageContainer = () => {
    let classNameDiv = 'px-2 flex items-center justify-end min-h-[3rem]';
    let classNameSpan =
      'bg-blue-400 max-w-[70%] min-h py-2 text-white px-4 rounded-md';
    if (!message.fromSelf) {
      classNameDiv = 'px-2 flex items-center justify-start min-h-[3rem]';
      classNameSpan =
        'bg-green-400 max-w-[70%] min-h py-2 text-white px-4 rounded-md';
    }
    return (
      <div className={classNameDiv}>
        <span className={classNameSpan}>{message.message}</span>
      </div>
    );
  };

  return <>{messageContainer()}</>;
};

export default ChatRow;
