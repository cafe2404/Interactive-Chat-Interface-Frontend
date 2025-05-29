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
    // const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);

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
            
            // setMessage('');
            if (messageRef.current) {
                messageRef.current.innerHTML = '';
            }
            
            // Scroll to bottom after sending message
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
            // Create a new message with the file
            const newMessage = {
                text: `Đã tải lên file: ${file.name}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMyMessage: true
            };
            setMessages([...messages, newMessage]);
            
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Scroll to bottom after uploading file
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
            <img src="/bg1.jpg" alt="Background Image" className="background" />
            <div className="container">
                <div className="sidebar-left">
                    <div className="nav-tab">
                        <div className="imgbx">
                            <img src="/user.png" className='cover' />
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
                                    <img src="/img1.png" className='cover' />
                                </div>
                                <div className='details'>
                                    <div className='listHead'>
                                        <h4>Tony Lee</h4>
                                        <p className='time'>yesterday</p>
                                    </div>
                                    <div className='message_p'>
                                        <p>How to make Interactive Chat Interface using Python and TypeScript</p>
                                    </div>
                                </div>
                            </div>

                            <div className='block'>
                                <div className="imgbx">
                                    <img src="/img2.png" className='cover' />
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

                            <div className='block'>
                                <div className="imgbx">
                                    <img src="/img1.png" className='cover' />
                                </div>
                                <div className='details'>
                                    <div className='listHead'>
                                        <h4>Tony Lee</h4>
                                        <p className='time'>yesterday</p>
                                    </div>
                                    <div className='message_p'>
                                        <p>How to make Interactive Chat Interface using Python and TypeScript</p>
                                        <b>1</b>
                                    </div>
                                </div>
                            </div>

                            <div className='block'>
                                <div className="imgbx">
                                    <img src="/img2.png" className='cover' />
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
                            
                            <div className='block'>
                                <div className="imgbx">
                                    <img src="/img1.png" className='cover' />
                                </div>
                                <div className='details'>
                                    <div className='listHead'>
                                        <h4>Tony Lee</h4>
                                        <p className='time'>yesterday</p>
                                    </div>
                                    <div className='message_p'>
                                        <p>How to make Interactive Chat Interface using Python and TypeScript</p>
                                    </div>
                                </div>
                            </div>

                            <div className='block'>
                                <div className="imgbx">
                                    <img src="/img2.png" className='cover' />
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
                            
                            <div className='block'>
                                <div className="imgbx">
                                    <img src="/img1.png" className='cover' />
                                </div>
                                <div className='details'>
                                    <div className='listHead'>
                                        <h4>Tony Lee</h4>
                                        <p className='time'>yesterday</p>
                                    </div>
                                    <div className='message_p'>
                                        <p>How to make Interactive Chat Interface using Python and TypeScript</p>
                                    </div>
                                </div>
                            </div>

                            <div className='block'>
                                <div className="imgbx">
                                    <img src="/img2.png" className='cover' />
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

                            <div className='block'>
                                <div className="imgbx">
                                    <img src="/img1.png" className='cover' />
                                </div>
                                <div className='details'>
                                    <div className='listHead'>
                                        <h4>Tony Lee</h4>
                                        <p className='time'>yesterday</p>
                                    </div>
                                    <div className='message_p'>
                                        <p>How to make Interactive Chat Interface using Python and TypeScript</p>
                                    </div>
                                </div>
                            </div>

                            <div className='block'>
                                <div className="imgbx">
                                    <img src="/img2.png" className='cover' />
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
                                <img src="/img2.png" className="cover" />
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

                        <div className="message friend_message">
                            <p>
                                Trước anh đi làm có MST cá nhân chưa ạ?
                                <br/>
                                <span>09:02</span>
                            </p>
                        </div>

                        <div className="message my_message">
                            <p>
                                Anh có MST thuế. <br/>
                                Nhưng để ở nhà, nên giờ không nhớ.
                                <br/>
                                <span>09:03</span>
                            </p>
                        </div>

                        <div className="message friend_message">
                            <p>
                                dạ tối anh xem lại giúp em nhé
                                <br/>
                                <span>09:04</span>
                            </p>
                        </div>

                        <div className="message my_message">
                            <p>
                                Ok em nhé.
                                <br/>
                                <span>09:05</span>
                            </p>
                        </div>

                        <div className="time">
                            <span>9:48 16/05/2024</span>
                            <br/>
                        </div>
                        <div className="message friend_message">
                            <p>
                                Em gởi mail rồi anh nhé
                                <br/>
                                <span>09:48</span>
                            </p>
                        </div>

                        <div className="time">
                            <span>13:41 16/05/2024</span>
                            <br/>
                        </div>
                        <div className="message my_message">
                            <p>
                                em nên kết bạn với số này đi <br/>
                                0777598007
                                <br/>
                                <span>13:41</span>
                            </p>
                        </div>

                        <div className="time">
                            <span>11:19 02/08/2024</span>
                            <br/>
                        </div>
                        <div className="message my_message">
                            <p>
                                Có gì mình nhắn qua chỗ này đi.
                                <br/>
                                <span>11:19</span>
                            </p>
                        </div>

                        <div className="message friend_message">
                            <p>
                                zalo cá nhân của anh
                                <br/>
                                <span>11:19</span>
                            </p>
                        </div>

                        <div className="message my_message">
                            <p>
                                Công việc thì nhắn qua bên kia.
                                <br/>
                                <span>11:19</span>
                            </p>
                        </div>

                        <div className="message friend_message">
                            <p>
                                ủa vậy luôn
                                <br/>
                                <span>11:20</span>
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


