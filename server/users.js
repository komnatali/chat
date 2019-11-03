const users = [];

const addUser = ({ id, name, room }) => {
  const user = { id, name, room };
  users.push(user);
  return user;
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  let disconnectedUser;
  if (index !== -1) {
    disconnectedUser = users.splice(index, 1)[0];
  } 
  return disconnectedUser;
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersFromRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersFromRoom, }