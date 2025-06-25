import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import CategorySection from '../components/CategorySection'; // <-- Import here
import './ProductListing.css';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('recommended');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/products`);
        const transformed = res.data.map(p => ({
          ...p,
          id: p._id,
          image: p.gallery?.[0],
        }));
        setProducts(transformed);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sort === 'low') return sorted.sort((a, b) => a.price - b.price);
    if (sort === 'high') return sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [products, sort]);

  // Filter by search term
  const filteredProducts = useMemo(() => {
    return sortedProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm)
    );
  }, [sortedProducts, searchTerm]);

  return (
    <div className="product-listing-root">
      <div className="product-listing-header">
        <h2 className="product-listing-title">Products</h2>
        <select
          className="product-listing-sort"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="recommended">Recommended</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>

      {/* Use CategorySection here */}
      <CategorySection title="All Products" products={filteredProducts} />

      {/* Optionally, keep the grid for fallback or remove it */}
      {/* 
      <div className="product-listing-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="no-results-msg">
            No products found for "{searchTerm}"
          </p>
        )}
      </div>
      */}
      {filteredProducts.length === 0 && (
        <p className="no-results-msg">
          No products found for "{searchTerm}"
        </p>
      )}
    </div>
  );
};

export default ProductListing;
