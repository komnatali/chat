import React from 'react';
import { useState } from 'react';
import store from '../../store/store';
import { changeRoom } from '../../store/actions/actions';
import { Link } from 'react-router-dom';
import './roomPage.css';

class RoomPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomValue: '',
    }

    this.onChangeRoom = this.onChangeRoom.bind(this);
    this.verifyRoomName = this.verifyRoomName.bind(this);
  }

  onChangeRoom(e) {
    this.setState({
      roomValue: e.target.value,
    })
  }

  verifyRoomName(e) {
    const room = this.state.roomValue;
    store.dispatch(changeRoom(room));
  }

  render() {
    return (
      <div className="login-page">
        <span className="form-text">Create new room:</span>
        <input
          className="input login-input"
          placeholder="Room title"
          value={this.state.roomValue}
          onChange={this.onChangeRoom}
        />
        <Link to={`/chat?room=${this.state.roomValue}`}>
          <button className="button button-submit" type="submit" onClick={this.verifyRoomName}>
            ROOM
          </button>
        </Link>
      </div>
    );
  }
}
 
export default RoomPage;