import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // ✅ only once
import '../fonts.css';
import './header.css';

// SVG imports
import logo from '../assets/logo.svg';
import searchIcon from '../assets/search.svg';
import cartIcon from '../assets/cart.svg';
import heartIcon from '../assets/heart.svg';
import hamburgerIcon from '../assets/hamburger.svg';
import instagramIcon from '../assets/instagram.svg';
import youtubeIcon from '../assets/youtube.svg';

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cartItems, favourites } = useCart();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <header className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 bg-white border-b-8 border-gray-300 relative min-h-[100px] font-karla">
        <div className="flex items-center gap-4 sm:gap-6 flex-1">
          <div className="hamburger-container flex items-center gap-3">
            <img src={hamburgerIcon} alt="Menu" className="w-7 cursor-pointer transition-transform hover:scale-110" onClick={toggleSidebar} />
            <img src={searchIcon} alt="Search" className="search-icon-mobile" />
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src={logo} alt="Laksh Closet Logo" className="h-18" />
        </div>

        <div className="flex items-center gap-4 sm:gap-6 flex-1 justify-end relative">
          <img src={searchIcon} alt="Search" className="search-icon-desktop" />

          {/* Wishlist */}
          <div className="relative">
            <img src={heartIcon} alt="Wishlist" className="w-6 cursor-pointer transition-transform hover:scale-110" />
            {favourites.length > 0 && (
              <span className="header-wishlist-badge">
                {favourites.length}
              </span>
            )}
          </div>

          {/* Cart */}
          <div className="relative cart-container">
            <img src={cartIcon} alt="Cart" className="w-6 cursor-pointer transition-transform hover:scale-110" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[11px] rounded-full px-[6px] py-[1px] font-semibold leading-none">
                {cartItems.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-[250px] bg-gray-100 shadow-lg px-6 py-8 transition-all z-[1000] font-karla ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button className="absolute top-4 right-4 text-2xl font-bold" onClick={toggleSidebar}>×</button>
        <h3 className="text-lg font-kanit mb-6 uppercase tracking-wide text-gray-800">Categories</h3>

        <ul className="space-y-4 text-gray-700 text-base">
          <li>
            <Link to="/products" className="cursor-pointer hover:text-gray-900 block">Products</Link>
          </li>
          <li>
            <Link to="/products/unisex" className="cursor-pointer hover:text-gray-900 block">Unisex</Link>
          </li>
          <li>
            <Link to="/products/baggy" className="cursor-pointer hover:text-gray-900 block">Baggy</Link>
          </li>
          <li>
            <Link to="/products/straight-fit" className="cursor-pointer hover:text-gray-900 block">Straight Fit</Link>
          </li>
          <li>
            <Link to="/products/bootcut" className="cursor-pointer hover:text-gray-900 block">Bootcut</Link>
          </li>
          <li>
            <Link to="/products/ripped-jeans" className="cursor-pointer hover:text-gray-900 block">Ripped jeans</Link>
          </li>
          <li>
            <Link to="/products/mom-jeans" className="cursor-pointer hover:text-gray-900 block">Mom Jeans</Link>
          </li>
        </ul>

        <hr className="my-6 border-gray-300" />

        <div className="space-y-2 text-base text-blue-700">
          <Link to="/login" className="block hover:underline">Login</Link>
          <Link to="/register" className="block hover:underline">Register</Link>
        </div>

        <hr className="my-6 border-gray-300" />

        <div className="sidebar-social-icons flex gap-4">
          <img src={instagramIcon} alt="Instagram" className="w-6 cursor-pointer hover:scale-110 transition-transform" />
          <img src={youtubeIcon} alt="YouTube" className="w-6 cursor-pointer hover:scale-110 transition-transform" />
        </div>
      </div>
    </>
  );
}

export default Header;
