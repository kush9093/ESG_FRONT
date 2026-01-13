import QuizDesktop from "@/components/desktop/quiz/QuizDesktop";
import DeviceGate from "@/components/DeviceGate.client";

export default function QuizPage() {
  return <DeviceGate mobile={<QuizDesktop />} desktop={<QuizDesktop />} />;
}
