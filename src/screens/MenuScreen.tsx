import { P } from "../styles/shared";
import type { DifficultyPreset, Screen, SetState } from "../types/game";

interface MenuScreenProps {
  diff: DifficultyPreset;
  setDiff: SetState<DifficultyPreset>;
  start: () => void;
  setScreen: SetState<Screen>;
}

export default function MenuScreen({ diff, setDiff, start, setScreen }: MenuScreenProps) {
  return (
    <div style={{ minHeight: "100vh", ...P.bg, display: "flex", alignItems: "center", justifyContent: "center", ...P.ft, color: "#e2e8f0" }}>
      <div style={{ ...P.pn, padding: "44px 52px", maxWidth: 500, textAlign: "center" }}>
        <div style={{ fontSize: 44 }}>🧟</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#22d3ee", margin: "4px 0 2px", letterSpacing: 2 }}>
          TYPE TO SURVIVE
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 28px" }}>
          Eliminate zombies by typing the words above them
        </p>

        <div style={{ marginBottom: 24 }}>
          <p style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            Difficulty
          </p>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
            {(["beginner", "intermediate", "advanced", "adaptive"] as DifficultyPreset[]).map(d => (
              <button key={d} onClick={() => setDiff(d)} style={{
                ...P.bt(d === diff ? "#4ade80" : "#475569"),
                padding: "6px 14px", fontSize: 11,
                background: d === diff ? "rgba(74,222,128,0.12)" : "rgba(71,85,105,0.08)",
              }}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button onClick={start} style={{ ...P.bt("#4ade80"), fontSize: 15, padding: "13px 0", width: "100%" }}>
          ▶ Start Game
        </button>

        <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => setScreen("vocab")} style={{ ...P.bt("#818cf8"), padding: "7px 18px", fontSize: 11 }}>
            📖 Vocabulary
          </button>
          <button onClick={() => setScreen("stats")} style={{ ...P.bt("#f472b6"), padding: "7px 18px", fontSize: 11 }}>
            📊 Stats
          </button>
        </div>

        <div style={{ marginTop: 28, textAlign: "left", color: "#64748b", fontSize: 11, lineHeight: 1.9 }}>
          <p style={{ color: "#94a3b8", fontWeight: 700, marginBottom: 4, fontSize: 12 }}>Controls</p>
          <span style={{ color: "#fbbf24" }}>Type</span> a letter to target the nearest matching zombie.{" "}
          <span style={{ color: "#fbbf24" }}>Backspace</span> to correct.{" "}
          <span style={{ color: "#fbbf24" }}>Escape</span> to cancel target.{" "}
          <span style={{ color: "#fbbf24" }}>Click</span> glowing drops to collect power-ups.
        </div>
      </div>
    </div>
  );
}
