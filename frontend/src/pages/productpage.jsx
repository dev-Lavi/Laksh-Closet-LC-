import React, { useState } from 'react'; 
import { ChevronDown, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductPage.css';

const product = {
  name: '4 Pocket Denim',
  price: 880,
  originalPrice: 1500,
  gallery: ['/images/pants1.svg', '/images/pants2.svg', '/images/pants3.svg'],
  reviews: [
    { name: 'Rohan', rating: 5, comment: 'Nice fabric' },
    { name: 'Rohan', rating: 5, comment: 'Nice fabric' },
    { name: 'Rohan', rating: 5, comment: 'Nice fabric' },
  ],
  sizes: [
    { label: 'S', available: false },
    { label: 'M', available: true },
    { label: 'L', available: true },
    { label: 'XL', available: false },
    { label: 'XXL', available: false },
  ],
};

const relatedProducts = [
  { id: 1, name: 'Straight fit jeans', price: 880, image: '/images/pants1.svg' },
  { id: 2, name: 'Straight fit jeans', price: 880, image: '/images/pants1.svg' },
  { id: 3, name: 'Straight fit jeans', price: 880, image: '/images/pants1.svg' },
  { id: 4, name: 'Straight fit jeans', price: 880, image: '/images/pants1.svg' },
  { id: 5, name: 'Straight fit jeans', price: 880, image: '/images/pants1.svg' },
];

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [relatedStart, setRelatedStart] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.find(s => s.available)?.label || ''
  );
  const { setCartItems } = useCart();

  const handleAddToCart = () => {
    setCartItems(prev => [...prev, { ...product, quantity }]);
  };

  const handleGalleryNav = (direction) => {
    setGalleryIndex(prev => {
      if (direction === 'next') return (prev + 1) % product.gallery.length;
      if (direction === 'prev') return (prev - 1 + product.gallery.length) % product.gallery.length;
      return prev;
    });
  };

  const handleRelatedNav = (direction) => {
    const step = 1;
    if (direction === 'next') setRelatedStart(prev => Math.min(prev + step, relatedProducts.length - 3));
    else setRelatedStart(prev => Math.max(prev - step, 0));
  };

  return (
    <div className="min-h-screen bg-[#f9f9fa] py-10 px-4 font-karla">
      <div className="w-full flex justify-center">
        <div className="max-w-6xl w-full">
          {/* Gallery */}
          <div className="flex flex-col items-center mb-12 px-4">
            <div className="relative w-full flex justify-center py-4">
              {/* Mobile/Small screens: show only one image */}
              <div className="block md:hidden">
                <img
                  src={product.gallery[galleryIndex]}
                  alt={`Product ${galleryIndex}`}
                  className="w-[300px] h-[420px] object-cover rounded border-2 shadow-lg border-purple-600"
                />
              </div>
              {/* Medium and up: show all images */}
              <div className="hidden md:flex justify-center gap-8 flex-wrap md:flex-nowrap">
                {product.gallery.slice(0, 3).map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Product ${index}`}
                    onClick={() => setGalleryIndex(index)}
                    className={`w-[300px] h-[420px] object-cover rounded border-2 cursor-pointer transition-all duration-200 ${
                      galleryIndex === index ? 'border-purple-600 shadow-lg' : 'border-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            {/* Dot indicators */}
            <div className="flex justify-center mt-4 gap-2">
              {product.gallery.map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full border transition-all duration-200 ${
                    galleryIndex === i ? 'bg-purple-600 border-purple-600' : 'bg-gray-300 border-gray-300'
                  }`}
                  onClick={() => setGalleryIndex(i)}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="product-details-section">
            {/* Left Side: Price + Add to Cart + Extra Details */}
            <div className="product-details-left">
              {/* Price Block */}
              <div className="product-price-block">
                <span className="price">₹{product.price}.00</span>
                <span className="original-price">₹{product.originalPrice}.00</span>
                <span className="mrp-label">MRP</span>
                <div className="tax-info">MRP incl. of all taxes</div>
              </div>

              {/* Extra Product Details */}
              <div className="product-extra-details">
                <div style={{ color: '#757575', fontWeight: 600, fontSize: '1rem', marginBottom: 12 }}>
                  UPI & Cards Accepted, Online approval in 2 minutes
                </div>
                <div style={{ margin: '18px 0 8px 0', fontSize: '1.1rem' }}>Size</div>
                <div className="product-sizes-row">
                  {product.sizes.map(size => (
                    <button
                      key={size.label}
                      className={`product-size-btn${selectedSize === size.label ? ' selected' : ''}`}
                      disabled={!size.available}
                      style={{
                        opacity: size.available ? 1 : 0.5,
                        borderColor: selectedSize === size.label ? '#9854f6' : '#bdbdbd',
                        color: size.available ? '#222' : '#bdbdbd',
                        background: selectedSize === size.label ? '#f6edff' : '#fff',
                        cursor: size.available ? 'pointer' : 'not-allowed'
                      }}
                      onClick={() => size.available && setSelectedSize(size.label)}
                      type="button"
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock and Add to Cart */}
              <div style={{ width: '100%' }}>
                <div className="product-stock-label">In stock</div>
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
            </div>

            {/* Right Side: Name + Sections */}
            <div className="product-details-right">
              <div className="w-full flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold mb-2 text-center">{product.name}</h2>
                <div className="flex items-center gap-2 text-purple-600 text-lg mb-4 justify-center">
                  {'★'.repeat(5)}
                  <span className="text-gray-500 text-sm ml-2">({product.reviews.length} reviews)</span>
                </div>
                <button className="border border-gray-400 px-6 py-2 rounded-md flex items-center gap-2 text-gray-700 hover:text-black transition mb-6">
                  <Heart className="w-5 h-5" /> Wishlist
                </button>
                <div className="space-y-0 w-full mt-8 details-list">
                  {['SHIPPING AND RETURN', 'DESCRIPTION', 'ADDITIONAL INFORMATION'].map(
                    (section, index) => (
                      <details key={index} className="details-row">
                        <summary className="details-summary">
                          {section}
                          <ChevronDown className="w-4 h-4" />
                        </summary>
                        <p className="details-content">
                          Details for {section.toLowerCase()}.
                        </p>
                      </details>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <section className="mb-20">
            <h3 className="text-2xl font-semibold mb-6">RELATED PRODUCTS</h3>
            {/* Mobile/Small screens: horizontal scroll with arrows */}
            <div className="relative block md:hidden">
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow hover:bg-gray-100"
                onClick={() => {
                  document.getElementById('related-scroll').scrollBy({ left: -320, behavior: 'smooth' });
                }}
                aria-label="Previous"
                type="button"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div
                id="related-scroll"
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-10"
                style={{ scrollBehavior: 'smooth' }}
              >
                {relatedProducts.map(prod => (
                  <div key={prod.id} className="relative min-w-[250px] max-w-[300px] bg-white border shadow-sm p-4 text-center">
                    {/* Heart icon button */}
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-purple-600 transition"
                      aria-label="Add to favourites"
                      // onClick={() => handleFavourite(prod)}
                      type="button"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-80 object-cover mb-2"
                    />
                    <div className="font-medium text-sm">{prod.name}</div>
                    <div className="text-xs text-gray-500 mb-2">₹{prod.price}</div>
                    <button className="w-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 transition">
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow hover:bg-gray-100"
                onClick={() => {
                  document.getElementById('related-scroll').scrollBy({ left: 320, behavior: 'smooth' });
                }}
                aria-label="Next"
                type="button"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            {/* Desktop: grid as before */}
            <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-12">
              {relatedProducts.map(prod => (
                <div key={prod.id} className="relative bg-white border shadow-sm p-4 text-center">
                  {/* Heart icon button */}
                  <button
                    className="absolute top-3 right-3 text-gray-200 hover:text-purple-600 transition"
                    aria-label="Add to favourites"
                    // onClick={() => handleFavourite(prod)} // Implement this if you want to handle favourites
                    type="button"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-80 object-cover mb-2"
                  />
                  <div className="font-medium text-sm">{prod.name}</div>
                  <div className="text-xs text-gray-500 mb-2">₹{prod.price}</div>
                  <button className="w-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-md transition">
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="mb-20">
            <h3 className="text-2xl font-semibold mb-4">REVIEWS</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {product.reviews.map((review, i) => (
                <div key={i} className="bg-white border rounded-md p-4 shadow-sm">
                  <h4 className="font-semibold text-base">{review.name}</h4>
                  <div className="text-purple-600">{'★'.repeat(review.rating)}</div>
                  <p className="text-gray-700 mt-1">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
