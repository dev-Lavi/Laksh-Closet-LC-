import React, { useState } from 'react';
import axios from 'axios';
import './OtpModal.css';
import { toast } from 'react-toastify';

const OtpVerificationModal = ({ isOpen, onClose, email, orderId }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      return toast.error("Enter a valid 6-digit OTP");
    }

    setLoading(true);
    try {
      // Step 1: Verify OTP
      const res = await axios.post(
        `${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/checkout/verify-otp`,
        { email, otp, orderId }
      );
      toast.success(res.data.message);

      // Step 2: Initiate Cashfree Payment
      const payRes = await axios.post(
        `${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/payment/initiate`,
        { orderId }
      );

      const sessionId = payRes.data.payment_session_id;
      console.log('Received session ID:', sessionId);

      // Step 3: Redirect to Cashfree Hosted Checkout using SDK
      const cashfree = window.Cashfree({ mode: import.meta.env.MODE === 'production' ? 'production' : 'sandbox' });

      cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_self", // You can also use "_blank", "_modal", or a DOM element
      });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Something went wrong');
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
          onChange={(e) => {
            const numericOtp = e.target.value.replace(/\D/g, '');
            setOtp(numericOtp);
          }}
          className="otp-input"
          placeholder="Enter OTP"
          disabled={loading}
        />

        <div className="otp-buttons">
          <button onClick={onClose} className="btn-cancel" disabled={loading}>
            Cancel
          </button>
          <button onClick={handleVerify} className="btn-verify" disabled={loading || otp.length !== 6}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
