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

  // ✅ 방향 감지 (세로/가로)
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

  const doneCount = completed.filter(Boolean).length;
  const totalCount = completed.length;

  // ✅ 5개 퀴즈 규칙
  // - 1~4는 항상 노출
  // - 5는 4번 완료 전엔 숨김
  // - 1~4 완료 & 5 미완료면 5만 노출 + 화살표 숨김
  const visibility = useMemo(() => {
    const total = completed.length;
    const last = total - 1;

    const showOnlyLastSticker =
      total === 5 &&
      completed.slice(0, last).every(Boolean) &&
      !completed[last];

    const firstGroupCount = Math.min(4, total);
    const firstGroup = Array.from({ length: firstGroupCount }, (_, i) => i);

    const canShowLast = total === 5 ? unlocked >= 5 : unlocked >= total;
    const lastGroup = canShowLast ? [last] : [];

    const visibleIndexes = showOnlyLastSticker
      ? [last]
      : [...firstGroup, ...lastGroup];

    const showArrows = !showOnlyLastSticker;

    return { visibleIndexes, showArrows };
  }, [completed, unlocked]);

  const unlockOrientation = async () => {
    try {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    } catch {}
  };

  const enterFullscreen = async () => {
    const el = videoRef.current;
    if (!el) return;

    // 표준 FS
    try {
      const requestFs = el.requestFullscreen?.bind(el);
      if (document.fullscreenEnabled && requestFs) {
        await requestFs();
      } else if ("webkitEnterFullscreen" in el) {
        // iOS Safari video fullscreen
        (
          el as HTMLVideoElement & { webkitEnterFullscreen: () => void }
        ).webkitEnterFullscreen();
        return;
      }
    } catch {
      // ignore
    }

    // 가능하면 가로 잠금 시도
    try {
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock("landscape");
      }
    } catch {
      // ignore
    }
  };

  const feedbackImg =
    feedback === "correct"
      ? "/images/quiz/feedback_correct.png"
      : "/images/quiz/feedback_wrong.png";

  return (
    <Viewport>
      <BoardCanvas>
        {/* 칠판은 항상 바닥 */}
        <ChalkboardImg src="/images/quiz/chalkboard.png" alt="" />

        {/* 상단 UI (비디오/올완료 제외) */}
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
            {/* 화살표 (마지막만 보기 모드면 숨김) */}
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

            {/* 스티커 */}
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
                  $completed={isCompleted}
                  style={{
                    left: item.mobilePos.left,
                    top: item.mobilePos.top,
                    width: item.mobilePos.width,
                  }}
                  onClick={() => onStickerClick(index)}
                  aria-disabled={!clickable}
                >
                  <StickerImg
                    src={item.stickerSrc}
                    alt={item.stickerAlt}
                    draggable={false}
                  />
                  {/* ✅ 체크 배지 제거 */}
                </StickerBtn>
              );
            })}
          </>
        )}

        {/* VIDEO */}
        {stage === "video" && activeItem && (
          <VideoOverlay>
            <VideoTopBar>
              <VideoBtn type="button" onClick={enterFullscreen}>
                전체화면
              </VideoBtn>
            </VideoTopBar>

            {/* ✅ 세로면 가로 유도 오버레이 (video에서만) */}
            {isPortrait && (
              <RotateHint>
                <RotateCard>
                  <RotateTitle>가로로 보면 더 크게 보여요!</RotateTitle>
                  <RotateDesc>
                    휴대폰을 가로로 돌리거나 아래 버튼을 눌러주세요.
                  </RotateDesc>
                  <RotateBtn type="button" onClick={enterFullscreen}>
                    가로로 보기
                  </RotateBtn>
                </RotateCard>
              </RotateHint>
            )}

            <Video
              ref={videoRef}
              key={activeItem.videoSrc}
              src={activeItem.videoSrc}
              autoPlay
              muted
              playsInline
              controls={false}
              preload="metadata"
              $portrait={isPortrait}
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
              <OXBtn type="button" onClick={() => onChooseOX("O")}>
                <OXImg src="/images/quiz/ox_o.png" alt="O" />
              </OXBtn>
              <OXBtn type="button" onClick={() => onChooseOX("X")}>
                <OXImg src="/images/quiz/ox_x.png" alt="X" />
              </OXBtn>
            </OXWrap>

            <ReplayBtn type="button" onClick={onReplayVideo}>
              동영상 다시 보기
            </ReplayBtn>
          </>
        )}

        {/* FEEDBACK (✅ first click 누락 방지: 준비 전엔 스피너) */}
        {stage === "feedback" && feedback && (
          <FeedbackCenter>
            {!feedbackReady ? (
              <Spinner />
            ) : (
              <FeedbackImg
                src={feedbackImg}
                alt={feedback === "correct" ? "정답" : "오답"}
                $kind={feedback}
              />
            )}
          </FeedbackCenter>
        )}

        {/* ALL DONE */}
        {stage === "all_done" && (
          <AllDoneOverlay>
            <AllDoneDim />
            <AllDoneCard>
              <AllDoneMainImg
                src="/images/quiz/all_done.png"
                alt="모든 퀴즈 완료"
              />

              <AllDoneBtnRow>
                <AllDoneBtn type="button" onClick={onAllDoneReplay}>
                  다시 한 번 보기
                </AllDoneBtn>
                <AllDoneBtn type="button" onClick={onAllDoneExit}>
                  나가기
                </AllDoneBtn>
              </AllDoneBtnRow>
            </AllDoneCard>
          </AllDoneOverlay>
        )}
      </BoardCanvas>
    </Viewport>
  );
}

/* ===============================
 * styled-components
 * =============================== */

const Viewport = styled.div`
  width: 100vw;
  height: 100vh;
`;

const BoardCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  isolation: isolate;
`;

const ChalkboardImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  z-index: 0;
  pointer-events: none;
`;

const ProgressPill = styled.div`
  position: absolute;
  z-index: 20;
  left: 12px;
  top: 10px;
  padding: 9px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  font-weight: 800;
  font-size: 12px;
`;

const ResetBtn = styled.button`
  position: absolute;
  z-index: 20;
  right: 12px;
  top: 10px;
  padding: 9px 10px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  font-weight: 800;
  font-size: 12px;
`;

/* START */
const StartButton = styled.button`
  position: absolute;
  inset: 0;
  z-index: 2;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

const StartImg = styled.img`
  position: absolute;
  left: 50%;
  bottom: 16%;
  transform: translateX(-50%);
  width: min(78vw, 320px);
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.35));
`;

/* Stickers */
const StickerBtn = styled.button<{
  $clickable: boolean;
  $unlocked: boolean;
  $completed: boolean;
}>`
  position: absolute;
  z-index: 5;
  border: none;
  background: transparent;
  padding: 0;
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};
  opacity: ${(p) => (p.$unlocked ? 1 : 0.35)};
  filter: ${(p) => (p.$unlocked ? "none" : "grayscale(0.8)")};
  pointer-events: ${(p) => (p.$clickable ? "auto" : "none")};
`;

const StickerImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
`;

/* Arrow */
const ArrowImg = styled.img`
  position: absolute;
  z-index: 4;
  pointer-events: none;
  user-select: none;
`;

/* Video */
const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 30;
`;

const VideoTopBar = styled.div`
  position: absolute;
  z-index: 33;
  left: 12px;
  top: 10px;
`;

const VideoBtn = styled.button`
  padding: 10px 12px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.92);
  font-weight: 900;
`;

const Video = styled.video<{ $portrait: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: ${(p) => (p.$portrait ? "cover" : "contain")};
  background: #000;
`;

/* Rotate Hint (video only) */
const RotateHint = styled.div`
  position: absolute;
  inset: 0;
  z-index: 32;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.35);
`;

const RotateCard = styled.div`
  width: min(88vw, 360px);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  padding: 18px 16px;
  text-align: center;
`;

const RotateTitle = styled.div`
  font-weight: 900;
  font-size: 16px;
  margin-bottom: 6px;
`;

const RotateDesc = styled.div`
  font-weight: 700;
  font-size: 13px;
  opacity: 0.8;
  margin-bottom: 12px;
`;

const RotateBtn = styled.button`
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  font-weight: 900;
`;

/* OX */
const QuestionBanner = styled.div`
  position: absolute;
  z-index: 12;
  left: 50%;
  top: 9%;
  transform: translateX(-50%);
  width: min(92vw, 520px);
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  font-weight: 900;
  font-size: 14px;
  text-align: center;
`;

const OXWrap = styled.div`
  position: absolute;
  z-index: 10;
  left: 50%;
  top: 38%;
  transform: translateX(-50%);
  display: flex;
`;

const OXBtn = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

const OXImg = styled.img`
  width: min(100vw, 250px);
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.28));
`;

const ReplayBtn = styled.button`
  position: absolute;
  z-index: 12;
  left: 50%;
  bottom: 10%;
  transform: translateX(-50%);
  padding: 12px 14px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.92);
  font-weight: 900;
`;

/* Feedback */
const popIn = keyframes`
  0% { transform: scale(0.92); opacity: 0; }
  60% { transform: scale(1.03); opacity: 1; }
  100% { transform: scale(1.00); opacity: 1; }
`;

const shakeWrong = keyframes`
  0% { transform: translateX(0) scale(0.98); }
  25% { transform: translateX(-10px) scale(1.00); }
  50% { transform: translateX(10px) scale(1.00); }
  75% { transform: translateX(-6px) scale(1.00); }
  100% { transform: translateX(0) scale(1.00); }
`;

const FeedbackCenter = styled.div`
  position: absolute;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  pointer-events: none;
`;

const FeedbackImg = styled.img<{ $kind: "correct" | "wrong" }>`
  width: min(86vw, 720px);
  filter: drop-shadow(0 14px 26px rgba(0, 0, 0, 0.35));
  animation:
    ${popIn} 220ms ease-out both,
    ${(p) => (p.$kind === "wrong" ? shakeWrong : "none")} 320ms ease-out;
`;

/* Spinner (feedbackReady false) */
const spin = keyframes`
  to { transform: rotate(360deg); }
`;
const Spinner = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.25);
  border-top-color: rgba(255, 255, 255, 0.95);
  animation: ${spin} 0.9s linear infinite;
`;

/* ALL DONE */
const AllDoneOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 50;
`;

const AllDoneDim = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
`;

const AllDoneCard = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
`;

const AllDoneMainImg = styled.img`
  width: min(92vw, 760px);
  filter: drop-shadow(0 18px 34px rgba(0, 0, 0, 0.4));
`;

const AllDoneBtnRow = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const AllDoneBtn = styled.button`
  padding: 12px 14px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.92);
  font-weight: 900;
`;
