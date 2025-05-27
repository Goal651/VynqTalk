import { apiClient } from "../client";

export const sendMessage = async (message: {
    conversationId: string;
    senderId: string;
    content: string;
}) => {
    const response = await apiClient.post('/', message);
    return response.data;
};

export const getMessages = async (senderId:string, receiverId:string) => {
    const response = await axios.get(`${API_BASE}/conv/${senderId}/${receiverId}`);
    return response.data;
};

export const updateMessage = async (messageId: string, updatedContent: string) => {
    const response = await axios.put(`${API_BASE}/${messageId}`, {
        content: updatedContent,
    });
    return response.data;
};

export const deleteMessage = async (messageId: string) => {
    await axios.delete(`${API_BASE}/${messageId}`);
};
