import { DefaultHr } from "@/components/common/hr/styles";
import {
  BlueBtn,
  BtnWrap,
  HeaderText,
  HeaderWrap,
  IntroductionMedia,
  IntroductionText,
  IntroductionWrap,
  KitLeft,
  KitRight,
  KitText,
  KitWrap,
  MainWrap,
  QuizLeft,
  QuizRight,
  QuizText,
  QuizWrap,
  TextWrap,
  WhiteBtn,
} from "./styles";
import { BlueSpan } from "@/components/common/text/styles";

export default function MobileMain() {
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
          <BlueBtn>키트 안내</BlueBtn>
          <WhiteBtn>퀴즈 풀기</WhiteBtn>
        </BtnWrap>
        <IntroductionMedia>
          <video autoPlay loop muted playsInline>
            <source src="\videos\intro.mp4" type="video/mp4" />
          </video>
        </IntroductionMedia>
      </IntroductionWrap>
      <QuizWrap>
        <QuizRight></QuizRight>
        <QuizLeft>
          <QuizText>퀴즈를 풀어봅시다</QuizText>
          <WhiteBtn>퀴즈 풀기</WhiteBtn>
        </QuizLeft>
      </QuizWrap>
      <KitWrap>
        <KitLeft></KitLeft>
        <KitRight>
          <KitText>키트를 만들어봅시다</KitText>
          <WhiteBtn>키트 안내</WhiteBtn>
        </KitRight>
      </KitWrap>
    </MainWrap>
  );
}
