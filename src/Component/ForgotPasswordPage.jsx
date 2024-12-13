import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      const response = await axios.post('http://192.168.0.115:4000/send-otp', { emailOrPhone });
      if (response.data.success) {
        setMessage('OTP sent successfully.');
        navigate('/reset-password', { state: { emailOrPhone } });
      } else {
        setMessage('Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Something went wrong. Please try again later.');
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: `url('/src/assets/image/loginbackground.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const cardStyle = {
    padding: '1rem',
    boxShadow: '10px 10px 10px rgba(255, 255, 255, 0.3)',
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.20)', // Adjusted opacity for the card background
    backdropFilter: 'blur(5px)', // Optional: adds a blur effect to the background behind the card
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 className="text-center mb-6">Forgot Password</h2>
        <div className="mb-3">
          <label htmlFor="emailOrPhone" className="form-label">Email or Phone</label>
          <input
            type="text"
            className="form-control"
            id="emailOrPhone"
            placeholder="Enter Email or Phone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" onClick={handleSendOTP}>Send OTP</button>
        {message && <p className="mt-3 text-center text-muted">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
