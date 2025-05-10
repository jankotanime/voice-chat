import connect from 'connect';
import { Server } from 'socket.io'

const app = connect();
const port = 8002;

const io = new Server(app, {cors: {
  origin: "https://localhost:8002",
  methods: ["GET", "POST"]
}})

app.use(serveStatic("public"))


io.sockets.on("connection", (socket) => {
  socket.on("join_room", (user, room) => {
      socket.userId = user;
      socket.join(room)
      console.log(`${user} dołączył do pokoju: global`)
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

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});