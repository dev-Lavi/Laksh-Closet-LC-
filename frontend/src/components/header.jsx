import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
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
import profileIcon from '../assets/profile.svg';

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cartCount, favourites } = useCart();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <header className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 bg-white border-b-8 border-gray-300 relative min-h-[100px] font-karla">
        <div className="flex items-center gap-4 sm:gap-6 flex-1">
          <div className="hamburger-container flex items-center gap-3">
            <img src={hamburgerIcon} alt="Menu" className="w-9 cursor-pointer transition-transform hover:scale-110" onClick={toggleSidebar} />
            <img src={searchIcon} alt="Search" className="search-icon-mobile" />
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src={logo} alt="Laksh Closet Logo" className="h-18" />
        </div>

        <div className="flex items-center gap-0 sm:gap-1 flex-1 justify-end relative">
          <img src={searchIcon} alt="Search" className="search-icon-desktop" />

          <div className="header-icon-container relative">
            <Link to="/wishlist" className="flex items-center">
              <img src={heartIcon} alt="Wishlist" className="header-wishlist-icon w-6 cursor-pointer transition-transform hover:scale-110" />
            </Link>
            {favourites.length > 0 && (
              <span className="header-wishlist-badge">
                {favourites.length}
              </span>
            )}
          </div>

          <div className="header-icon-container">
            <Link to="/cart">
              <img src={cartIcon} alt="Cart" className="header-cart-icon" />
              {cartCount > 0 && (
                <span className="header-cart-badge">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`header-sidebar ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button className="sidebar-close-btn" onClick={toggleSidebar}>×</button>
        
        {/* Social Icons */}
        <div className="sidebar-social-icons flex justify-start gap-4 mb-6">
          <img src={youtubeIcon} alt="YouTube" className="w-5 cursor-pointer hover:scale-110 transition-transform" />
          <a
    href="https://www.instagram.com/lakshcloset/?igsh=ZHZiYWJoeXB6c3Vi#"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={instagramIcon} alt="Instagram" className="w-5 cursor-pointer hover:scale-110 transition-transform" />
  </a>
        </div>

        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 border-b pb-1 mb-4">Categories</h3>

        <ul className="space-y-5 text-[14px] text-black">
          <li><Link to="/products" className="block hover:font-semibold">All Products</Link></li>
          <li><Link to="/products" className="block hover:font-semibold">Unisex</Link></li>
          <li><Link to="/products" className="block hover:font-semibold">Baggy</Link></li>
          <li><Link to="/products" className="block hover:font-semibold">Straight Fit</Link></li>
          <li><Link to="/products" className="block hover:font-semibold">Bootcut</Link></li>
          <li><Link to="/products" className="block hover:font-semibold">Ripped Jeans</Link></li>
        </ul>

        <hr className="my-6 border-gray-300" />

        <Link to="/profile" className="sidebar-profile-link flex items-center gap-2 text-black hover:font-semibold">
          <img src={profileIcon} alt="Profile" className="w-5" />
          Profile
        </Link>
        
        <div className="sidebar-link-group space-y-4 text-[14px]">
          <Link to="/login" className="block text-black hover:font-semibold">Login</Link>
          <Link to="/register" className="block text-black hover:font-semibold">Register</Link>
          <Link to="/track-order" className="block text-black hover:font-semibold">Track Order</Link>
          <Link to="/help" className="block text-black hover:font-semibold">Need Help?</Link>
        </div>
      </div>
    </>
  );
}

export default Header;