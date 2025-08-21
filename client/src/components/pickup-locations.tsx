import { MapPin, Clock, Shield, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

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

export default function PickupLocations() {
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      if (response.ok) {
        const data = await response.json();
        // Only show active locations
        const activeLocations = data.filter((loc: PickupLocation) => loc.isActive);
        setLocations(activeLocations);
      } else {
        console.error('Failed to fetch locations');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pickup-locations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Secure Pickup Locations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our network of safe, convenient pickup hotspots throughout the area. 
            All locations are carefully selected for your safety and privacy.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pickup locations...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {locations.map((location) => (
              <Card 
                key={location.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  location.isPopular ? 'ring-2 ring-forest-green ring-opacity-20' : ''
                }`}
              >
                {location.isPopular && (
                  <div className="absolute top-0 right-0 bg-forest-green text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                    Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="bg-mint-green rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-forest-green" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{location.name}</h3>
                      <p className="text-sm text-gray-600">{location.district}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{location.spot}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-gray-400" />
                      <span>{location.hours}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Shield size={14} className="text-gray-400 mt-0.5" />
                      <span className="text-xs">{location.notes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="bg-mint-green rounded-2xl p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Different Location?
            </h3>
            <p className="text-gray-600 mb-6">
              These are our established pickup hotspots, but we're flexible! 
              If you have a preferred safe meeting location that's not listed, just let us know. 
              We can arrange pickups at parking lots, shopping centers, or any public place where you feel comfortable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-forest-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-sage-green transition-colors"
                onClick={scrollToContact}
                data-testid="button-suggest-location"
              >
                <Phone className="mr-2" size={16} />
                Suggest a Location
              </Button>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Shield size={16} className="text-forest-green" />
                <span>All meetings are safe, discreet, and professional</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="bg-forest-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={24} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Vetted Locations</h4>
            <p className="text-sm text-gray-600">All pickup spots are carefully selected for safety and convenience</p>
          </div>
          <div>
            <div className="bg-forest-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="text-white" size={24} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Flexible Hours</h4>
            <p className="text-sm text-gray-600">Most locations available during extended hours for your convenience</p>
          </div>
          <div>
            <div className="bg-forest-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-white" size={24} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Wide Coverage</h4>
            <p className="text-sm text-gray-600">Pickup points across different areas to minimize your travel time</p>
          </div>
        </div>
      </div>
    </section>
  );
}