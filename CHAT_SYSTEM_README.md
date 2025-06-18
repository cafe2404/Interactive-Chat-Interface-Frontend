# Chat System Implementation

## Overview
This implementation creates a comprehensive chat system that connects to your Django backend with the following features:

- **User List**: Display all available users for chat
- **Individual Chat Conversations**: Create separate chat rooms for each user pair
- **Real-time Messaging**: Send and receive messages with proper API integration
- **Chat History**: Load and display message history from the backend
- **User Status**: Show online/offline status and last seen information
- **File Upload Support**: Basic file attachment functionality
- **Search Functionality**: Search through users and messages

## Backend API Integration

The system connects to your Django backend using these endpoints:

### User Management
- `GET /api/users/` - Get all users
- `GET /api/users/login` - User authentication

### Chat Operations
- `GET /api/chat-history?user1={id}&user2={id}` - Get chat history between two users
- `POST /api/chat` - Send a new message
- `PUT /api/chat/update` - Update a message
- `DELETE /api/chat/delete?message_id={id}` - Delete a message
- `PUT /api/chat/mark-read/{conversation_id}` - Mark messages as read

## File Structure

```
src/
├── components/
│   ├── ChatList.tsx          # User list component
│   ├── ChatList.css          # Styles for user list
│   ├── ChatDetail.tsx        # Individual chat conversation
│   └── ChatDetail.css        # Styles for chat detail
├── pages/
│   ├── ChatMain.tsx          # Main chat container
│   ├── ChatMain.css          # Main chat styles
│   └── chat.tsx              # Original chat (legacy)
├── services/
│   └── chatService.ts        # API service for chat operations
├── types/
│   └── chat.ts               # TypeScript interfaces
└── routes/
    └── index.tsx             # Updated routing with chat detail routes
```

## Key Features

### 1. User List (ChatList Component)
- Displays all available users except the current user
- Shows user avatars, names, and online status
- Search functionality to filter users
- Click to start a conversation

### 2. Chat Detail (ChatDetail Component)
- Individual chat interface for each user conversation
- Loads chat history from the backend
- Real-time message sending
- File attachment support
- Message timestamps and date grouping
- User information sidebar

### 3. Routing
- `/chat` - Main chat interface with user list
- `/chat/:userId` - Individual chat conversation with specific user

### 4. Authentication
- Automatic token handling from localStorage
- Redirect to login if not authenticated
- User session management

## Usage

1. **Login**: Users must log in first to access the chat system
2. **User Selection**: Click on any user from the left sidebar to start a conversation
3. **Messaging**: Type messages in the input field and press Enter or click the send button
4. **File Upload**: Click the attachment icon to upload files
5. **Search**: Use the search bar to find specific users or messages

## API Response Format

### User Object
```typescript
interface User {
    id: number;
    name: string;
    email: string;
    user_image: string | null;
    is_online?: boolean;
    last_seen?: string;
}
```

### Message Object
```typescript
interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    timestamp: string;
    is_read: boolean;
    message_type: 'text' | 'file' | 'image';
    file_url?: string;
}
```

### Chat History Response
```typescript
interface ChatDetail {
    conversation_id: number;
    messages: Message[];
    participants: User[];
}
```

## Styling

The chat system uses a modern, glassmorphism design with:
- Blur effects and transparency
- Green accent colors (#00ff1f)
- Responsive layout
- Smooth animations and transitions
- Custom scrollbars
- Online status indicators

## Future Enhancements

1. **WebSocket Integration**: Real-time message updates
2. **Message Status**: Read receipts and delivery status
3. **Group Chats**: Support for group conversations
4. **Media Preview**: Image and video previews
5. **Message Reactions**: Emoji reactions to messages
6. **Voice Messages**: Audio message support
7. **Typing Indicators**: Show when users are typing

## Backend Requirements

Ensure your Django backend implements these endpoints with proper authentication:

1. **User Authentication**: JWT token-based authentication
2. **CORS Configuration**: Allow frontend domain
3. **Message Storage**: Database models for messages and conversations
4. **File Upload**: Handle file uploads and storage
5. **User Status**: Track online/offline status

The system is designed to work seamlessly with your existing Django URL patterns and can be easily extended with additional features. 