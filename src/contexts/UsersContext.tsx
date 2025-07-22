import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Message, User } from "@/types";
import { useSocket } from "./SocketContext";


interface UsersContextType {
    users: User[];
    setUsers: (users: User[]) => void;
    getUserName: (userId: number) => string;
    updateLatestMessage: (message: Message) => void
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
    const socket = useSocket()
    const [users, setUsersState] = useState<User[]>([]);


    useEffect(() => {
        const setUserOnline = (id: number) => {
            users.map((user) => {
                if (user.id == id) user.isOnline = true
                return user
            })
        }
        socket.onOnlineUsersChange((users) => {
            users.forEach(user => setUserOnline(user))

        })

    }, [socket, users])

    const setUsers = (usersArr: User[]) => {
        usersArr.map((user) => (!user.avatar ? user.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}` : user.avatar))
        setUsersState(sortUsers(usersArr));
    };

    const updateLatestMessage = (message: Message) => {
        const receiver = message.receiver
        users.map((user) => {
            if (user.id == receiver.id) user.latestMessage = message
            return user
        })
      setUsersState(sortUsers(users))
    }

    const sortUsers = (users: User[]): User[] => {
        return [...users].sort((a, b) => {
            if (a.isOnline !== b.isOnline) {
                return b.isOnline ? 1 : -1;
            }

            const aTime = Number(new Date(a.latestMessage?.timestamp)) || 0;
            const bTime = Number(new Date(b.latestMessage?.timestamp)) || 0;
            return bTime - aTime;
        });
    };

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