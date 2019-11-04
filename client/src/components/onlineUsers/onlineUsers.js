import React from 'react';
import './onlineUsers.css';

const OnlineUsers = ({users}) => {
  let usersList;
  if (users) {
    usersList = users.map((user, index) => {
      return (
        <div key={index.toString()} className="onlineuser">{user.name}</div>
      )
    });
  } else usersList = "No online users";
  
  return (
    <div className="onlineusers">
      <p className="online-text">Now online:</p>
      {usersList}
    </div>
  )  
}

export default OnlineUsers;