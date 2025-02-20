"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function ShareTargetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = searchParams.get("url");
    if (url) {
      // Extract the path from the shared URL
      try {
        const sharedUrl = new URL(url);
        // Ensure the path starts with a forward slash
        const path = sharedUrl.pathname || "/";
        // Cast the path as a valid route
        // @ts-ignore
        router.replace(path);
      } catch (e) {
        console.error("Invalid shared URL:", e);
        router.replace("/");
      }
    } else {
      router.replace("/");
    }
  }, [router, searchParams]);

  return null; // Or a loading spinner
}

export default function ShareTarget() {
  return (
    <Suspense>
      <ShareTargetContent />
    </Suspense>
  );
}
