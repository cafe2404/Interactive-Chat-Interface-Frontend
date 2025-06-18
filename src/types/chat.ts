export interface User {
    id: number;
    name: string;
    email: string;
    user_image: string | null;
    is_online?: boolean;
    last_seen?: string;
}

export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    timestamp: string;
    is_read: boolean;
    message_type: 'text' | 'file' | 'image';
    file_url?: string;
}

export interface ChatConversation {
    id: number;
    participant1_id: number;
    participant2_id: number;
    last_message?: Message;
    unread_count: number;
    updated_at: string;
}

export interface ChatDetail {
    conversation_id: number;
    messages: Message[];
    participants: User[];
}

export interface SendMessageRequest {
    receiver_id: number;
    content: string;
    message_type?: 'text' | 'file' | 'image';
    file_url?: string;
} 