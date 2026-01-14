export type QuizChoice = "O" | "X";

export type QuizSticker = {
  id: string;
  title: string;
  videoSrc: string; // public/videos/xxx.mp4
  question: string;
  answer: QuizChoice;
};

export type StickerStatus = "locked" | "idle" | "completed";

export type QuizStep =
  | { name: "intro" }
  | { name: "board" } // 스티커 선택 화면
  | { name: "video"; stickerId: string }
  | { name: "ox"; stickerId: string };
