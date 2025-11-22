import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/sections/home/HeroSection';
import StatsSection from '@/components/sections/home/StatsSection';
import FeaturesSection from '@/components/sections/home/FeaturesSection'; // Baru
import ServicesSection from '@/components/sections/home/ServicesSection'; // Baru
import HowItWorksSection from '@/components/sections/home/HowItWorksSection';
import CTASection from '@/components/sections/home/CTASection'; // Baru

const LandingPage = () => {
  return (
    <MainLayout>
      <HeroSection />
      <StatsSection />
      
      {/* Keunggulan Kami */}
      <FeaturesSection />
      
      {/* Cara Kerja */}
      <HowItWorksSection />
      
      {/* Kategori Layanan */}
      <ServicesSection />
      
      {/* Call to Action (Penutup) */}
      <CTASection />
    </MainLayout>
  );
};

export default LandingPage;