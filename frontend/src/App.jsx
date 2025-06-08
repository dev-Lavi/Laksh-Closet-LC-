import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/header';
import Footer from './components/footer';
import { CartProvider } from './context/CartContext';

import HomePage from './pages/HomePage';
import ProductPage from './pages/productpage'; // ✅ import your product page

const Products = () => <div><h1>Our Products</h1></div>;
const About = () => <div><h1>About Us</h1></div>;
const Contact = () => <div><h1>Contact</h1></div>;

function App() {
  return (
    <Router>
      <CartProvider>
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/" element={<ProductPage />} /> {/* ✅ dynamic product page route /products/:id */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </CartProvider>
    </Router>
  );
}

export default App;
