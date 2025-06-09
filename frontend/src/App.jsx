import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CartProvider } from './context/CartContext';

import Header from './components/header';
import Footer from './components/footer';

import HomePage from './pages/homepage';
import ProductPage from './pages/productpage';
import AdminLogin from './pages/AdminLogin';
import AddProduct from './pages/addproduct'; // ✅ AddProduct page

const Products = () => <div><h1>Our Products</h1></div>;
const About = () => <div><h1>About Us</h1></div>;
const Contact = () => <div><h1>Contact</h1></div>;

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* Admin-only Routes without Header/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/add-product" element={<AddProduct />} />

          {/* Public Routes with Header/Footer */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/" element={<ProductPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
