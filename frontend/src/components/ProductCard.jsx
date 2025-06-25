import React from 'react';
import addtocartheart from '../assets/heart.svg';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
  const { toggleFavourite, favourites } = useCart();
  const navigate = useNavigate();
  const isFavourited = favourites.some(item => item._id === product._id);
  const fallbackImage = '/fallback.jpg';

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
      <div
        className="product-card-image-wrap"
        onClick={() => navigate(`/products/${product._id}`)}
      >
        <img
          src={product.image || product.gallery?.[0] || fallbackImage}
          alt={product.name || "Product"}
          className="product-card-image"
        />
      </div>

      {/* Title */}
      <h2 className="product-card-title">{product.name || "Untitled"}</h2>


      {/* Price and Select Size */}
      <div className="product-card-price-row">
        <div className="product-card-price-group">
          <span className="product-card-price">
            ₹{product.price ? product.price + '.00' : 'N/A'}
          </span>
          {product.originalPrice && (
            <span className="product-card-original-price">
              ₹{product.originalPrice}.00 MRP
            </span>
          )}
        </div>
        <span className="product-card-vertical-divider"></span>
        <button
          className="product-card-add-btn select-size-btn"
          onClick={() => navigate(`/products/${product._id}`)}
        >
          Select Size
        </button>
      </div>

    </div>
  );
}

export default ProductCard;
