import connect from 'connect';
import { Server } from 'socket.io'
import http from 'http'

const app = connect();
const port = 8002;

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

io.sockets.on("connection", (socket) => {
  console.log("Serwery połączone")

  socket.on("join_room", (user, room) => {
      socket.userId = user;
      socket.join(room)
      console.log(`${user} dołączył do pokoju: ${room}`)
  })
  socket.on("message", (data) => {
      console.log(`${data['user']}: ${data['message']}`)
      io.to(data['room']).emit("message_global", data['user'], data['message']);
  })
})

io.sockets.on("connect_error", () => {
  console.log("Błąd połączenia");
  setTimeout(() => {
      socket.connect();
  }, 2000)
})

httpServer.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});