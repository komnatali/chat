import React from 'react';
import { connect } from 'react-redux';
import store from '../store/store';
import { changeRoom } from '../store/actions/actions';
import queryString from 'query-string';
import Chat from './chat/chat';
import LoginPage from './login/loginPage';

const MainChat = ({location, login, room}) => {
  
  if (login) return <Chat location={location} />;
  if (room === "") {
    room = queryString.parse(location.search).room;
    store.dispatch(changeRoom(room));
  }
  return <LoginPage />;
}

export default connect(state => ({
  login: state.login,
  room: state.room,
 }), null)(MainChat);