import React from 'react';
import { connect } from 'react-redux';
import './messageInput.css';

class InputForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        message: '',
      };

      this.onChangeMessage = this.onChangeMessage.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
    }

  onChangeMessage(event) {
    this.setState({
      message: event.target.value,
    })
  }

  onSubmit(event){ 
    event.preventDefault();
    const { message } = this.state;
    if(message) {
      this.props.sendMessage(message);
      this.setState({message: ''});
    }
  }

  render() {
    const { login } = this.props;
    const text = this.state.message;
    const placeholder = login ? 'Write your message' : 'Please, log in';

    return (
      <form className="form-message" onSubmit={this.onSubmit}>
        <input className="message-input"
          type="text"
          value={text}
          placeholder={placeholder}
          onChange={this.onChangeMessage} />
        <input type="submit" value="send" className="button"/>
      </form>
    );
  }
}

export default connect(state => ({
  login: state.login,
 }), null)(InputForm);