import type { ReactNode } from "react";
import type { Device } from "@/types/device";
import { DeviceProvider } from "./DeviceProvider.client";

export default function Providers({
  children,
  initialDevice,
}: {
  children: ReactNode;
  initialDevice: Device;
}) {
  return (
    <DeviceProvider initialDevice={initialDevice}>
      {children}
    </DeviceProvider>
  );
}
