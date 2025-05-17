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

const verifyAdmin = async (token) => {
  const res = await (await fetch(`${userUrl}/user/admin`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })).json()
  return res
}

io.sockets.on("connection", (socket) => {
  console.log("Serwery połączone")
  socket.on("join_room", async (room, token) => {
    try {
      const res = await verify(room, token);
      if ("err" in res) {
        socket.emit('error', { message: 'Invalid token' });
        return;
      }
      const user = res.user;
      socket.userId = user;
      const actualRooms = [...socket.rooms].filter(r => r !== socket.id);
      actualRooms.forEach(oldRoom => {
        socket.leave(oldRoom);
        console.log(`${user} opuścił pokój: ${oldRoom}`);
        io.to(oldRoom).emit('voice', `${user} opuścił pokój: ${oldRoom}`);
      });

      socket.join(room);
      console.log(`${user} dołączył do pokoju: ${room}`);
      io.to(room).emit('voice', `${user} dołączył do pokoju: ${room}`);

    } catch (err) {
      console.error(err);
      socket.emit('error', { message: 'Auth error' });
    }
  });

  socket.on("leave_room", async (token) => {
    try {
      const room = [...socket.rooms].filter(room => room !== socket.id)[0]
      const res = await verify(room, token)
      if ("err" in res) {
        socket.emit('error', { message: 'Invalid token' });
      } else {
        const user = res.user
        socket.to([...socket.rooms][1]).emit('voice', `${user} opuścił pokój: ${room}`)
        socket.leave(room)
        console.log(`${user} opuścił pokój: ${room}`)
      }
    } catch {
      socket.emit('error', { message: 'Auth error' });
    }
  })

  socket.on("kick_user", async (user, token) => {
    try {
      const res = await verifyAdmin(token)
      if ("err" in res) {
        socket.emit('error', { message: 'Invalid token' });
      } else {
        const sockets = Array.from(io.sockets.sockets);
        sockets.forEach(([id, socket]) => {
          if (socket.userId === user) {
            for (const roomName of socket.rooms) {
              if (roomName !== socket.id) {
                io.to(roomName).emit('voice', `${user} opuścił pokój ${roomName}`)
                socket.leave(roomName);
                console.log(`User ${user} removed from room ${roomName}`);
              }
            }
          }
        });
      }
    } catch {
      socket.emit('error', { message: 'Auth error' });
    }
  })

  socket.on("voice", (data) => {
    const room = [...socket.rooms][1]

    if (socket.rooms.has(room)) {
      socket.to(room).emit("voice", data)
    }
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