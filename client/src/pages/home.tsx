import Header from "@/components/header";
import Hero from "@/components/hero";
import ProductCategories from "@/components/product-categories";
import FeaturedProducts from "@/components/featured-products";
import SeedlingsSection from "@/components/seedlings-section";
import WhyChooseUs from "@/components/why-choose-us";
import OrderProcess from "@/components/order-process";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import CartOverlay from "@/components/cart-overlay";
import { CartProvider } from "@/hooks/use-cart";

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <CartOverlay />
        <main>
          <Hero />
          <ProductCategories />
          <FeaturedProducts />
          <SeedlingsSection />
          <WhyChooseUs />
          <OrderProcess />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
