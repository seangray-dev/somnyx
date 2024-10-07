"use client";

import { useEffect } from "react";

export default function PWA() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        await navigator.serviceWorker.register("/sw.js");
      });
    }
  }, []);

  return <></>;
}
