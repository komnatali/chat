import React from 'react';
import { DateTime } from 'luxon';

import './message.css';

const Message = ({message}) => {
  const { text, time, user } = message;

  const date = time ? DateTime.fromISO(time).toLocaleString(DateTime.DATETIME_MED) : null;
  const messageClasses = user ? 'message' : 'message join-message';
  let messageInfo;
  if (user) messageInfo = (
    <div className="message-info">
      <div className="message-info-user">{user}</div>
      <div className="message-info-date">{date}</div>
    </div>
  ); else messageInfo = null;

  return (
    <div className={messageClasses}>
      {messageInfo}
      <div className="message-text">{text}</div>
    </div>
  );
} 

export default Message;