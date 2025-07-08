import React, { createContext, useContext, useEffect } from "react";
import { socketService } from "@/api";

const SocketContext = createContext<typeof socketService | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        socketService.connect();
        return () => {
            socketService.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socketService}>
            {children}
        </SocketContext.Provider>
    );
};
