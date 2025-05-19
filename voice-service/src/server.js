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
      actualRooms.forEach(async (oldRoom) => {
        socket.leave(oldRoom);
        console.log(`${user} opuścił pokój: ${oldRoom}`);
        socket.to(oldRoom).emit("guest_leave")
        const usersInRoom = (await io.in(oldRoom).fetchSockets()).map(elem => elem.userId)
        console.log(usersInRoom)
        socket.to(oldRoom).emit('roomMates', usersInRoom);
      });
      socket.join(room);
      console.log(`${user} dołączył do pokoju: ${room}`);
      socket.to(room).emit('guest_join');
      const usersInRoom = (await io.in(room).fetchSockets()).map(elem => elem.userId)
      io.to(room).emit('roomMates', usersInRoom);
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
        io.to(room).emit("guest_leave")
        const usersInRoom = (await io.in(room).fetchSockets())
        .map(elem => elem.userId).filter(elem => elem !== user);
        io.to(room).emit('roomMates', usersInRoom);
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
        sockets.forEach(async ([id, socket]) => {
          if (socket.userId === user) {
            for (const roomName of socket.rooms) {
              if (roomName !== socket.id) {
                socket.leave(roomName);
                io.to(roomName).emit("guest_leave");
                const usersInRoom = (await io.in(roomName).fetchSockets()).map(elem => elem.userId);
                io.to(roomName).emit('roomMates', usersInRoom);
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
      socket.to(room).emit("voice", socket.userId, data)
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