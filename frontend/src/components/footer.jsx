import React from 'react';
import './footer.css';
import logo from '../assets/logo.svg'; // Adjust if needed
import instagram from '../assets/insta.svg';
import facebook from '../assets/facebook.svg';
import twitter from '../assets/twitter.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Left Section */}
        <div className="footer-content">
          <div className="footer-links">
            <div>
              <h4>CUSTOMER SERVICES</h4>
              <ul>
                <li>contact us</li>
                <li>photos & reviews</li>
                <li>schedule an appointment</li>
                <li>track order</li>
                <li>need help?</li>
              </ul>
            </div>
            <div>
              <h4>ABOUT US</h4>
              <ul>
                <li>privacy policy</li>
                <li>exchange policy</li>
                <li>coupons & offers</li>
                <li>frequently asked questions</li>
              </ul>
            </div>
            <div>
              <h4>MAIN LOCATIONS</h4>
              <ul>
                <li>mayur vihar phase 1</li>
                <li>new delhi, 110091</li>
                <li>india</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Section (Logo + Icons) */}
        <div className="footer-brand">
          <img src={logo} alt="Laksh Closet Logo" className="footer-logo" />
          <div className="footer-brand-socials">
            <img src={instagram} alt="Instagram" />
            <img src={twitter} alt="Twitter" />
            <img src={facebook} alt="Facebook" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© 2025 laksh closet. all rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
