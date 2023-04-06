const express = require('express')
const app = express()
const http = require('http').Server(app)
const bodyparser = require('body-parser')
const io = require('socket.io')(http)
const port = 3000

app.use(bodyparser.json())

// This allows the API to be used when CORS is enforced
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Expose-Headers', '*')
  res.header('Access-Control-Allow-Private-Network', 'true')
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})

// Display index.html
app.use(express.static(__dirname + '/public'))

// Configure socket connections
io.on('connection', function(socket) {
  console.log('A user connected')

  // Handling typing notifications 
  socket.on("typing", (userID) => {
    console.log('typing')
    socket.broadcast.emit("typing", userID)
  })
  
  socket.on("stoppedTyping", (userID) => {
    socket.broadcast.emit("stoppedTyping", userID)
  })

  socket.on('chatMessage', function(msg) {
    io.emit('chatMessage', {
      id: socket.id,
      text: msg.text,
      identityKey: msg.identityKey
    })
  })

  socket.on('disconnect', function() {
    console.log('A user disconnected')
  })
})


http.listen(port, function() {
  console.log('Listening on port ' + port)
})
