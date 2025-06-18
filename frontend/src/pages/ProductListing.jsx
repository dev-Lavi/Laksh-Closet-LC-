import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './ProductListing.css';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('recommended');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/products`);
        const transformed = res.data.map(p => ({
          ...p,
          id: p._id,
          image: p.gallery?.[0],
          availableSizes: Array.isArray(p.sizes) ? p.sizes.map(s => s.label || s) : [],
        }));
        setProducts(transformed);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  // Sort products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'low') return a.price - b.price;
    if (sort === 'high') return b.price - a.price;
    return 0; // recommended
  });

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

      <div className="product-listing-grid">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductListing;
