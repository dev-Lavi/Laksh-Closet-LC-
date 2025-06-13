import React, { useRef } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CategorySection.css';

function CategorySection({ title, products }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <section className="category-section">
      <div className="category-section-header">
        <h2 className="category-section-title">{title}</h2>
        <button className="category-section-viewmore">View More</button>
      </div>
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="category-section-scroll-btn"
          style={{ left: 0 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollRight}
          className="category-section-scroll-btn"
          style={{ right: 0 }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div
          ref={scrollRef}
          className="category-section-products-row snap-x snap-mandatory"
        >
          {products.map((product, index) => (
            <div
              key={index}
              className="category-section-product-card"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
