
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren, JSX, Dispatch, SetStateAction } from "react";
import { WS_URL } from "../utils.ts";


interface Context {
  socket: WebSocket | null;
  setSocket: Dispatch<SetStateAction<WebSocket | null>>;
}

const ContextInstance = createContext<Context | undefined>(undefined);

export function SocketContextProvider({ children }: PropsWithChildren): JSX.Element {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    setSocket(socket);
    
    return () => {
        socket?.close();
        setSocket(null);
    }
  },[setSocket])

  const contextValue = useMemo(() => {
    return {
      socket,
      setSocket,
    };
  }, [socket, setSocket]);

  return <ContextInstance.Provider value={contextValue}>{children}</ContextInstance.Provider>;
}


export function useSocketContext(): Context {
  const context = useContext(ContextInstance);
  if (context === undefined) {
    throw new Error("useSocketContext must be used within a ContextProvider");
  }
  return context;
}