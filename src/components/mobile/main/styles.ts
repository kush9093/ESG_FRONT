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
  gap: 5vw;
`;

export const BlueBtn = styled.button`
  width: 45vw;
  height: 50px;
  background-color: #467fd7;
  color: #ffffff;
  border-radius: 25px;
  font-size: 15px;
  border: none;
  cursor: pointer;

  transition:
    background-color 0.18s ease,
    transform 0.12s ease,
    box-shadow 0.18s ease;

  &:hover {
    background-color: #3b6fc0; /* 살짝 더 진한 파랑 */
    box-shadow: 0 10px 18px rgba(70, 127, 215, 0.28);
  }

  &:active {
    transform: translateY(1px) scale(0.99);
    box-shadow: 0 6px 12px rgba(70, 127, 215, 0.22);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(70, 127, 215, 0.28);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const WhiteBtn = styled.button`
  width: 45vw;
  height: 50px;
  background-color: #ffffff;
  color: #467fd7;
  border-radius: 25px;
  font-size: 15px;
  border: 1px solid #467fd7;
  cursor: pointer;

  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease,
    transform 0.12s ease,
    box-shadow 0.18s ease;

  &:hover {
    background-color: rgba(70, 127, 215, 0.08); /* 연한 파랑 */
    color: #3b6fc0;
    border-color: #3b6fc0;
    box-shadow: 0 10px 18px rgba(70, 127, 215, 0.16);
  }

  &:active {
    transform: translateY(1px) scale(0.99);
    box-shadow: 0 6px 12px rgba(70, 127, 215, 0.12);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(70, 127, 215, 0.22);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }
`;
export const QuizWrap = styled.div`
  width: 100%;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  padding-top: 50px;
  padding-bottom: 50px;
`;

export const QuizHeaderWrap = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

export const QuizHeaderTitle = styled.div`
  font-size: 42px;
  font-weight: 500;
`;

export const QuizBodyWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 50vh;
  gap: 20px;
`;

export const QuizBodyImage = styled.img`
  width: 100%;
`;

export const BodyWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #777;
  font-size: 16px;
`;

export const QuizbodyContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CheckIcon = styled.div`
  background: url(/images/check_icon.png) no-repeat center center;
  width: 24px;
  height: 24px;
`;
export const QuizbodyBoldText = styled.div`
  color: #000;
  font-size: 27px;
  font-weight: 800;
`;
export const QuizbodyText = styled.div`
  font-size: 17px;
  color: #333;
`;

export const KitWrap = styled.div`
  width: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  padding-top: 50px;
  padding-bottom: 50px;
`;

export const KitBodyWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 30px;
`;

export const KitBodyTitle = styled.div`
  font-size: 41px;
  font-weight: bold;
`;
export const KitColorText = styled.span`
  color: #467fd7;
`;

export const KitBodyText = styled.div`
  font-size: 19px;
  color: #777;
`;
