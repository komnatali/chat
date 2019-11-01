import * as actionTypes from '../actions/actionTypes';

const login = (login="", action) => {
  switch (action.type) {
    case actionTypes.ADD_LOGIN:
      return action.login;

    default:
      return login;
  }
}

export { login };