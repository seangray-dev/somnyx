import FAQSection from "@/components/shared/faq-section";
import FeaturesSection from "@/features/landing/components/features-section";
import HeroSection from "@/features/landing/components/hero-section";
import HowItWorksSection from "@/features/landing/components/how-it-works-section";
import { generatePageJSONLD } from "@/features/landing/utils/json-ld";
import PricingSection from "@/features/pricing-payments/components/pricing-section";

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generatePageJSONLD()),
        }}
      />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
    </>
  );
}
