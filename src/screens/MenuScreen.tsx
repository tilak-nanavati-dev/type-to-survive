import { P } from "../styles/shared";
import { PUPS } from "../data/config";
import type { DifficultyPreset, Screen, SetState, PowerUpType } from "../types/game";

interface MenuScreenProps {
  diff: DifficultyPreset;
  setDiff: SetState<DifficultyPreset>;
  start: () => void;
  setScreen: SetState<Screen>;
}

const DIFF_META: Record<DifficultyPreset, { label: string; blurb: string; color: string }> = {
  beginner:     { label: "Beginner",     blurb: "Slow spawns · short words",  color: "#4ade80" },
  intermediate: { label: "Intermediate", blurb: "Balanced pace",              color: "#22d3ee" },
  advanced:     { label: "Advanced",     blurb: "Fast horde · hard words",    color: "#f472b6" },
  adaptive:     { label: "Adaptive",     blurb: "Scales to your accuracy",    color: "#fbbf24" },
};

export default function MenuScreen({ diff, setDiff, start, setScreen }: MenuScreenProps) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 30% 20%, rgba(34,211,238,0.08) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(239,68,68,0.06) 0%, transparent 55%), linear-gradient(180deg,#0a0a15 0%,#0f0f1a 100%)",
      ...P.ft, color: "#e2e8f0",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, overflow: "hidden", position: "relative",
    }}>
      {/* Ambient grid backdrop */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        display: "grid", gridTemplateColumns: "minmax(320px, 460px) minmax(260px, 340px)",
        gap: 20, maxWidth: 820, width: "100%",
      }}>
        {/* LEFT: hero + start */}
        <div style={{
          ...P.pn,
          background: "linear-gradient(160deg, rgba(20,20,40,0.95) 0%, rgba(12,12,28,0.92) 100%)",
          border: "1px solid rgba(34,211,238,0.22)",
          padding: "36px 40px",
          boxShadow: "0 20px 60px -20px rgba(34,211,238,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              display: "inline-block", padding: "4px 10px", borderRadius: 999,
              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)",
              fontSize: 9, color: "#fca5a5", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700,
            }}>
              ⚠ Horde inbound
            </div>

            <div style={{ fontSize: 56, marginTop: 14, lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(34,211,238,0.3))" }}>
              🧟
            </div>
          </div>

          <h1 style={{
            fontSize: 34, fontWeight: 900, margin: "8px 0 4px",
            letterSpacing: 3, lineHeight: 1,
            background: "linear-gradient(90deg,#22d3ee 0%,#4ade80 55%,#fbbf24 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            TYPE&nbsp;TO&nbsp;SURVIVE
          </h1>

          <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 26px", lineHeight: 1.5 }}>
            A vocabulary-driven horde defense. Type the words above each zombie
            <br />to eliminate them before they overrun your position.
          </p>

          <button onClick={start} style={{
            ...P.bt("#4ade80"),
            fontSize: 16, padding: "15px 0", width: "100%",
            background: "linear-gradient(135deg, rgba(74,222,128,0.22) 0%, rgba(34,211,238,0.18) 100%)",
            border: "1px solid rgba(74,222,128,0.55)",
            color: "#dcfce7", fontWeight: 800, letterSpacing: 2,
            boxShadow: "0 8px 24px -6px rgba(74,222,128,0.4)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseDown={e => (e.currentTarget.style.transform = "translateY(1px)")}
          onMouseUp={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            ▶  SURVIVE
          </button>

          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <button onClick={() => setScreen("vocab")} style={{
              ...P.bt("#818cf8"), padding: "9px 0", fontSize: 11, flex: 1, letterSpacing: 1,
            }}>
              📖 Vocabulary
            </button>
            <button onClick={() => setScreen("stats")} style={{
              ...P.bt("#f472b6"), padding: "9px 0", fontSize: 11, flex: 1, letterSpacing: 1,
            }}>
              📊 Stats
            </button>
          </div>
        </div>

        {/* RIGHT: difficulty + intel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ ...P.pn, padding: "18px 20px" }}>
            <div style={{
              color: "#64748b", fontSize: 9, textTransform: "uppercase", letterSpacing: 2,
              fontWeight: 700, marginBottom: 12,
            }}>
              Select Difficulty
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(Object.keys(DIFF_META) as DifficultyPreset[]).map(d => {
                const meta = DIFF_META[d];
                const active = d === diff;
                return (
                  <button key={d} onClick={() => setDiff(d)} style={{
                    textAlign: "left", cursor: "pointer",
                    padding: "9px 12px", borderRadius: 7,
                    background: active
                      ? `linear-gradient(90deg, ${meta.color}22 0%, ${meta.color}05 100%)`
                      : "rgba(255,255,255,0.02)",
                    border: `1px solid ${active ? meta.color + "88" : "rgba(255,255,255,0.06)"}`,
                    color: active ? meta.color : "#94a3b8",
                    fontFamily: "inherit",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "border-color 0.15s, background 0.15s",
                  }}>
                    <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>
                      {meta.label}
                    </span>
                    <span style={{ fontSize: 9, color: active ? meta.color + "cc" : "#475569" }}>
                      {meta.blurb}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ ...P.pn, padding: "14px 18px" }}>
            <div style={{
              color: "#64748b", fontSize: 9, textTransform: "uppercase", letterSpacing: 2,
              fontWeight: 700, marginBottom: 10,
            }}>
              Arsenal · Drops
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {(Object.keys(PUPS) as PowerUpType[]).map(k => {
                const pu = PUPS[k];
                return (
                  <div key={k} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "5px 7px", borderRadius: 5,
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${pu.color}25`,
                  }}>
                    <span style={{ fontSize: 13 }}>{pu.icon}</span>
                    <span style={{ color: pu.color, fontSize: 10, fontWeight: 700 }}>{pu.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            padding: "12px 16px", borderRadius: 10,
            background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.04)",
            fontSize: 10, lineHeight: 1.7, color: "#94a3b8",
          }}>
            <div style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: 4, letterSpacing: 1, fontSize: 10 }}>
              CONTROLS
            </div>
            <span style={{ color: "#fbbf24" }}>Type</span> — target nearest match ·{" "}
            <span style={{ color: "#fbbf24" }}>Backspace</span> — undo ·{" "}
            <span style={{ color: "#fbbf24" }}>Esc</span> — clear target ·{" "}
            <span style={{ color: "#fbbf24" }}>Click</span> — collect drops
          </div>
        </div>
      </div>
    </div>
  );
}
