import Header from "@/components/header";
import Hero from "@/components/hero";
import LandingChat from "@/components/landing-chat";
import ProductCategories from "@/components/product-categories";
import ProductCarousel from "@/components/product-carousel";
import WhyChooseUs from "@/components/why-choose-us";
import SafetySection from "@/components/safety-section";
import PickupLocations from "@/components/pickup-locations";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import CartOverlay from "@/components/cart-overlay";
import FloatingChatButton from "@/components/floating-chat-button";
import { CartProvider } from "@/hooks/use-cart";

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <CartOverlay />
        <FloatingChatButton />
        <main>
          <Hero />
          <WhyChooseUs />
          <ProductCategories />
          <ProductCarousel 
            title="Featured Cuttings" 
            subtitle="Our most popular and highest-quality cutting varieties"
            category="cutting"
            id="cuttings"
          />
          <ProductCarousel 
            title="Premium Seedlings" 
            subtitle="Fresh seedlings from top-tier genetics"
            category="seedling"
            id="seedlings"
          />
          <LandingChat />
          <SafetySection />
          <PickupLocations />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
