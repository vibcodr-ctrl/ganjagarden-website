import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  FileText, 
  Save, 
  Eye, 
  ArrowLeft,
  Globe,
  Type,
  Layout,
  Plus
} from 'lucide-react';
import { useLocation } from 'wouter';

interface SiteContent {
  id: string;
  key: string;
  title: string;
  content: string;
  contentType: string;
  isActive: boolean;
  orderIndex: number;
}

interface ContentFormData {
  key: string;
  title: string;
  content: string;
  contentType: string;
  isActive: boolean;
  orderIndex: number;
}

interface PickupLocation {
  name: string;
  district: string;
  spot: string;
  hours: string;
  notes: string;
  isPopular?: boolean;
}

const DEFAULT_CONTENT_SECTIONS = [
  // Hero Section
  {
    key: 'hero_title',
    title: 'Hero Section Title',
    content: 'Premium Cannabis Plants & Cuttings',
    contentType: 'text',
    description: 'Main headline on the homepage hero section'
  },
  {
    key: 'hero_subtitle',
    title: 'Hero Section Subtitle',
    content: 'Professional-grade cannabis cuttings and seedlings grown with care. Perfect genetics, healthy plants, delivered to your chosen safe location or available at our secure pickup hotspots.',
    contentType: 'text',
    description: 'Subtitle text below the main headline'
  },
  
  // Plant Selection Section
  {
    key: 'plant_selection_title',
    title: 'Plant Selection Title',
    content: 'Choose Your Plants',
    contentType: 'text',
    description: 'Title for the plant selection section'
  },
  {
    key: 'plant_selection_description',
    title: 'Plant Selection Description',
    content: 'We specialize in two types of premium cannabis plants, each carefully cultivated for optimal growth and genetics.',
    contentType: 'text',
    description: 'Description for the plant selection section'
  },
  
  // Featured Cuttings Section
  {
    key: 'featured_cuttings_title',
    title: 'Featured Cuttings Title',
    content: 'Featured Cuttings',
    contentType: 'text',
    description: 'Title for the featured cuttings section'
  },
  {
    key: 'featured_cuttings_description',
    title: 'Featured Cuttings Description',
    content: 'Our most popular and highest-quality cutting varieties',
    contentType: 'text',
    description: 'Description for the featured cuttings section'
  },
  
  // Premium Seedlings Section
  {
    key: 'premium_seedlings_title',
    title: 'Premium Seedlings Title',
    content: 'Premium Seedlings',
    contentType: 'text',
    description: 'Title for the premium seedlings section'
  },
  {
    key: 'premium_seedlings_description',
    title: 'Premium Seedlings Description',
    content: 'Fresh seedlings from top-tier genetics',
    contentType: 'text',
    description: 'Description for the premium seedlings section'
  },
  
  // Why Choose GreenLeaf Section
  {
    key: 'why_choose_title',
    title: 'Why Choose GreenLeaf Title',
    content: 'Why Choose GreenLeaf?',
    contentType: 'text',
    description: 'Title for the why choose us section'
  },
  {
    key: 'why_choose_subtitle',
    title: 'Why Choose GreenLeaf Subtitle',
    content: 'Professional quality, reliable delivery, expert support',
    contentType: 'text',
    description: 'Subtitle for the why choose us section'
  },
  {
    key: 'why_choose_feature_1_title',
    title: 'Why Choose Feature 1 Title',
    content: 'Premium Genetics',
    contentType: 'text',
    description: 'Title for the first feature (Premium Genetics)'
  },
  {
    key: 'why_choose_feature_1_description',
    title: 'Why Choose Feature 1 Description',
    content: 'All our plants come from carefully selected mother plants and premium seeds, ensuring superior genetics and consistent quality.',
    contentType: 'text',
    description: 'Description for the first feature (Premium Genetics)'
  },
  {
    key: 'why_choose_feature_2_title',
    title: 'Why Choose Feature 2 Title',
    content: 'Safe & Flexible Delivery',
    contentType: 'text',
    description: 'Title for the second feature (Safe & Flexible Delivery)'
  },
  {
    key: 'why_choose_feature_2_description',
    title: 'Why Choose Feature 2 Description',
    content: 'Choose your preferred safe meeting location - whether it\'s your home, a parking lot, or one of our secure pickup hotspots. We prioritize your safety and discretion while ensuring your plants arrive healthy.',
    contentType: 'text',
    description: 'Description for the second feature (Safe & Flexible Delivery)'
  },
  {
    key: 'why_choose_feature_3_title',
    title: 'Why Choose Feature 3 Title',
    content: 'Expert Support',
    contentType: 'text',
    description: 'Title for the third feature (Expert Support)'
  },
  {
    key: 'why_choose_feature_3_description',
    title: 'Why Choose Feature 3 Description',
    content: 'Our experienced team provides ongoing support and growing tips to help you achieve the best results with your plants.',
    contentType: 'text',
    description: 'Description for the third feature (Expert Support)'
  },
  
  // Safety Section
  {
    key: 'safety_title',
    title: 'Safety Section Title',
    content: 'Your Safety is Our Priority',
    contentType: 'text',
    description: 'Title for the safety section'
  },
  {
    key: 'safety_description',
    title: 'Safety Section Description',
    content: 'We offer flexible and secure delivery options to ensure you feel completely safe when receiving your plants.',
    contentType: 'text',
    description: 'Description for the safety section'
  },
  {
    key: 'safety_choose_location_title',
    title: 'Safety Choose Location Title',
    content: 'Choose Any Safe Location',
    contentType: 'text',
    description: 'Title for the choose location subsection'
  },
  {
    key: 'safety_choose_location_description',
    title: 'Safety Choose Location Description',
    content: 'Select any location where you feel secure - your home, a parking lot, shopping center, or any public place that works for you. We adapt to your comfort level.',
    contentType: 'text',
    description: 'Description for the choose location subsection'
  },
  {
    key: 'safety_pickup_hotspots_title',
    title: 'Safety Pickup Hotspots Title',
    content: 'Secure Pickup Hotspots',
    contentType: 'text',
    description: 'Title for the pickup hotspots subsection'
  },
  {
    key: 'safety_pickup_hotspots_description',
    title: 'Safety Pickup Hotspots Description',
    content: 'We maintain a network of trusted pickup locations throughout the area. These are safe, discreet spots where you can meet our team with complete confidence.',
    contentType: 'text',
    description: 'Description for the pickup hotspots subsection'
  },
  {
    key: 'safety_professional_title',
    title: 'Safety Professional Title',
    content: 'Professional & Discreet',
    contentType: 'text',
    description: 'Title for the professional subsection'
  },
  {
    key: 'safety_professional_description',
    title: 'Safety Professional Description',
    content: 'Our team is trained to conduct all meetings professionally and discreetly. Your privacy and safety are always our top concerns.',
    contentType: 'text',
    description: 'Description for the professional subsection'
  },
  {
    key: 'delivery_options_title',
    title: 'Delivery Options Title',
    content: 'Delivery Options',
    contentType: 'text',
    description: 'Title for the delivery options section'
  },
  {
    key: 'delivery_safe_location_title',
    title: 'Delivery Safe Location Title',
    content: 'Safe Location Delivery',
    contentType: 'text',
    description: 'Title for safe location delivery'
  },
  {
    key: 'delivery_safe_location_description',
    title: 'Delivery Safe Location Description',
    content: 'We deliver to any address or location you specify - whether it\'s your home, workplace, or a public meeting spot like a parking lot or cafe.',
    contentType: 'text',
    description: 'Description for safe location delivery'
  },
  {
    key: 'delivery_pickup_hotspots_title',
    title: 'Delivery Pickup Hotspots Title',
    content: 'Secure Pickup Hotspots',
    contentType: 'text',
    description: 'Title for pickup hotspots delivery'
  },
  {
    key: 'delivery_pickup_hotspots_description',
    title: 'Delivery Pickup Hotspots Description',
    content: 'Choose from our established network of secure pickup locations:',
    contentType: 'text',
    description: 'Description for pickup hotspots delivery'
  },
  {
    key: 'delivery_pickup_locations',
    title: 'Delivery Pickup Locations List',
    content: '• Downtown Mall Parking - Level 2 (West Side)\n• Riverside Park - Main Entrance Lot\n• Metro Station Plaza - Coffee Shop Area\n• Shopping Center - Food Court Parking\n• Community Center - Back Parking Lot\n+ More locations available upon request',
    contentType: 'text',
    description: 'List of pickup locations'
  },
  {
    key: 'delivery_priority_message',
    title: 'Delivery Priority Message',
    content: 'All meetings are conducted safely with your security and privacy as our highest priority.',
    contentType: 'text',
    description: 'Message about safety priority'
  },
  
  // Pickup Locations Section
  {
    key: 'pickup_locations_title',
    title: 'Pickup Locations Title',
    content: 'Secure Pickup Locations',
    contentType: 'text',
    description: 'Title for the pickup locations section'
  },
  {
    key: 'pickup_locations_description',
    title: 'Pickup Locations Description',
    content: 'Choose from our network of safe, convenient pickup hotspots throughout the area. All locations are carefully selected for your safety and privacy.',
    contentType: 'text',
    description: 'Description for the pickup locations section'
  },
  {
    key: 'pickup_locations_list',
    title: 'Pickup Locations List',
    content: JSON.stringify([
      {
        name: 'Downtown Mall Plaza',
        district: 'Downtown',
        spot: 'Level 2 Parking - West Side',
        hours: '9AM - 9PM',
        notes: 'Near the main entrance, well-lit area with security cameras',
        isPopular: true
      },
      {
        name: 'Riverside Park',
        district: 'Riverside',
        spot: 'Main Entrance Parking Lot',
        hours: '8AM - 8PM',
        notes: 'Spacious parking with easy access, family-friendly area',
        isPopular: true
      },
      {
        name: 'Metro Station Plaza',
        district: 'Metro District',
        spot: 'Coffee Shop Area - North Side',
        hours: '7AM - 10PM',
        notes: 'High traffic area, multiple exit routes for convenience'
      },
      {
        name: 'Westside Shopping Center',
        district: 'West Side',
        spot: 'Food Court Parking Section B',
        hours: '10AM - 9PM',
        notes: 'Covered parking available, close to multiple businesses',
        isPopular: true
      },
      {
        name: 'Community Recreation Center',
        district: 'North End',
        spot: 'Back Parking Lot - Staff Entrance',
        hours: '6AM - 10PM',
        notes: 'Quiet location with regular security patrols'
      },
      {
        name: 'University Campus',
        district: 'University District',
        spot: 'Visitor Parking - Building C',
        hours: '8AM - 6PM',
        notes: 'Academic area with consistent foot traffic'
      }
    ]),
    contentType: 'json',
    description: 'List of pickup locations with details'
  },
  
  // Location Flexibility Section
  {
    key: 'location_flexibility_title',
    title: 'Location Flexibility Title',
    content: 'Need a Different Location?',
    contentType: 'text',
    description: 'Title for the location flexibility section'
  },
  {
    key: 'location_flexibility_description',
    title: 'Location Flexibility Description',
    content: 'These are our established pickup hotspots, but we\'re flexible! If you have a preferred safe meeting location that\'s not listed, just let us know. We can arrange pickups at parking lots, shopping centers, or any public place where you feel comfortable.',
    contentType: 'text',
    description: 'Description for the location flexibility section'
  },
  {
    key: 'location_flexibility_button',
    title: 'Location Flexibility Button',
    content: 'Suggest a Location',
    contentType: 'text',
    description: 'Text for the suggest location button'
  },
  {
    key: 'location_flexibility_message',
    title: 'Location Flexibility Message',
    content: 'All meetings are safe, discreet, and professional',
    contentType: 'text',
    description: 'Message about meeting safety'
  },
  {
    key: 'location_benefits_title_1',
    title: 'Location Benefits Title 1',
    content: 'Vetted Locations',
    contentType: 'text',
    description: 'Title for the first location benefit'
  },
  {
    key: 'location_benefits_description_1',
    title: 'Location Benefits Description 1',
    content: 'All pickup spots are carefully selected for safety and convenience',
    contentType: 'text',
    description: 'Description for the first location benefit'
  },
  {
    key: 'location_benefits_title_2',
    title: 'Location Benefits Title 2',
    content: 'Flexible Hours',
    contentType: 'text',
    description: 'Title for the second location benefit'
  },
  {
    key: 'location_benefits_description_2',
    title: 'Location Benefits Description 2',
    content: 'Most locations available during extended hours for your convenience',
    contentType: 'text',
    description: 'Description for the second location benefit'
  },
  {
    key: 'location_benefits_title_3',
    title: 'Location Benefits Title 3',
    content: 'Wide Coverage',
    contentType: 'text',
    description: 'Title for the third location benefit'
  },
  {
    key: 'location_benefits_description_3',
    title: 'Location Benefits Description 3',
    content: 'Pickup points across different areas to minimize your travel time',
    contentType: 'text',
    description: 'Description for the third location benefit'
  }
];

export default function AdminContent() {
  const [contentSections, setContentSections] = useState<SiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);
  const [formData, setFormData] = useState<ContentFormData>({
    key: '',
    title: '',
    content: '',
    contentType: 'text',
    isActive: true,
    orderIndex: 0
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPickupEditorOpen, setIsPickupEditorOpen] = useState(false);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    checkAuth();
    fetchContent();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLocation('/admin/login');
    }
  };

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContentSections(data);
      } else {
        // If no content exists, initialize with defaults
        initializeDefaultContent();
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      initializeDefaultContent();
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDefaultContent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const createdSections: SiteContent[] = [];

      for (const section of DEFAULT_CONTENT_SECTIONS) {
        const response = await fetch('/api/admin/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...section,
            isActive: true,
            orderIndex: DEFAULT_CONTENT_SECTIONS.indexOf(section)
          })
        });

        if (response.ok) {
          const created = await response.json();
          createdSections.push(created.content);
        }
      }

      setContentSections(createdSections);
    } catch (error) {
      console.error('Error initializing content:', error);
      setError('Failed to initialize content sections');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingContent 
        ? `/api/admin/content/${editingContent.id}`
        : '/api/admin/content';
      
      const method = editingContent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(editingContent ? 'Content updated successfully!' : 'Content created successfully!');
        setIsFormOpen(false);
        resetForm();
        fetchContent();
      } else {
        const data = await response.json();
        setError(data.message || 'Operation failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handleEdit = (content: SiteContent) => {
    setEditingContent(content);
    setFormData({
      key: content.key,
      title: content.title,
      content: content.content,
      contentType: content.contentType,
      isActive: content.isActive,
      orderIndex: content.orderIndex
    });
    setIsFormOpen(true);
  };

  const handleToggleActive = async (contentId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const content = contentSections.find(c => c.id === contentId);
      if (!content) return;

      const response = await fetch(`/api/admin/content/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...content,
          isActive: !currentStatus
        })
      });

      if (response.ok) {
        fetchContent();
        setSuccess('Content status updated successfully!');
      }
    } catch (error) {
      setError('Failed to update content status');
    }
  };

  const resetForm = () => {
    setFormData({
      key: '',
      title: '',
      content: '',
      contentType: 'text',
      isActive: true,
      orderIndex: 0
    });
    setEditingContent(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Pickup Location Management Functions
  const openPickupEditor = () => {
    const pickupContent = contentSections.find(c => c.key === 'pickup_locations_list');
    if (pickupContent && pickupContent.contentType === 'json') {
      try {
        const locations = JSON.parse(pickupContent.content);
        setPickupLocations(locations);
      } catch (error) {
        setPickupLocations([]);
      }
    } else {
      setPickupLocations([]);
    }
    setIsPickupEditorOpen(true);
  };

  const updatePickupLocation = (index: number, field: keyof PickupLocation, value: string | boolean) => {
    setPickupLocations(prev => prev.map((location, i) => 
      i === index ? { ...location, [field]: value } : location
    ));
  };

  const addPickupLocation = () => {
    setPickupLocations(prev => [...prev, {
      name: '',
      district: '',
      spot: '',
      hours: '',
      notes: '',
      isPopular: false
    }]);
  };

  const removePickupLocation = (index: number) => {
    setPickupLocations(prev => prev.filter((_, i) => i !== index));
  };

  const savePickupLocations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const pickupContent = contentSections.find(c => c.key === 'pickup_locations_list');
      
      if (!pickupContent) {
        setError('Pickup locations content section not found');
        return;
      }

      const response = await fetch(`/api/admin/content/${pickupContent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...pickupContent,
          content: JSON.stringify(pickupLocations)
        })
      });

      if (response.ok) {
        setSuccess('Pickup locations updated successfully!');
        setIsPickupEditorOpen(false);
        fetchContent();
      } else {
        setError('Failed to update pickup locations');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const previewContent = (key: string) => {
    // Open the main website in a new tab to preview content
    window.open('/', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={openPickupEditor}
                variant="outline"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Globe className="w-4 h-4 mr-2" />
                Manage Pickup Locations
              </Button>
              <Button
                onClick={openCreateForm}
                className="bg-green-600 hover:bg-green-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Content Sections */}
        <div className="space-y-6">
          {contentSections.map((section) => (
            <Card key={section.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {section.contentType}
                      </Badge>
                      <Badge variant={section.isActive ? 'default' : 'secondary'}>
                        {section.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm text-gray-600">
                      Key: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{section.key}</code>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={section.isActive}
                      onCheckedChange={() => handleToggleActive(section.id, section.isActive)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(section)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => previewContent(section.key)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    {section.key === 'pickup_locations_list' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openPickupEditor}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Edit Locations
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Content Preview:</div>
                  <div className="text-gray-900">
                    {section.contentType === 'html' ? (
                      <div dangerouslySetInnerHTML={{ __html: section.content }} />
                    ) : (
                      <p className="whitespace-pre-wrap">{section.content}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {contentSections.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content sections found</h3>
            <p className="text-gray-600">
              Get started by adding your first content section
            </p>
          </div>
        )}
      </main>

      {/* Content Form Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingContent ? 'Edit Content' : 'Add New Content'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">Content Key *</Label>
                    <Input
                      id="key"
                      value={formData.key}
                      onChange={(e) => setFormData({...formData, key: e.target.value})}
                      placeholder="e.g., hero_title, about_content"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contentType">Content Type *</Label>
                    <Select value={formData.contentType} onValueChange={(value) => setFormData({...formData, contentType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Plain Text</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Section Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Hero Section Title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Enter the content for this section..."
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderIndex">Display Order</Label>
                    <Input
                      id="orderIndex"
                      type="number"
                      min="0"
                      value={formData.orderIndex}
                      onChange={(e) => setFormData({...formData, orderIndex: parseInt(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    {editingContent ? 'Update Content' : 'Create Content'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Pickup Locations Editor Dialog */}
      {isPickupEditorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Pickup Locations</h2>
              
              <div className="space-y-4">
                {pickupLocations.map((location, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Location Name</Label>
                        <Input
                          value={location.name}
                          onChange={(e) => updatePickupLocation(index, 'name', e.target.value)}
                          placeholder="Location name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>District</Label>
                        <Input
                          value={location.district}
                          onChange={(e) => updatePickupLocation(index, 'district', e.target.value)}
                          placeholder="District/Area"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Specific Spot</Label>
                        <Input
                          value={location.spot}
                          onChange={(e) => updatePickupLocation(index, 'spot', e.target.value)}
                          placeholder="Specific pickup spot"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hours</Label>
                        <Input
                          value={location.hours}
                          onChange={(e) => updatePickupLocation(index, 'hours', e.target.value)}
                          placeholder="Operating hours"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Notes</Label>
                        <Textarea
                          value={location.notes}
                          onChange={(e) => updatePickupLocation(index, 'notes', e.target.value)}
                          placeholder="Additional notes about the location"
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center space-x-2 md:col-span-2">
                        <Switch
                          checked={location.isPopular || false}
                          onCheckedChange={(checked) => updatePickupLocation(index, 'isPopular', checked)}
                        />
                        <Label>Mark as Popular</Label>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePickupLocation(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove Location
                      </Button>
                    </div>
                  </Card>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPickupLocation}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Location
                </Button>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPickupEditorOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={savePickupLocations}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Locations
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
