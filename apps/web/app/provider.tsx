'use client';

import { SocketContextProvider } from "./context/socket";


export function Providers({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <SocketContextProvider>
        {children}
    </SocketContextProvider>
  );
}