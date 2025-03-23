export function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";

  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
}

export function isPwa(): boolean {
  if (typeof window === "undefined") return false;

  // Check if the app is running in standalone mode (PWA)
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes("android-app://")
  );
}

export function getDeviceProperties() {
  return {
    deviceType: getDeviceType(),
    isPwa: isPwa(),
    url: typeof window !== "undefined" ? window.location.href : undefined,
    path: typeof window !== "undefined" ? window.location.pathname : undefined,
  };
}
