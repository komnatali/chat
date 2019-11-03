const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { addUser, removeUser, getUser, getUsersFromRoom } = require('./users.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 5000;

const offers = [];
let callerId; 

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

  socket.on('send offer', (offer, index) => {
    const user = getUser(socket.id);
    callerId = socket.id;
    const onlineUsers = getUsersFromRoom(user.room);

    //collect offers in array and send them to online users (ignoring the sender).
    if (onlineUsers.length !== index + 1) offers.push(offer);
    else onlineUsers.forEach((user) => {
      if (user.id !== socket.id) { 
        console.log('offer');
        io.sockets.sockets[user.id].emit('send offer', offer);
      }
    })
  });

  socket.on('icecandidate', (candidate) => {
    console.log('icecandidate', candidate.candidate);
    io.sockets.emit('icecandidate', candidate);
  });

  socket.on('answer', (answer) => {
    console.log('answer', answer.sdp.slice(0, 10));
    const calleeId = socket.id;
		io.sockets.sockets[callerId].emit('answer', answer, calleeId);
	});

  socket.on('stop streaming', () => {
    const user = getUser(socket.id);
    io.to(user.room).emit('stop streaming');
    io.to(user.room).emit('message', {text: 'The end of stream!'});
    const offers = [];
    let callerId = null; 
  })
});

server.listen(port, function() {
  console.log(`listening on *:${port}`);
});