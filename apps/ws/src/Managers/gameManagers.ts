export interface User {
    name: string;
    ws: WebSocket;
}

export interface Game {
    users: User[];
    rounds: number;
    gameId: string;
}

export class GamesManager {
    private games: Map<string, Game>;  // Map of gameId and the Game itself

    constructor() {
        this.games = new Map();
    }

    createGame(gameId: string, creator: User, rounds: number) {
        const game: Game = {
            gameId: gameId,
            users : [creator],
            rounds
        };
        this.games.set(gameId, game);
    }

    removeGame(gameId: string) {
        this.games.delete(gameId);
    }
    joinGame(gameId: string, user: User) {
        const game = this.games.get(gameId);
        if (game) {
            game.users.push(user);
        }
    }
    leaveGame(gameId: string, user: User) {
        const game = this.games.get(gameId);
        game?.users.filter((u) => u.ws !== user.ws)
    }

    getAllGames() {
        return this.games;
    }

}