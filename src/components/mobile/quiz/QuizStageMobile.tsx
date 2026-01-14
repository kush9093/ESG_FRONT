"use client";

import { QUIZ_ITEMS, QuizItem } from "@/components/desktop/quiz/quizData";
import { useRef } from "react";
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

  onStartClick: () => void;
  onStickerClick: (index: number) => void;
  onVideoEnded: () => void;
  onReplayVideo: () => void;
  onChooseOX: (c: "O" | "X") => void;

  onReset: () => void;
  onAllDoneReplay: () => void;
  onAllDoneExit: () => void;
}) {
  const doneCount = completed.filter(Boolean).length;
  const totalCount = completed.length;

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const feedbackImg =
    feedback === "correct"
      ? "/images/quiz/feedback_correct.png"
      : "/images/quiz/feedback_wrong.png";

  const enterFullscreen = () => {
    const el = videoRef.current;
    if (!el) return;

    // 표준 Fullscreen API (대부분 브라우저)
    if (document.fullscreenEnabled && el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
      return;
    }

    // iOS Safari: video 전용 fullscreen (webkitEnterFullscreen)
    // 타입에 없으므로 "타입 가드"로 안전하게 접근
    if ("webkitEnterFullscreen" in el) {
      const iosVideo = el as HTMLVideoElement & {
        webkitEnterFullscreen: () => void;
      };
      iosVideo.webkitEnterFullscreen();
    }
  };

  return (
    <Viewport>
      <BoardCanvas>
        <ChalkboardImg src="/images/quiz/chalkboard.png" alt="" />

        {/* 상단 UI (영상 중엔 숨김) */}
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
          <StartButton
            type="button"
            onClick={onStartClick}
            aria-label="퀴즈 시작"
          >
            <StartImg src="/images/quiz/start.png" alt="시작" />
          </StartButton>
        )}

        {stage === "stickers" &&
          (() => {
            const totalCount = completed.length;
            const lastIndex = totalCount - 1;

            const showOnlyLastSticker =
              totalCount === 5 &&
              completed.slice(0, lastIndex).every(Boolean) &&
              !completed[lastIndex];

            const firstGroupCount = Math.min(4, totalCount);
            const firstGroup = Array.from(
              { length: firstGroupCount },
              (_, i) => i
            );

            const canShowLast =
              totalCount === 5 ? unlocked >= 5 : unlocked >= totalCount;
            const lastGroup = canShowLast ? [lastIndex] : [];

            const visibleIndexes = showOnlyLastSticker
              ? [lastIndex]
              : [...firstGroup, ...lastGroup];
            const showArrows = !showOnlyLastSticker;

            return (
              <>
                {showArrows &&
                  visibleIndexes
                    .map((i) => QUIZ_ITEMS[i])
                    .map((item) =>
                      item.arrowToNext ? (
                        <ArrowImg
                          key={`arrow-${item.id}`}
                          src={item.arrowToNext.src}
                          alt=""
                          style={
                            item.arrowToNext.mobileStyle ??
                            item.arrowToNext.style
                          }
                        />
                      ) : null
                    )}

                {visibleIndexes.map((index) => {
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
                      {/* ✅ 체크 표시 제거 */}
                    </StickerBtn>
                  );
                })}
              </>
            );
          })()}

        {/* VIDEO (전체 오버레이 + 전체화면 버튼) */}
        {stage === "video" && activeItem && (
          <VideoOverlay>
            <VideoTopBar>
              <VideoBtn type="button" onClick={enterFullscreen}>
                전체화면
              </VideoBtn>
            </VideoTopBar>

            <Video
              ref={videoRef}
              key={activeItem.videoSrc}
              src={activeItem.videoSrc}
              autoPlay
              muted
              playsInline
              controls={false}
              preload="metadata"
              onEnded={onVideoEnded}
            />
          </VideoOverlay>
        )}

        {/* OX */}
        {stage === "ox" && activeItem && (
          <>
            <QuestionBanner>{activeItem.question}</QuestionBanner>
            <OXWrap>
              <OXBtn
                type="button"
                onClick={() => onChooseOX("O")}
                aria-label="O 선택"
              >
                <OXImg src="/images/quiz/ox_o.png" alt="O" />
              </OXBtn>
              <OXBtn
                type="button"
                onClick={() => onChooseOX("X")}
                aria-label="X 선택"
              >
                <OXImg src="/images/quiz/ox_x.png" alt="X" />
              </OXBtn>
            </OXWrap>

            <ReplayBtn type="button" onClick={onReplayVideo}>
              동영상 다시 보기
            </ReplayBtn>
          </>
        )}

        {/* FEEDBACK */}
        {stage === "feedback" && feedback && (
          <FeedbackCenter>
            <FeedbackImg
              src={feedbackImg}
              alt={feedback === "correct" ? "정답" : "오답"}
              $kind={feedback}
            />
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

/* ===== Layout ===== */
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

/* ✅ B: cover */
const ChalkboardImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
`;

const ProgressPill = styled.div`
  position: absolute;
  z-index: 20;
  left: 12px;
  top: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  font-weight: 800;
  font-size: 14px;
`;

const ResetBtn = styled.button`
  position: absolute;
  z-index: 20;
  right: 12px;
  top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  font-weight: 700;
`;

/* Start */
const StartButton = styled.button`
  position: absolute;
  inset: 0;
  z-index: 2;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

const StartImg = styled.img`
  position: absolute;
  left: 50%;
  bottom: 16%;
  transform: translateX(-50%);
  width: min(70vw, 320px);
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.35));
`;

/* Arrow */
const ArrowImg = styled.img`
  position: absolute;
  z-index: 2;
  pointer-events: none;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25));
`;

/* Stickers */
const StickerBtn = styled.button<{
  $clickable: boolean;
  $unlocked: boolean;
  $completed: boolean;
}>`
  position: absolute;
  z-index: 2;

  /* 모바일 터치 히트박스 확대 */
  padding: 22px;
  border: 0;
  background: transparent;

  cursor: ${(p) => (p.$clickable ? "pointer" : "not-allowed")};
  opacity: ${(p) => (p.$unlocked ? 1 : 0.35)};
  filter: ${(p) => (p.$unlocked ? "none" : "grayscale(1)")};

  ${(p) =>
    p.$completed &&
    `
      opacity: 1;
      filter: none;
    `}

  pointer-events: ${(p) => (p.$clickable ? "auto" : "none")};
  -webkit-tap-highlight-color: transparent;
`;

const StickerImg = styled.img`
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.25));
`;

/* Video */
const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  background: black;
`;

const VideoTopBar = styled.div`
  position: absolute;
  z-index: 11;
  top: 10px;
  right: 10px;
`;

const VideoBtn = styled.button`
  padding: 10px 12px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.92);
  font-weight: 800;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

/* OX */
const OXWrap = styled.div`
  position: absolute;
  z-index: 3;
  left: 50%;
  bottom: 12%;
  transform: translateX(-50%);
  display: flex;
  gap: 14px;
`;

const OXBtn = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

const OXImg = styled.img`
  width: min(100vw, 250px);
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.25));
`;

const ReplayBtn = styled.button`
  position: absolute;
  z-index: 3;
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%);
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.92);
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
  z-index: 4;
  display: grid;
  place-items: center;
  pointer-events: none;
`;

const FeedbackImg = styled.img<{ $kind: FeedbackKind }>`
  width: min(78vw, 520px);
  filter: drop-shadow(0 14px 26px rgba(0, 0, 0, 0.35));
  animation: ${popIn} 220ms ease-out both,
    ${(p) => (p.$kind === "wrong" ? shakeWrong : "none")} 320ms ease-out;
`;

/* All Done */
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
  pointer-events: none;
`;

const AllDoneMainImg = styled.img`
  width: min(86vw, 680px);
  height: auto;
  pointer-events: none;
  filter: drop-shadow(0 18px 34px rgba(0, 0, 0, 0.4));
`;

const AllDoneBtnRow = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 10px;
  justify-content: center;
  pointer-events: auto;
`;

const AllDoneBtn = styled.button`
  padding: 12px 14px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.92);
  font-weight: 800;
`;

const QuestionBanner = styled.div`
  position: absolute;
  z-index: 3;
  left: 50%;
  top: 10%;
  transform: translateX(-50%);
  width: min(92vw, 520px);

  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);

  font-weight: 900;
  font-size: 14px;
  text-align: center;
`;
