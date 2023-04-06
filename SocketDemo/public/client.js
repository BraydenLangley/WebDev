var socket = io()
var form = document.querySelector('form')
var input = document.querySelector('#input')
var messages = document.querySelector('#chat')
var BabbageSDK = window.BabbageSDK

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let identityKey = 'unknown'

const checkAuthentication = async () => {
let authenticated = false
  while (!authenticated) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        await BabbageSDK.isAuthenticated()
        document.getElementById('chatContainer').style.visibility = 'visible'
        document.getElementById('status').innerText = ''
        authenticated = true
        identityKey = await BabbageSDK.getPublicKey({ identityKey: true })
    } catch (e) {
        // handle error
        document.getElementById('chatContainer').style.visibility = 'hidden'
        document.getElementById('status').innerText = 'Babbage MetaNet Client is required!'
    }
  }
  // Once authenticated return true
  return true
}

checkAuthentication();

// const checkAuthentication = async () => {
    // let authenticated = false
    
    // (async () => {
    //     while (authenticated !== true) {
    //         await new Promise((resolve) => setTimeout(resolve, 5000));
    //         try {
    //             // Check if the user is authenticated
    //             // sleep(1000)
    //             authenticated = await window.BabbageSDK.isAuthenticated()
    //             document.getElementById('chatContainer').style.visibility = 'visible'
    //             document.getElementById('status').innerText = ''
    //             return true
    //             // document
    //             // .getElementById('GetBabbageButton')
    //             // .style.visibility = 'hidden'
    //             // document
    //             // .getElementById('GetCertificateButton')
    //             // .style.visibility = 'visible'
    //         } catch (e) {
    //             // document
    //             // .getElementById('GetBabbageButton')
    //             // .style.visibility = 'visible'
    //             // document
    //             // .getElementById('GetCertificateButton')
    //             // .style.visibility = 'hidden'
    //             document.getElementById('chatContainer').style.visibility = 'hidden'
    //             document.getElementById('status').innerText = 'Babbage MetaNet Client is required!'
    //         }
    //     }
    // })()
// }
// checkAuthentication()

form.addEventListener('submit', function(e) {
  e.preventDefault()
  // Clear typing timer
  clearTimeout(typingTimer)
  
  if (input.value) {
    socket.emit('chatMessage', { text: input.value, identityKey })
    input.value = ''
  }
})

socket.on('chatMessage', function(msg) {
    var li = document.createElement('li')
    var div = document.createElement('div')
    div.classList.add('message', 'last')
    div.textContent = msg.text
  
  if (socket.id === msg.id) {
    li.classList.add('sent', 'messages')
  } else {
    li.classList.add('recieved', 'messages')
    document.getElementById('identityKey').innerText = 'Msg from: ' + msg.identityKey
  }
  li.appendChild(div)

  checkTypingIndicator()
  messages.appendChild(li)
})

const inputField = document.getElementById("input")
let typingTimer
const doneTypingInterval = 2000 // Time in ms

input.addEventListener('input', () => {
    // User is typing, emit typing event
    socket.emit('typing')
  
    // Clear typing timer and start a new one
    clearTimeout(typingTimer)
    typingTimer = setTimeout(() => { socket.emit('stoppedTyping')}, doneTypingInterval)
  })
  

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

socket.on('stoppedTyping', async (data) => {
    checkTypingIndicator()
})

const checkTypingIndicator = () => {
    var li = document.getElementById('typingIndicator')
    if (li) {
        messages.removeChild(li)
    }
    checkAuthentication()
}