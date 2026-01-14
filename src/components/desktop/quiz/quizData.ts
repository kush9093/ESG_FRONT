export type QuizItem = {
  id: string;

  stickerSrc: string;
  stickerAlt: string;

  desktopPos: { left: string; top: string; width: string };
  mobilePos: { left: string; top: string; width: string };

  arrowToNext?: {
    src: string;
    style: { left: string; top: string; width: string; transform?: string };
    mobileStyle?: {
      left: string;
      top: string;
      width: string;
      transform?: string;
    };
  };

  videoSrc: string;
  answer: "O" | "X";

  /** ✅ O/X 화면에 띄울 퀴즈 내용 */
  question: string;
};

export const QUIZ_ITEMS: QuizItem[] = [
  {
    id: "quiz-1",
    question: "Q1. 압축기는 냉매를 고온·고압으로 만들까요?",
    stickerSrc: "/images/quiz/sticker_1.png",
    stickerAlt: "첫 번째 퀴즈",
    desktopPos: { left: "0%", top: "35%", width: "25%" },
    mobilePos: { left: "-15%", top: "40%", width: "60%" },

    arrowToNext: {
      src: "/images/quiz/arrow.png",
      style: {
        left: "20%",
        top: "20%",
        width: "20%",
        transform: "rotate(-18deg)",
      },
      mobileStyle: {
        left: "10%",
        top: "28%",
        width: "40%",
        transform: "rotate(-60deg)",
      },
    },

    videoSrc: "/videos/quiz/quiz_1.mov",
    answer: "O",
  },
  {
    id: "quiz-2",
    question: "Q2. 응축기에서는 냉매가 가지고 있던 열을 밖으로 버린다.",
    stickerSrc: "/images/quiz/sticker_2.png",
    stickerAlt: "두 번째 퀴즈",
    desktopPos: { left: "34%", top: "5%", width: "25%" },
    mobilePos: { left: "17%", top: "10%", width: "60%" },

    arrowToNext: {
      src: "/images/quiz/arrow.png",
      style: {
        left: "54%",
        top: "20%",
        width: "20%",
        transform: "rotate(18deg)",
      },
      mobileStyle: {
        left: "50%",
        top: "28%",
        width: "40%",
        transform: "rotate(50deg)",
      },
    },

    videoSrc: "/videos/quiz/quiz_2.mov",
    answer: "O",
  },
  {
    id: "quiz-3",
    question: "Q3. 팽창밸브를 지나면 냉매는 갑자기 힘이 빠진다.",
    stickerSrc: "/images/quiz/sticker_3.png",
    stickerAlt: "세 번째 퀴즈",
    desktopPos: { left: "75%", top: "30%", width: "25%" },
    mobilePos: { left: "60%", top: "38%", width: "60%" },

    arrowToNext: {
      src: "/images/quiz/arrow.png",
      style: {
        left: "54%",
        top: "50%",
        width: "20%",
        transform: "rotate(152deg)",
      },
      mobileStyle: {
        left: "55%",
        top: "60%",
        width: "40%",
        transform: "rotate(120deg)",
      },
    },

    videoSrc: "/videos/quiz/quiz_3.mov",
    answer: "O",
  },
  {
    id: "quiz-4",
    question: "Q4. 증발기는 차가운 공기를 만들어서 방을 시원하게 한다.",
    stickerSrc: "/images/quiz/sticker_4.png",
    stickerAlt: "네 번째 퀴즈",
    desktopPos: { left: "38%", top: "65%", width: "25%" },
    mobilePos: { left: "25%", top: "70%", width: "60%" },

    arrowToNext: {
      src: "/images/quiz/arrow.png",
      style: {
        left: "20%",
        top: "50%",
        width: "20%",
        transform: "rotate(205deg)",
      },
      mobileStyle: {
        left: "10%",
        top: "60%",
        width: "40%",
        transform: "rotate(230deg)",
      },
    },

    videoSrc: "/videos/quiz/quiz_4.mov",
    answer: "X",
  },
  {
    id: "quiz-5",
    question: "Q5. 냉매는 한 번만 움직이고 멈춘다.",
    stickerSrc: "/images/quiz/sticker_5.png",
    stickerAlt: "다섯 번째 퀴즈",
    desktopPos: { left: "10%", top: "0%", width: "80%" },
    mobilePos: { left: "0%", top: "40%", width: "100%" },

    videoSrc: "/videos/quiz/quiz_5.mov",
    answer: "X",
  },
];
