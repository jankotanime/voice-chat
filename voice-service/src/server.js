import connect from 'connect';
import { Server } from 'socket.io'
import http from 'http'

const userUrl = process.env.USER_URL;

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
  socket.on("join_room", async (room, token) => {
    try {
      const res = await (await fetch(`${userUrl}/room/user`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roomId: room
          })
      })).json()
      if ("err" in res) {
        socket.emit('error', { message: 'Invalid token' });
      } else {
        const user = res.user
        socket.userId = user;
        socket.join(room)
        console.log(`${user} dołączył do pokoju: ${room}`)
        io.to(socket.id).emit('voice', `${user} dołączył do pokoju: ${room}`)
      }
    } catch {
      socket.emit('error', { message: 'Auth error' });
    }
  })

  socket.on("message", (data) => {
    console.log(`${data['user']}: ${data['message']}`)
    io.to(data.room).emit("voice", data.user, data.message);
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