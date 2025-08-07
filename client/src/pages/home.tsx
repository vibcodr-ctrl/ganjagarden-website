import Header from "@/components/header";
import Hero from "@/components/hero";
import ProductCategories from "@/components/product-categories";
import FeaturedProducts from "@/components/featured-products";
import SeedlingsSection from "@/components/seedlings-section";
import WhyChooseUs from "@/components/why-choose-us";
import OrderProcess from "@/components/order-process";
import SafetySection from "@/components/safety-section";
import PickupLocations from "@/components/pickup-locations";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import CartOverlay from "@/components/cart-overlay";
import ShopScene from "@/components/shop-scene";
import ShopAssistant from "@/components/shop-assistant";
import { CartProvider } from "@/hooks/use-cart";

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <CartOverlay />
        <ShopAssistant />
        <main>
          <Hero />
          <ShopScene />
          <ProductCategories />
          <FeaturedProducts />
          <SeedlingsSection />
          <WhyChooseUs />
          <OrderProcess />
          <SafetySection />
          <PickupLocations />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
