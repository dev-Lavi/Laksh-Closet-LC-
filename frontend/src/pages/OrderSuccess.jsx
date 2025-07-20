import React from 'react';
import { useNavigate } from 'react-router-dom';
import successTick from '../assets/success-Tick.svg';
import { useCart } from '../context/CartContext';
import './OrderSuccess.css';

const OrderSuccess = ({ orderId = '#e8e7rv' }) => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="order-success-root">
      <div className="order-success-card">
        <img src={successTick} alt="Success" className="order-success-icon" />

        <h1 className="order-success-title">
          Thank you for your purchase
        </h1>
        <p className="order-success-desc">
          We've received your order will ship in 5 - 7 business days.<br />
        </p>

        <div className="order-success-items-box">
          {cartItems.map((item, index) => (
            <div key={index} className="order-success-item">
              <div className="order-success-item-left">
                <img
  src={item.image || item.gallery?.[0] || '/fallback-image.jpg'}
  alt={item.name}
  className="w-16 h-16 object-cover rounded"
/>

                <div className="order-success-item-details">
                  <p className="order-success-item-name">{item.name}</p>
                  <p className="order-success-item-price">₹{item.price}.00</p>
                </div>
              </div>
              <p className="order-success-item-total">₹{item.price * item.quantity}.00</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
          className="order-success-back-btn"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
