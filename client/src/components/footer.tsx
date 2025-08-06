import { Leaf, Facebook, Instagram, Twitter, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-white mb-4">
              <Leaf className="inline mr-2 text-sage-green" size={24} />
              GreenLeaf Cannabis
            </div>
            <p className="text-gray-300 mb-4">
              Premium cannabis cuttings and seedlings for professional growers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-sage-green transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-sage-green transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-sage-green transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('cuttings')} 
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Premium Cuttings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('seedlings')} 
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Fresh Seedlings
                </button>
              </li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Growing Supplies</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Custom Orders</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Growing Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Plant Care</a></li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <Phone className="mr-3" size={16} />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3" size={16} />
                <span>info@greenleafcannabis.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="mr-3" size={16} />
                <span>Mon-Fri 9AM-6PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 GreenLeaf Cannabis. All rights reserved. | Licensed Cannabis Retailer</p>
        </div>
      </div>
    </footer>
  );
}
