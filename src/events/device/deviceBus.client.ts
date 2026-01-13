"use client";

import type { Device } from "@/types/device";

const EVENT_NAME = "device:changed";

class DeviceBus {
  private target = new EventTarget();
  private current: Device = "desktop";

  get() {
    return this.current;
  }

  set(next: Device) {
    if (this.current === next) return;
    this.current = next;
    this.target.dispatchEvent(new CustomEvent<Device>(EVENT_NAME, { detail: next }));
  }

  subscribe(handler: (d: Device) => void) {
    const listener = (e: Event) => handler((e as CustomEvent<Device>).detail);
    this.target.addEventListener(EVENT_NAME, listener);
    return () => this.target.removeEventListener(EVENT_NAME, listener);
  }
}

export const deviceBus = new DeviceBus();

export function detectDeviceByViewport(breakpointPx: number): Device {
  return window.matchMedia(`(max-width: ${breakpointPx}px)`).matches ? "mobile" : "desktop";
}

export function startDeviceEvents(breakpointPx: number) {
  const update = () => deviceBus.set(detectDeviceByViewport(breakpointPx));

  update();

  const mql = window.matchMedia(`(max-width: ${breakpointPx}px)`);
  if (mql.addEventListener) mql.addEventListener("change", update);
  else (mql as any).addListener(update);

  window.addEventListener("orientationchange", update);

  return () => {
    if (mql.removeEventListener) mql.removeEventListener("change", update);
    else (mql as any).removeListener(update);

    window.removeEventListener("orientationchange", update);
  };
}
