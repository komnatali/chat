import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import LoginPage from './components/login/loginPage';
import RoomPage from './components/roomPage/roomPage';
import MainChat from './components/mainChat';

import './style.css';

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={LoginPage} />
      <Route path="/chooseRoom" component={RoomPage} />
      <Route path="/chat" component={MainChat} />
    </Router>
  );
}

export default App;
// export default connect(state => ({
//   login: state.login,
//  }), null)(App);