import type { Device } from "@/types/device";

export function getDeviceFromUA(ua: string): Device {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  return isMobile ? "mobile" : "desktop";
}
