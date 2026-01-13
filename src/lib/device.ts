import type { Device } from "@/types/device";

export function getDeviceFromUA(ua: string): Device {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  return isMobile ? "mobile" : "desktop";
}

export function getWindowDeviceType(): Device {
  if (typeof window === "undefined") {
    // Server-side rendering, or window is not available
    return "desktop"; // Default to desktop or handle as needed
  }
  return window.innerWidth <= 768 ? "mobile" : "desktop";
}
