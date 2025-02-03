import { useCallback, useState } from "react";

import { createRateLimit } from "@/lib/rate-limit";

interface UseRateLimitProps {
  onRateLimited?: () => void;
}

interface UseRateLimitReturn {
  isRateLimited: boolean;
  checkRateLimit: () => Promise<boolean>;
}

const rateLimiter = createRateLimit(1, 24 * 60 * 60); // 24 hours in seconds

export function useRateLimit({
  onRateLimited,
}: UseRateLimitProps): UseRateLimitReturn {
  const [isRateLimited, setIsRateLimited] = useState(false);

  const checkRateLimit = useCallback(async () => {
    // If already rate limited, prevent further attempts
    if (isRateLimited) return false;

    try {
      const { success } = await rateLimiter.limit("free-analysis");

      if (!success) {
        setIsRateLimited(true);
        onRateLimited?.();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Rate limit check failed:", error);
      return false;
    }
  }, [isRateLimited, onRateLimited]);

  return { isRateLimited, checkRateLimit };
}
