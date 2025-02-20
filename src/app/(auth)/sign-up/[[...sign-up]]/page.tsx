"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-20">
      {theme === "dark" ? (
        <SignUp appearance={{ baseTheme: dark }} />
      ) : (
        <SignUp />
      )}
    </div>
  );
}
