import { SCORING } from "../data/config";
import { P } from "../styles/shared";
import type { GameRef, WaveStats, SetState } from "../types/game";

interface WaveEndScreenProps {
  wv: number;
  sc: number;
  wvS: WaveStats;
  G: GameRef;
  setSc: SetState<number>;
  nextWave: () => void;
}

export default function WaveEndScreen({ wv, sc, wvS, G, setSc, nextWave }: WaveEndScreenProps) {
  return (
    <div style={{ minHeight: "100vh", ...P.bg, display: "flex", alignItems: "center", justifyContent: "center", ...P.ft, color: "#e2e8f0" }}>
      <div style={{ ...P.pn, padding: "36px 48px", maxWidth: 420, textAlign: "center" }}>
        <div style={{ fontSize: 30 }}>🏆</div>
        <h2 style={{ color: "#4ade80", margin: "4px 0", fontSize: 20 }}>Wave {wv} Complete!</h2>
        {wvS.nd && (
          <p style={{ color: "#fbbf24", fontSize: 11, margin: "0 0 14px" }}>
            ⭐ No damage taken! +{SCORING.waveNoDmg} bonus points
          </p>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0 20px" }}>
          {([
            ["Kills", wvS.k, "#22d3ee"],
            ["Accuracy", wvS.acc + "%", "#4ade80"],
            ["WPM", wvS.wpm, "#fbbf24"],
            ["Score", sc, "#f472b6"],
          ] as [string, string | number, string][]).map(([label, value, color]) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 7, padding: 10 }}>
              <div style={{ color, fontSize: 22, fontWeight: 800 }}>{value}</div>
              <div style={{ color: "#64748b", fontSize: 9, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            if (wvS.nd) { G.current.sc += SCORING.waveNoDmg; setSc(v => v + SCORING.waveNoDmg); }
            nextWave();
          }}
          style={{ ...P.bt("#4ade80"), width: "100%", fontSize: 14 }}
        >
          Next Wave →
        </button>
      </div>
    </div>
  );
}
