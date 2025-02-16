"use client";

import { Metadata } from "next";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

import { SEO } from "@/config/app";

export default function Page() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {theme === "dark" ? (
        <SignIn appearance={{ baseTheme: dark }} />
      ) : (
        <SignIn />
      )}
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SEO.pages.signIn.title,
    description: SEO.pages.signIn.description,
    openGraph: {
      title: SEO.pages.signIn.title,
      description: SEO.pages.signIn.description,
    },
    twitter: {
      title: SEO.pages.signIn.title,
      description: SEO.pages.signIn.description,
    },
  };
}
