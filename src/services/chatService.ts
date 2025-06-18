import axios from 'axios';
import { Message, ChatDetail, SendMessageRequest, User, ChatConversation } from '../types/chat';

const API_BASE_URL = 'http://localhost:8000/api/';

// Get auth token from localStorage
const getAuthToken = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        return parsedUserInfo.DT?.access_token;
    }
    return null;
};

// Create axios instance with auth header
const createAuthAxios = () => {
    const token = getAuthToken();
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

export const chatService = {
    // Get all users for chat list
    async getUsers(): Promise<User[]> {
        const authAxios = createAuthAxios();
        try {
            const response = await authAxios.get('/users/');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Get chat history between two users
    async getChatHistory(userId1: number, userId2: number): Promise<ChatDetail> {
        const authAxios = createAuthAxios();
        try {
            const response = await authAxios.get(`/chat-history?user1=${userId1}&user2=${userId2}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching chat history:', error);
            throw error;
        }
    },

    // Send a message
    async sendMessage(messageData: SendMessageRequest): Promise<Message> {
        const authAxios = createAuthAxios();
        try {
            const response = await authAxios.post('/chat', messageData);
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    // Get all conversations for current user
    async getConversations(): Promise<ChatConversation[]> {
        const authAxios = createAuthAxios();
        try {
            const response = await authAxios.get('/chat/conversations');
            return response.data;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    },

    // Mark messages as read
    async markMessagesAsRead(conversationId: number): Promise<void> {
        const authAxios = createAuthAxios();
        try {
            await authAxios.put(`/chat/mark-read/${conversationId}`);
        } catch (error) {
            console.error('Error marking messages as read:', error);
            throw error;
        }
    },

    // Delete a message
    async deleteMessage(messageId: number): Promise<void> {
        const authAxios = createAuthAxios();
        try {
            await authAxios.delete(`/chat/delete?message_id=${messageId}`);
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    },

    // Update a message
    async updateMessage(messageId: number, content: string): Promise<Message> {
        const authAxios = createAuthAxios();
        try {
            const response = await authAxios.put('/chat/update', {
                message_id: messageId,
                content: content
            });
            return response.data;
        } catch (error) {
            console.error('Error updating message:', error);
            throw error;
        }
    },

    // Get current user info from Django response format
    getCurrentUser(): User | null {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            if (parsedUserInfo.DT) {
                const userData = parsedUserInfo.DT;
                return {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    user_image: null, // Django doesn't include this
                    is_online: true,
                    last_seen: new Date().toISOString()
                };
            }
        }
        return null;
    }
}; 