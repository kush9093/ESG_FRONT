import styled from "styled-components";

/** 나무 프레임 */
export const BoardFrame = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  aspect-ratio: 4 / 3;
  padding: clamp(10px, 1.4vw, 18px);
  background: linear-gradient(180deg, #c79a6a, #a6764c);
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
  position: relative;
`;

/** 칠판 표면 */
export const BoardSurface = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;

  /* 초록 칠판 + 얼룩 */
  background:
    radial-gradient(
      circle at 20% 30%,
      rgba(255, 255, 255, 0.06),
      transparent 55%
    ),
    radial-gradient(
      circle at 70% 40%,
      rgba(255, 255, 255, 0.05),
      transparent 60%
    ),
    radial-gradient(circle at 40% 80%, rgba(0, 0, 0, 0.12), transparent 55%),
    linear-gradient(180deg, #1f5b4b, #194e41);

  /* 안쪽 테두리(프레임 안쪽 음영) */
  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, 0.06),
    inset 0 0 35px rgba(0, 0, 0, 0.35);

  /* 분필 가루 질감(이미지 없이) */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.18;
    background:
      repeating-linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.05) 0px,
        rgba(255, 255, 255, 0.05) 1px,
        transparent 2px,
        transparent 6px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.03) 0px,
        rgba(255, 255, 255, 0.03) 1px,
        transparent 2px,
        transparent 8px
      );
    mix-blend-mode: overlay;
  }

  /* 가장자리 비네팅 */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      ellipse at center,
      transparent 55%,
      rgba(0, 0, 0, 0.25) 100%
    );
  }
`;

/** 하단 받침대 */
export const Tray = styled.div`
  position: absolute;
  left: clamp(10px, 1.4vw, 18px);
  right: clamp(10px, 1.4vw, 18px);
  bottom: clamp(10px, 1.4vw, 18px);

  height: clamp(18px, 2.2vw, 28px);
  transform: translateY(65%);
  border-radius: 10px;

  background: linear-gradient(180deg, #c79a6a, #a6764c);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
`;

/** 지우개 */
export const Eraser = styled.div`
  width: clamp(60px, 9vw, 120px);
  height: 70%;
  border-radius: 10px;
  background: linear-gradient(180deg, #f1f1f1, #d7d7d7);
  box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.12);
`;

/** 분필 3개 */
export const ChalkSet = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const Chalk = styled.div`
  width: clamp(18px, 2.2vw, 28px);
  height: clamp(6px, 0.8vw, 10px);
  border-radius: 999px;
  background: linear-gradient(180deg, #ffffff, #e8e8e8);
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12);
  opacity: 0.95;
`;

export const Arrow = styled.div`
  position: absolute;

  /* ===== 위치 & 기본 형태 ===== */
  left: 28%;
  top: 50%;
  width: 42%;
  height: clamp(12px, 1.4vw, 2px);
  border-radius: 999px;

  /* ===== 분필 흰색 ===== */
  background: rgba(255, 255, 255, 0.92);

  /* ===== 45도 대각선 ===== */
  transform: rotate(-45deg);
  transform-origin: left center;

  /* ===== 분필 가루 그림자 ===== */
  filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.25))
    drop-shadow(0 -1px 0 rgba(255, 255, 255, 0.35));

  /* ===== 가장자리 거칠게 ===== */
  mask-image: linear-gradient(
    90deg,
    transparent 0%,
    black 6%,
    black 94%,
    transparent 100%
  );

  /* ===== 화살촉 ===== */
  &::after {
    content: "";
    position: absolute;
    right: -18px;
    top: 50%;
    transform: translateY(-50%);
    border-left: 22px solid rgba(255, 255, 255, 0.92);
    border-top: 14px solid transparent;
    border-bottom: 14px solid transparent;
  }

  /* ===== 분필 가루 노이즈 ===== */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.15) 0px,
      rgba(255, 255, 255, 0.15) 1px,
      transparent 2px,
      transparent 4px
    );
    opacity: 0.25;
    mix-blend-mode: overlay;
    pointer-events: none;
  }
`;
