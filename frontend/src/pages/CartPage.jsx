import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import razorpayImg from '../assets/razorpay.svg'; // Adjust the path as necessary
import { FaTrashAlt } from 'react-icons/fa';

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount } = useCart();
  const navigate = useNavigate();
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = cartCount > 0 ? 0 : 0;
  const total = subtotal + shipping;

  return (
    <div className="cart-page-container">
      <div className="cart-content">
        <div className="cart-items-section">
          <div className="cart-table-header">
            <span>Products</span>
            <span></span> {/* For the remove/trash icon column */}
          </div>
          {cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <img
  src={item.image || item.gallery?.[0] || '/fallback-image.jpg'}
  alt={item.name}
  className="cart-item-image"
/>
              <div className="cart-item-details">
                <div className="cart-product-details">
                  <span className="cart-product-title">
                    {item.name}
                    {item.selectedSize && (
                      <span className="cart-product-size"> &nbsp;|&nbsp; Size: {item.selectedSize} </span>
                    )}
                  </span>
                  <span className="cart-product-price">| ₹{item.price}.00</span>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div className="cart-item-subtotal">
                ₹{item.price * item.quantity}.00
                <button onClick={() => removeFromCart(item._id, item.selectedSize)}>
                  <FaTrashAlt className="delete-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">CART TOTALS</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}.00</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>₹{shipping}.00</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total}.00</span>
          </div>

          <div className="payment-option">
            <input type="radio" id="onlinePayment" name="payment" defaultChecked />
            <label htmlFor="onlinePayment">Pay online via UPI, wallet, card etc.</label>
            <img
              src={razorpayImg}
              alt="Payment options"
              className="payment-methods-img"
            />
          </div>

<button
  className="checkout-btn"
  onClick={() => navigate('/checkout')}
  disabled={cartItems.length === 0}
>
  Proceed to Checkout
</button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
