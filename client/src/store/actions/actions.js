import * as actionTypes from './actionTypes';

export const changeLogin = (login) => ({
  type: actionTypes.ADD_LOGIN,
  login,
});

export const changeRoom = (room) => ({
  type: actionTypes.ADD_ROOM,
  room,
});