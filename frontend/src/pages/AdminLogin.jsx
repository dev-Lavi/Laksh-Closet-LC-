import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminLogin.css';
import fingerprint from '../assets/fingerprint.svg';
import Header from '../components/header';
import Footer from '../components/footer';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('https://laksh-closet.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Invalid credentials');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      setTimeout(() => navigate('/admin/add-product'), 1000);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-bg">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="admin-login-container">
          <div className="text-center mb-4">
            <h2 className="admin-login-title">Admin login</h2>
             <img src={fingerprint} alt="Fingerprint Icon" className="admin-fingerprint" />
            <div className="admin-login-welcome">Welcome</div>
          </div>
          <form onSubmit={handleLogin} className="admin-login-form">
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer position="bottom-center" />
    </div>
  );
}

export default AdminLogin;
