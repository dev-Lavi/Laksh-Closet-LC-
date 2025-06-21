import React, { useState } from 'react';
import addtocartheart from '../assets/heart.svg';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
  const availableSizes = product.availableSizes || [];
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart, toggleFavourite, favourites } = useCart();
  const isFavourited = favourites.some(item => item._id === product._id);
  const navigate = useNavigate();

  const handleSizeSelect = (size) => {
    if (availableSizes.includes(size)) {
      setSelectedSize(size);
      setAddedToCart(false);
    }
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart({ ...product, selectedSize, quantity: 1 }); // ✅ quantity added
      setAddedToCart(true);
    }
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  return (
    <div className="product-card">
      {/* Wishlist Button */}
      <button
        onClick={() => toggleFavourite(product)}
        className="wishlist-btn"
        title={isFavourited ? "Remove from Favourites" : "Add to Favourites"}
      >
        <img
          src={addtocartheart}
          alt="wishlist"
          className={isFavourited ? "favourited" : ""}
        />
      </button>

      {/* Product Image */}
      <div className="product-card-image-wrap">
        <img
          src={product.image || product.gallery?.[0]} // ✅ fallback to gallery
          alt={product.name}
          className="product-card-image"
        />
      </div>

      {/* Title */}
      <h2 className="product-card-title">{product.name}</h2>

      {/* Sizes */}
      <div className="product-card-sizes-row">
        {product.sizes.map((size, idx) => {
          const isAvailable = availableSizes.includes(size);
          const isSelected = size === selectedSize;

          return (
            <button
              key={idx}
              disabled={!isAvailable}
              onClick={() => handleSizeSelect(size)}
              className={`product-card-size-btn ${isSelected ? 'selected' : ''}`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="product-card-divider" />

      {/* Price and Add to Cart */}
      <div className="product-card-price-row">
        <div className="product-card-price-group">
          <span className="product-card-price">₹{product.price}.00</span>
          <span className="product-card-original-price">₹{product.originalPrice}.00 MRP</span>
        </div>
        <span className="product-card-vertical-divider"></span>
        {!selectedSize ? (
          <button
            className="product-card-add-btn select-size-btn"
            onClick={() => navigate(`/product/${product._id}`)} // ✅ use _id
            type="button"
          >
            Select Size
          </button>
        ) : addedToCart ? (
          <button
            className="product-card-add-btn view-cart-btn"
            onClick={handleViewCart}
            type="button"
          >
            View Cart
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="product-card-add-btn"
            type="button"
          >
            Add to Cart
          </button>
        )}
      </div>

      {/* Bottom Divider */}
      <div className="product-card-divider" />
    </div>
  );
}

export default ProductCard;
