import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import cors from "cors";
const port = process.env.PORT || 8001;

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://t77bsh.github.io/DJ-PlayMySong-App/", "http://locahost:3000"],
    methods: ["GET", "POST"],
  },
});

const pubClient = createClient({
  url: process.env.REDIS_URL,
});
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
});

pubClient.on("error", (err) => {
  console.log(err.message);
});

subClient.on("error", (err) => {
  console.log(err.message);
});

httpServer.listen(port, () => console.log("app is working " + port));

io.on("connection", (socket) => {
  // Create room as DJ (key: *)
  socket.on("create-room", (roomCode: string) => {
    socket.join(roomCode);
    pubClient.lRange(`requests-${roomCode}`, 0, -1).then((requests) => {
      io.in(roomCode).emit("receive-request", requests); // (key: ***)
    });
  });

  // Handle song request from guest room (key: **)
  socket.on("song-request", (request, roomCode) => {
    pubClient.RPUSH(`requests-${roomCode}`, request);
    pubClient.lRange(`requests-${roomCode}`, 0, -1).then((data) => {
      socket.to(roomCode).emit("receive-request", data);
    });
  });

  // Clear requests from DJ Room (key: ****)

  socket.on("clear-requests", (roomCode) => {
    pubClient.del(`requests-${roomCode}`);
  });

  // Delete room (key: *****)
  socket.on("delete-room", (roomCode) => {
    socket.to(roomCode).emit("room-closed");
    io.socketsLeave(roomCode);
    pubClient.del(`requests-${roomCode}`);
  });

  // Count room (key: --)
  socket.on("get-room-count", (roomCode) => {
    const count = io.sockets.adapter.rooms.get(roomCode)?.size;
    io.to(socket.id).emit("receive-room-count", count);
  });

  // Check that the room entered in the homepage exists (key: ******)
  socket.on("check-room-exists", (roomCode) => {
    if (io.sockets.adapter.rooms.has(roomCode)) {
      socket.emit("check-complete", true);
    } else {
      socket.emit("check-complete", false);
    }
  });

  // Double check room existence incase someone tries joining through url (key:*******)
  socket.on("double-check-room-exists", (roomCode) => {
    if (io.sockets.adapter.rooms.has(roomCode)) {
      socket.emit("double-check-complete", true);
      socket.join(roomCode);
    } else {
      socket.emit("double-check-complete", false);
    }
  });

    //Guest leaves room (key: ********)
    socket.on("leave-room", (roomCode) => {
      socket.leave(roomCode);
    });
});
