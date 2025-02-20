import { useCallback, useEffect, useState } from "react";

import { createRateLimit } from "@/lib/rate-limit";

interface UseRateLimitProps {
  onRateLimited?: () => void;
}

interface UseRateLimitReturn {
  isRateLimited: boolean;
  checkRateLimit: () => Promise<boolean>;
  resetRateLimit: () => void;
}

const RATE_LIMIT_KEY = "free-analysis-last-used";
const RATE_LIMIT_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Create a more robust rate limiter that combines IP and device fingerprint
const rateLimiter = createRateLimit(1, 24 * 60 * 60); // 24 hours in seconds

export function useRateLimit({
  onRateLimited,
}: UseRateLimitProps): UseRateLimitReturn {
  const [isRateLimited, setIsRateLimited] = useState(false);

  const checkStoredRateLimit = useCallback(() => {
    try {
      const lastUsed = localStorage.getItem(RATE_LIMIT_KEY);
      if (lastUsed) {
        const lastUsedDate = new Date(lastUsed);
        const now = new Date();
        const timeSinceLastUse = now.getTime() - lastUsedDate.getTime();

        if (timeSinceLastUse < RATE_LIMIT_DURATION) {
          setIsRateLimited(true);
          return true;
        } else {
          localStorage.removeItem(RATE_LIMIT_KEY);
          setIsRateLimited(false);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking rate limit:", error);
      return false;
    }
  }, []);

  // Check local storage on mount and window focus
  useEffect(() => {
    checkStoredRateLimit();

    const handleFocus = () => {
      checkStoredRateLimit();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkStoredRateLimit]);

  const resetRateLimit = useCallback(() => {
    try {
      localStorage.removeItem(RATE_LIMIT_KEY);
      setIsRateLimited(false);
    } catch (error) {
      console.error("Error resetting rate limit:", error);
    }
  }, []);

  const checkRateLimit = useCallback(
    async (suppressError: boolean = false) => {
      // Double-check stored rate limit first (client-side check)
      if (checkStoredRateLimit()) {
        if (!suppressError) {
          onRateLimited?.();
        }
        return false;
      }

      try {
        // First check server-side rate limit
        const { success } = await rateLimiter.limit("free-analysis");

        if (!success) {
          setIsRateLimited(true);
          if (!suppressError) {
            onRateLimited?.();
          }
          return false;
        }

        // If server-side check passes, store locally
        const now = new Date().toISOString();
        localStorage.setItem(RATE_LIMIT_KEY, now);
        setIsRateLimited(true);
        return true;
      } catch (error) {
        console.error("Rate limit check failed:", error);
        return false;
      }
    },
    [checkStoredRateLimit, isRateLimited, onRateLimited]
  );

  return { isRateLimited, checkRateLimit, resetRateLimit };
}
