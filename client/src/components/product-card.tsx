import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  size?: 'default' | 'small';
}

export default function ProductCard({ product, size = 'default' }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
  };

  if (size === 'small') {
    return (
      <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-40 object-cover"
        />
        <CardContent className="p-4">
          <h4 className="text-lg font-bold text-gray-900 mb-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h4>
          <p className="text-sm text-gray-600 mb-3" data-testid={`text-product-description-${product.id}`}>
            {product.description}
          </p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-bold text-forest-green" data-testid={`text-product-price-${product.id}`}>
              ${product.price}
            </span>
            <span className="text-xs text-gray-500" data-testid={`text-product-stock-${product.id}`}>
              {product.stock} available
            </span>
          </div>
          <Button 
            className="w-full bg-forest-green text-white py-2 rounded-lg text-sm font-semibold hover:bg-sage-green transition-colors"
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
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-gray-600 mb-4" data-testid={`text-product-description-${product.id}`}>
          {product.description}
        </p>
        {product.genetics && (
          <p className="text-sm text-gray-500 mb-2 capitalize">
            {product.genetics}
          </p>
        )}
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-forest-green" data-testid={`text-product-price-${product.id}`}>
            ${product.price}
          </span>
          <span className="text-sm text-gray-500" data-testid={`text-product-stock-${product.id}`}>
            {product.stock} available
          </span>
        </div>
        <Button 
          className="w-full bg-forest-green text-white py-2 rounded-lg font-semibold hover:bg-sage-green transition-colors"
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
