import React, { useState } from 'react';
import axios from 'axios';
import './OtpModal.css'; // you can style this modal accordingly
import { toast } from 'react-toastify';

const OtpVerificationModal = ({ isOpen, onClose, email, orderId }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) return toast.error("Enter a valid 6-digit OTP");

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/checkout/verify-otp`,
        {
          email,
          otp,
          orderId,
        }
      );
      toast.success(res.data.message);
      onClose(); // close modal
      // Redirect or show confirmation here
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="otp-modal-overlay">
      <div className="otp-modal">
        <h2>Verify OTP</h2>
        <p>Enter the 6-digit OTP sent to <strong>{email}</strong></p>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="otp-input"
          placeholder="Enter OTP"
        />
        <div className="otp-buttons">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={handleVerify} className="btn-verify" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
