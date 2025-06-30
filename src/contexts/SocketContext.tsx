import React, { createContext, useContext, useEffect } from "react";
import { socketService } from "@/api/services/socket";

const SocketContext = createContext<typeof socketService | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        console.log('🔌 SocketProvider: Initializing WebSocket connection...');
        socketService.connect();
        return () => {
            console.log('🔌 SocketProvider: Cleaning up WebSocket connection...');
            socketService.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socketService}>
            {children}
        </SocketContext.Provider>
    );
};
