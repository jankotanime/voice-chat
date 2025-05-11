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

const verify = async (room, token) => {
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
  return res
}

io.sockets.on("connection", (socket) => {
  console.log("Serwery połączone")
  socket.on("join_room", async (room, token) => {
    try {
      const res = await verify(room, token)
      if ("err" in res) {
        socket.emit('error', { message: 'Invalid token' });
      } else {
        const user = res.user
        const actualRooms = [...socket.rooms].filter(room => room !== socket.id)
        actualRooms.forEach(room => {
          io.to(socket.id).emit('voice', `${user} opóścił pokój: ${room}`)
          socket.leave(room)
          console.log(`${user} opuścił pokój: ${room}`)
        })
        socket.userId = user;
        socket.join(room)
        console.log(`${user} dołączył do pokoju: ${room}`)
        io.to(socket.id).emit('voice', `${user} dołączył do pokoju: ${room}`)
      }
    } catch {
      socket.emit('error', { message: 'Auth error' });
    }
  })

  socket.on("leave_room", async (token) => {
    try {
      const room = [...socket.rooms].filter(room => room !== socket.id)[0]
      const res = await verify(room, token)
      if ("err" in res) {
        socket.emit('error', { message: 'Invalid token' });
      } else {
        const user = res.user
        io.to(socket.id).emit('voice', `${user} opóścił pokój: ${room}`)
        socket.leave(room)
        console.log(`${user} opuścił pokój: ${room}`)
      }
    } catch {
      socket.emit('error', { message: 'Auth error' });
    }
  })

  socket.on("voice", (data) => {
    console.log(`${socket.userId} on room ${socket.id}: ${data}`)
    io.to(socket.id).emit("voice", `${socket.userId}: ${data}`);
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