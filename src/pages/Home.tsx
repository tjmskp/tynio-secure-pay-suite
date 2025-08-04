import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { IntegrationProcess } from "@/components/home/IntegrationProcess";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header userRole="public" />
      <main>
        <HeroSection />
        <IntegrationProcess />
      </main>
      <Footer />
    </div>
  );
}