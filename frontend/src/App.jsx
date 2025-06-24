import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import { CartProvider } from './context/CartContext';

import Header from './components/header';
import Footer from './components/footer';

import HomePage from './pages/homepage';
import CartPage from './pages/CartPage';
import ProductPage from './pages/productpage';
import AdminLogin from './pages/AdminLogin';
import AddProduct from './pages/addproduct';
import ProductListing from './pages/ProductListing';

const About = () => <div><h1>About Us</h1></div>;
const Contact = () => <div><h1>Contact</h1></div>;

// Shared layout for public routes
const Layout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Admin-only Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/add-product" element={<AddProduct />} />

          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
