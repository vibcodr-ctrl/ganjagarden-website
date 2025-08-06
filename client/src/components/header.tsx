import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Leaf } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function Header() {
  const { items, toggleCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-forest-green">
              <Leaf className="inline mr-2" size={24} />
              GreenLeaf Cannabis
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-gray-700 hover:text-forest-green transition-colors"
              data-testid="nav-home"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('cuttings')} 
              className="text-gray-700 hover:text-forest-green transition-colors"
              data-testid="nav-cuttings"
            >
              Cuttings
            </button>
            <button 
              onClick={() => scrollToSection('seedlings')} 
              className="text-gray-700 hover:text-forest-green transition-colors"
              data-testid="nav-seedlings"
            >
              Seedlings
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-gray-700 hover:text-forest-green transition-colors"
              data-testid="nav-about"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-gray-700 hover:text-forest-green transition-colors"
              data-testid="nav-contact"
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="relative text-gray-700 hover:text-forest-green"
              data-testid="button-cart"
            >
              <ShoppingCart className="text-xl" />
              {itemCount > 0 && (
                <span 
                  className="absolute -top-2 -right-2 bg-forest-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  data-testid="text-cart-count"
                >
                  {itemCount}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-700 hover:text-forest-green"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="text-xl" />
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-gray-700 hover:text-forest-green transition-colors py-2 text-left"
                data-testid="nav-mobile-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('cuttings')} 
                className="text-gray-700 hover:text-forest-green transition-colors py-2 text-left"
                data-testid="nav-mobile-cuttings"
              >
                Cuttings
              </button>
              <button 
                onClick={() => scrollToSection('seedlings')} 
                className="text-gray-700 hover:text-forest-green transition-colors py-2 text-left"
                data-testid="nav-mobile-seedlings"
              >
                Seedlings
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-gray-700 hover:text-forest-green transition-colors py-2 text-left"
                data-testid="nav-mobile-about"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-gray-700 hover:text-forest-green transition-colors py-2 text-left"
                data-testid="nav-mobile-contact"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
