"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QUIZ_ITEMS } from "@/components/desktop/quiz/quizData";
import QuizStageMobile from "./QuizStageMobile";

type Stage = "start" | "stickers" | "video" | "ox" | "feedback" | "all_done";
type FeedbackKind = "correct" | "wrong";

const LS_KEY = "esg-quiz-progress-v1"; // ✅ Desktop과 공유 (Y)
const ALLOW_REPLAY_COMPLETED = true;

type SavedProgress = { unlocked: number; completed: boolean[] };

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

  const activeItem = useMemo(() => {
    if (activeStickerIndex === null) return null;
    return QUIZ_ITEMS[activeStickerIndex] ?? null;
  }, [activeStickerIndex]);

  const didHydrateRef = useRef(false);
  const feedbackTimerRef = useRef<number | null>(null);
  const completedRef = useRef<boolean[]>(completed);
  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  const clearTimer = () => {
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  };

  const resetProgress = () => {
    clearTimer();
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}

    setUnlocked(1);
    setCompleted(Array.from({ length: total }, () => false));
    setActiveStickerIndex(null);
    setFeedback(null);
    setStage("stickers");
  };

  const handleAllDoneReplay = () => resetProgress();
  const handleAllDoneExit = () => router.push("/");

  // hydrate
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

  // save
  useEffect(() => {
    if (!didHydrateRef.current) return;
    try {
      const payload: SavedProgress = { unlocked, completed };
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {}
  }, [unlocked, completed]);

  useEffect(() => () => clearTimer(), []);

  const handleStickerClick = (index: number) => {
    if (index + 1 > unlocked) return;
    if (!ALLOW_REPLAY_COMPLETED && completed[index]) return;

    clearTimer();
    setActiveStickerIndex(index);
    setStage("video");
  };

  const handleVideoEnded = () => setStage("ox");
  const handleReplayVideo = () => setStage("video");

  const handleChooseOX = (choice: "O" | "X") => {
    if (!activeItem || activeStickerIndex === null) return;

    clearTimer();

    const idx = activeStickerIndex;
    const correct = choice === activeItem.answer;

    setFeedback(correct ? "correct" : "wrong");
    setStage("feedback");

    feedbackTimerRef.current = window.setTimeout(() => {
      if (!correct) {
        setFeedback(null);
        setStage("ox");
        feedbackTimerRef.current = null;
        return;
      }

      // ✅ 최신 completed 기준으로 next 계산
      const base = completedRef.current;
      const nextCompleted = [...base];
      nextCompleted[idx] = true;

      const allDone = nextCompleted.every(Boolean);

      // ✅ 한번에 반영
      setCompleted(nextCompleted);
      setUnlocked((prev) => {
        const target = Math.min(idx + 2, total);
        return Math.max(prev, target);
      });

      setFeedback(null);
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
