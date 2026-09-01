import { P } from "../styles/shared";
import type { Screen, SetState } from "../types/game";

interface GameOverScreenProps {
  wv: number;
  sc: number;
  curWpm: number;
  acc: number;
  wc: number;
  best: number;
  surv: number;
  start: () => void;
  setScreen: SetState<Screen>;
}

export default function GameOverScreen({ wv, sc, curWpm, acc, wc, best, surv, start, setScreen }: GameOverScreenProps) {
  return (
    <div style={{ minHeight: "100vh", ...P.bg, display: "flex", alignItems: "center", justifyContent: "center", ...P.ft, color: "#e2e8f0" }}>
      <div style={{ ...P.pn, padding: "36px 48px", maxWidth: 460, textAlign: "center" }}>
        <div style={{ fontSize: 38 }}>💀</div>
        <h2 style={{ color: "#ef4444", margin: "4px 0 2px", fontSize: 22 }}>Game Over</h2>
        <p style={{ color: "#64748b", fontSize: 11, margin: "0 0 20px" }}>
          Survived {wv} wave{wv > 1 ? "s" : ""}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          {([
            ["Score", sc, "#fbbf24"], ["WPM", curWpm, "#22d3ee"], ["Accuracy", acc + "%", "#4ade80"],
            ["Words", wc, "#818cf8"], ["Best Streak", best, "#f472b6"],
            ["Time", Math.floor(surv / 60) + "m " + (surv % 60) + "s", "#67e8f9"],
          ] as [string, string | number, string][]).map(([label, value, color]) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 7, padding: 8 }}>
              <div style={{ color, fontSize: 18, fontWeight: 800 }}>{value}</div>
              <div style={{ color: "#64748b", fontSize: 9, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={start} style={{ ...P.bt("#4ade80"), flex: 1 }}>Play Again</button>
          <button onClick={() => setScreen("stats")} style={{ ...P.bt("#818cf8"), flex: 1 }}>📊 Stats</button>
          <button onClick={() => setScreen("menu")} style={{ ...P.bt("#94a3b8"), flex: 1 }}>Menu</button>
        </div>
      </div>
    </div>
  );
}
