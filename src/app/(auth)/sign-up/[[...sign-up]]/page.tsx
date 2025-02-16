"use client";

import { Metadata } from "next";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

import { SEO } from "@/config/app";

export default function Page() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {theme === "dark" ? (
        <SignUp appearance={{ baseTheme: dark }} />
      ) : (
        <SignUp />
      )}
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SEO.pages.signUp.title,
    description: SEO.pages.signUp.description,
    openGraph: {
      title: SEO.pages.signUp.title,
      description: SEO.pages.signUp.description,
    },
    twitter: {
      title: SEO.pages.signUp.title,
      description: SEO.pages.signUp.description,
    },
  };
}
