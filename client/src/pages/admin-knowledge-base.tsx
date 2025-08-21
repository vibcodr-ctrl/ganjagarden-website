import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  X, 
  ArrowLeft,
  Leaf,
  Bug,
  Droplets,
  Sun,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useLocation } from 'wouter';

interface KnowledgeBaseItem {
  id: string;
  title: string;
  description: string;
  problemType: 'pest' | 'disease' | 'nutrient' | 'environment';
  symptoms: string[];
  causes: string[];
  solutions: string[];
  prevention: string;
  imageUrls: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  description: string;
  problemType: 'pest' | 'disease' | 'nutrient' | 'environment';
  symptoms: string[];
  causes: string[];
  solutions: string[];
  prevention: string;
}

const problemTypeIcons = {
  pest: Bug,
  disease: AlertCircle,
  nutrient: Droplets,
  environment: Sun
};

const problemTypeColors = {
  pest: 'bg-red-500',
  disease: 'bg-orange-500',
  nutrient: 'bg-blue-500',
  environment: 'bg-yellow-500'
};

export default function AdminKnowledgeBase() {
  const [items, setItems] = useState<KnowledgeBaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeBaseItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    problemType: 'pest',
    symptoms: [''],
    causes: [''],
    solutions: [''],
    prevention: ''
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    checkAuth();
    fetchKnowledgeBase();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLocation('/admin/login');
    }
  };

  const fetchKnowledgeBase = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/knowledge-base', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        setError('Failed to fetch knowledge base');
      }
    } catch (error) {
      setError('Error fetching knowledge base');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const addArrayField = (field: keyof Pick<FormData, 'symptoms' | 'causes' | 'solutions'>) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: keyof Pick<FormData, 'symptoms' | 'causes' | 'solutions'>, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (field: keyof Pick<FormData, 'symptoms' | 'causes' | 'solutions'>, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('problemType', formData.problemType);
      formDataToSend.append('symptoms', JSON.stringify(formData.symptoms.filter(s => s.trim())));
      formDataToSend.append('causes', JSON.stringify(formData.causes.filter(c => c.trim())));
      formDataToSend.append('solutions', JSON.stringify(formData.solutions.filter(s => s.trim())));
      formDataToSend.append('prevention', formData.prevention);

      // Add images
      selectedImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      const url = editingItem 
        ? `/api/admin/knowledge-base/${editingItem.id}`
        : '/api/admin/knowledge-base';
      
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend
      });

      if (response.ok) {
        setSuccess(editingItem ? 'Item updated successfully' : 'Item created successfully');
        setIsDialogOpen(false);
        resetForm();
        fetchKnowledgeBase();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Operation failed');
      }
    } catch (error) {
      setError('Error saving item');
    }
  };

  const handleEdit = (item: KnowledgeBaseItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      problemType: item.problemType,
      symptoms: item.symptoms.length > 0 ? item.symptoms : [''],
      causes: item.causes.length > 0 ? item.causes : [''],
      solutions: item.solutions.length > 0 ? item.solutions : [''],
      prevention: item.prevention
    });
    setImagePreviewUrls(item.imageUrls);
    setSelectedImages([]);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/knowledge-base/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess('Item deleted successfully');
        fetchKnowledgeBase();
      } else {
        setError('Failed to delete item');
      }
    } catch (error) {
      setError('Error deleting item');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      problemType: 'pest',
      symptoms: [''],
      causes: [''],
      solutions: [''],
      prevention: ''
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setEditingItem(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading knowledge base...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/admin')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Knowledge Base Management</h1>
            </div>
            <Button onClick={openCreateDialog} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add New Item</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Knowledge Base Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const IconComponent = problemTypeIcons[item.problemType];
            const colorClass = problemTypeColors[item.problemType];
            
            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {item.problemType}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {item.imageUrls.length > 0 && (
                    <div className="flex space-x-2 mb-3 overflow-x-auto">
                      {item.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`${item.title} image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Created: {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No knowledge base items yet</h3>
            <p className="text-gray-600 mb-4">
              Start building your AI training database by adding plant care information.
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          </div>
        )}
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Knowledge Base Item' : 'Add New Knowledge Base Item'}
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? 'Update the plant care information and training data.'
                : 'Add new plant care information to train the AI assistant.'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Spider Mite Infestation"
                  required
                />
              </div>
              <div>
                <Label htmlFor="problemType">Problem Type *</Label>
                <Select
                  value={formData.problemType}
                  onValueChange={(value: 'pest' | 'disease' | 'nutrient' | 'environment') => 
                    setFormData(prev => ({ ...prev, problemType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pest">Pest</SelectItem>
                    <SelectItem value="disease">Disease</SelectItem>
                    <SelectItem value="nutrient">Nutrient Deficiency</SelectItem>
                    <SelectItem value="environment">Environmental Issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the problem and its characteristics..."
                rows={3}
                required
              />
            </div>

            {/* Symptoms */}
            <div>
              <Label>Symptoms</Label>
              <div className="space-y-2">
                {formData.symptoms.map((symptom, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={symptom}
                      onChange={(e) => updateArrayField('symptoms', index, e.target.value)}
                      placeholder="e.g., Yellow leaves, brown spots..."
                    />
                    {formData.symptoms.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('symptoms', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('symptoms')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Symptom
                </Button>
              </div>
            </div>

            {/* Causes */}
            <div>
              <Label>Causes</Label>
              <div className="space-y-2">
                {formData.causes.map((cause, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={cause}
                      onChange={(e) => updateArrayField('causes', index, e.target.value)}
                      placeholder="e.g., Overwatering, poor drainage..."
                    />
                    {formData.causes.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('causes', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('causes')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Cause
                </Button>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <Label>Solutions</Label>
              <div className="space-y-2">
                {formData.solutions.map((solution, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={solution}
                      onChange={(e) => updateArrayField('solutions', index, e.target.value)}
                      placeholder="e.g., Apply neem oil, improve ventilation..."
                    />
                    {formData.solutions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('solutions', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('solutions')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Solution
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="prevention">Prevention Tips</Label>
              <Textarea
                id="prevention"
                value={formData.prevention}
                onChange={(e) => setFormData(prev => ({ ...prev, prevention: e.target.value }))}
                placeholder="Tips to prevent this problem from occurring..."
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label>Images</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload images to help identify the problem
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select Images
                </Button>
              </div>

              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4">
                  <Label>Selected Images</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white hover:bg-red-600"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? 'Update Item' : 'Create Item'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
