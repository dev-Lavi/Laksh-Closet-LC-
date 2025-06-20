import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/header';
import CategorySection from '../components/CategorySection';
import arrowIcon from '../assets/arrow.svg';
import banner1 from '../assets/banner1.svg';
import banner2 from '../assets/banner2.svg';
import banner3 from '../assets/banner3.svg';
import banner4 from '../assets/banner4.svg';  
import banner5 from '../assets/banner5.svg';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import './HomePage.css';

function HomePage() {
  const { cartItems, setCartItems, favourites, toggleFavourite } = useCart();
  const [allProducts, setAllProducts] = useState([]);

  const handleAddToCart = (product) => {
    setCartItems(prev => [...prev, product]);
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/products`);
        if (Array.isArray(res.data)) {
          const transformed = res.data.map(p => ({
            ...p,
            id: p._id,
            image: p.gallery?.[0],
            availableSizes: Array.isArray(p.sizes) ? p.sizes.map(s => s.label || s) : [],
          }));
          setAllProducts(transformed);
        } else {
          console.error('Expected array but got:', res.data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  const filterByCategory = (categoryName) => {
    return allProducts.filter(p => p.category?.toLowerCase() === categoryName.toLowerCase());
  };

  const bannerRef = useRef(null);
  const bannerWidth = 380;
  const gap = 10;
  const scrollAmount = bannerWidth + gap;

  const originalBanners = [banner1, banner2, banner3, banner4, banner5];
  const banners = [...originalBanners, ...originalBanners.slice(0, 2)];

  useEffect(() => {
    const container = bannerRef.current;
    let index = 0;

    const interval = setInterval(() => {
      if (!container) return;

      index++;
      container.scrollTo({
        left: index * scrollAmount,
        behavior: 'smooth',
      });

      if (index >= originalBanners.length) {
        setTimeout(() => {
          container.scrollTo({ left: 0, behavior: 'auto' });
          index = 0;
        }, 500);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage-root">
      {/* Banner Slider */}
      <div className="homepage-banner-section">
        <div className="homepage-banner-slider" ref={bannerRef}>
          <div className="flex gap-[10px] transition-all duration-500 ease-in-out">
            {banners.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Banner ${index + 1}`}
                className="homepage-banner-img"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Category Sections using API data */}
      <CategorySection
        title="BAGGY"
        products={filterByCategory('Baggy')}
        link="/category/baggy"
        onAddToCart={handleAddToCart}
      />
      <CategorySection
        title="STRAIGHT FIT"
        products={filterByCategory('Straight fit')}
        link="/category/straight-fit"
        onAddToCart={handleAddToCart}
      />
      <CategorySection
        title="NEW ARRIVALS"
        products={allProducts.slice(-4)} // Show last 4 as new arrivals
        link="/category/new-arrivals"
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default HomePage;
