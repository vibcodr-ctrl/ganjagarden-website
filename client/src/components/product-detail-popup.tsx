import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Star, Clock, Leaf, Thermometer, Zap, Heart, BookOpen, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@shared/schema";

interface ProductDetailPopupProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailPopup({ product, isOpen, onClose }: ProductDetailPopupProps) {
  const { addItem } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!isOpen) return null;

  // Parse additional images
  const additionalImages = product.additionalImages ? JSON.parse(product.additionalImages) : [];
  const allImages = [product.imageUrl, ...additionalImages];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
    onClose();
  };

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGeneticsColor = (genetics: string) => {
    switch (genetics?.toLowerCase()) {
      case 'indica': return 'bg-purple-600';
      case 'sativa': return 'bg-orange-500';
      case 'hybrid': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <img
                  src={allImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-xl"
                />
                
                {/* Image Navigation */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-forest-green'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={`px-3 py-1 text-white ${getGeneticsColor(product.genetics)}`}>
                    {product.genetics}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 px-3 py-1">
                    {product.stock > 10 ? 'In Stock' : product.stock > 5 ? 'Low Stock' : 'Limited'}
                  </Badge>
                  <Badge className={`px-3 py-1 ${getDifficultyColor(product.difficultyLevel)}`}>
                    {product.difficultyLevel}
                  </Badge>
                </div>

                <div className="text-3xl font-bold text-forest-green">
                  ${product.price}
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {product.detailedDescription || product.description}
                </p>
              </div>

              {/* Technical Specifications */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-forest-green" />
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {product.thcContent && (
                      <div>
                        <span className="font-medium text-gray-700">THC Content:</span>
                        <span className="ml-2 text-gray-600">{product.thcContent}</span>
                      </div>
                    )}
                    {product.cbdContent && (
                      <div>
                        <span className="font-medium text-gray-700">CBD Content:</span>
                        <span className="ml-2 text-gray-600">{product.cbdContent}</span>
                      </div>
                    )}
                    {product.floweringTime && (
                      <div>
                        <span className="font-medium text-gray-700">Flowering Time:</span>
                        <span className="ml-2 text-gray-600">{product.floweringTime}</span>
                      </div>
                    )}
                    {product.yieldPotential && (
                      <div>
                        <span className="font-medium text-gray-700">Yield Potential:</span>
                        <span className="ml-2 text-gray-600">{product.yieldPotential}</span>
                      </div>
                    )}
                    {product.growingMedium && (
                      <div>
                        <span className="font-medium text-gray-700">Growing Medium:</span>
                        <span className="ml-2 text-gray-600">{product.growingMedium}</span>
                      </div>
                    )}
                    {product.climate && (
                      <div>
                        <span className="font-medium text-gray-700">Climate:</span>
                        <span className="ml-2 text-gray-600">{product.climate}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Effects & Benefits */}
              {(product.effects || product.medicalBenefits) && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-forest-green" />
                      Effects & Benefits
                    </h3>
                    <div className="space-y-3">
                      {product.effects && (
                        <div>
                          <span className="font-medium text-gray-700">Effects:</span>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {product.effects.split(', ').map((effect, index) => (
                              <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                                {effect.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.medicalBenefits && (
                        <div>
                          <span className="font-medium text-gray-700">Medical Benefits:</span>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {product.medicalBenefits.split(', ').map((benefit, index) => (
                              <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                                {benefit.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Care Instructions */}
              {product.careInstructions && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-forest-green" />
                      Care Instructions
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {product.careInstructions}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Add to Cart Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Stock:</span> {product.stock} available
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Strain:</span> {product.strain}
                  </div>
                </div>
                
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-forest-green hover:bg-sage-green text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
