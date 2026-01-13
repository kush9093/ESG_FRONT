"use client";

import MobileMain from "../components/mobile/main/MobileMain";
import DesktopMain from "../components/desktop/main/DesktopMain";
import DeviceGate from "@/components/DeviceGate.client";

export default function HomePage() {
  return <DeviceGate mobile={<MobileMain />} desktop={<DesktopMain />} />;
}
