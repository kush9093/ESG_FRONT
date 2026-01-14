import { DefaultHr, ShortHr } from "@/components/common/hr/styles";
import {
  BlueBtn,
  BodyWrap,
  BtnWrap,
  CheckIcon,
  HeaderText,
  HeaderWrap,
  IntroductionMedia,
  IntroductionText,
  IntroductionWrap,
  KitBodyText,
  KitBodyTitle,
  KitBodyWrap,
  KitColorText,
  KitWrap,
  MainWrap,
  QuizbodyBoldText,
  QuizbodyContent,
  QuizBodyImage,
  QuizbodyText,
  QuizBodyWrap,
  QuizHeaderTitle,
  QuizHeaderWrap,
  QuizWrap,
  TextWrap,
  WhiteBtn,
} from "./styles";
import { BlueSpan } from "@/components/common/text/styles";
import { useRouter } from "next/navigation";

export default function DesktopMain() {
  const router = useRouter();

  const goQuiz = () => {
    router.push("quiz");
  };

  const goKit = () => {
    router.push("kit");
  };
  return (
    <MainWrap>
      <HeaderWrap>
        <HeaderText>COOL QUIZ</HeaderText>
      </HeaderWrap>
      <DefaultHr></DefaultHr>
      <IntroductionWrap>
        <TextWrap>
          <IntroductionText>
            <BlueSpan>키트</BlueSpan>로 빠르고 쉽게
          </IntroductionText>
          <IntroductionText>
            <BlueSpan>공조시스템</BlueSpan>을 이해해보세요
          </IntroductionText>
        </TextWrap>
        <BtnWrap>
          <BlueBtn onClick={goKit}>키트 안내</BlueBtn>
          <WhiteBtn onClick={goQuiz}>퀴즈 풀기</WhiteBtn>
        </BtnWrap>
        <IntroductionMedia>
          <video autoPlay loop muted playsInline>
            <source src="\videos\intro.mp4" type="video/mp4" />
          </video>
        </IntroductionMedia>
      </IntroductionWrap>
      <QuizWrap>
        <QuizHeaderWrap>
          <ShortHr />
          <QuizHeaderTitle>QUIZ</QuizHeaderTitle>
        </QuizHeaderWrap>
        <QuizBodyWrap>
          <QuizBodyImage src={"/images/quiz_dummy.png"} />
          <BodyWrap>
            <QuizbodyContent>
              <CheckIcon />
              <QuizbodyBoldText>MEDIA</QuizbodyBoldText>
              <QuizbodyText>동영상과 함께</QuizbodyText>
            </QuizbodyContent>
            <QuizbodyContent>
              <CheckIcon />
              <QuizbodyBoldText>O/X</QuizbodyBoldText>
              <QuizbodyText>간단한 퀴즈로</QuizbodyText>
            </QuizbodyContent>
            귀여운 냉매 친구들이 에어컨 안에서 여행을 하고 있어요! 이 퀴즈를
            풀면서 냉매가 언제 뜨거워지고, 언제 차가워지는지 맞혀보세요. O / X
            문제를 풀다 보면 어느새 에어컨의 비밀을 모두 알게 될 거예요!
          </BodyWrap>
        </QuizBodyWrap>
      </QuizWrap>
      <KitWrap>
        <QuizHeaderWrap>
          <ShortHr />
          <QuizHeaderTitle>KIT</QuizHeaderTitle>
        </QuizHeaderWrap>
        <QuizBodyWrap>
          <KitBodyWrap>
            <QuizBodyImage src={"/images/kit_image.png"} />
            <KitBodyTitle>
              지루했던 수업이
              <KitColorText>놀이</KitColorText>가 됩니다.
            </KitBodyTitle>
            <KitBodyText>
              시험지 대신 스마트기기를 꺼내 퀴즈를 풀어보세요.​​ 퀴즈 풀이와
              함께 참여자들간 실시간 랭킹을 ​비교해볼 수 ​있습니다.
            </KitBodyText>
          </KitBodyWrap>
        </QuizBodyWrap>
      </KitWrap>
    </MainWrap>
  );
}
