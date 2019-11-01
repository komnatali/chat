import { combineReducers } from 'redux';

import { login } from './login';
import { room } from './room';

const reducers = combineReducers({
    login,
    room,
});

export default reducers;