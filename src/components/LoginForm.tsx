/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { login } from '../services/auth';
import { IoMailSharp } from "react-icons/io5";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import './LoginForm.css'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import backgroundImage from '../assets/bg.jpg';

const LoginForm = () => {
    const [email_or_phone, setEmail_or_phone] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const data = await login(email_or_phone, password);
          console.log('Login response:', data);

          // Nếu đăng nhập thành công thì chuyển hướng
          if (data && data.EC === 0) {  // EC = 0 là thành công
            toast.success(data.EM);
            
            // Store user info in localStorage for chat service
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            // Chờ 2 giây rồi chuyển trang (giảm từ 5.8 giây)
            setTimeout(() => {
              navigate('/chat');
            }, 2000);
          } else {
            toast.error(data.EM || 'Login failed');
          }
        } 
        catch (err: any) {
          toast.error(err.message)
        }
    };

    return (
        <section>
            {/* <img src="/bg.jpg" alt="Background Image" className="background-img" /> */}
            <img src={backgroundImage} alt="Background Image" className="background-img" />
            <div className="login-box">
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <div className="input-box">
                        <span className="icon">
                            <IoMailSharp className="mail" />
                        </span>
                        <input
                            type="text"
                            value={email_or_phone}
                            onChange={(e) => setEmail_or_phone(e.target.value)}
                            required
                        />
                        <label>Email or Phone</label>
                    </div>
                    <div className="input-box">
                        <input
                            type={isShowPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label>Password</label>
                        {
                            isShowPassword ?
                                <span className='icon'
                                    onClick={() => setIsShowPassword(false)}>
                                    <AiFillEyeInvisible/>
                                </span>
                                :
                                <span className='icon'
                                    onClick={() => setIsShowPassword(true)}>
                                    <AiFillEye/>
                                </span>
                        }
                    </div>
                    <button 
                        type='submit'
                    >Login
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </button>
                    <div className="register-link">
                        <p>Don't have an account? {" "}
                            <span onClick ={() => {navigate('/register')}}>
                                Register
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default LoginForm;

