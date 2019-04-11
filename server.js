const express = require('express')
const http = require('http')
const app = express()
const server = http.Server(app)
const socketio = require('socket.io')

const io = socketio(server)



io.on('connection', (socket) => {
    console.log('Socket connected ' + socket.id)

    socket.on('send_message', (data) =>{
        //broadcast.emit('new message', data); send to everybody but me
        socket.broadcast.emit('new_message', data)
        socket.emit('your_message', data)

    })
})

app.use('/', express.static(__dirname + '/public'))

server.listen(3033, () => {
    console.log('Server started on http://localhost:3033')
  })

