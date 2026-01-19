"use client";

import { ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import { useGlobalPreloadGate } from "@/hooks/useGlobalPreloadGate";
import { PRELOAD_IMAGES, PRELOAD_VIDEOS_META } from "@/asset/preloadManifest";

export default function GlobalPreloadGate({
  children,
}: {
  children: ReactNode;
}) {
  const gate = useGlobalPreloadGate(PRELOAD_IMAGES, PRELOAD_VIDEOS_META, true);

  if (!gate.ready) {
    return (
      <GateWrap>
        <Spinner />
      </GateWrap>
    );
  }

  return <>{children}</>;
}
const GateWrap = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  background: #0b0b0b;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.25);
  border-top-color: rgba(255, 255, 255, 0.95);
  animation: ${spin} 0.9s linear infinite;
`;
