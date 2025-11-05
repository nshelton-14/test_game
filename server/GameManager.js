class GameManager {
    constructor() {
        this.rooms = {};
    }

    createRoom(roomId) {
        this.rooms[roomId] = {
            players: [],
            phase: 'waiting', // waiting | assigning | playing | ended
            cards: [],
        };
    }

    addPlayer(roomId, player) {
        const room = this.rooms[roomId];
        if (!room) return;

        room.players.push({
            id: player.id,
            name: player.name,
            socketId: player.socketId,
            card: null,
            team: null,
            location: null,
        });
    }

    assignCards(roomId, deck) {
        const room = this.rooms[roomId];
        const shuffled = [...deck].sort(() => Math.random() - 0.5);
        room.players.forEach((p, i) => (p.card = shuffled[i]));
        room.phase = 'playing';
    }

    splitIntoRooms(roomId) {
        const room = this.rooms[roomId];
        const shuffled = [...room.players].sort(() => Math.random() - 0.5);
        const half = Math.ceil(shuffled.length / 2);
        shuffled.forEach((p, i) => {
            p.location = i < half ? 'A' : 'B';
        });
    }

    getPublicState(roomId) {
        const room = this.rooms[roomId];
        return {
            phase: room.phase,
            players: room.players.map(p => ({
                id: p.id,
                name: p.name,
                location: p.location,
            })),
        };
    }
}

module.exports = GameManager;