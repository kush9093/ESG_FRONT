"use client";

import { useState } from "react";
import {
  BoardFrame,
  BoardSurface,
  Chalk,
  ChalkSet,
  Eraser,
  Tray,
} from "./styles";

export default function QuizDesktop() {
  const [round, setRound] = useState(0);
  return (
    <BoardFrame>
      <BoardSurface></BoardSurface>

      <Tray>
        <Eraser />
        <ChalkSet>
          <Chalk />
          <Chalk />
          <Chalk />
        </ChalkSet>
      </Tray>
    </BoardFrame>
  );
}
