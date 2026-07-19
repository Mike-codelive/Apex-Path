import { BottomCta } from "@/components/homepage/BottomCta";
import { Features } from "@/components/homepage/Features";
import { Hero } from "@/components/homepage/Hero";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { Testimonial } from "@/components/homepage/Testimonial";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function Home(): React.ReactNode {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonial />
      <BottomCta />
      <Footer />
    </main>
  );
}
