import KitDesktop from "@/components/desktop/kit/KitDesktop";
import DeviceGate from "@/components/DeviceGate.client";
import KitMobile from "@/components/mobile/kit/KitMobile";

export default function KitPage() {
  return <DeviceGate mobile={<KitMobile />} desktop={<KitDesktop />} />;
}
