import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import type { Product } from "@shared/schema";
import ProductDetailPopup from "./product-detail-popup";

interface ProductCardProps {
  product: Product;
  size?: 'default' | 'small';
}

export default function ProductCard({ product, size = 'default' }: ProductCardProps) {
  const { addItem } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  // Limit description to 80 characters for consistent card heights
  const shortDescription = product.description.length > 80 
    ? product.description.substring(0, 80) + '...'
    : product.description;
  
  const hasLongDescription = product.description.length > 80;

  const handleAddToCart = () => {
    setShowPopup(true);
  };

  if (size === 'small') {
    return (
      <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-40 object-cover"
        />
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 mb-2" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </h4>
            <p className="text-sm text-gray-600 mb-3" data-testid={`text-product-description-${product.id}`}>
              {shortDescription}
            </p>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-forest-green" data-testid={`text-product-price-${product.id}`}>
                ${product.price}
              </span>
              <span className="text-xs text-gray-500" data-testid={`text-product-stock-${product.id}`}>
                {product.stock} available
              </span>
            </div>
          </div>
          <Button 
            className="w-full bg-forest-green text-white py-2 rounded-lg text-sm font-semibold hover:bg-sage-green transition-colors mt-auto"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 h-full flex flex-col">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-52 object-cover"
        />
        {/* Subtle gradient overlay for better badge readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none"></div>
        {/* Genetics Badge */}
        {product.genetics && (
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
              product.genetics === 'indica' ? 'bg-purple-600' :
              product.genetics === 'sativa' ? 'bg-orange-500' :
              'bg-blue-600'
            }`}>
              {product.genetics}
            </span>
          </div>
        )}
        {/* Stock Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
            product.stock > 10 ? 'bg-green-600' :
            product.stock > 5 ? 'bg-yellow-600' :
            'bg-red-600'
          }`}>
            {product.stock > 10 ? 'In Stock' : product.stock > 5 ? 'Low Stock' : 'Limited'}
          </span>
        </div>
      </div>
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          
          {/* Fixed height description container */}
          <div className="mb-3 min-h-[80px] flex flex-col">
            <p className="text-sm text-gray-600 flex-1" data-testid={`text-product-description-${product.id}`}>
              {isExpanded ? product.description : shortDescription}
            </p>
            {/* Always reserve space for the See More button to maintain consistent heights */}
            <div className="min-h-[20px]">
              {hasLongDescription && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-forest-green hover:text-sage-green font-medium mt-1 flex items-center gap-1 transition-colors self-start"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      See Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      See More
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-forest-green" data-testid={`text-product-price-${product.id}`}>
              ${product.price}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full" data-testid={`text-product-stock-${product.id}`}>
              {product.stock} available
            </span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-forest-green hover:bg-sage-green text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg mt-auto"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
    
    {/* Product Detail Popup */}
    <ProductDetailPopup
      product={product}
      isOpen={showPopup}
      onClose={() => setShowPopup(false)}
          />
    </>
  );
}
