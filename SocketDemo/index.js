const express = require('express')
const app = express()
const http = require('http').Server(app)
const bodyparser = require('body-parser')
// const io = require('socket.io')(http)
const SERVER_PRIVATE_KEY = 'a0b6131b2ed7c9f6099f35a1e61a18c0e6bca3352a624d9e4b4851403cf52949'

const authrite = require('authrite-express')
const io = authrite.socket(http, {
  cors: {
    origin: '*'
  },
  serverPrivateKey: SERVER_PRIVATE_KEY
})

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

// Configure socket connections
io.on('connection', function (socket) {
  console.log('A user connected')

  // Handling typing notifications
  socket.on('typing', (userID) => {
    console.log('typing')
    // Note: Still shows for the user
    io.emit('typing', {
      id: socket.id,
      identityKey: userID
    })
  })

  socket.on('stoppedTyping', (userID) => {
    io.emit('stoppedTyping', {
      id: socket.id,
      identityKey: userID
    })
    // socket.broadcast.emit('stoppedTyping', userID)
  })

  socket.on('chatMessage', function (msg) {
    console.log('msg', msg)
    io.emit('chatMessage', {
      id: socket.id,
      text: msg.text,
      identityKey: msg.identityKey
    })
  })

  socket.on('disconnect', (reason) => {
    console.log(`Disconnected: ${reason}`)
  })

  socket.on('reconnect', (attemptNumber) => {
    console.log(`Reconnected after ${attemptNumber} attempts`)
  })

  socket.on('reconnect_error', (error) => {
    console.log('Reconnection failed:', error)
  })
})

// Display index.html
app.use(express.static(__dirname + '/public'))

// Authrite is enforced from here forward
app.use(authrite.middleware({
  serverPrivateKey: SERVER_PRIVATE_KEY,
  baseUrl: 'http://localhost:3000'
}))

app.get('/test', (req, res) => {
  return res.status(200).json({
    message: 'yay!'
  })
})

http.listen(port, function () {
  console.log('Listening on port ' + port)
})
