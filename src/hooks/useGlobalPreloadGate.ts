"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type GateResult = {
  ready: boolean;
  progress: number; // 0~1
  pendingCount: number;
};

function uniq(list: string[]) {
  return Array.from(new Set(list.filter(Boolean)));
}

// 배열 참조가 바뀌어도 "내용"이 같으면 같은 키
function makeKey(list: string[]) {
  return uniq(list).slice().sort().join("|");
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (!src) return resolve();
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

function preloadVideoMeta(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (!src) return resolve();
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => resolve();
    v.onerror = () => resolve();
    v.src = src;
  });
}

export function useGlobalPreloadGate(
  images: string[],
  videosMeta: string[],
  enabled: boolean
): GateResult {
  const imagesKey = useMemo(() => makeKey(images), [images]);
  const videosKey = useMemo(() => makeKey(videosMeta), [videosMeta]);

  const imgList = useMemo(
    () => (imagesKey ? imagesKey.split("|") : []),
    [imagesKey]
  );
  const vidList = useMemo(
    () => (videosKey ? videosKey.split("|") : []),
    [videosKey]
  );

  const total = imgList.length + vidList.length;

  const [ready, setReady] = useState<boolean>(() => !enabled);
  const [done, setDone] = useState<number>(() => (!enabled ? total : 0));

  // 실행 식별자 (StrictMode / 재실행 방지)
  const runIdRef = useRef(0);

  useEffect(() => {
    runIdRef.current += 1;
    const runId = runIdRef.current;
    let cancelled = false;

    // ✅ effect 안에서 "즉시" setState 하지 말고, 마이크로태스크로 한 번 넘김
    queueMicrotask(() => {
      if (cancelled) return;
      if (runIdRef.current !== runId) return;

      if (!enabled) {
        setReady(true);
        setDone(total);
        return;
      }

      setReady(false);
      setDone(0);
    });

    // enabled=false면 프리로드 자체는 안 함
    if (!enabled) {
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      let count = 0;

      for (const src of imgList) {
        await preloadImage(src);
        if (cancelled) return;
        if (runIdRef.current !== runId) return;

        count += 1;
        setDone(count);
      }

      for (const src of vidList) {
        await preloadVideoMeta(src);
        if (cancelled) return;
        if (runIdRef.current !== runId) return;

        count += 1;
        setDone(count);
      }

      if (!cancelled && runIdRef.current === runId) {
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, imagesKey, videosKey, total, imgList, vidList]);

  const progress = total === 0 ? 1 : done / total;

  return { ready, progress, pendingCount: Math.max(0, total - done) };
}
