"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import { env } from "@/config/env/client";

const queryClient = new QueryClient();
const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        afterSignOutUrl={"/"}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        signInFallbackRedirectUrl={
          env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
        }
        signUpFallbackRedirectUrl={
          env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
        }
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
