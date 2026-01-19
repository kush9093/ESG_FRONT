"use client";

import { QUIZ_ITEMS, QuizItem } from "@/components/desktop/quiz/quizData";
import { useEffect, useMemo, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

type Stage = "start" | "stickers" | "video" | "ox" | "feedback" | "all_done";
type FeedbackKind = "correct" | "wrong";

export default function QuizStageMobile({
  stage,
  unlocked,
  completed,
  allowReplayCompleted,
  activeItem,
  feedback,
  feedbackReady,
  onStartClick,
  onStickerClick,
  onVideoEnded,
  onReplayVideo,
  onChooseOX,
  onReset,
  onAllDoneReplay,
  onAllDoneExit,
}: {
  stage: Stage;
  unlocked: number;
  completed: boolean[];
  allowReplayCompleted: boolean;

  activeItem: QuizItem | null;
  feedback: FeedbackKind | null;
  feedbackReady: boolean;

  onStartClick: () => void;
  onStickerClick: (index: number) => void;
  onVideoEnded: () => void;
  onReplayVideo: () => void;
  onChooseOX: (c: "O" | "X") => void;
  onReset: () => void;

  onAllDoneReplay: () => void;
  onAllDoneExit: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /* =========================
   * orientation 감지
   * ========================= */
  const [isPortrait, setIsPortrait] = useState(true);
  useEffect(() => {
    const update = () => setIsPortrait(window.innerHeight >= window.innerWidth);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  /* =========================
   * fullscreen / orientation (빌드 안전)
   * ========================= */
  const unlockOrientation = () => {
    try {
      const orientation = screen.orientation;
      if (orientation && "unlock" in orientation) {
        (orientation as ScreenOrientation & { unlock: () => void }).unlock();
      }
    } catch {}
  };

  const enterFullscreen = async () => {
    const el = videoRef.current;
    if (!el) return;

    // iOS Safari
    try {
      if ("webkitEnterFullscreen" in el) {
        (
          el as HTMLVideoElement & { webkitEnterFullscreen: () => void }
        ).webkitEnterFullscreen();
        return;
      }
    } catch {}

    // 표준 fullscreen
    try {
      const requestFs = el.requestFullscreen?.bind(el);
      if (document.fullscreenEnabled && requestFs) {
        await requestFs();
      }
    } catch {}

    // 가능하면 가로 잠금
    try {
      const orientation = screen.orientation;
      if (orientation && "lock" in orientation) {
        type OrientationLock = "any" | "natural" | "landscape" | "portrait";
        const lockFn = (
          orientation as ScreenOrientation & {
            lock: (o: OrientationLock) => Promise<void>;
          }
        ).lock;
        await lockFn("landscape");
      }
    } catch {}
  };

  /* =========================
   * 진행도 / 스티커 노출 규칙
   * ========================= */
  const doneCount = completed.filter(Boolean).length;
  const totalCount = completed.length;

  const visibility = useMemo(() => {
    const total = completed.length;
    const last = total - 1;

    const showOnlyLast =
      total === 5 &&
      completed.slice(0, last).every(Boolean) &&
      !completed[last];

    const firstGroup = Array.from({ length: Math.min(4, total) }, (_, i) => i);
    const canShowLast = total === 5 ? unlocked >= 5 : unlocked >= total;
    const lastGroup = canShowLast ? [last] : [];

    return {
      visibleIndexes: showOnlyLast ? [last] : [...firstGroup, ...lastGroup],
      showArrows: !showOnlyLast,
    };
  }, [completed, unlocked]);

  const feedbackImg =
    feedback === "correct"
      ? "/images/quiz/feedback_correct.png"
      : "/images/quiz/feedback_wrong.png";

  return (
    <Viewport>
      <BoardCanvas>
        {/* 칠판 */}
        <ChalkboardImg src="/images/chalkboard.png" alt="" />

        {/* 상단 UI */}
        {stage !== "video" && stage !== "all_done" && (
          <>
            <ProgressPill>
              완료 {doneCount}/{totalCount}
            </ProgressPill>
            <ResetBtn type="button" onClick={onReset}>
              처음부터
            </ResetBtn>
          </>
        )}

        {/* START */}
        {stage === "start" && (
          <StartButton type="button" onClick={onStartClick}>
            <StartImg src="/images/quiz/start.png" alt="시작" />
          </StartButton>
        )}

        {/* STICKERS */}
        {stage === "stickers" && (
          <>
            {visibility.showArrows &&
              visibility.visibleIndexes
                .map((i) => QUIZ_ITEMS[i])
                .map((item) =>
                  item.arrowToNext ? (
                    <ArrowImg
                      key={`arrow-${item.id}`}
                      src={item.arrowToNext.src}
                      alt=""
                      style={
                        item.arrowToNext.mobileStyle ?? item.arrowToNext.style
                      }
                    />
                  ) : null
                )}

            {visibility.visibleIndexes.map((index) => {
              const item = QUIZ_ITEMS[index];
              const isUnlocked = index + 1 <= unlocked;
              const isCompleted = completed[index];
              const clickable =
                isUnlocked && (allowReplayCompleted ? true : !isCompleted);

              return (
                <StickerBtn
                  key={item.id}
                  type="button"
                  $clickable={clickable}
                  $unlocked={isUnlocked}
                  style={{
                    left: item.mobilePos.left,
                    top: item.mobilePos.top,
                    width: item.mobilePos.width,
                  }}
                  onClick={() => onStickerClick(index)}
                >
                  <StickerImg src={item.stickerSrc} alt="" draggable={false} />
                </StickerBtn>
              );
            })}
          </>
        )}

        {/* VIDEO */}
        {stage === "video" && activeItem && (
          <VideoOverlay>
            {isPortrait && (
              <RotateHint>
                <RotateCard>
                  <RotateTitle>가로로 돌리면 크게 보여요</RotateTitle>
                  <RotateBtn onClick={enterFullscreen}>가로로 보기</RotateBtn>
                </RotateCard>
              </RotateHint>
            )}

            <Video
              ref={videoRef}
              src={activeItem.videoSrc}
              autoPlay
              playsInline
              preload="metadata"
              onEnded={() => {
                unlockOrientation();
                onVideoEnded();
              }}
            />
          </VideoOverlay>
        )}

        {/* OX */}
        {stage === "ox" && activeItem && (
          <>
            <QuestionBanner>{activeItem.question}</QuestionBanner>
            <OXWrap>
              <OXBtn onClick={() => onChooseOX("O")}>
                <OXImg src="/images/quiz/ox_o.png" alt="O" />
              </OXBtn>
              <OXBtn onClick={() => onChooseOX("X")}>
                <OXImg src="/images/quiz/ox_x.png" alt="X" />
              </OXBtn>
            </OXWrap>
            <ReplayBtn onClick={onReplayVideo}>동영상 다시 보기</ReplayBtn>
          </>
        )}

        {/* FEEDBACK */}
        {stage === "feedback" && feedback && (
          <FeedbackCenter>
            {!feedbackReady ? <Spinner /> : <FeedbackImg src={feedbackImg} />}
          </FeedbackCenter>
        )}

        {/* ALL DONE */}
        {stage === "all_done" && (
          <AllDoneOverlay>
            <AllDoneCard>
              <AllDoneImg src="/images/quiz/all_done.png" alt="" />
              <BtnRow>
                <Btn onClick={onAllDoneReplay}>다시 보기</Btn>
                <Btn onClick={onAllDoneExit}>나가기</Btn>
              </BtnRow>
            </AllDoneCard>
          </AllDoneOverlay>
        )}
      </BoardCanvas>
    </Viewport>
  );
}

/* =========================
 * styles
 * ========================= */

const Viewport = styled.div`
  width: 100vw;
  height: 100vh;
`;

const BoardCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ChalkboardImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
`;

const ProgressPill = styled.div`
  position: absolute;
  left: 12px;
  top: 10px;
  z-index: 10;
  padding: 8px 10px;
  background: #fff;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
`;

const ResetBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 10px;
  z-index: 10;
`;

const StartButton = styled.button`
  position: absolute;
  inset: 0;
  background: transparent;
  border: none;
`;

const StartImg = styled.img`
  position: absolute;
  left: 50%;
  bottom: 16%;
  transform: translateX(-50%);
  width: min(80vw, 320px);
`;

const StickerBtn = styled.button<{
  $clickable: boolean;
  $unlocked: boolean;
}>`
  position: absolute;
  background: none;
  border: none;
  padding: 0;
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};
  opacity: ${(p) => (p.$unlocked ? 1 : 0.35)};
`;

const StickerImg = styled.img`
  width: 100%;
  display: block;
`;

const ArrowImg = styled.img`
  position: absolute;
  pointer-events: none;
`;

const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: #000;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const RotateHint = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
  z-index: 5;
`;

const RotateCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
`;

const RotateTitle = styled.div`
  font-weight: 800;
  margin-bottom: 10px;
`;

const RotateBtn = styled.button``;

const QuestionBanner = styled.div`
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 12px 14px;
  border-radius: 14px;
  font-weight: 800;
`;

const OXWrap = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 14px;
`;

const OXBtn = styled.button`
  background: none;
  border: none;
`;

const OXImg = styled.img`
  width: 120px;
`;

const ReplayBtn = styled.button`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
`;

const FeedbackCenter = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
`;

const pop = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const FeedbackImg = styled.img`
  width: min(80vw, 600px);
  animation: ${pop} 0.2s ease-out;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  animation: ${spin} 0.8s linear infinite;
`;

const AllDoneOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
`;

const AllDoneCard = styled.div`
  text-align: center;
`;

const AllDoneImg = styled.img`
  width: min(86vw, 520px);
`;

const BtnRow = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const Btn = styled.button``;
