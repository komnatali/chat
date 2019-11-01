const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { addUser, removeUser, getUser, getUsersFromRoom } = require('./users.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 5000;

app.get('/', function(req, res){
  res.send("Server is up and running.").status(200);
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('join chat', function({ name, room }, callback) {
    const user = addUser({ id: socket.id, name, room });

    socket.join(user.room);
    
    const address = user.name ? user.name : "New user";
    io.to(user.room).emit('message', { text: `${address} has joined the chat :)` });
    io.to(user.room).emit('usersFromRoom', getUsersFromRoom(user.room));
  });

  socket.on('send message', (msg) => {
    const user = getUser(socket.id);
    const time = new Date();
    io.to(user.room).emit('message', {user: user.name, text: msg, time});
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
    const user = removeUser(socket.id);    
    console.log(user);
    if (user) io.emit('usersFromRoom', getUsersFromRoom(user.room));
  });
});

server.listen(5000, function() {
  console.log(`listening on *:${port}`);
});