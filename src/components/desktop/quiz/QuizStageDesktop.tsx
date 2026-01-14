"use client";

import styled, { keyframes } from "styled-components";
import { QUIZ_ITEMS, QuizItem } from "./quizData";

type Stage = "start" | "stickers" | "video" | "ox" | "feedback" | "all_done";
type FeedbackKind = "correct" | "wrong";

export default function QuizStageDesktop({
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
  // ✅ 진행표시
  const doneCount = completed.filter(Boolean).length;
  const totalCount = completed.length;

  const feedbackImg =
    feedback === "correct"
      ? "/images/quiz/feedback_correct.png"
      : "/images/quiz/feedback_wrong.png";

  return (
    <Viewport>
      <BoardCanvas>
        {/* 칠판은 항상 바닥 */}
        <ChalkboardImg src="/images/quiz/chalkboard.png" alt="" />

        {/* ✅ 진행표시 (영상 중엔 숨김) */}
        {stage !== "video" && (
          <ProgressPill>
            완료 {doneCount}/{totalCount}
          </ProgressPill>
        )}

        {/* Reset 버튼(영상/전체완료 중엔 숨김) */}
        {stage !== "video" && stage !== "all_done" && (
          <ResetBtn type="button" onClick={onReset}>
            처음부터
          </ResetBtn>
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

        {/* STICKERS */}
        {stage === "stickers" &&
          (() => {
            const totalCount = completed.length;
            const lastIndex = totalCount - 1;

            // ✅ "1~4 완료 && 5 미완료"면 마지막(5번)만 보이게
            const showOnlyLastSticker =
              totalCount === 5 &&
              completed.slice(0, lastIndex).every(Boolean) &&
              !completed[lastIndex];

            // ✅ 기본: 1~4번은 항상 노출
            // (퀴즈가 5개가 아닐 때도 안전하게 처리)
            const firstGroupCount = Math.min(4, totalCount);
            const firstGroup = Array.from(
              { length: firstGroupCount },
              (_, i) => i
            );

            // ✅ 5번은 unlocked가 5 이상일 때만 노출 (4번 완료 전엔 아예 없음)
            const canShowLast =
              totalCount === 5 ? unlocked >= 5 : unlocked >= totalCount;
            const lastGroup = canShowLast ? [lastIndex] : [];

            const visibleIndexes = showOnlyLastSticker
              ? [lastIndex]
              : [...firstGroup, ...lastGroup];

            // ✅ 마지막만 보일 때는 화살표 전부 숨김
            const showArrows = !showOnlyLastSticker;

            return (
              <>
                {/* 화살표: 마지막만 보기 모드면 숨김 */}
                {showArrows &&
                  visibleIndexes
                    .map((i) => QUIZ_ITEMS[i])
                    .map((item) =>
                      item.arrowToNext ? (
                        <ArrowImg
                          key={`arrow-${item.id}`}
                          src={item.arrowToNext.src}
                          alt=""
                          style={item.arrowToNext.style}
                        />
                      ) : null
                    )}

                {/* 스티커 */}
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
                        left: item.desktopPos.left,
                        top: item.desktopPos.top,
                        width: item.desktopPos.width,
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

        {/* VIDEO */}
        {stage === "video" && activeItem && (
          <VideoOverlay>
            <Video
              key={activeItem.videoSrc}
              src={activeItem.videoSrc}
              autoPlay
              muted
              playsInline
              controls={false}
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

        {/* ALL DONE (1안) */}
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

const ChalkboardImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  z-index: 0;
  pointer-events: none;
`;

/* ✅ Progress */
const ProgressPill = styled.div`
  position: absolute;
  z-index: 20;
  left: 18px;
  top: 14px;

  padding: 10px 12px;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.9);
  font-weight: 700;
`;

/* Reset */
const ResetBtn = styled.button`
  position: absolute;
  z-index: 20;
  right: 18px;
  top: 14px;

  padding: 10px 12px;
  border-radius: 12px;
  border: none;
  cursor: pointer;

  background: rgba(255, 255, 255, 0.9);
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
  bottom: 5%;
  transform: translateX(-50%);
  width: clamp(600px, 22vw, 320px);
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
  padding: 18px;
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
  gap: clamp(18px, 3vw, 36px);
`;
const OXBtn = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;
const OXImg = styled.img`
  width: clamp(800px, 16vw, 240px);
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
  width: clamp(800px, 34vw, 520px);
  filter: drop-shadow(0 14px 26px rgba(0, 0, 0, 0.35));
  animation: ${popIn} 220ms ease-out both,
    ${(p) => (p.$kind === "wrong" ? shakeWrong : "none")} 320ms ease-out;
`;

/* All Done (1안) */
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
  width: clamp(360px, 46vw, 680px);
  height: auto;
  pointer-events: none;
  filter: drop-shadow(0 18px 34px rgba(0, 0, 0, 0.4));
`;

const AllDoneBtnRow = styled.div`
  margin-top: 18px;
  display: flex;
  gap: 12px;
  justify-content: center;
  pointer-events: auto;
`;

const AllDoneBtn = styled.button`
  padding: 12px 16px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.92);
`;

const QuestionBanner = styled.div`
  position: absolute;
  z-index: 3;
  left: 50%;
  top: 10%;
  transform: translateX(-50%);
  width: min(86%, 900px);

  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);

  font-weight: 900;
  font-size: clamp(16px, 2vw, 22px);
  text-align: center;
`;
