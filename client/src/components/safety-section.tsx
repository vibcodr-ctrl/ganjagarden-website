import { Shield, MapPin, Users } from "lucide-react";
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

export default function SafetySection() {
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
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Your Safety is Our Priority</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer flexible and secure delivery options to ensure you feel completely safe when receiving your plants.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-forest-green rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Choose Any Safe Location</h3>
                  <p className="text-gray-600">
                    Select any location where you feel secure - your home, a parking lot, shopping center, 
                    or any public place that works for you. We adapt to your comfort level.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-forest-green rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Pickup Hotspots</h3>
                  <p className="text-gray-600">
                    We maintain a network of trusted pickup locations throughout the area. 
                    These are safe, discreet spots where you can meet our team with complete confidence.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-forest-green rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <Shield className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Professional & Discreet</h3>
                  <p className="text-gray-600">
                    Our team is trained to conduct all meetings professionally and discreetly. 
                    Your privacy and safety are always our top concerns.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Delivery Options</h3>
            <div className="space-y-6">
              <div className="border-l-4 border-forest-green pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">Safe Location Delivery</h4>
                <p className="text-gray-600 text-sm">
                  We deliver to any address or location you specify - whether it's your home, 
                  workplace, or a public meeting spot like a parking lot or cafe.
                </p>
              </div>
              
              <div className="border-l-4 border-sage-green pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">Secure Pickup Hotspots</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Choose from our established network of secure pickup locations:
                </p>
                <div className="space-y-1 text-xs text-gray-500">
                  {isLoading ? (
                    <div className="text-gray-400">Loading locations...</div>
                  ) : locations.length > 0 ? (
                    <>
                      {locations.slice(0, 5).map((location) => (
                        <div key={location.id}>• {location.name} - {location.spot}</div>
                      ))}
                      {locations.length > 5 && (
                        <div className="text-forest-green font-medium mt-2">+ {locations.length - 5} more locations available</div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-400">Locations being updated...</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-mint-green rounded-lg">
              <p className="text-sm text-forest-green font-medium">
                <Shield className="inline mr-2" size={16} />
                All meetings are conducted safely with your security and privacy as our highest priority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}