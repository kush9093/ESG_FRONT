// src/types/styled.d.ts
import 'styled-components';
import theme from '@/styles/theme';

// typeof theme를 통해 테마의 타입을 추론합니다.
type Theme = typeof theme;

// styled-components 모듈을 확장합니다.
declare module 'styled-components' {
  // DefaultTheme을 우리 테마의 타입으로 확장합니다.
  export interface DefaultTheme extends Theme {}
}
