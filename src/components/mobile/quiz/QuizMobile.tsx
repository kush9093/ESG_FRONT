"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QuizStageMobile from "./QuizStageMobile";
import { QUIZ_ITEMS } from "@/components/desktop/quiz/quizData";

type Stage = "start" | "stickers" | "video" | "ox" | "feedback" | "all_done";
type FeedbackKind = "correct" | "wrong";

const LS_KEY = "esg-quiz-progress-v1";
const ALLOW_REPLAY_COMPLETED = true;

type SavedProgress = { unlocked: number; completed: boolean[] };

function preloadAndDecodeImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (!src) return resolve();

    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";

    img.onload = async () => {
      try {
        if ("decode" in img) {
          await img.decode();
        }
      } catch {}
      resolve();
    };

    img.onerror = () => resolve();
    img.src = src;
  });
}

export default function QuizMobile() {
  const router = useRouter();
  const total = QUIZ_ITEMS.length;

  const [stage, setStage] = useState<Stage>("start");
  const [unlocked, setUnlocked] = useState<number>(1);
  const [completed, setCompleted] = useState<boolean[]>(() =>
    Array.from({ length: total }, () => false)
  );

  const [activeStickerIndex, setActiveStickerIndex] = useState<number | null>(
    null
  );

  const [feedback, setFeedback] = useState<FeedbackKind | null>(null);
  const [feedbackReady, setFeedbackReady] = useState<boolean>(true);

  const activeItem = useMemo(() => {
    if (activeStickerIndex === null) return null;
    return QUIZ_ITEMS[activeStickerIndex] ?? null;
  }, [activeStickerIndex]);

  const didHydrateRef = useRef(false);

  const feedbackTimerRef = useRef<number | null>(null);
  const clearFeedbackTimer = () => {
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  };

  const completedRef = useRef<boolean[]>(completed);
  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  const resetProgress = () => {
    clearFeedbackTimer();
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}

    setUnlocked(1);
    setCompleted(Array.from({ length: total }, () => false));
    setActiveStickerIndex(null);

    setFeedback(null);
    setFeedbackReady(true);

    setStage("stickers");
  };

  const handleAllDoneReplay = () => resetProgress();
  const handleAllDoneExit = () => router.push("/");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;

      const parsed: SavedProgress = JSON.parse(raw);
      const safeUnlocked: number = Math.max(
        1,
        Math.min(parsed.unlocked ?? 1, total)
      );
      const safeCompleted: boolean[] =
        Array.isArray(parsed.completed) && parsed.completed.length === total
          ? parsed.completed.map(Boolean)
          : Array.from({ length: total }, (_, i) =>
              Boolean(parsed.completed?.[i])
            );

      setUnlocked(safeUnlocked);
      setCompleted(safeCompleted);

      if (safeCompleted.length === total && safeCompleted.every(Boolean)) {
        setStage("all_done");
      }
    } catch {
      // ignore
    } finally {
      didHydrateRef.current = true;
    }
  }, [total]);

  useEffect(() => {
    if (!didHydrateRef.current) return;
    try {
      const payload: SavedProgress = { unlocked, completed };
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {}
  }, [unlocked, completed]);

  useEffect(() => () => clearFeedbackTimer(), []);

  const handleStickerClick = (index: number) => {
    if (index + 1 > unlocked) return;
    if (!ALLOW_REPLAY_COMPLETED && completed[index]) return;

    clearFeedbackTimer();
    setFeedback(null);
    setFeedbackReady(true);

    setActiveStickerIndex(index);
    setStage("video");
  };

  const handleVideoEnded = () => setStage("ox");
  const handleReplayVideo = () => setStage("video");

  const handleChooseOX = async (choice: "O" | "X") => {
    if (!activeItem || activeStickerIndex === null) return;

    clearFeedbackTimer();

    const idx = activeStickerIndex;
    const correct = choice === activeItem.answer;
    const kind: FeedbackKind = correct ? "correct" : "wrong";

    setFeedback(kind);
    setFeedbackReady(false);
    setStage("feedback");

    const src =
      kind === "correct"
        ? "/images/quiz/feedback_correct.png"
        : "/images/quiz/feedback_wrong.png";

    await preloadAndDecodeImage(src);
    setFeedbackReady(true);

    feedbackTimerRef.current = window.setTimeout(() => {
      if (!correct) {
        setFeedback(null);
        setFeedbackReady(true);
        setStage("ox");
        feedbackTimerRef.current = null;
        return;
      }

      const base = completedRef.current;
      const nextCompleted = [...base];
      nextCompleted[idx] = true;

      const allDone = nextCompleted.every(Boolean);

      setCompleted(nextCompleted);
      setUnlocked((prev) => {
        const target = Math.min(idx + 2, total);
        return Math.max(prev, target);
      });

      setFeedback(null);
      setFeedbackReady(true);
      setStage(allDone ? "all_done" : "stickers");

      feedbackTimerRef.current = null;
    }, 1000);
  };

  return (
    <QuizStageMobile
      stage={stage}
      unlocked={unlocked}
      completed={completed}
      allowReplayCompleted={ALLOW_REPLAY_COMPLETED}
      activeItem={activeItem}
      feedback={feedback}
      feedbackReady={feedbackReady}
      onStartClick={() => setStage("stickers")}
      onStickerClick={handleStickerClick}
      onVideoEnded={handleVideoEnded}
      onReplayVideo={handleReplayVideo}
      onChooseOX={handleChooseOX}
      onReset={resetProgress}
      onAllDoneReplay={handleAllDoneReplay}
      onAllDoneExit={handleAllDoneExit}
    />
  );
}
