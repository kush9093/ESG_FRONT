import styled from "styled-components";

export const MainWrap = styled.div``;

export const HeaderWrap = styled.header`
  padding: 10px 0px 10px 100px;
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
  margin-top: 50px;
  gap: 20px;
`;

export const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const IntroductionText = styled.div`
  font-family: var(--font-montserrat), sans-serif;
  font-size: 50px;
  font-weight: bold;
  color: black;
`;

export const IntroductionMedia = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;

  video {
    inset: 0;
    width: 60%;
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
  gap: 20px;
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
  display: flex;
  width: 100%;
  height: 100vh;

  background-image: url("/images/quiz_dummy.png");
  background-position: calc(100% + 250px);
  background-repeat: no-repeat;
  background-size: cover;
`;

export const QuizLeft = styled.div`
  width: 60%;
  background: #4a7fd4;
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;
export const QuizText = styled.div`
  font-size: 70px;
  font-weight: bold;
  color: #ffffff;
`;

export const KitWrap = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;

  background-image: url("/images/kit_image.png");
  background-position: calc(100% - 700px);
  background-repeat: no-repeat;
  background-size: contain;
`;
export const KitLeft = styled.div`
  width: 40%;
`;

export const KitRight = styled.div`
  width: 60%;
  background: #4a7fd4;
  clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

export const KitText = styled.div`
  font-size: 70px;
  font-weight: bold;
  color: #ffffff;
`;
