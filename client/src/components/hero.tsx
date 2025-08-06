import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-mint-green to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Premium Cannabis
              <span className="text-forest-green block">Plants & Cuttings</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Professional-grade cannabis cuttings and seedlings grown with care. 
              Perfect genetics, healthy plants, delivered to your chosen safe location or available at our secure pickup hotspots.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-forest-green text-white px-8 py-4 rounded-lg font-semibold hover:bg-sage-green transition-colors"
                onClick={() => scrollToSection('cuttings')}
                data-testid="button-shop-cuttings"
              >
                Shop Cuttings
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-forest-green text-forest-green px-8 py-4 rounded-lg font-semibold hover:bg-forest-green hover:text-white transition-colors"
                onClick={() => scrollToSection('seedlings')}
                data-testid="button-view-seedlings"
              >
                View Seedlings
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/6480102/pexels-photo-6480102.jpeg?auto=compress&cs=tinysrgb&w=800&h=600" 
              alt="Professional cannabis growing facility with healthy plants" 
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
