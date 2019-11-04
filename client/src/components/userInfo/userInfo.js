import React from 'react';
import { connect } from 'react-redux';
import store from '../../store/store';
import { changeLogin } from '../../store/actions/actions';
import './userInfo.css';

class UserInfo extends React.Component {
  constructor(props){
    super(props);
    
    this.logOut = this.logOut.bind(this);
  }
  
  logOut() {
    store.dispatch(changeLogin(''));
    this.props.disconnect();
  }
  
  render(){
    const { login } = this.props;
    return (
      <div className="user-container">
        <div className="welcome-phrase">Welcome!</div>
        <div className="user-info">
          <span className="username">{login}</span>
          <button className="button" onClick={this.logOut}>Log Out</button>
        </div>
      </div>
    );
  };
} 


export default connect(state => ({
  login: state.login,
 }), null)(UserInfo);