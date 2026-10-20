import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChoose from "@/components/WhyChoose";
import BestSellingProducts from "@/components/BestSellingProducts";

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden">
      {/* Subtle cosmic ambient glows that illuminate liquid glass edges */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-96 w-[500px] -translate-x-1/2 rounded-full bg-[#1677FF]/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-[38%] -left-40 -z-10 h-80 w-80 rounded-full bg-[#1677FF]/10 blur-[110px]" />
      <div className="pointer-events-none absolute top-[70%] -right-40 -z-10 h-96 w-96 rounded-full bg-[#1677FF]/10 blur-[130px]" />

      <Hero />

      <FeaturedCategories />

      <BestSellingProducts />

      <WhyChoose />

      <FeaturedProducts />
    </main>
  );
}