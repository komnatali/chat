import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import UserInfo from '../userInfo/userInfo';
import MessageInput from '../messageInput/messageInput';
import Messages from '../messages/messages';
import OnlineUsers from '../onlineUsers/onlineUsers';
import Video from '../video/video';

import './chat.css';

// let socket;

class Chat extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      messages: [],
      users: null,
      socket: null,
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  componentDidMount() {
    const {login, room} = this.props;
    // const endpoint = 'https://forasoft-chat.herokuapp.com/';
    const endpoint = 'localhost:5000';
    const name = login;

    const socket = io(endpoint);
    this.setState({socket});
    socket.emit('join chat', { name, room }, () => {} );


    socket.on('message', (msg) => {
      const {messages} = this.state;
      this.setState({messages: [...messages, msg]});
    });

    socket.on('usersFromRoom', ( users ) => {
      
      this.setState({users});
    })
  }

  componentWillUnmount() {
    const {socket} = this.state;
    socket.emit('disconnect');
    socket.off();
  }


  disconnect = () => {
    const {socket} = this.state;
    socket.disconnect();
    socket.off();
  }

  sendMessage = (message) => {
    const {socket} = this.state;
    socket.emit('send message', message); 
  }

  render() {
    const {socket, users, messages} = this.state;
    return (
      <div className="chat">
        <UserInfo disconnect={this.disconnect} />
        <div className="messages-onlineusers">
          <Messages messages={messages} />
          <OnlineUsers users={users}/>
        </div>
        {socket && <Video socket={socket} users={users} /> }
        <MessageInput sendMessage={this.sendMessage} />
      </div>
    );
  }
}
 
// export default Chat;
export default connect(state => ({
  login: state.login,
  room: state.room,
 }), null)(Chat);