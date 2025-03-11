import FAQSection from "@/components/shared/faq-section";
import FeaturesSection from "@/features/landing/components/features-section";
import HeroSection from "@/features/landing/components/hero-section";
import HowItWorksSection from "@/features/landing/components/how-it-works-section";
import PricingSection from "@/features/pricing-payments/components/pricing-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
    </>
  );
}
