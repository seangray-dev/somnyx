import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Somnyx",
    short_name: "Somnyx",
    description: "Somnyx is a platform for exploring and analyzing dreams.",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#030712",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
