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
              Perfect genetics, healthy plants, delivered fresh to your location.
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
              src="https://pixabay.com/get/g04935de2b24d4ada2a06e9f81e92b6382f994437f172c2b376f6cbc6277339e7c7d1b77eddf0ab7ef681f81bc9dff0449ab9dee75cac26df37d7e12cb4c83967_1280.jpg" 
              alt="Professional cannabis growing facility" 
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
