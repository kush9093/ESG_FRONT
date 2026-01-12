"use client";
import DeviceGate from "@/components/DeviceGate.client";
import MobileMain from "./mobile/pages/MobileMain";
import DesktopMain from "./desktop/pages/DesktopMain";


export default function HomePage() {
  return <DeviceGate mobile={<MobileMain />} desktop={<DesktopMain />} />;
}
