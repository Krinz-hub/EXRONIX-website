import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChoose from "@/components/WhyChoose";
import BestSellingProducts from "@/components/BestSellingProducts";

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <Hero />

      <FeaturedCategories />

      <BestSellingProducts />

      <WhyChoose />

      <FeaturedProducts />
    </main>
  );
}