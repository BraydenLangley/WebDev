var socket = io()
var form = document.querySelector('form')
var input = document.querySelector('#input')
var messages = document.querySelector('#chat')

// Add a listener for when the message is submitted
form.addEventListener('submit', function(e) {
  e.preventDefault()
  // Clear typing timer
  clearTimeout(typingTimer)
  
  if (input.value) {
    socket.emit('message', input.value)
    input.value = ''
  }
})

// Handle message broadcasts
socket.on('message', function(msg) {
    var li = document.createElement('li')
    var div = document.createElement('div')
    div.classList.add('message', 'last')
    div.textContent = msg.text
  
    // Figure out if this message is being sent or recieved
    if (socket.id === msg.id) {
        li.classList.add('sent', 'messages')
    } else {
        li.classList.add('recieved', 'messages')
        // Remove the typing indicator if it is present before recieving
        removeTypingIndicator()
    }
    li.appendChild(div)

    messages.appendChild(li)
})

// let typingTimer

input.addEventListener('input', () => {
    // User is typing, emit typing event
    socket.emit('typing')
    // Wait 2 seconds before clearing the typing indicator
    setTimeout(() => { socket.emit('stoppedTyping')}, 2000)
})
  
// Handling typing indicator broadcasts
socket.on('typing', (data) => {
    if (!document.getElementById('typingIndicator')) {
        var li = document.createElement('li')
        li.id = 'typingIndicator'

        var div = document.createElement('div')
        div.classList.add('message', 'last')
        div.textContent = 'typing...'
        li.classList.add('recieved', 'messages')

        li.appendChild(div)
        messages.appendChild(li)
    }
})

socket.on('stoppedTyping', (data) => {
    removeTypingIndicator()
})

// If an typing indicator is present, remove it
const removeTypingIndicator = () => {
    var li = document.getElementById('typingIndicator')
    if (li) {
        messages.removeChild(li)
    }
}