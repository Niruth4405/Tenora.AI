import HeroSection from "./components/marketing/hero-section";
import BenefitsSection from "./components/marketing/benefits-section";
import PricingSection from "./components/marketing/pricing-section";
import CtaSection from "./components/marketing/cta-section";
import SiteNavbar from "./components/marketing/site-navbar";


export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0b0d10] text-white">
      <SiteNavbar />
      <HeroSection />
      <BenefitsSection />
      <PricingSection />
      <CtaSection />
    </main>
  );
}