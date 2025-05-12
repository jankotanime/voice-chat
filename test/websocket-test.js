import { io } from 'socket.io-client';

const socket = io("http://localhost:8002", {
  transports: ['websocket', 'polling'],
  autoConnect: false
});

socket.connect()

socket.on("connect_error", (err) => {
  console.error("Błąd połączenia z WebSocketem:", err.message);
});

socket.on("connect", () => {
  console.log("Połączono z serwerem WebSocket.");
});

socket.on("voice", (message) => {
  console.log(message);
});

let myToken = undefined

fetch('http://localhost:8003/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'sigma',
    password: 'sigma'
  })
})
.then(response => {
  return response.json();
})
.then(data => {
  myToken = data.token
  // ? test rooms: 681ce9cb298e30be08df9305  , 681cf893f29b8e45ce3cff2e
  socket.emit("join_room", '681ce9cb298e30be08df9305', myToken);
  setTimeout(() => {
    socket.emit("kick_user", "sigma", myToken);
  }, 1000)
})
.catch(error => {
  console.error('Wystąpił błąd:', error);
});

