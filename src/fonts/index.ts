import { Lora, Open_Sans } from "next/font/google";

export const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });

export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});
