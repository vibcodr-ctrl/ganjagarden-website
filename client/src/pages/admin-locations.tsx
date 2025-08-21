import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  MapPin, 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Clock,
  Map,
  Star
} from 'lucide-react';
import { useLocation } from 'wouter';

interface PickupLocation {
  id: string;
  name: string;
  district: string;
  spot: string;
  hours: string;
  notes: string;
  isPopular: boolean;
  isActive: boolean;
}

export default function AdminLocations() {
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingLocation, setEditingLocation] = useState<PickupLocation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    district: '',
    spot: '',
    hours: '',
    notes: '',
    isPopular: false,
    isActive: true
  });

  useEffect(() => {
    checkAuth();
    fetchLocations();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLocation('/admin/login');
    }
  };

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/locations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      } else {
        setError('Failed to fetch locations');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to fetch locations');
    } finally {
      setIsLoading(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      
      if (editingLocation) {
        // Update existing location
        const response = await fetch(`/api/admin/locations/${editingLocation.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const updatedLocation = await response.json();
          setLocations(prev => prev.map(loc => 
            loc.id === editingLocation.id ? updatedLocation : loc
          ));
          setSuccess('Location updated successfully!');
        } else {
          setError('Failed to update location');
          return;
        }
      } else {
        // Add new location
        const response = await fetch('/api/admin/locations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const newLocation = await response.json();
          setLocations(prev => [...prev, newLocation]);
          setSuccess('Location added successfully!');
        } else {
          setError('Failed to create location');
          return;
        }
      }

      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      setError('Failed to save location');
    }
  };



  const handleEdit = (location: PickupLocation) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      district: location.district,
      spot: location.spot,
      hours: location.hours,
      notes: location.notes,
      isPopular: location.isPopular,
      isActive: location.isActive
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (locationId: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`/api/admin/locations/${locationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const updatedLocations = locations.filter(loc => loc.id !== locationId);
          setLocations(updatedLocations);
          setSuccess('Location deleted successfully!');
        } else {
          setError('Failed to delete location');
        }
      } catch (error) {
        setError('Failed to delete location');
      }
    }
  };

  const toggleLocationStatus = async (locationId: string) => {
    try {
      const location = locations.find(loc => loc.id === locationId);
      if (!location) return;

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/locations/${locationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...location,
          isActive: !location.isActive
        })
      });

      if (response.ok) {
        const updatedLocation = await response.json();
        setLocations(prev => prev.map(loc => 
          loc.id === locationId ? updatedLocation : loc
        ));
      } else {
        setError('Failed to update location status');
      }
    } catch (error) {
      setError('Failed to update location status');
    }
  };

  const togglePopular = async (locationId: string) => {
    try {
      const location = locations.find(loc => loc.id === locationId);
      if (!location) return;

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/locations/${locationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...location,
          isPopular: !location.isPopular
        })
      });

      if (response.ok) {
        const updatedLocation = await response.json();
        setLocations(prev => prev.map(loc => 
          loc.id === locationId ? updatedLocation : loc
        ));
      } else {
        setError('Failed to update location popularity');
      }
    } catch (error) {
      setError('Failed to update location popularity');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      district: '',
      spot: '',
      hours: '',
      notes: '',
      isPopular: false,
      isActive: true
    });
    setEditingLocation(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading locations...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Location Management</h1>
            </div>
            <Button
              onClick={openCreateForm}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Location
            </Button>
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <MapPin className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Locations</p>
                  <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Star className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Popular Locations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {locations.filter(loc => loc.isPopular).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Locations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {locations.filter(loc => loc.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Map className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Districts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(locations.map(loc => loc.district)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <Card key={location.id} className={`hover:shadow-lg transition-shadow ${!location.isActive ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>{location.name}</span>
                      {location.isPopular && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {location.district}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={location.isActive}
                      onCheckedChange={() => toggleLocationStatus(location.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{location.spot}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{location.hours}</span>
                </div>
                
                {location.notes && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {location.notes}
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(location)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePopular(location.id)}
                    className={location.isPopular ? 'bg-yellow-100 text-yellow-800' : ''}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    {location.isPopular ? 'Popular' : 'Mark Popular'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(location.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {locations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
            <p className="text-gray-600">
              Get started by adding your first pickup location
            </p>
          </div>
        )}
      </main>

      {/* Location Form Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Location Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Downtown Mall Plaza"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      placeholder="e.g., Downtown"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="spot">Specific Spot *</Label>
                    <Input
                      id="spot"
                      value={formData.spot}
                      onChange={(e) => setFormData({...formData, spot: e.target.value})}
                      placeholder="e.g., Level 2 Parking - West Side"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hours">Operating Hours *</Label>
                    <Input
                      id="hours"
                      value={formData.hours}
                      onChange={(e) => setFormData({...formData, hours: e.target.value})}
                      placeholder="e.g., 9AM - 9PM"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="e.g., Near the main entrance, well-lit area with security cameras"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPopular"
                      checked={formData.isPopular}
                      onCheckedChange={(checked) => setFormData({...formData, isPopular: checked})}
                    />
                    <Label htmlFor="isPopular">Mark as Popular Location</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
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
                    {editingLocation ? 'Update Location' : 'Add Location'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
