import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import { GiNothingToSay } from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import { User } from '../types/chat';
import { chatService } from '../services/chatService';
import userAvatar from '../assets/user.png';
import './ChatList.css';

interface ChatListProps {
    onUserSelect: (user: User) => void;
    selectedUserId?: number;
}

const ChatList: React.FC<ChatListProps> = ({ onUserSelect, selectedUserId }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const currentUserData = chatService.getCurrentUser();
                if (!currentUserData) {
                    setError('User not authenticated');
                    setLoading(false);
                    return;
                }
                
                setCurrentUser(currentUserData);
                
                const usersData = await chatService.getUsers();
                console.log('Fetched users:', usersData);
                
                // Filter out current user from the list
                const otherUsers = usersData.filter(user => user.id !== currentUserData.id);
                setUsers(otherUsers);
                setFilteredUsers(otherUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to load users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

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

    const handleUserClick = (user: User) => {
        onUserSelect(user);
        navigate(`/chat/${user.id}`);
    };

    const formatLastSeen = (lastSeen?: string) => {
        if (!lastSeen) return '';
        
        const lastSeenDate = new Date(lastSeen);
        const now = new Date();
        const diffInHours = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return lastSeenDate.toLocaleDateString();
    };

    const getDefaultAvatar = (user: User) => {
        return user.user_image ? `http://localhost:8000${user.user_image}` : userAvatar;
    };

    if (loading) {
        return (
            <div className="chat-list">
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
                            <input type="text" placeholder='Search or start new chat' disabled />
                            <IoIosSearch />
                        </div>
                    </div>
                    <div className='footer'>
                        <div className="loading-message">Loading users...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chat-list">
                <div className="nav-tab">
                    <div className="imgbx">
                        <img src={userAvatar} className='cover' />
                    </div>
                    <div className="icons">
                        <GiNothingToSay />
                        <HiUserGroup />
                    </div>
                </div>
                <div className='nav-tab1'>
                    <div className='header'>
                        <div className='search-chat'>
                            <input type="text" placeholder='Search or start new chat' disabled />
                            <IoIosSearch />
                        </div>
                    </div>
                    <div className='footer'>
                        <div className="error-message">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-list">
            <div className="nav-tab">
                <div className="imgbx">
                    <img 
                        src={currentUser?.user_image ? `http://localhost:8000${currentUser.user_image}` : userAvatar} 
                        className='cover' 
                        alt={currentUser?.name || 'User'}
                    />
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
                    {filteredUsers.length === 0 ? (
                        <div className="no-users">
                            {searchTerm ? 'No users found' : 'No users available'}
                        </div>
                    ) : (
                        filteredUsers.map((user) => (
                            <div 
                                key={user.id} 
                                className={`block ${selectedUserId === user.id ? 'selected' : ''}`}
                                onClick={() => handleUserClick(user)}
                            >
                                <div className="imgbx">
                                    <img src={getDefaultAvatar(user)} className='cover' alt={user.name} />
                                    {user.is_online && <div className="online-indicator"></div>}
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
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatList; 