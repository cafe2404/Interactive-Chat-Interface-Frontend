import { useState } from 'react';
import { register } from '../services/auth';
import './RegisterForm.css'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { IoMailSharp } from "react-icons/io5";
import backgroundImage from '../assets/bg2.jpg';

const RegisterForm = () => {
    const [company_name, setCompany_name] = useState('');
    const [your_name, setYour_name] = useState('');
    const [gender, setGender] = useState('');
    const [your_phone, setYour_phone] = useState('');
    const [company_tax, setCompany_tax] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const data = await register(company_name, your_name, 
            gender, your_phone, company_tax, email, password);
          toast.success(data.EM)
          console.log(data)

          // Nếu đăng nhập thành công thì chuyển hướng
          if (data && data.EC === 0) {  // Giả sử EC = 0 là thành công
            // Chờ 5.8 giây rồi mới chuyển trang
            setTimeout(() => {
              navigate('/');
            }, 5800); // 6000 ms = 5.8 giây
          }
        } 
        catch (err: any) {
          toast.error(err.message)
        }
    };

    return (
        <section>
            {/* <img src="/bg2.jpg" alt="Background Image" className="background-img" /> */}
            <img src={backgroundImage} alt="Background Image" className="background-img" />
            <div className="register-box">
                <form onSubmit={handleSubmit}>
                    <h2>Register</h2>
                    <div className="form-container">
                        <div className="column">
                            <div className="input-box">
                                <input
                                    type="text"
                                    value={company_name}
                                    onChange={(e) => setCompany_name(e.target.value)}
                                    required
                                />
                                <label>Company Name</label>
                            </div>

                            <div className="input-box">
                                <input
                                    type="text"
                                    value={your_name}
                                    onChange={(e) => setYour_name(e.target.value)}
                                    required
                                />
                                <label>Your Name</label>
                            </div>

                            <div className="input-box">
                                <select
                                    className="form-select"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                >
                                        <option value="male" className='option'>Male</option>
                                        <option value="female" className='option'>Female</option>
                                </select>
                                <label className="form-label">Gender</label>                               
                            </div>

                            <div className="input-box">
                                <input
                                    type="text"
                                    value={your_phone}
                                    onChange={(e) => setYour_phone(e.target.value)}
                                    required
                                />
                                <label>Your Phone</label>
                            </div>
                        </div>

                        <div className="column">
                            <div className="input-box">
                                <input
                                    type="text"
                                    value={company_tax}
                                    onChange={(e) => setCompany_tax(e.target.value)}
                                    required
                                />
                                <label>Company Tax</label>
                            </div>

                            <div className="input-box">
                                <span className="icon">
                                    <IoMailSharp className="mail" />
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label>Your Email</label>
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
                                    isShowPassword ? (
                                        <span className='icon'
                                            onClick={() => setIsShowPassword(false)}>
                                            <AiFillEyeInvisible/>
                                        </span>
                                    ):(
                                        <span className='icon'
                                            onClick={() => setIsShowPassword(true)}>
                                            <AiFillEye/>
                                        </span>
                                    )
                                }
                            </div>
                        </div>
                    </div>                                    
                    <button type='submit'>Register</button>
                </form>
            </div>
        </section>
    );
};

export default RegisterForm;


