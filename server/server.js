
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
   cors: { origin: "*" }
});

const rooms = {};

io.on("connection", (socket) => {
   console.log("User connected:", socket.id);

   socket.on("create-room", () => {
      const roomCode = Math.random().toString(36).substring(2,6).toUpperCase();
      rooms[roomCode] = { players: [] };
      socket.join(roomCode);
      socket.emit("room-created", roomCode);
      console.log(`Room created: ${roomCode}`);
   });

   socket.on("join-room", ({ name, roomCode }) => {
      const room = rooms[roomCode];
      if (room) {
         room.players.push({ id: socket.id, name });
         socket.join(roomCode);
         io.to(roomCode).emit("player-list", room.players);
      } else {
         socket.emit("error-message", "Room not found");
      }
   });

   socket.on("disconnect", () => {
      for (const [code, room] of Object.entries(rooms)) {
         room.players = room.players.filter(p => p.id !== socket.id);
         io.to(code).emit("player-list", room.players);
      }
      console.log("User disconnected:", socket.id);
   });
});

server.listen(4000, () => console.log("Server running on port 4000"));




