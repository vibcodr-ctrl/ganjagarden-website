import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function ProductCategories() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Choose Your Plants</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We specialize in two types of premium cannabis plants, each carefully cultivated for optimal growth and genetics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Cuttings Category */}
          <Card className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Cannabis cuttings with healthy root systems" 
              className="w-full h-64 object-cover"
            />
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Cuttings</h3>
              <p className="text-gray-600 mb-6">
                Hand-selected cuttings from our best mother plants. Pre-rooted and ready to transplant, 
                ensuring genetic consistency and faster growth.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-600">
                  <Check className="text-forest-green mr-3" size={16} />
                  Established root systems
                </li>
                <li className="flex items-center text-gray-600">
                  <Check className="text-forest-green mr-3" size={16} />
                  Proven genetics
                </li>
                <li className="flex items-center text-gray-600">
                  <Check className="text-forest-green mr-3" size={16} />
                  Faster to harvest
                </li>
              </ul>
              <Button 
                className="w-full bg-forest-green text-white py-3 rounded-lg font-semibold hover:bg-sage-green transition-colors"
                onClick={() => scrollToSection('cuttings')}
                data-testid="button-shop-cuttings-category"
              >
                Shop Cuttings
              </Button>
            </CardContent>
          </Card>

          {/* Seedlings Category */}
          <Card className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Young cannabis seedlings in nursery pots" 
              className="w-full h-64 object-cover"
            />
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fresh Seedlings</h3>
              <p className="text-gray-600 mb-6">
                Germinated from premium seeds and carefully nurtured through early growth stages. 
                Perfect for growers who want full control from the beginning.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-600">
                  <Check className="text-forest-green mr-3" size={16} />
                  Premium seed genetics
                </li>
                <li className="flex items-center text-gray-600">
                  <Check className="text-forest-green mr-3" size={16} />
                  Healthy early development
                </li>
                <li className="flex items-center text-gray-600">
                  <Check className="text-forest-green mr-3" size={16} />
                  Full growth potential
                </li>
              </ul>
              <Button 
                className="w-full bg-forest-green text-white py-3 rounded-lg font-semibold hover:bg-sage-green transition-colors"
                onClick={() => scrollToSection('seedlings')}
                data-testid="button-shop-seedlings-category"
              >
                Shop Seedlings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
