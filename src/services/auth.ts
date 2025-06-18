/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users/login';

export const login = async (email_or_phone: string, password: string) => {
  try {
    const { data } = await axios.post(API_URL, { 
      email: email_or_phone, 
      password 
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.EM || 'Không thể kết nối đến máy chủ');
  }
};

const API_REGISTER = 'http://localhost:8000/api/users/register';

export const register = async (
  company_name: string, 
  your_name: string, 
  gender: string,
  your_phone: string,
  company_tax: string,
  email: string, 
  password: string
) => {
  try {
    const { data } = await axios.post(API_REGISTER, {company_name, your_name, gender, 
      your_phone, company_tax, email, password });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.EM || 'Không thể kết nối đến máy chủ');
  }
};

