export const MessageTypes =  {
    JOIN_GAME: "JOIN_GAME",
    START_GAME: "START_GAME",
    END_GAMR: "END_GAME",
    LEAVE_GAME: "LEAVE_GAME",
    UPDATE_CANVAS: "UPDATE_CANVAS",
} as const;

export type MessageTypes = (typeof MessageTypes)[keyof typeof MessageTypes];