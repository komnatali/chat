import * as actionTypes from '../actions/actionTypes';

const room = (room = "", action) => {
  switch (action.type) {
    case actionTypes.ADD_ROOM:
      return action.room;

    default:
      return room;
  }
}

export { room };