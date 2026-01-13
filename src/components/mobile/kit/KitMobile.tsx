import { KitContext, KitImage, KitText, KitTitle, KitWrap } from "./styles";

export default function KitMobile() {
  return (
    <KitWrap>
      <KitTitle>키트 안내</KitTitle>
      <KitContext>
        <KitText>1. 구성품</KitText>
        <KitImage src={"/images/kit/kit_component.png"} />
      </KitContext>
      <KitContext>
        <KitText>2. 실내기</KitText>
        <KitImage src={"/images/kit/before_in.png"} />
      </KitContext>
      <KitContext>
        <KitText>3. 실외기</KitText>
        <KitImage src={"/images/kit/before_out.png"} />
      </KitContext>
      <KitContext>
        <KitText>4. 키트프레임</KitText>
        <KitImage src={"/images/kit/wood.png"} />
      </KitContext>
    </KitWrap>
  );
}
