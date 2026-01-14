import QuizDesktop from "@/components/desktop/quiz/QuizDesktop";
import DeviceGate from "@/components/DeviceGate.client";
import QuizMobile from "@/components/mobile/quiz/QuizMobile";

export default function QuizPage() {
  return <DeviceGate mobile={<QuizMobile />} desktop={<QuizDesktop />} />;
}
