"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QUIZ_ITEMS } from "./quizData";
import QuizStageDesktop from "./QuizStageDesktop";

type Stage = "start" | "stickers" | "video" | "ox" | "feedback" | "all_done";
type FeedbackKind = "correct" | "wrong";

const ALLOW_REPLAY_COMPLETED = true;
const LS_KEY = "esg-quiz-progress-v1";

type SavedProgress = {
  unlocked: number;
  completed: boolean[];
};

function preloadAndDecodeImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (!src) return resolve();

    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";

    img.onload = async () => {
      try {
        // decode 지원 브라우저면 렌더 준비까지 기다림
        if ("decode" in img) {
          await img.decode();
        }
      } catch {
        // ignore
      }
      resolve();
    };

    img.onerror = () => resolve();
    img.src = src;
  });
}

export default function QuizDesktop() {
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

  // hydrate 스킵
  const didHydrateRef = useRef(false);

  // 타이머 중복 방지
  const feedbackTimerRef = useRef<number | null>(null);
  const clearFeedbackTimer = () => {
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  };

  // ✅ all_done 안정화용 (최신 completed 참조)
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

  // localStorage load (+ all_done 복구)
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

      const allDone =
        safeCompleted.length === total && safeCompleted.every(Boolean);
      if (allDone) setStage("all_done");
    } catch {
      // ignore
    } finally {
      didHydrateRef.current = true;
    }
  }, [total]);

  // localStorage save
  useEffect(() => {
    if (!didHydrateRef.current) return;
    try {
      const payload: SavedProgress = { unlocked, completed };
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {}
  }, [unlocked, completed]);

  useEffect(() => {
    return () => clearFeedbackTimer();
  }, []);

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

  // ✅ 핵심: feedback 이미지가 “준비된 후” 1초 타이머 시작
  const handleChooseOX = async (choice: "O" | "X") => {
    if (!activeItem || activeStickerIndex === null) return;

    clearFeedbackTimer();

    const idx = activeStickerIndex;
    const correct = choice === activeItem.answer;
    const kind: FeedbackKind = correct ? "correct" : "wrong";

    // 1) feedback stage로 진입 (일단 스피너)
    setFeedback(kind);
    setFeedbackReady(false);
    setStage("feedback");

    // 2) 이미지 preload + decode 완료까지 대기
    const src =
      kind === "correct"
        ? "/images/quiz/feedback_correct.png"
        : "/images/quiz/feedback_wrong.png";

    await preloadAndDecodeImage(src);

    // 3) 이제부터는 “무조건 보일 수 있는 상태”
    setFeedbackReady(true);

    // 4) 이 순간부터 1초 타이머 시작 (첫 클릭 누락 방지)
    feedbackTimerRef.current = window.setTimeout(() => {
      if (!correct) {
        setFeedback(null);
        setFeedbackReady(true);
        setStage("ox");
        feedbackTimerRef.current = null;
        return;
      }

      // 정답 처리: 최신 completed 기준으로 계산 → all_done 안정
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
    <QuizStageDesktop
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
