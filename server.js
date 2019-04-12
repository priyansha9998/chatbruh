const express = require('express')
const http = require('http')
const app = express()
const server = http.Server(app)
const socketio = require('socket.io')

const io = socketio(server)

//users that are currently present to chat
let users = {}
//rooms currently in use
let rooms = {}

//Connecting the socket
io.on('connection', (socket) => {
    //The socket is now connected succesfully
    console.log('Socket connected ' + socket.id)

    socket.on('adduser', (username) => {
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = 'room1';
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room 1
		socket.join('room1');
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected to room1');
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room1');
	});

    socket.on('enter_room', (data) =>{
        socket.username = data.username
        socket.room = data.room
        rooms[data.room] = data.room
        users[data.room] = data.username
        socket.join(socket.room)
        socket.emit('updatemychat', {
            room : socket.room
        })
        socket.broadcast.to(socket.room).emit('updatechat', {
            username : socket.username
        });
        
    })

    //When the user sends a message
    socket.on('send_message', (data) =>{
        //broadcast.emit('new message', data); send to everybody but me
        //send the mesage to the clients
        io.in(socket.room).emit('new_message', {
            username : socket.username,
            message : data.message
        });
    })
})
//use all the files in the public folder
app.use('/', express.static(__dirname + '/public'))

//listen the client
server.listen(3033, () => {
    console.log('Server started on http://localhost:3033')
  })

