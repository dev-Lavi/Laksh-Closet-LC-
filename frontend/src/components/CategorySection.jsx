import React, { useRef } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function CategorySection({ title, products }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <section className="w-full max-w-7xl px-4 py-12 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold uppercase tracking-wide text-gray-800">
          {title}
        </h2>
        <button className="text-gray-600 hover:text-black underline text-sm">
          View More
        </button>
      </div>

      {/* Scroll Buttons */}
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Horizontal Scrollable Product List */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth scroll-px-4 snap-x snap-mandatory"
        >
          {products.map((product, index) => (
            <div
              key={index}
              className="min-w-[250px] snap-start"
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
