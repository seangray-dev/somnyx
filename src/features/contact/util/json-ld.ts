import { ContactPage, WithContext } from "schema-dts";

export const generateJSONLD = () => {
  const jsonLd: WithContext<ContactPage> = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Get in touch with us Today!",
    description:
      "At Somnyx, we're committed to supporting your communication needs. Feel free to reach out through the contact form below, and our team will ensure your inquiries are addressed promptly.",
    mainEntity: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "somnyxapp@gmail.com",
      availableLanguage: "English",
    },
  };

  return jsonLd;
};
