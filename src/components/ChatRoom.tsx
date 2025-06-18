import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { ChatSocket } from '../websocket/chatSocket';

export default function ChatRoom() {
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const socketRef = useRef<ChatSocket | null>(null);

  useEffect(() => {
    socketRef.current = new ChatSocket('ws://localhost:8000/ws/chat/room/', dispatch);
    socketRef.current.connect();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [dispatch]);

  const handleSend = () => {
    socketRef.current?.send({
      content: 'Hello from frontend',
      sender: 'user@example.com',
    });
  };

  return (
    <div>
      <button onClick={handleSend}>Send Test Message</button>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}><b>{msg.sender}</b>: {msg.content}</li>
        ))}
      </ul>
    </div>
  );
}


