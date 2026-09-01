import { useEffect } from "react";
import type { GameRef, Screen, SetState } from "../types/game";

export default function useVisibility(screen: Screen, G: GameRef, setScreen: SetState<Screen>) {
  useEffect(() => {
    const handler = () => {
      if (document.hidden && screen === "playing") {
        G.current.pau = true;
        setScreen("paused");
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [screen]);
}
