import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [desktopStart, setDesktopStart] = useState(0);

  const { setCartItems } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        if (data?.sizes?.length > 0) {
          setSelectedSize(data.sizes[0]); // Set the first size by default
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    setCartItems(prev => [...prev, { ...product, quantity, selectedSize }]);
  };

  const handleGalleryNav = (direction) => {
    if (!product) return;
    setGalleryIndex(prev =>
      direction === 'next'
        ? (prev + 1) % product.gallery.length
        : (prev - 1 + product.gallery.length) % product.gallery.length
    );
  };

  if (!product) {
    return <div className="text-center py-20">Loading product...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9f9fa] py-10 px-4 font-karla">
      <div className="w-full flex justify-center">
        <div className="max-w-6xl w-full">
{/* Gallery Section */}
<div className="flex flex-col items-center mb-12 px-4">
  {/* Desktop: Show all images side by side */}
  <div className="hidden md:flex gap-4 gallery-images-row">
    {product.gallery.map((src, i) => (
      <img
        key={i}
        src={src}
        alt={product.name}
        className={`w-[220px] h-[320px] object-cover rounded border-2 shadow-lg cursor-pointer transition-all duration-200 ${
          galleryIndex === i ? 'border-purple-600' : 'border-gray-300 opacity-80'
        }`}
        onClick={() => setGalleryIndex(i)}
      />
    ))}
  </div>

  {/* Mobile: Show only one image */}
  <div className="relative w-full flex justify-center py-4 md:hidden gallery-images-row">
    <img
      src={product.gallery[galleryIndex]}
      alt={product.name}
      className="w-[300px] h-[420px] object-cover rounded border-2 shadow-lg border-purple-600"
    />

    {/* Left / Right Arrow Navigation */}
    <button
      onClick={() => handleGalleryNav('prev')}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white border rounded-full p-1 shadow hover:bg-gray-100"
      aria-label="Previous Image"
    >
      <ChevronLeft className="w-5 h-5 text-gray-700" />
    </button>
    <button
      onClick={() => handleGalleryNav('next')}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white border rounded-full p-1 shadow hover:bg-gray-100"
      aria-label="Next Image"
    >
      <ChevronRight className="w-5 h-5 text-gray-700" />
    </button>
  </div>

  {/* Thumbnails (always visible) */}
  <div className="flex justify-center gap-2 mt-4">
    {product.gallery.map((src, i) => (
      <img
        key={i}
        src={src}
        alt={`Thumbnail ${i}`}
        className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
          galleryIndex === i ? 'border-purple-600' : 'border-gray-300'
        }`}
        onClick={() => setGalleryIndex(i)}
      />
    ))}
  </div>
</div>


          {/* Product Details */}
          <div className="product-details-section">
            <div className="product-details-left">
              <div className="product-price-block">
                <span className="price">₹{product.price}.00</span>
                <span className="original-price">₹{product.originalPrice}.00</span>
                <span className="mrp-label">MRP</span>
                <div className="tax-info">MRP incl. of all taxes</div>
              </div>

              <div className="product-extra-details">
                <div className="mb-3 text-sm text-gray-600 font-medium">UPI & Cards Accepted</div>
                <div className="mb-2 text-base font-semibold">Size</div>
                <div className="product-sizes-row">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`product-size-btn${selectedSize === size ? ' selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="product-qty-cart-row">
                <div className="product-qty-box">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="product-add-cart-btn"
                >
                  Add to cart
                </button>
              </div>
            </div>

            <div className="product-details-right">
              <h2 className="text-3xl font-bold mb-2 text-center">{product.name}</h2>
              <div className="text-center text-sm mb-4 text-gray-500">
                {product.description}
              </div>
              <button className="border border-gray-400 px-6 py-2 rounded-md flex items-center gap-2 text-gray-700 hover:text-black transition mb-6">
                <Heart className="w-5 h-5" /> Wishlist
              </button>
              <div className="space-y-2 w-full mt-6 details-list">
                {['SHIPPING AND RETURN', 'DESCRIPTION', 'ADDITIONAL INFORMATION'].map((section, i) => (
                  <details key={i} className="details-row">
                    <summary className="details-summary">
                      {section}
                      <ChevronDown className="w-4 h-4" />
                    </summary>
                    <p className="details-content">Details for {section.toLowerCase()}.</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <section className="reviews-section">
            <h3 className="text-2xl font-semibold mb-4">REVIEWS</h3>
            {product.reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 reviews-grid">
                {product.reviews.map((review, i) => (
                  <div key={i} className="review-card">
                    <h4>{review.name}</h4>
                    <div className="review-stars">{'★'.repeat(review.rating)}</div>
                    <div className="review-comment">{review.comment}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
