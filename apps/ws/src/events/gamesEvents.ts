export const GameEvents =  {
    CREATE_GAME: "CREATE_GAME",
    JOIN_GAME: "JOIN_GAME",
    START_GAME: "START_GAME",
    END_GAME: "END_GAME",
    LEAVE_GAME: "LEAVE_GAME",
    UPDATE_CANVAS: "UPDATE_CANVAS",
    WORD_SELECTED: "WORD_SELECTED",
} as const;

export type GameEvent = (typeof GameEvents)[keyof typeof GameEvents];

export const ClientEvents =  {
    ERROR: "ERROR",
    GAME_CREATED: "GAME_CREATED",
    GAME_JOINED: "GAME_JOINED",
    PLAYER_JOINED: "PLAYER_JOINED",
    CHOOSE_WORD: "CHOOSE_WORD",
    CHOOSING_WORD: "CHOOSING_WORD",
    CHOOSEN_WORD: "CHOOSEN_WORD",
    GUESS_CHOOSEN_WORD: "GUESS_CHOOSEN_WORD",
} as const;

export type ClientEvent = (typeof ClientEvents)[keyof typeof ClientEvents];