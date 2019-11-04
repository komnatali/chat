import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../../store/store';
import { changeLogin } from '../../store/actions/actions';
import './login.css';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginValue: '',
    }

    this.onChangeLogin = this.onChangeLogin.bind(this);
    this.verifyName = this.verifyName.bind(this);
  }

  onChangeLogin(e) {
    this.setState({
      loginValue: e.target.value,
    })
  }

  verifyName(e) {
    const login = this.state.loginValue;
    if (login) store.dispatch(changeLogin(login));
  }

  render() {
    const { room } = this.props;
    const { loginValue } = this.state;
    
    /* render link to the "choose room" page if there is no room in the URL  */
    let submitBlock;
    if (!room) submitBlock = (
      <Link to={`/chooseRoom`}>
        <input
          disabled={loginValue ? false : true}
          className="button button-submit"
          type="submit"
          value="Next step"
          onClick={this.verifyName}
        />
      </Link>
    ); else submitBlock = (
      <input
        className="button"
        disabled={loginValue ? false : true}
        type="submit"
        value="Let's chat!"
        onClick={this.verifyName}/>
    );

    return (
      <div className="login-page">
        
        <span className="form-text">Please, choose nickname</span>

        <input 
          className="input login-input"
          type="text"
          value={this.state.loginValue}
          placeholder="Your name"
          onChange={this.onChangeLogin} />

        {submitBlock}
      </div>
    );
  }
}

export default connect(state => ({
  room: state.room,
 }), null)(LoginPage);