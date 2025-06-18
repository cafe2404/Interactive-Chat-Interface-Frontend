/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { IoIosSearch } from "react-icons/io";
import { VscLayoutSidebarRight } from "react-icons/vsc";
import { FiPhoneCall } from "react-icons/fi";
import { FaRegFaceSmileWink } from "react-icons/fa6";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa";
import { HiMiniPaintBrush } from "react-icons/hi2";
import { User, Message } from '../types/chat';
import { chatService } from '../services/chatService';
import userAvatar from '../assets/user.png';
import './ChatDetail.css';

interface ChatDetailProps {
    selectedUser: User | null;
    onBackToChatList: () => void;
}

const ChatDetail: React.FC<ChatDetailProps> = ({ selectedUser, onBackToChatList }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showSidebarRight, setShowSidebarRight] = useState(false);
    const [isSidebarHiding, setIsSidebarHiding] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    
    const contentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentUserData = chatService.getCurrentUser();
        setCurrentUser(currentUserData);
    }, []);

    useEffect(() => {
        if (selectedUser && currentUser) {
            loadChatHistory();
        }
    }, [selectedUser, currentUser]);

    useEffect(() => {
        // Auto scroll to bottom when new messages arrive
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [messages]);

    const loadChatHistory = async () => {
        if (!selectedUser || !currentUser) return;
        
        try {
            setLoading(true);
            const chatData = await chatService.getChatHistory(currentUser.id, selectedUser.id);
            setMessages(chatData.messages || []);
        } catch (error) {
            console.error('Error loading chat history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!selectedUser || !currentUser || !newMessage.trim()) return;

        const messageData = {
            receiver_id: selectedUser.id,
            content: newMessage.trim(),
            message_type: 'text' as const
        };

        try {
            const sentMessage = await chatService.sendMessage(messageData);
            setMessages(prev => [...prev, sentMessage]);
            setNewMessage('');
            
            if (messageRef.current) {
                messageRef.current.innerHTML = '';
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            document.execCommand('bold', false);
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedUser || !currentUser) return;

        try {
            // For now, we'll just send a text message about the file
            // In a real implementation, you'd upload the file first
            const messageData = {
                receiver_id: selectedUser.id,
                content: `File uploaded: ${file.name}`,
                message_type: 'file' as const
            };

            const sentMessage = await chatService.sendMessage(messageData);
            setMessages(prev => [...prev, sentMessage]);
            
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleAttachmentClick = () => {
        fileInputRef.current?.click();
    };

    const handleSearchClick = () => {
        if (showSearch) {
            setIsClosing(true);
            setTimeout(() => {
                setShowSearch(false);
                setIsClosing(false);
            }, 300);
        } else {
            setShowSearch(true);
        }
    };

    const handleSidebarToggle = () => {
        if (showSidebarRight) {
            setIsSidebarHiding(true);
            setTimeout(() => {
                setShowSidebarRight(false);
                setIsSidebarHiding(false);
            }, 300);
        } else {
            setShowSidebarRight(true);
        }
    };

    const formatMessageTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatMessageDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    const getDefaultAvatar = (user: User) => {
        return user.user_image ? `http://localhost:8000${user.user_image}` : userAvatar;
    };

    const isMyMessage = (message: Message) => {
        return message.sender_id === currentUser?.id;
    };

    if (!selectedUser) {
        return (
            <div className="chat-detail no-selection">
                <div className="no-chat-selected">
                    <h3>Select a user to start chatting</h3>
                    <p>Choose someone from the list to begin a conversation</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-detail" style={{ width: showSidebarRight ? '51%' : '73%' }}>
            <div className='header'>
                <div className="imgText">
                    <div className="userimg">
                        <img src={getDefaultAvatar(selectedUser)} className='cover' alt={selectedUser.name} />
                        {selectedUser.is_online && <div className="online-indicator"></div>}
                    </div>
                    <h4>
                        {selectedUser.name}
                        <br/>
                        <span>{selectedUser.is_online ? 'online' : 'offline'}</span>
                    </h4>
                </div>
                <ul className='nav-icons'>
                    <li onClick={handleSearchClick}><IoIosSearch /></li>
                    <li><FiPhoneCall /></li>                        
                    <li onClick={handleSidebarToggle}><VscLayoutSidebarRight /></li>
                </ul>
            </div>

            {showSearch && (
                <div className={`search-popup ${isClosing ? 'closing' : ''}`} ref={searchRef}>
                    <div className="search-box">
                        <input type="text" placeholder="Search texts of the message" />
                        <IoIosSearch className="search-icon" />
                    </div>
                </div>
            )}

            <div className="content" ref={contentRef}>
                {loading ? (
                    <div className="loading-messages">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => {
                            const showDate = index === 0 || 
                                formatMessageDate(message.timestamp) !== 
                                formatMessageDate(messages[index - 1].timestamp);
                            
                            return (
                                <React.Fragment key={message.id}>
                                    {showDate && (
                                        <div className="time">
                                            <span>{formatMessageDate(message.timestamp)}</span>
                                            <br/>
                                        </div>
                                    )}
                                    <div className={`message ${isMyMessage(message) ? 'my_message' : 'friend_message'}`}>
                                        <p>
                                            {message.content}
                                            <br/>
                                            <span>{formatMessageTime(message.timestamp)}</span>
                                        </p>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </>
                )}
            </div>

            <div className='footer1'>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <IoDocumentAttachOutline onClick={handleAttachmentClick} />
                <FaBold />
                <FaItalic />
                <FaUnderline />
                <HiMiniPaintBrush />
            </div>
            
            <div className='footer2'>
                <FaRegFaceSmileWink />
                <div
                    ref={messageRef}
                    contentEditable
                    className="message-input"
                    onKeyDown={handleKeyDown}
                    data-placeholder="Type a message"
                    onInput={(e) => setNewMessage(e.currentTarget.innerText)}
                />
                <MdOutlineRocketLaunch onClick={handleSendMessage} />
            </div>

            {showSidebarRight && (
                <div className={`sidebar-right ${isSidebarHiding ? 'hiding' : ''}`}>
                    <div className='header'>Chat Info</div>
                    <div className='footer'>
                        <div className="user-info">
                            <img src={getDefaultAvatar(selectedUser)} alt={selectedUser.name} />
                            <h4>{selectedUser.name}</h4>
                            <p>{selectedUser.email}</p>
                            <p>Status: {selectedUser.is_online ? 'Online' : 'Offline'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatDetail; 