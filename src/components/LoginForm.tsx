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
          toast.success(data.EM)
          console.log(data)

          // Nếu đăng nhập thành công thì chuyển hướng
          if (data && data.EC === 0) {  // Giả sử EC = 0 là thành công
            // Chờ 5.8 giây rồi mới chuyển trang
            setTimeout(() => {
              navigate('/chat');
            }, 5800); // 6000 ms = 5.8 giây
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

