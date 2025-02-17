import { env } from "process";

export const applicationName = "Somnyx";
export const baseUrl = "https://somnyx.app";

export const DOMAIN =
  env.NODE_ENV === "production" ? baseUrl : "http://localhost:3000";

export const SEO = {
  default: {
    title: "Somnyx | Never Let Another Dream Slip Away",
    description:
      "Turn your morning dream fragments into meaningful insights with AI-powered interpretation, before those precious moments fade away.",
    keywords:
      "dream journal, dream interpretation, AI dream analysis, dream tracking, dream patterns",
  },
  pages: {
    auth: {
      title: "Sign In / Sign Up",
    },
    dashboard: {
      title: "Dashboard",
      description:
        "View your dream patterns, emotional insights, and recent dream entries all in one place.",
    },
    dreams: {
      title: "Dreams",
      description:
        "Your personal space to record and reflect on your dreams with AI-assisted interpretation.",
    },
    journal: {
      title: "Dream Journal",
      description:
        "Your personal space to record and reflect on your dreams with AI-assisted interpretation.",
    },
    insights: {
      title: "Insights",
      description:
        "Discover patterns and meanings in your dreams with AI-powered emotional and thematic analysis.",
    },
    dreamDictionary: {
      title: "Dream Dictionary",
      description:
        "Explore common dream symbols and their meanings in our comprehensive dream dictionary.",
    },

    interpret: {
      title: "Free Dream Interpretation",
      description:
        "Share your dream with our AI-powered tool and receive an insightful interpretation that reveals the hidden meanings, symbols, and psychological patterns in your dream experience.",
    },
    support: {
      title: "Support",
      description: "Get help and support from the Somnyx team.",
    },
    blog: {
      title: "Blog",
      description:
        "Articles, guides, and insights about dream interpretation, lucid dreaming, and sleep science.",
    },
    contact: {
      title: "Contact Us",
      description: "Get in touch with the Somnyx team for support or feedback.",
    },
    settings: {
      title: "Account Settings",
      description: "Manage your Somnyx account preferences and settings.",
    },
    orderSuccess: {
      title: "Order Success",
      description: "Your order has been successfully processed.",
    },
  },
  legal: {
    privacyPolicy: {
      title: "Privacy Policy",
      description:
        "Read our privacy policy to understand how we use your data.",
    },
    termsOfService: {
      title: "Terms of Service",
      description:
        "Read our terms of service to understand how we use your data.",
    },
  },
  templates: {
    dream: {
      title: "%s - Dream Entry",
      description: "Detailed analysis and interpretation of dream: %s",
    },
    blogPost: {
      title: "%s - Somnyx Blog",
      description:
        "%s - Read more about dreams and dream interpretation on the Somnyx blog.",
    },
    dreamTheme: {
      title: "%s - Dream Symbol Meaning",
      description: "Explore the meaning and interpretation of %s in dreams.",
    },
  },
};
