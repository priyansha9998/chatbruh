const express = require('express')
const http = require('http')
const app = express()
const server = http.Server(app)
const socketio = require('socket.io')

const io = socketio(server)

const { Users } = require('./db')


//users that are currently present to chat
let users = {}
//rooms currently in use
let rooms = {}

//Connecting the socket
io.on('connection', (socket) => {
    //The socket is now connected succesfully
    console.log('Socket connected ' + socket.id)

    socket.on('new_signup', (data) => {
        Users.create({
            username : data.username,
            firstName : data.firstName,
            lastName : data.lastName,
            password : data.password,
        }).then((user) => {
            
                socket.emit('signup_done', {
                username : user.username
                })
        })
        
        })

       

    socket.on('enter_room', (data) =>{
        Users.findOne({
            where: {
                username : data.username,
            }
        }).then((user) =>{
            if(!user) { 
                socket.emit('nouser',{
                    username : data.username
                })
            }
            if(user.password !== data.password) {
                socket.emit('inpassword', {
                    room : data.room
                })
            }
            else {
                socket.emit('login', {
                    username : data.username
                })
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
                })
            }
        })
        
        
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

