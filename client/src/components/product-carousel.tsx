import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ProductCard from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

interface ProductCarouselProps {
  title: string;
  subtitle: string;
  category: 'cutting' | 'seedling';
  id: string;
}

export default function ProductCarousel({ title, subtitle, category, id }: ProductCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products', category],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const allProducts = await response.json();
      return allProducts.filter((product: Product) => product.category === category);
    },
  });

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = 320; // Scroll by 320px each time (card width + gap)
    
    if (direction === 'left') {
      const newPosition = Math.max(0, scrollPosition - scrollAmount);
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setScrollPosition(newPosition);
    } else {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollContainerRef.current && 
    scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth;

  // Track actual scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollPosition(container.scrollLeft);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);





  if (isLoading) {
    return (
      <section id={id} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-xl text-gray-600">{subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section id={id} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-xl text-gray-600">{subtitle}</p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available in this category yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600">{subtitle}</p>
        </div>

        {/* Navigation Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          {scrollPosition > 0 && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-forest-green hover:bg-sage-green text-white shadow-xl rounded-full p-4 transition-all duration-200 hover:scale-110 border-2 border-white"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Right Arrow */}
          {products && products.length > 3 && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-forest-green hover:bg-sage-green text-white shadow-xl rounded-full p-4 transition-all duration-200 hover:scale-110 border-2 border-white"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Product Carousel */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-4 min-h-[600px]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-72 h-full">
                <div className="h-full">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicators */}
        {products && products.length > 3 && (
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: Math.max(1, products.length - 2) }).map((_, index) => {
              const isActive = Math.round(scrollPosition / 320) === index;
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      const container = scrollContainerRef.current;
                      const targetPosition = index * 320;
                      container.scrollTo({ left: targetPosition, behavior: 'smooth' });
                      setScrollPosition(targetPosition);
                    }
                  }}
                  className={`w-4 h-4 rounded-full transition-colors ${
                    isActive
                      ? 'bg-forest-green' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// Hide scrollbar for webkit browsers
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);
