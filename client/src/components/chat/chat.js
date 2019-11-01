import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import UserInfo from '../userInfo/userInfo';
import MessageInput from '../messageInput/messageInput';
import Messages from '../messages/messages';
import OnlineUsers from '../onlineUsers/onlineUsers';

import './chat.css';

let socket;

const Chat = ({location, login, room}) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState('');
  const endpoint = 'localhost:5000';
  
  useEffect(() => {
    const name = login;

    socket = io(endpoint);
    socket.emit('join chat', { name, room }, () => {} );

    return () => {
      socket.emit('disconnect');

      socket.off();
    }

  }, [endpoint, location.search])

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages([...messages, msg]);
    });
    socket.on('usersFromRoom', ( users ) => {
      setUsers(users);  
    })

    return () => {
      socket.emit('disconnect');

      socket.off();
    }
  }, [messages, users])

  const disconnect = () => {
    socket.disconnect();
    socket.off();
  }

  const sendMessage = (message) => {
    socket.emit('send message', message); 
  }

  return (
    <div className="chat">
      <UserInfo disconnect={disconnect} />
      <div className="messages-onlineusers">
        <Messages messages={messages} />
        <OnlineUsers users={users}/>
      </div>
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
}
 
// export default Chat;
export default connect(state => ({
  login: state.login,
  room: state.room,
 }), null)(Chat);