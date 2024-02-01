import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../store/ChatProvider';

const ChatMessages = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((item) => (
          <div
            className={`d-flex mb-1 ${item.sender._id === user._id ? 'justify-content-end' : 'text-left'}`}
            key={item._id}
          >
            <p
            className={`mb-2 ${item.sender._id === user._id ? 'text-right' : 'text-left'}`}

              style={{
                backgroundColor: `${
                  item.sender._id === user._id ? '#B4D4FF' : '#96E9C6'
                }`,
                padding: '10px',
                maxWidth: '70%',
                borderRadius: '10px',
                display: 'inline-block',
              }}
            >
              {item.content}
            </p>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ChatMessages;
