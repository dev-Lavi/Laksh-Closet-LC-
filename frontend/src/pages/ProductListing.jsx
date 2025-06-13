import React, { useEffect, useState } from 'react';
import axios from 'axios';
    import { useNavigate } from 'react-router-dom';
import './productlisting.css';

const DEFAULT_SIZES = ['28', '30', '32', '34', '36'];

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product, size) => {
    // Your add to cart logic here
    alert(`Added ${product.name} (${size}) to cart!`);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Products</h2>
        <select className="border px-4 py-2 rounded-md">
          <option>Recommended</option>
          <option>Low to High</option>
          <option>High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="product-card"
            onClick={e => {
              // Prevent card click if clicking size/add to cart
              if (e.target.classList.contains('size-btn') || e.target.classList.contains('add-cart-btn')) return;
              navigate(`/product/${product._id}`);
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="product-img-wrap">
              <img
                src={product.gallery[0]}
                alt={product.name}
                className="product-img"
              />
              <span className="product-label">Heavy Gauge</span>
            </div>
            <div className="product-info">
              <h3 className="product-title">{product.name}</h3>
              <div className="product-sizes-row">
                {DEFAULT_SIZES.map(size => {
                  const available = product.sizes.includes(size) || product.sizes.some?.(s => (s.label || s) === size);
                  const isSelected = selectedSizes[product._id] === size;
                  return (
                    <button
                      key={size}
                      className={`size-btn${isSelected ? ' selected' : ''}`}
                      disabled={!available}
                      style={{
                        opacity: available ? 1 : 0.5,
                        cursor: available ? 'pointer' : 'not-allowed',
                        background: isSelected ? '#f6edff' : '#fff',
                        color: available ? (isSelected ? '#9854f6' : '#222') : '#bdbdbd',
                        borderColor: isSelected ? '#9854f6' : '#bdbdbd'
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        if (available) handleSizeSelect(product._id, size);
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              <div className="product-price-row">
                <span className="product-price">₹{product.price}.00</span>
                <span className="product-original-price">₹{product.originalPrice}.00</span>
                <span className="product-mrp">MRP</span>
              </div>
              {!selectedSizes[product._id] ? (
                <button
                  className="select-size-btn"
                  onClick={e => e.stopPropagation()}
                >
                  Select Size
                </button>
              ) : (
                <button
                  className="add-cart-btn"
                  onClick={e => {
                    e.stopPropagation();
                    handleAddToCart(product, selectedSizes[product._id]);
                  }}
                >
                  Add to Bag
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListing;
