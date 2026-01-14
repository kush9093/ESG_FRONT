"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QuizStageDesktop from "./QuizStageDesktop"; // ✅ 같은 폴더 기
import { QUIZ_ITEMS } from "./quizData";

type Stage = "start" | "stickers" | "video" | "ox" | "feedback" | "all_done";
type FeedbackKind = "correct" | "wrong";

const ALLOW_REPLAY_COMPLETED = true;
const LS_KEY = "esg-quiz-progress-v1";

type SavedProgress = {
  unlocked: number;
  completed: boolean[];
};

export default function QuizDesktop() {
  const router = useRouter();
  const total = QUIZ_ITEMS.length;

  const [stage, setStage] = useState<Stage>("start");
  const [unlocked, setUnlocked] = useState<number>(1);
  const [completed, setCompleted] = useState<boolean[]>(() =>
    Array.from({ length: total }, () => false)
  );

  const completedRef = useRef<boolean[]>(completed);
  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);
  const [activeStickerIndex, setActiveStickerIndex] = useState<number | null>(
    null
  );
  const [feedback, setFeedback] = useState<FeedbackKind | null>(null);

  const activeItem = useMemo(() => {
    if (activeStickerIndex === null) return null;
    return QUIZ_ITEMS[activeStickerIndex] ?? null;
  }, [activeStickerIndex]);

  // ✅ hydrate 직후 저장 effect가 바로 덮어쓰지 않도록
  const didHydrateRef = useRef(false);

  const totalCount = completed.length;
  const lastIndex = totalCount - 1;

  // ✅ 1~4 완료 && 5 미완료면 마지막만 노출
  const showOnlyLastSticker =
    totalCount === 5 &&
    completed.slice(0, lastIndex).every(Boolean) &&
    !completed[lastIndex];

  // ✅ 타이머 중복 방지
  const feedbackTimerRef = useRef<number | null>(null);

  const clearFeedbackTimer = () => {
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  };

  /** ✅ Reset: 상태 초기화 + localStorage 제거 */
  const resetProgress = () => {
    clearFeedbackTimer();

    try {
      localStorage.removeItem(LS_KEY);
    } catch {}

    setUnlocked(1);
    setCompleted(Array.from({ length: total }, () => false));
    setActiveStickerIndex(null);
    setFeedback(null);

    setStage("stickers");
  };

  /** ✅ 전체 완료 화면: 다시 한 번 보기(처음부터) */
  const handleAllDoneReplay = () => resetProgress();

  /** ✅ 전체 완료 화면: 나가기 */
  const handleAllDoneExit = () => router.push("/");

  // ✅ 1) 마운트 시: localStorage에서 진행상태 불러오기 + all_done 복구
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

      // ✅ 새로고침 시 이미 전부 완료면 완료 화면 복구
      const allDone =
        safeCompleted.length === total && safeCompleted.every(Boolean);
      if (allDone) setStage("all_done");
    } catch {
      // ignore
    } finally {
      didHydrateRef.current = true;
    }
  }, [total]);

  // ✅ 2) unlocked/completed 변경 시: localStorage에 저장
  useEffect(() => {
    if (!didHydrateRef.current) return;

    try {
      const payload: SavedProgress = { unlocked, completed };
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {}
  }, [unlocked, completed]);

  // ✅ 언마운트 시 타이머 정리
  useEffect(() => {
    return () => clearFeedbackTimer();
  }, []);

  /** 스티커 클릭 → 비디오로 */
  const handleStickerClick = (index: number) => {
    if (index + 1 > unlocked) return;
    if (!ALLOW_REPLAY_COMPLETED && completed[index]) return;

    clearFeedbackTimer();
    setActiveStickerIndex(index);
    setStage("video");
  };

  /** 비디오 끝 → OX */
  const handleVideoEnded = () => setStage("ox");

  /** 동영상 다시보기 */
  const handleReplayVideo = () => setStage("video");

  /**
   * O/X 선택 → 즉시 피드백 → 1초 후 처리
   * - useEffect에서 연쇄 setState 안 함 (경고 방지)
   * - 타이머 중복 방지 포함
   */
  const handleChooseOX = (choice: "O" | "X") => {
    if (!activeItem || activeStickerIndex === null) return;

    clearFeedbackTimer();

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
    <QuizStageDesktop
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
