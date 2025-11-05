import { useState, useEffect } from 'react'
import io from "socket.io-client";

//const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:4000");
const socket = io("http://localhost:4000");

function App() {
   const [roomId, setRoomId] = useState("");
   const [playerName, setPlayerName] = useState("");
   const [inRoom, setInRoom] = useState(false);
   const [gameState, setGameState] = useState(null);

   useEffect(() => {
      socket.on("roomUpdate", setGameState);
   }, []);

   const joinRoom = () => {
      socket.emit("joinRoom", { roomId, name: playerName });
      setInRoom(true);
   };

   const startGame = () => {
      socket.emit("startGame", roomId);
   };

   if (!inRoom) {
      return (
         <div className="p-4">
            <h1 className="text-2xl font-bold">Two Rooms and Boom</h1>
            <input value={roomId} onChange={e => setRoomId(e.target.value)} placeholder="Room ID" />
            <input value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Your Name" />
            <button onClick={joinRoom}>Join</button>
         </div>
      );
   }

   if (!gameState) return <p>Waiting for game state...</p>;

   return (
      <div className="p-4">
         <h2>Room: {roomId}</h2>
         <h3>Phase: {gameState.phase}</h3>

         <h4>Players</h4>
         <ul>
            {gameState.players.map(p => (
               <li key={p.id}>{p.name} ({p.location || "?"})</li>
            ))}
         </ul>

         {gameState.phase === "waiting" && <button onClick={startGame}>Start Game</button>}
      </div>
   );

   // useEffect(() => {
   //    socket.on("connect", () => console.log("Connected to server"));
   //    socket.on("room-created", (code) => {
   //       setRoomCode(code);
   //       setIsHost(true);
   //       setInRoom(true);
   //    });

   //    socket.on("joined-room", (code) => {
   //       setRoomCode(code);
   //       setInRoom(true);
   //    });
   //    socket.on("player-list", (list) => setPlayers(list));
   //    socket.on("error-message", (msg) => alert(msg));
   //    socket.on("game-started", () => {
   //       setGameStarted(true);
   //    });

   //    return () => {
   //       socket.off("connect");
   //       socket.off("room-created");
   //       socket.off("player-list");
   //       socket.off("error-message");
   //       socket.off("game-started");
   //    };
   // }, []);

   // const createRoom = () => socket.emit("create-room");
   // const joinRoom = () => socket.emit("join-room", { name, roomCode });
   // const startGame = () => socket.emit("start-game", roomCode);

   // // UI States
   // if (!inRoom) {
   //    return (
   //       <div className="flex flex-col items-center justify-center h-screen">
   //          <h1 className="text-2x1 font-bold mb-4">Party Game Lobby</h1>
   //          <input
   //             className="border p-2 mb-2"
   //             placeholder="Your name"
   //             value={name}
   //             onChange={(e) => setName(e.target.value)}
   //          />
   //          <div className="mb-4">
   //             <button
   //                onClick={createRoom}
   //                className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
   //             >
   //                Create Room
   //             </button>
   //             <input
   //                className="border p-2 w-20 mr-2"
   //                placeholder="Code"
   //                value={roomCode}
   //                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
   //             />
   //             <button
   //                onClick={joinRoom}
   //                className="bg-green-500 text-white px-4 py-2 rounded"
   //             >
   //                Join
   //             </button>
   //          </div>
   //       </div>
   //    );
   // }

   // if (gameStarted) {
   //    return (
   //       <div className="flex flex-col items-center justify-center h-screen text-center">
   //          <h2 className="text-xl font-semibold mb-4">Game has started!</h2>
   //       </div>
   //    );
   // }

   // // Lobby screen
   // return (
   //    <div className="flex flex-col items-center justify-center h-screen text-center">
   //       <h2 className="text-2xl mb-2">Room Code: {roomCode}</h2>
   //       {isHost && <p className="text-sm text-gray-600">(You are the host)</p>}
   //       <h3 className="mt-4 mb-2 text-lg font-semibold">Players:</h3>
   //       <ul>
   //          {players.map((p) => (
   //             <li key={p.id}>{p.name}</li>
   //          ))}
   //       </ul>
   //       {isHost && players.length > 0 && (
   //          <button
   //             onClick={startGame}
   //             className="mt-6 bg-orange-500 text-white px-4 py-2 rounded"
   //          >
   //             Start Game
   //          </button>
   //       )}
   //    </div>
   // );
}

export default App;


