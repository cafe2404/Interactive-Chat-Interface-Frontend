import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import Chat from '../pages/chat';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/chat" element={<Chat/>}/>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;

