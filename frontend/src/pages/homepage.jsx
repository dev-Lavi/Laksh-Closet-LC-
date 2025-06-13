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
import './homepage.css';

// BAGGY Products (pants1 to pants4)
const baggyProducts = [
  {
    name: '4 Pocket Denim',
    price: 860,
    sizes: ['28', '30', '32', '34', '36'],
    availableSizes: ['28', '30', '32'],
    image: '/images/pants1.svg',
    description: 'Select Size'
  },
  {
    name: 'Grey Baggy',
    price: 950,
        sizes: ['28', '30', '32', '34', '36'],
    availableSizes: ['30', '32'],
    image: '/images/pants2.svg',
    description: 'Select Size'
  },
  {
    name: 'Rust Baggy',
    price: 990,
        sizes: ['28', '30', '32', '34', '36'],
    availableSizes: ['30', '32'],
    image: '/images/pants3.svg',
    description: 'Select Size'
  },
  {
    name: 'Olive Cargo Jeans',
    price: 1050,
        sizes: ['28', '30', '32', '34', '36'],
    availableSizes: ['30', '32'],
    image: '/images/pants4.svg',
    description: 'Select Size'
  }
];

// STRAIGHT FIT Products (pants6 to pants9)
const straightFitProducts = [
  {
    name: 'Cream Baggy Pants',
    price: 970,
        sizes: ['28', '30', '32', '34', '36'],
    availableSizes: ['30', '32'],
    image: '/images/pants6.svg',
    description: 'Select Size'
  },
  {
    name: 'Light Grey Jogger Denim',
    price: 890,
        sizes: ['28', '30', '32', '34', '36'],
    availableSizes: ['28', '30'],
    image: '/images/pants7.svg',
    description: 'Select Size'
  },
  {
    name: 'Urban Fit Baggy',
    price: 1050,
        sizes: ['28', '30', '32', '34', '36'],
    availableSizes: ['30', '32'],
    image: '/images/pants8.svg',
    description: 'Select Size'
  },
  {
    name: 'Stone Wash Baggy',
    price: 980,
        sizes: ['28', '30', '32', '34', '36'],
    availableSizes: ['34'],
    image: '/images/pants9.svg',
    description: 'Select Size'
  }
];

// NEW ARRIVALS Products (pants10 to pants13)
const newArrivals = [
  {
    name: 'Shadow Black Jeans',
    price: 1020,
    sizes: ['34', '36','28', '30', '32'],
    availableSizes: ['28', '30', '32'],
    image: '/images/pants10.svg',
    description: 'Select Size'
  },
  {
    name: 'Midnight Blue Tapered',
    price: 1100,
    sizes: ['30', '32'],
    availableSizes: ['30', '32'],
    image: '/images/pants11.svg',
    description: 'Select Size'
  },
  {
    name: 'Dust Grey Loose Fit',
    price: 970,
    sizes: ['28', '30'],
    availableSizes: ['28', '30'],
    image: '/images/pants12.svg',
    description: 'Select Size'
  },
  {
    name: 'Ink Black Baggy',
    price: 1080,
    sizes: ['30', '32', '34'],
    availableSizes: ['30', '32', '34'],
    image: '/images/pants13.svg',
    description: 'Select Size'
  }
];


function HomePage() {
const { cartItems, setCartItems } = useCart();
    const [cart, setCart] = useState([]);

const handleAddToCart = (product) => {
  setCartItems(prev => [...prev, product]);
};
  const bannerRef = useRef(null);
  const bannerWidth = 380;
  const gap = 10;
  const scrollAmount = bannerWidth + gap;

  const originalBanners = [banner1, banner2, banner3, banner4, banner5];
  const banners = [...originalBanners, ...originalBanners.slice(0, 2)]; // Cloning first 2

  useEffect(() => {
    const container = bannerRef.current;
    let index = 0;

    const interval = setInterval(() => {
      if (!container) return;

      index++;
      container.scrollTo({
        left: index * scrollAmount,
        behavior: 'smooth'
      });

      if (index >= originalBanners.length) {
        setTimeout(() => {
          container.scrollTo({ left: 0, behavior: 'auto' });
          index = 0;
        }, 500); // Allow scroll to complete
      }
    }, 4000); // Scroll every 3 seconds

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

      {/* Category Sections */}
      <CategorySection
        title="BAGGY"
        products={baggyProducts}
        link="/category/baggy"
        onAddToCart={handleAddToCart}
      />
      <CategorySection
        title="STRAIGHT FIT"
        products={straightFitProducts}
        link="/category/straight-fit"
        onAddToCart={handleAddToCart}
      />
      <CategorySection
        title="NEW ARRIVALS"
        products={newArrivals}
        link="/category/new-arrivals"
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default HomePage;
