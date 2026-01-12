"use client";

import type { Device } from "@/types/device";
import { createContext, useContext, useState, type ReactNode } from "react";

interface DeviceContextType {
  device: Device;
}

const DeviceContext = createContext<DeviceContextType | null>(null);

export function DeviceProvider({
  children,
  initialDevice,
}: {
  children: ReactNode;
  initialDevice: Device;
}) {
  const [device] = useState(initialDevice);

  return (
    <DeviceContext.Provider value={{ device }}>
      {children}
    </DeviceContext.Provider>
  );
}

export const useDevice = (): Device => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context.device;
};
