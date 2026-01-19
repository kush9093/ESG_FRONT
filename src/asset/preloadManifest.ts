// ✅ 여기 목록만 수정하면 됨 (public 기준 경로)
export const PRELOAD_IMAGES: string[] = [
  // 공통
  "/images/check_icon.png",
  "images/kit_image.png",
  "images/quiz_dummy.png",
  "videos/intro.mp4",

  // quiz 공통 UI
  "/images/quiz/chalkboard.png",
  "/images/quiz/start.png",
  "/images/quiz/ox_o.png",
  "/images/quiz/ox_x.png",
  "/images/quiz/feedback_correct.png",
  "/images/quiz/feedback_wrong.png",
  "/images/quiz/all_done.png",

  // 스티커/화살표(예시 - 네 실제 파일로 바꿔)
  "/images/quiz/sticker_1.png",
  "/images/quiz/sticker_2.png",
  "/images/quiz/sticker_3.png",
  "/images/quiz/sticker_4.png",
  "/images/quiz/sticker_5.png",
  "/images/quiz/arrow.png",

  // 키트 이미지
  "/images/kit/before_in.png",
  "/images/kit/before_out.png",
  "/images/kit/kit_component.png",
  "/images/kit/wood.png",
];

// (선택) 비디오까지 완전 프리로드(무거움) 대신 "메타데이터만"
export const PRELOAD_VIDEOS_META: string[] = [
  "/videos/quiz/quiz_1.mov",
  "/videos/quiz/quiz_2.mov",
  "/videos/quiz/quiz_3.mov",
  "/videos/quiz/quiz_4.mov",
  "/videos/quiz/quiz_5.mov",
];
