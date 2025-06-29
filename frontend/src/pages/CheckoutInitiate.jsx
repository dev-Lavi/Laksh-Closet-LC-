import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import './CheckoutInitiate.css';
import razorpayImg from '../assets/razorpay.svg';

const CheckoutInitiate = () => {
  const { cartItems } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    address: '',
    pinCode: '',
    paymentMethod: '',
  });

  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const validate = () => {
    let temp = {};
    if (!formData.email.includes('@')) temp.email = 'Invalid email';
    if (!/^\d{10}$/.test(formData.phone)) temp.phone = 'Phone must be 10 digits';
    if (!formData.firstName) temp.firstName = 'First name is required';
    if (!formData.lastName) temp.lastName = 'Last name is required';
    if (!formData.city) temp.city = 'City is required';
    if (!formData.state) temp.state = 'State is required';
    if (!formData.address) temp.address = 'Address is required';
    if (!/^\d{6}$/.test(formData.pinCode)) temp.pinCode = 'PIN Code must be 6 digits';
    if (!formData.paymentMethod) temp.paymentMethod = 'Choose a payment method';
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    if (!agreed) return toast.error('Please accept the terms and conditions');
    if (cartItems.length === 0) return toast.error('Your cart is empty.');

    setLoading(true);
    try {
      const payload = {
        ...formData,
        cart: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/checkout/initiate`,
        payload
      );
      toast.success(res.data.message || 'Order initiated');
      // TODO: Redirect to OTP page/modal here with res.data.orderId
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-root">
      <form onSubmit={handleSubmit} className="checkout-form-main">
        {/* Left Column - Billing Details */}
        <div className="checkout-card">
          <h2 className="checkout-title">Billing Details</h2>
          <label className="checkout-label" htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            name="email"
            className={`checkout-input ${errors.email ? 'border-red-500' : ''}`}
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <div className="checkout-error">{errors.email}</div>}

          <label className="checkout-label" htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            className={`checkout-input ${errors.phone ? 'border-red-500' : ''}`}
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
          />
          {errors.phone && <div className="checkout-error">{errors.phone}</div>}

          <div className="checkout-input-row">
            <div style={{ flex: 1 }}>
              <label className="checkout-label" htmlFor="firstName">First name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                className={`checkout-input ${errors.firstName ? 'border-red-500' : ''}`}
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <div className="checkout-error">{errors.firstName}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <label className="checkout-label" htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                className={`checkout-input ${errors.lastName ? 'border-red-500' : ''}`}
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <div className="checkout-error">{errors.lastName}</div>}
            </div>
          </div>

          <label className="checkout-label" htmlFor="city">City / Town</label>
          <input
            id="city"
            type="text"
            name="city"
            className={`checkout-input ${errors.city ? 'border-red-500' : ''}`}
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <div className="checkout-error">{errors.city}</div>}

          <label className="checkout-label" htmlFor="state">State</label>
          <input
            id="state"
            type="text"
            name="state"
            className={`checkout-input ${errors.state ? 'border-red-500' : ''}`}
            value={formData.state}
            onChange={handleChange}
          />
          {errors.state && <div className="checkout-error">{errors.state}</div>}

          <label className="checkout-label" htmlFor="address">Street Address</label>
          <input
            id="address"
            type="text"
            name="address"
            className={`checkout-input ${errors.address ? 'border-red-500' : ''}`}
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <div className="checkout-error">{errors.address}</div>}

          <label className="checkout-label" htmlFor="pinCode">Pin Code</label>
          <input
            id="pinCode"
            type="tel"
            name="pinCode"
            className={`checkout-input ${errors.pinCode ? 'border-red-500' : ''}`}
            value={formData.pinCode}
            onChange={handleChange}
            maxLength={6}
          />
          {errors.pinCode && <div className="checkout-error">{errors.pinCode}</div>}
        </div>

        {/* Right Column - Order Summary */}
        <div className="checkout-card">
          <h2 className="checkout-title">Your Order</h2>
          <table className="checkout-summary-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.name} ×{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>₹{item.price * item.quantity}.00</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="checkout-summary-divider" />
          <div className="checkout-summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Subtotal</span>
            <span>₹{subtotal}.00</span>
          </div>
          <div className="checkout-summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Shipping</span>
            <span className="checkout-summary-shipping">Free shipping</span>
          </div>
          <div className="checkout-summary-row checkout-summary-total" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total</span>
            <span>₹{subtotal}.00</span>
          </div>
          <div className="checkout-summary-note">
            (includes ₹{Math.round(subtotal * 0.05)} Tax)
          </div>
          <div className="checkout-payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === 'cod'}
              onChange={handleChange}
              id="pay-cod"
            />
            <label htmlFor="pay-cod" style={{ margin: 0, fontWeight: 500 }}>
              Pay online via UPI, wallet, card etc.
            </label>
            <img src={razorpayImg} alt="Cashfree" style={{ height: 22, marginLeft: 8 }} />
          </div>
          <div className="checkout-terms">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              id="terms"
            />
            <label htmlFor="terms">
              I have read and agree to the website <a href="/terms" className="text-blue-600">terms and conditions</a> *.
            </label>
          </div>
          <button
            type="submit"
            className="checkout-pay-btn"
            disabled={!agreed || loading}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutInitiate;
