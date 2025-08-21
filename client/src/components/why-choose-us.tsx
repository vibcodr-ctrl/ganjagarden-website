import { Sprout, Truck, UserCheck } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-20 bg-forest-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Why Choose GreenLeaf?</h2>
          <p className="text-xl text-green-100">Professional quality, reliable delivery, expert support</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sprout className="text-3xl text-forest-green" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Premium Genetics</h3>
            <p className="text-green-100">All our plants come from carefully selected mother plants and premium seeds, ensuring superior genetics and consistent quality.</p>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Truck className="text-3xl text-forest-green" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Safe & Flexible Delivery</h3>
            <p className="text-green-100">Choose your preferred safe meeting location - whether it's your home, a parking lot, or one of our secure pickup hotspots. We prioritize your safety and discretion while ensuring your plants arrive healthy.</p>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <UserCheck className="text-3xl text-forest-green" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Expert Support</h3>
            <p className="text-green-100">Our experienced team provides ongoing support and growing tips to help you achieve the best results with your plants.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
