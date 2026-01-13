"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Device } from "@/types/device";
import { getWindowDeviceType } from "@/lib/device";
import { DEVICE_TYPE_CHANGE_EVENT, deviceBus } from "@/events/device/deviceBus.client";

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
  const [device, setDevice] = useState<Device>(initialDevice);

  useEffect(() => {
    const handleResize = () => {
      const newDeviceType = getWindowDeviceType();
      if (newDeviceType !== device) {
        setDevice(newDeviceType);
        deviceBus.emit(DEVICE_TYPE_CHANGE_EVENT, newDeviceType);
      }
    };

    // 클라이언트 사이드에서 초기 deviceType 설정
    handleResize(); 

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [device]);

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
