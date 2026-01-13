import styled from "styled-components";

export const MainWrap = styled.div``;

export const HeaderWrap = styled.header`
  padding: 10px 0px 10px 0px;
  text-align: center;
`;

export const HeaderText = styled.div`
  font-family: var(--font-montserrat), sans-serif;
  font-size: 40px;
  font-weight: bold;
  color: #467fd7;
`;

export const IntroductionWrap = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 20px;
`;

export const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const IntroductionText = styled.div`
  font-family: var(--font-montserrat), sans-serif;
  font-size: 40px;
  font-weight: bold;
  color: black;
`;

export const IntroductionMedia = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;

  video {
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .content {
    position: relative;
    z-index: 1;
  }
`;

export const BtnWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const BlueBtn = styled.button`
  width: 200px;
  height: 50px;
  background-color: #467fd7;
  color: #ffffff;
  border-radius: 25px;
  font-size: 15px;
  border: none;
`;

export const WhiteBtn = styled.button`
  width: 200px;
  height: 50px;
  background-color: #ffffff;
  color: #467fd7;
  border-radius: 25px;
  font-size: 15px;
  border: 1px solid #467fd7;
`;

export const QuizWrap = styled.div`
  width: 100%;
  height: 100vh;
`;

export const QuizLeft = styled.div`
  height: 50vh;
  background: #4a7fd4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

export const QuizRight = styled.div`
  height: 50vh;
  background-image: url("/images/quiz_dummy.png");
  background-position: center;
  background-size: cover;
`;
export const QuizText = styled.div`
  font-size: 40px;
  font-weight: bold;
  color: #ffffff;
`;

export const KitWrap = styled.div`
  width: 100%;
  height: 100vh;
`;
export const KitLeft = styled.div`
  width: 100%;
  height: 50vh;
  background-image: url("/images/kit_image.png");
  background-position: center;
  background-size: cover;
`;

export const KitRight = styled.div`
  width: 100%;
  height: 50vh;
  background: #4a7fd4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

export const KitText = styled.div`
  font-size: 40px;
  font-weight: bold;
  color: #ffffff;
`;
