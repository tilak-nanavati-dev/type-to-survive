import { useEffect } from "react";
import { clamp } from "../utils/helpers";
import type { DifficultyPreset, GameRef, WpmSample, SetState } from "../types/game";

export default function useStatsInterval(
  screen: string,
  diff: DifficultyPreset,
  G: GameRef,
  setWpmH: SetState<WpmSample[]>,
) {
  useEffect(() => {
    if (screen !== "playing") return;

    const interval = setInterval(() => {
      const g = G.current;
      const minutes = (Date.now() - g.st) / 60000;
      const wpm = minutes > 0 ? Math.round(g.wc / minutes) : 0;
      const total = g.cc + g.ic;
      const accuracy = total > 0 ? Math.round((g.cc / total) * 100) : 100;

      if (diff === "adaptive") {
        g.aw = wpm;
        g.aa = accuracy / 100;
        g.sm = clamp(0.4 + wpm * 0.014, 0.4, 1.4);
        g.sr = clamp(3500 - wpm * 38, 1300, 4000);
        g.mz = clamp(3 + Math.floor(wpm / 8), 3, 14);
      }

      setWpmH(h => [...h.slice(-30), { t: h.length, wpm, acc: accuracy }]);
    }, 2000);

    return () => clearInterval(interval);
  }, [screen, diff]);
}
