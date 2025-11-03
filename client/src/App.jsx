import { useState, useEffect } from 'react'
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
   const [name, setName] = useState("");
   const [roomCode, setRoomCode] = useState("");
   const [inRoom, setInRoom] = useState(false);
   const [players, setPlayers] = useState([]);
   const [isHost, setIsHost] = useState(false);

   useEffect(() => {
      socket.on("room-created", (code) => {
         setRoomCode(code);
         setIsHost(true);
         setInRoom(true);
      });

      socket.on("player-list", (list) => {
         setPlayers(list);
      });

      socket.on("error-message", (msg) => {
         alert(msg);
      });

      return () => {
         socket.off("room-created");
         socket.off("player-list");
         socket.off("error-message");
      };
   }, []);

   const createRoom = () => socket.emit("create-room");
   const joinRoom = () => socket.emit("join-room", { name, roomCode });

   if (!inRoom) {
      return (
         <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2x1 font-bold mb-4">Party Game Lobby</h1>
            <input
               className="border p-2 mb-2"
               placeholder="Your name"
               value={name}
               onChange={(e) => setName(e.target.value)}
            />
            <div className="mb-4">
               <button onClick={createRoom} className="bg-blue-500 text-white px-4 py-2 mr-2 rounded">
                  Create Room
               </button>
               <input
                  className="border p-2 w-20 mr-2"
                  placeholder="Code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
               />
               <button onClick={joinRoom} className="bg-green-500 text-white px-4 py-2 rounded">
                  Join
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="flex flex-col items-center justify-center h-screen">
         <h2 className="text-2xl mb-2">Room Code: {roomCode}</h2>
         {isHost && <p className="text-sm text-gray-600">(You are the host)</p>}
         <h3 className="mt-4 mb-2 text-lg font-semibold">Players:</h3>
         <ul>
            {players.map((p) => (
               <li key={p.id}>{p.name}</li>
            ))}
         </ul>
      </div>
   );
}

export default App;


