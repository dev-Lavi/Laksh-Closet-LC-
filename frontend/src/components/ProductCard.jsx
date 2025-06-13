import React, { useState } from 'react';
import addtocartheart from '../assets/heart.svg';
import { useCart } from '../context/CartContext';  // Import cart context

function ProductCard({ product }) {
  const availableSizes = product.availableSizes || [];
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Get cart functions and favorites from context
  const { addToCart, toggleFavourite, favourites } = useCart();
  
  // Check if product is favorited
  const isFavourited = favourites.some(item => item.id === product.id);

  const handleSizeSelect = (size) => {
    if (availableSizes.includes(size)) {
      setSelectedSize(size);
      setAddedToCart(false);  // Reset added state when size changes
    }
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      // Add product with selected size
      addToCart({ ...product, selectedSize });
      setAddedToCart(true);
    }
  };

  return (
    <div className="bg-white w-full max-w-[350px] p-4 border border-gray-200 shadow hover:shadow-lg transition-shadow duration-300 relative font-sans rounded-md">
      {/* Favourite Button */}
      <button
        onClick={() => toggleFavourite(product)}
        className="absolute top-4 right-4 z-10"
        title={isFavourited ? "Remove from Favourites" : "Add to Favourites"}
      >
        <img
          src={addtocartheart}
          alt="wishlist"
          className={`w-6 h-6 transition ${
            isFavourited 
              ? 'brightness-0 invert sepia hue-rotate-[330deg]' 
              : 'opacity-80 hover:opacity-100'
          }`}
        />
      </button>

      {/* Product Image */}
      <div className="w-full h-[420px] bg-white mb-4 overflow-hidden rounded">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <h2 className="text-center text-[16.5px] text-gray-800 font-medium tracking-tight mb-2">
        {product.name}
      </h2>

      {/* Sizes */}
      <div className="flex justify-center gap-2 flex-wrap mb-4">
        {product.sizes.map((size, idx) => {
          const isAvailable = availableSizes.includes(size);
          const isSelected = size === selectedSize;

          return (
            <button
              key={idx}
              disabled={!isAvailable}
              onClick={() => handleSizeSelect(size)}
              className={`px-[14px] py-[6px] border text-sm rounded-sm transition ${
                !isAvailable
                  ? 'opacity-30 cursor-not-allowed'
                  : isSelected
                  ? 'bg-black text-white border-black'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* First Horizontal Divider */}
      <div className="border-t border-gray-200 my-3" />

      {/* Price + Add to Cart section with vertical divider */}
      <div className="flex items-center text-sm">
        <div className="flex-1 flex justify-center pr-4 text-left">
          <div>
            <span className="text-[15.5px] font-semibold text-gray-900">
              ₹{product.price}.00
            </span>
            <span className="text-[13px] text-gray-400 line-through ml-2">
              ₹1500.00 MRP
            </span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] h-[36px] bg-gray-300 mx-4" />

        <div className="flex-1 flex justify-center pl-4">
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`product-card-add-btn${addedToCart ? ' added' : ''}`}
          >
            {addedToCart ? 'Added!' : selectedSize ? 'Add to Cart' : 'Select Size'}
          </button>
        </div>
      </div>

      {/* Second Horizontal Divider */}
      <div className="border-t border-gray-200 mt-3" />
    </div>
  );
}

export default ProductCard;