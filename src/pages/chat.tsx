import './chat.css'
import { IoIosSearch } from "react-icons/io";
import { GiNothingToSay } from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import { VscLayoutSidebarRight } from "react-icons/vsc";
import { FiPhoneCall } from "react-icons/fi";
import { useState, useRef, useEffect } from 'react';
import { FaRegFaceSmileWink } from "react-icons/fa6";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa";
import { HiMiniPaintBrush } from "react-icons/hi2";
import React from 'react';
import backgroundImage from '../assets/bg1.jpg'
import ngocTranAvatar from '../assets/img2.png'
import userAvatar from '../assets/user.png'
import axios from 'axios';

interface User {
    id: number;
    name: string;
    email: string;
    user_image?: string;
    is_online?: boolean;
    last_seen?: string;
}

interface Message {
    text: string;
    time: string;
    isMyMessage: boolean;
}

interface ChatHistoryResponse {
    id: number;
    from: string;
    to: string;
    message: string;
    sent_at: string;
    files: string[];
}

const Chat = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showSidebarRight, setShowSidebarRight] = useState(false);
    const [isSidebarHiding, setIsSidebarHiding] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    
    const searchRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);

    // Get auth token
    const getAuthToken = () => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            return parsedUserInfo.DT?.access_token;
        }
        return null;
    };

    // Create axios instance with auth
    const createAuthAxios = () => {
        const token = getAuthToken();
        return axios.create({
            baseURL: 'http://localhost:8000/api',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    };

    useEffect(() => {
        const initializeChat = async () => {
            try {
                setLoading(true);
                
                // Get current user from localStorage
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    const parsedUserInfo = JSON.parse(userInfo);
                    if (parsedUserInfo.DT) {
                        const userData = parsedUserInfo.DT;
                        const currentUserData: User = {
                            id: userData.id,
                            name: userData.name,
                            email: userData.email,
                            is_online: true
                        };
                        setCurrentUser(currentUserData);
                    }
                }

                // Fetch all users
                const authAxios = createAuthAxios();
                const response = await authAxios.get('/users/');
                const allUsers = response.data;
                
                // Filter out current user
                const otherUsers = allUsers.filter((user: User) => user.id !== currentUser?.id);
                setUsers(otherUsers);
                setFilteredUsers(otherUsers);
                
                // Set first user as selected by default
                if (otherUsers.length > 0) {
                    setSelectedUser(otherUsers[0]);
                    loadChatHistory(otherUsers[0].id);
                }
                
            } catch (error) {
                console.error('Error initializing chat:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeChat();
    }, []);

    // Load chat history
    const loadChatHistory = async (userId: number) => {
        if (!currentUser) return;
        
        try {
            const authAxios = createAuthAxios();
            const response = await authAxios.get(`/users/chat-history?sender_id=${currentUser.id}&receiver_id=${userId}`);
            const chatData = response.data;
            
            // Convert API messages to local format
            const convertedMessages: Message[] = chatData.DT?.map((msg: ChatHistoryResponse) => ({
                text: msg.message,
                time: new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMyMessage: msg.from === currentUser.name
            })) || [];
            
            setMessages(convertedMessages);
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    // Handle user selection
    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        loadChatHistory(user.id);
    };

    // Filter users based on search
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);

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

    const handleSendMessage = async () => {
        if (!messageRef.current?.innerText.trim() || !selectedUser || !currentUser) return;

        const messageContent = messageRef.current.innerText.trim();
        
        try {
            // Send message to API using FormData
            const authAxios = createAuthAxios();
            const formData = new FormData();
            formData.append('receiver_id', selectedUser.id.toString());
            formData.append('message', messageContent);
            
            await authAxios.post('/users/chat', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            // Add message to local state
            const newMessage: Message = {
                text: messageContent,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMyMessage: true
            };
            
            setMessages(prev => [...prev, newMessage]);
            
            if (messageRef.current) {
                messageRef.current.innerHTML = '';
            }
            
            setTimeout(() => {
                if (contentRef.current) {
                    contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }
            }, 100);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedUser || !currentUser) return;

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('receiver_id', selectedUser.id.toString());
            formData.append('message', `File uploaded: ${file.name}`);
            formData.append('files', file);
            
            const authAxios = createAuthAxios();
            await authAxios.post('/users/chat', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            const newMessage: Message = {
                text: `Đã tải lên file: ${file.name}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMyMessage: true
            };
            
            setMessages(prev => [...prev, newMessage]);
            
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            setTimeout(() => {
                if (contentRef.current) {
                    contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }
            }, 100);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleAttachmentClick = () => {
        fileInputRef.current?.click();
    };

    const getDefaultAvatar = (user: User) => {
        return user.user_image ? `http://localhost:8000${user.user_image}` : userAvatar;
    };

    const formatLastSeen = (lastSeen?: string) => {
        if (!lastSeen) return 'yesterday';
        
        const lastSeenDate = new Date(lastSeen);
        const now = new Date();
        const diffInHours = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return lastSeenDate.toLocaleDateString();
    };

    if (loading) {
        return (
            <section>
                <img src={backgroundImage} alt="Background Image" className="background" />
                <div className="container">
                    <div style={{ color: 'white', textAlign: 'center', fontSize: '1.2em' }}>
                        Loading chat...
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section>
            <img src={backgroundImage} alt="Background Image" className="background" />
            <div className="container">
                <div className="sidebar-left">
                    <div className="nav-tab">
                        <div className="imgbx">
                            <img src={currentUser?.user_image ? `http://localhost:8000${currentUser.user_image}` : userAvatar} className='cover' />
                        </div>
                        <div className="icons">
                            <GiNothingToSay />
                            <HiUserGroup />
                        </div>
                    </div>
                    <div className='nav-tab1'>
                        <div className='header'>
                            <div className='search-chat'>
                                <input 
                                    type="text" 
                                    placeholder='Search or start new chat'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <IoIosSearch />
                            </div>
                        </div>
                        <div className='footer'>
                            {filteredUsers.map((user) => (
                                <div 
                                    key={user.id} 
                                    className={`block ${selectedUser?.id === user.id ? 'selected' : ''}`}
                                    onClick={() => handleUserSelect(user)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="imgbx">
                                        <img src={getDefaultAvatar(user)} className='cover' />
                                        {user.is_online && <div style={{
                                            position: 'absolute',
                                            bottom: '2px',
                                            right: '2px',
                                            width: '12px',
                                            height: '12px',
                                            background: '#00ff1f',
                                            borderRadius: '50%',
                                            border: '2px solid rgba(255, 255, 255, 0.9)'
                                        }}></div>}
                                    </div>
                                    <div className='details'>
                                        <div className='listHead'>
                                            <h4>{user.name}</h4>
                                            <p className='time'>
                                                {user.is_online ? 'online' : formatLastSeen(user.last_seen)}
                                            </p>
                                        </div>
                                        <div className='message_p'>
                                            <p>{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="chat" style={{ width: showSidebarRight ? '51%' : '73%' }}>
                    <div className='header'>
                        <div className="imgText">
                            <div className="userimg">
                                <img src={selectedUser ? getDefaultAvatar(selectedUser) : ngocTranAvatar} className='cover' />
                                {selectedUser?.is_online && <div style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    right: '2px',
                                    width: '12px',
                                    height: '12px',
                                    background: '#00ff1f',
                                    borderRadius: '50%',
                                    border: '2px solid rgba(255, 255, 255, 0.9)'
                                }}></div>}
                            </div>
                            <h4>
                                {selectedUser ? selectedUser.name : 'Ngọc Trân'}
                                <br/>
                                <span>{selectedUser?.is_online ? 'online' : 'offline'}</span>
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
                        {messages.length === 0 ? (
                            <div className="time">
                                <span>No messages yet. Start the conversation!</span>
                                <br/>
                            </div>
                        ) : (
                            <>
                                <div className="time">
                                    <span>{new Date().toLocaleDateString()}</span>
                                    <br/>
                                </div>
                                {messages.map((msg, index) => (
                                    <div key={index} className={`message ${msg.isMyMessage ? 'my_message' : 'friend_message'}`}>
                                        <p dangerouslySetInnerHTML={{ __html: msg.text }}>
                                        </p>
                                        <time>{msg.time}</time>
                                    </div>
                                ))}
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
                        />
                        <MdOutlineRocketLaunch onClick={handleSendMessage} />
                    </div>
                </div>

                {showSidebarRight && (
                    <div className={`sidebar-right ${isSidebarHiding ? 'hiding' : ''}`}>
                        <div className='header'>Chat Info</div>
                        <div className='footer'>
                            {selectedUser && (
                                <div style={{ textAlign: 'center', color: 'white' }}>
                                    <img 
                                        src={getDefaultAvatar(selectedUser)} 
                                        alt={selectedUser.name}
                                        style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px' }}
                                    />
                                    <h4 style={{ color: '#00ff1f', marginBottom: '5px' }}>{selectedUser.name}</h4>
                                    <p style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '5px' }}>{selectedUser.email}</p>
                                    <p style={{ color: '#aaa', fontSize: '0.9em' }}>
                                        Status: {selectedUser.is_online ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Chat;


