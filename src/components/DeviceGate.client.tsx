"use client";

import { useDevice } from "@/app/providers/DeviceProvider.client";
import type { ReactNode } from "react";

interface DeviceGateProps {
  mobile: ReactNode;
  desktop: ReactNode;
}

export default function DeviceGate({ mobile, desktop }: DeviceGateProps) {
  const device = useDevice();

  if (device === "mobile") {
    return <>{mobile}</>;
  }

  return <>{desktop}</>;
}
