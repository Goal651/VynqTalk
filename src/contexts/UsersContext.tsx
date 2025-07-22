import { createContext, useContext, useState, ReactNode } from "react";
import { Message, User } from "@/types";


interface UsersContextType {
    users: User[];
    setUsers: (users: User[]) => void;
    getUserName: (userId: number) => string;
    updateLatestMessage: (message: Message) => void
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsersState] = useState<User[]>([]);

    const setUsers = (usersArr: User[]) => {
        usersArr.map((user) => {
            if (!user.avatar) user.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
            return user
        })
        console.log('updated user avatar ', usersArr)
        setUsersState(usersArr);
    };

    const updateLatestMessage = (message: Message) => {
        const receiver = message.receiver
        users.map((user) => {
            if (!user) return []
            if (user.id == receiver.id) {
                user.latestMessage = message
            }
            return user
        })
    }

    // Get user name by id
    const getUserName = (userId: number) => users[userId]?.name || `User ${userId}`;

    return (
        <UsersContext.Provider value={{ users, setUsers, getUserName, updateLatestMessage }}>
            {children}
        </UsersContext.Provider>
    );
};

export const useUsers = () => {
    const ctx = useContext(UsersContext);
    if (!ctx) throw new Error("useUsers must be used within a UsersProvider");
    return ctx;
}; 