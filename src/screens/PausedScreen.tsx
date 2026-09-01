import { P } from "../styles/shared";
import type { GameRef, Screen, SetState } from "../types/game";

interface PausedScreenProps {
  G: GameRef;
  setScreen: SetState<Screen>;
}

export default function PausedScreen({ G, setScreen }: PausedScreenProps) {
  return (
    <div style={{ minHeight: "100vh", ...P.bg, display: "flex", alignItems: "center", justifyContent: "center", ...P.ft, color: "#e2e8f0" }}>
      <div style={{ ...P.pn, padding: "36px 48px", textAlign: "center" }}>
        <h2 style={{ color: "#fbbf24", margin: "0 0 12px" }}>⏸ Paused</h2>
        <p style={{ color: "#64748b", fontSize: 11, marginBottom: 20 }}>Auto-pauses when you switch tabs</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => { G.current.pau = false; setScreen("playing"); }} style={P.bt("#4ade80")}>Resume</button>
          <button onClick={() => setScreen("menu")} style={P.bt("#94a3b8")}>Quit</button>
        </div>
      </div>
    </div>
  );
}
