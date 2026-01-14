"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  QuizChoice,
  QuizStep,
  QuizSticker,
  StickerStatus,
} from "@/types/quiz";

type StickerStateMap = Record<string, StickerStatus>;

function initStickerState(stickers: QuizSticker[]): StickerStateMap {
  const map: StickerStateMap = {};
  for (const s of stickers) map[s.id] = "idle";
  return map;
}

export function useStickerQuizFlow(stickers: QuizSticker[]) {
  const [step, setStep] = useState<QuizStep>({ name: "intro" });
  const [statusMap, setStatusMap] = useState<StickerStateMap>(() =>
    initStickerState(stickers)
  );

  const activeSticker = useMemo(() => {
    if (step.name === "video" || step.name === "ox") {
      return stickers.find((s) => s.id === step.stickerId) ?? null;
    }
    return null;
  }, [step, stickers]);

  const start = useCallback(() => setStep({ name: "board" }), []);

  const openSticker = useCallback((stickerId: string) => {
    // 완료된 스티커도 다시 볼 수 있게 하려면 허용
    setStep({ name: "video", stickerId });
  }, []);

  const onVideoEnded = useCallback(() => {
    if (step.name !== "video") return;
    setStep({ name: "ox", stickerId: step.stickerId });
  }, [step]);

  const replayVideo = useCallback(() => {
    if (step.name !== "ox") return;
    setStep({ name: "video", stickerId: step.stickerId });
  }, [step]);

  const answerOX = useCallback(
    (choice: QuizChoice) => {
      if (step.name !== "ox") return;
      const sticker = stickers.find((s) => s.id === step.stickerId);
      if (!sticker) return;

      const isCorrect = choice === sticker.answer;

      // 여기서 정책: 정답이면 completed, 오답이면 그대로(idle)
      if (isCorrect) {
        setStatusMap((prev) => ({ ...prev, [sticker.id]: "completed" }));
      }

      // 문제 푼 후 다시 보드로 돌아가기
      setStep({ name: "board" });
    },
    [step, stickers]
  );

  return {
    step,
    statusMap,
    activeSticker,
    actions: {
      start,
      openSticker,
      onVideoEnded,
      replayVideo,
      answerOX,
      goBoard: () => setStep({ name: "board" }),
    },
  };
}
