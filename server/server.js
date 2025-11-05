
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const GameManager = require("./GameManager");
const gameManager = new GameManager();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
   cors: { origin: "*" }
});

io.on("connection", (socket) => {
   console.log("Player connected:", socket.id);

   // socket.on("create-room", () => {
   //    const roomCode = Math.random().toString(36).substring(2,6).toUpperCase();
   //    rooms[roomCode] = {
   //       players: [],
   //       phase: "lobby"
   //    };
   //    socket.join(roomCode);
   //    socket.emit("room-created", roomCode);
   //    console.log(`Room created: ${roomCode}`);
   // });

   socket.on("joinRoom", ({ roomId, name }) => {
      console.log(`joinRoom received from ${name} (${socket.id}) for room ${roomId}`);
      if (!gameManager.rooms[roomId]) {
         console.log(`Creating room ${roomId}`);
         gameManager.createRoom(roomId);
      }
      const player = { id: socket.id, name, socketId: socket.id };
      gameManager.addPlayer(roomId, player);

      socket.join(roomId);
      console.log(`Room ${roomId} now has:`, gameManager.rooms[roomId].players.map(p => p.name));
      io.to(roomId).emit("roomUpdate", gameManager.getPublicState(roomId));
      console.log(`Sent roomUpdate to room ${roomId}`);
   });

   socket.on("startGame", (roomId) => {
      const deck = ["President", "Bomber", "Red", "Blue", "Gray", "Spy"];
      gameManager.assignCards(roomId, deck);
      gameManager.splitIntoRooms(roomId);
      io.to(roomId).emit("roomUpdate", gameManager.getPublicState(roomId));
   });

   // socket.on("disconnect", () => {
   //    for (const [code, room] of Object.entries(rooms)) {
   //       room.players = room.players.filter(p => p.id !== socket.id);
   //       io.to(code).emit("player-list", room.players);
   //    }
   //    console.log("User disconnected:", socket.id);
   // });

});

server.listen(4000, () => console.log("Server running on port 4000"));




