import React from 'react';
import store from '../../store/store';
import { changeRoom } from '../../store/actions/actions';
import { Link } from 'react-router-dom';

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
    const { roomValue } = this.state;

    return (
      <div className="login-page">
        <span className="form-text">Join the room:</span>
        <input
          className="input login-input"
          placeholder="Room title"
          value={this.state.roomValue}
          onChange={this.onChangeRoom}
        />
        <Link to={`/chat?room=${this.state.roomValue}`}>
          <button
            disabled={roomValue ? false : true}
            className="button button-submit"
            type="submit"
            onClick={this.verifyRoomName}
          >
            Let's chat!
          </button>
        </Link>
      </div>
    );
  }
}
 
export default RoomPage;