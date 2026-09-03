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
  const stats: [string, string | number, string][] = [
    ["Score",       sc,                                                    "#fbbf24"],
    ["WPM",         curWpm,                                                "#22d3ee"],
    ["Accuracy",    acc + "%",                                             "#4ade80"],
    ["Words",       wc,                                                    "#818cf8"],
    ["Best Streak", best,                                                  "#f472b6"],
    ["Time",        Math.floor(surv / 60) + "m " + (surv % 60) + "s",      "#67e8f9"],
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, rgba(239,68,68,0.10) 0%, transparent 55%), radial-gradient(ellipse at 50% 90%, rgba(239,68,68,0.05) 0%, transparent 55%), linear-gradient(180deg,#0a0a15 0%,#0f0f1a 100%)",
      ...P.ft, color: "#e2e8f0",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      {/* Grid backdrop */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(239,68,68,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.05) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        ...P.pn,
        background: "linear-gradient(160deg, rgba(30,20,22,0.95) 0%, rgba(20,12,14,0.92) 100%)",
        border: "1px solid rgba(239,68,68,0.28)",
        boxShadow: "0 20px 60px -20px rgba(239,68,68,0.30), inset 0 1px 0 rgba(255,255,255,0.04)",
        padding: "32px 42px", maxWidth: 500, width: "100%", textAlign: "center",
      }}>
        <div style={{
          display: "inline-block", padding: "4px 12px", borderRadius: 999,
          background: "rgba(239,68,68,0.14)", border: "1px solid rgba(239,68,68,0.4)",
          fontSize: 9, color: "#fca5a5", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700,
        }}>
          ✕ Position Overrun
        </div>

        <div style={{ fontSize: 52, marginTop: 12, lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(239,68,68,0.4))" }}>
          💀
        </div>

        <h2 style={{
          fontSize: 32, fontWeight: 900, margin: "6px 0 2px",
          letterSpacing: 3, lineHeight: 1,
          background: "linear-gradient(90deg,#ef4444 0%,#fbbf24 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          GAME&nbsp;OVER
        </h2>
        <p style={{ color: "#94a3b8", fontSize: 12, margin: "4px 0 0", letterSpacing: 1 }}>
          Held out for {wv} wave{wv > 1 ? "s" : ""}
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8,
          margin: "22px 0",
        }}>
          {stats.map(([label, value, color]) => (
            <div key={label} style={{
              background: `linear-gradient(140deg, ${color}12 0%, rgba(255,255,255,0.02) 100%)`,
              border: `1px solid ${color}25`,
              borderRadius: 9, padding: "10px 6px",
            }}>
              <div style={{ color, fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{value}</div>
              <div style={{ color: "#64748b", fontSize: 8, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={start}
            style={{
              ...P.bt("#4ade80"), flex: 1.4, padding: "12px 0", fontSize: 13,
              background: "linear-gradient(135deg, rgba(74,222,128,0.22) 0%, rgba(34,211,238,0.18) 100%)",
              border: "1px solid rgba(74,222,128,0.55)",
              color: "#dcfce7", fontWeight: 800, letterSpacing: 2,
              boxShadow: "0 8px 24px -6px rgba(74,222,128,0.4)",
              transition: "transform 0.15s",
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "translateY(1px)")}
            onMouseUp={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            ↻ RETRY
          </button>
          <button
            onClick={() => setScreen("stats")}
            style={{ ...P.bt("#818cf8"), flex: 1, padding: "12px 0", fontSize: 11, letterSpacing: 1 }}
          >
            📊 Stats
          </button>
          <button
            onClick={() => setScreen("menu")}
            style={{ ...P.bt("#94a3b8"), flex: 1, padding: "12px 0", fontSize: 11, letterSpacing: 1 }}
          >
            ⌂ Menu
          </button>
        </div>
      </div>
    </div>
  );
}
