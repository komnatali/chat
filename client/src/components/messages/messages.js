import React from 'react';
import Message from '../message/message';

import './messages.css';

import ScrollToBottom from 'react-scroll-to-bottom';

const Messages = ({ messages }) => {
  const messagesList = messages.map((message, index) => (
    <Message key={index.toString()} message={message}/>));

  return (
    <ScrollToBottom className="messages">
      {messagesList}
    </ScrollToBottom>
  );
}

export default Messages;