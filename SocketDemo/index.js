const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = 3000

// Display index.html
app.use(express.static(__dirname + '/public'))

// Configure socket connections
io.on('connection', function(socket) {
    console.log('A user connected')

    // Handling typing notifications
    socket.on("typing", (userID) => {
    socket.broadcast.emit("typing", userID)
    })

    socket.on("stoppedTyping", (userID) => {
    socket.broadcast.emit("stoppedTyping", userID)
    })

    // Handle chat message broadcasts
    socket.on('message', function(msg) {
    io.emit('message', {
        id: socket.id,
        text: msg
    })
    })

    // Notify about user disconnection
    socket.on('disconnect', function() {
    console.log('A user disconnected')
    })
})


http.listen(port, function() {
  console.log('Listening on port ' + port)
})