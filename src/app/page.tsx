"use client";

import styled from "styled-components";

const StyledHeading = styled.h1`
  color: ${({ theme }) => theme.colors.black};
  font-size: 2rem;
  text-align: center;
  margin-top: 2rem;
`;

export default function Home() {
  return <StyledHeading>Welcome to My ESG Project!</StyledHeading>;
}