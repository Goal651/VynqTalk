import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types";

// The context type
interface UsersContextType {
    users: Record<number, User>;
    setUsers: (users: User[]) => void;
    getUserName: (userId: number) => string;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsersState] = useState<Record<number, User>>({});

    // Set users from an array
    const setUsers = (usersArr: User[]) => {
        const map: Record<number, User> = {};
        usersArr.forEach(user => { map[user.id] = user; });
        setUsersState(map);
    };

    // Get user name by id
    const getUserName = (userId: number) => users[userId]?.name || `User ${userId}`;

    return (
        <UsersContext.Provider value={{ users, setUsers, getUserName }}>
            {children}
        </UsersContext.Provider>
    );
};

export const useUsers = () => {
    const ctx = useContext(UsersContext);
    if (!ctx) throw new Error("useUsers must be used within a UsersProvider");
    return ctx;
}; 