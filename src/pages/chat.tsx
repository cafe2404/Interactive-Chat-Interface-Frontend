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
import lythanhdatAvatar from '../assets/img1.png'
import ngocTranAvatar from '../assets/img2.png'
import userAvatar from '../assets/user.png'
import axios from 'axios';

interface User {
    id: number;
    name: string;
    email: string;
    user_image: string | null;
}

interface Message {
    text: string;
    time: string;
    isMyMessage: boolean;
}


const Chat = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showSidebarRight, setShowSidebarRight] = useState(false);
    const [isSidebarHiding, setIsSidebarHiding] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);
    const hasLoggedRef = useRef(false)
    const hasFetchedUsersRef = useRef(false)

    useEffect(() => {
        // Fetch all users only once
        const fetchUsers = async () => {
            if (!hasFetchedUsersRef.current) {
                try {
                    const response = await axios.get('http://localhost:8000/api/users/');
                    console.log('All Users Information:', response.data);
                    hasFetchedUsersRef.current = true;
                } catch (error) {
                    console.error('Error fetching users:', error);
                    hasFetchedUsersRef.current = true;
                }
            }
        };

        fetchUsers();

        if (!hasLoggedRef.current) {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const parsedUserInfo = JSON.parse(userInfo);
                console.log('Current Logged-in User Information:', parsedUserInfo);
                // Lấy thông tin user trực tiếp từ response của API login
                if (parsedUserInfo.DT) {
                    const userData = parsedUserInfo.DT;
                    console.log('User Data from DT:', userData);
                    console.log('User Image Path:', userData.user_image);
                    
                    setCurrentUser({
                        id: userData.id,
                        name: userData.name,
                        email: userData.email,
                        user_image: userData.user_image || null
                    });
                }
                hasLoggedRef.current = true;
            }
        }
    }, []);

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

    const handleSendMessage = () => {
        if (messageRef.current?.innerText.trim()) {
            const newMessage = {
                text: messageRef.current.innerHTML,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMyMessage: true
            };
            setMessages([...messages, newMessage]);
            
            if (messageRef.current) {
                messageRef.current.innerHTML = '';
            }
            
            setTimeout(() => {
                if (contentRef.current) {
                    contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }
            }, 100);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const newMessage = {
                text: `Đã tải lên file: ${file.name}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMyMessage: true
            };
            setMessages([...messages, newMessage]);
            
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            setTimeout(() => {
                if (contentRef.current) {
                    contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }
            }, 100);
        }
    };

    const handleAttachmentClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <section>
            <img src={backgroundImage} alt="Background Image" className="background" />
            <div className="container">
                <div className="sidebar-left">
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
                                <input type="text" placeholder='Search or start new chat'/>
                                <IoIosSearch />
                            </div>
                        </div>
                        <div className='footer'>
                            <div className='block'>
                                <div className="imgbx">
                                    <img src={lythanhdatAvatar} className='cover' />
                                </div>
                                <div className='details'>
                                    <div className='listHead'>
                                        <h4>Lý Thành Đạt</h4>
                                        <p className='time'>yesterday</p>
                                    </div>
                                    <div className='message_p'>
                                        <p>How to make Interactive Chat Interface using Python and TypeScript</p>
                                    </div>
                                </div>
                            </div>

                            <div className='block'>
                                <div className="imgbx">
                                    <img src={ngocTranAvatar} className='cover' />
                                </div>
                                <div className='details'>
                                    <div className='listHead'>
                                        <h4>Ngọc Trân</h4>
                                        <p className='time'>yesterday</p>
                                    </div>
                                    <div className='message_p'>
                                        <p>How to make Interactive Chat Interface using Python and TypeScript</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chat" style={{ width: showSidebarRight ? '51%' : '73%' }}>
                    <div className='header'>
                        <div className="imgText">
                            <div className="userimg">
                                <img src={ngocTranAvatar} className='cover' />
                            </div>
                            <h4>Ngọc Trân<br/><span>online</span></h4>
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
                        <div className="time">
                            <span>8:46 13/05/2024</span>
                            <br/>
                        </div>
                        <div className="message friend_message">
                            <p>
                                Hi, anh. <br/>Anh giúp em ảnh CCCD 2 mặt và CV để em lưu hồ sơ nhé
                                <br/>
                                <span>08:47</span>
                            </p>
                        </div>

                        <div className="message my_message">
                            <p>
                                lythanhdat21@gmail.com
                                Cho anh gởi nhé.
                                <br/>
                                <span>09:01</span>
                            </p>
                        </div>

                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.isMyMessage ? 'my_message' : 'friend_message'}`}>
                                <p dangerouslySetInnerHTML={{ __html: msg.text }}>
                                </p>
                            </div>
                        ))}
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
                        <div className='header'>header</div>
                        <div className='footer'>footer</div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Chat;


