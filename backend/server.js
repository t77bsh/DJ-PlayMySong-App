"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
const cors_1 = __importDefault(require("cors"));
const port = process.env.PORT || 8001;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: ["https://t77bsh.github.io/DJ-PlayMySong-App/", "http://locahost:3000"],
        methods: ["GET", "POST"],
    },
});
const pubClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
const subClient = pubClient.duplicate();
Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
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
    socket.on("create-room", (roomCode) => {
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
        var _a;
        const count = (_a = io.sockets.adapter.rooms.get(roomCode)) === null || _a === void 0 ? void 0 : _a.size;
        io.to(socket.id).emit("receive-room-count", count);
    });
    // Check that the room entered in the homepage exists (key: ******)
    socket.on("check-room-exists", (roomCode) => {
        if (io.sockets.adapter.rooms.has(roomCode)) {
            socket.emit("check-complete", true);
        }
        else {
            socket.emit("check-complete", false);
        }
    });
    // Double check room existence incase someone tries joining through url (key:*******)
    socket.on("double-check-room-exists", (roomCode) => {
        if (io.sockets.adapter.rooms.has(roomCode)) {
            socket.emit("double-check-complete", true);
            socket.join(roomCode);
        }
        else {
            socket.emit("double-check-complete", false);
        }
    });
    //Guest leaves room (key: ********)
    socket.on("leave-room", (roomCode) => {
        socket.leave(roomCode);
    });
});
