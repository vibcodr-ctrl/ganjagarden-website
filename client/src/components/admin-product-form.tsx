import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Image as ImageIcon } from "lucide-react";
import type { Product } from "@shared/schema";

interface AdminProductFormProps {
  product?: Product;
  onSubmit: (productData: Partial<Product>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AdminProductForm({ product, onSubmit, onCancel, isLoading }: AdminProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    detailedDescription: product?.detailedDescription || '',
    price: product?.price || '',
    stock: product?.stock || '',
    category: product?.category || 'cutting',
    imageUrl: product?.imageUrl || '',
    strain: product?.strain || '',
    genetics: product?.genetics || 'hybrid',
    thcContent: product?.thcContent || '',
    cbdContent: product?.cbdContent || '',
    floweringTime: product?.floweringTime || '',
    yieldPotential: product?.yieldPotential || '',
    difficultyLevel: product?.difficultyLevel || 'beginner',
    growingMedium: product?.growingMedium || '',
    climate: product?.climate || '',
    effects: product?.effects || '',
    medicalBenefits: product?.medicalBenefits || '',
    careInstructions: product?.careInstructions || '',
    additionalImages: product?.additionalImages ? JSON.parse(product.additionalImages) : []
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: parseFloat(formData.price.toString()),
      stock: parseInt(formData.stock.toString()),
      additionalImages: JSON.stringify(formData.additionalImages)
    };
    onSubmit(submitData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Blue Dream Cutting"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="strain">Strain Name</Label>
                <Input
                  id="strain"
                  value={formData.strain}
                  onChange={(e) => handleInputChange('strain', e.target.value)}
                  placeholder="e.g., Blue Dream"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="28.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="15"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cutting">Cutting</SelectItem>
                    <SelectItem value="seedling">Seedling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="genetics">Genetics</Label>
                <Select value={formData.genetics} onValueChange={(value) => handleInputChange('genetics', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indica">Indica</SelectItem>
                    <SelectItem value="sativa">Sativa</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Short Description (Landing Page) *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description for product cards (max 80 characters recommended)"
                  rows={3}
                  required
                />
                <p className="text-sm text-gray-500">
                  Characters: {formData.description.length}/80
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailedDescription">Detailed Description (Popup)</Label>
                <Textarea
                  id="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
                  placeholder="Comprehensive description for the product detail popup"
                  rows={5}
                />
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="thcContent">THC Content</Label>
                <Input
                  id="thcContent"
                  value={formData.thcContent}
                  onChange={(e) => handleInputChange('thcContent', e.target.value)}
                  placeholder="e.g., 18-24%"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cbdContent">CBD Content</Label>
                <Input
                  id="cbdContent"
                  value={formData.cbdContent}
                  onChange={(e) => handleInputChange('cbdContent', e.target.value)}
                  placeholder="e.g., 0.1-0.3%"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floweringTime">Flowering Time</Label>
                <Input
                  id="floweringTime"
                  value={formData.floweringTime}
                  onChange={(e) => handleInputChange('floweringTime', e.target.value)}
                  placeholder="e.g., 8-10 weeks"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yieldPotential">Yield Potential</Label>
                <Input
                  id="yieldPotential"
                  value={formData.yieldPotential}
                  onChange={(e) => handleInputChange('yieldPotential', e.target.value)}
                  placeholder="e.g., 500-600g/m²"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                <Select value={formData.difficultyLevel} onValueChange={(value) => handleInputChange('difficultyLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="growingMedium">Growing Medium</Label>
                <Input
                  id="growingMedium"
                  value={formData.growingMedium}
                  onChange={(e) => handleInputChange('growingMedium', e.target.value)}
                  placeholder="e.g., soil, hydroponic, coco"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="climate">Climate</Label>
                <Input
                  id="climate"
                  value={formData.climate}
                  onChange={(e) => handleInputChange('climate', e.target.value)}
                  placeholder="e.g., indoor, outdoor, greenhouse"
                />
              </div>
            </div>

            {/* Effects & Benefits */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="effects">Effects</Label>
                <Input
                  id="effects"
                  value={formData.effects}
                  onChange={(e) => handleInputChange('effects', e.target.value)}
                  placeholder="e.g., Euphoric, Creative, Relaxed, Focused"
                />
                <p className="text-sm text-gray-500">
                  Separate multiple effects with commas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalBenefits">Medical Benefits</Label>
                <Input
                  id="medicalBenefits"
                  value={formData.medicalBenefits}
                  onChange={(e) => handleInputChange('medicalBenefits', e.target.value)}
                  placeholder="e.g., Pain relief, Anxiety, Depression, Stress, Insomnia"
                />
                <p className="text-sm text-gray-500">
                  Separate multiple benefits with commas
                </p>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="space-y-2">
              <Label htmlFor="careInstructions">Care Instructions</Label>
              <Textarea
                id="careInstructions"
                value={formData.careInstructions}
                onChange={(e) => handleInputChange('careInstructions', e.target.value)}
                placeholder="Detailed care instructions for growing this plant"
                rows={4}
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Main Image URL *</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="Enter product image URL"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Additional Images</Label>
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter additional image URL"
                  />
                  <Button type="button" onClick={addImage} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.additionalImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {formData.additionalImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
