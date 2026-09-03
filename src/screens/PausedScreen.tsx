import { P } from "../styles/shared";
import type { GameRef, Screen, SetState } from "../types/game";

interface PausedScreenProps {
  G: GameRef;
  setScreen: SetState<Screen>;
}

export default function PausedScreen({ G, setScreen }: PausedScreenProps) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.10) 0%, transparent 55%), radial-gradient(ellipse at 50% 90%, rgba(34,211,238,0.06) 0%, transparent 55%), linear-gradient(180deg,#0a0a15 0%,#0f0f1a 100%)",
      ...P.ft, color: "#e2e8f0",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      {/* Grid backdrop */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(251,191,36,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.05) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        ...P.pn,
        background: "linear-gradient(160deg, rgba(30,26,18,0.95) 0%, rgba(18,16,12,0.92) 100%)",
        border: "1px solid rgba(251,191,36,0.28)",
        boxShadow: "0 20px 60px -20px rgba(251,191,36,0.28), inset 0 1px 0 rgba(255,255,255,0.04)",
        padding: "34px 44px", maxWidth: 380, width: "100%", textAlign: "center",
      }}>
        <div style={{
          display: "inline-block", padding: "4px 12px", borderRadius: 999,
          background: "rgba(251,191,36,0.14)", border: "1px solid rgba(251,191,36,0.4)",
          fontSize: 9, color: "#fcd34d", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700,
        }}>
          Standing By
        </div>

        <div style={{ fontSize: 48, marginTop: 12, lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(251,191,36,0.4))" }}>
          ⏸
        </div>

        <h2 style={{
          fontSize: 30, fontWeight: 900, margin: "6px 0 4px",
          letterSpacing: 3, lineHeight: 1,
          background: "linear-gradient(90deg,#fbbf24 0%,#f472b6 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          PAUSED
        </h2>
        <p style={{ color: "#94a3b8", fontSize: 11, margin: "4px 0 22px", lineHeight: 1.5 }}>
          Horde suspended.
          <br />
          <span style={{ color: "#64748b", fontSize: 10 }}>Auto-pauses when you switch tabs.</span>
        </p>

        <button
          onClick={() => { G.current.pau = false; setScreen("playing"); }}
          style={{
            ...P.bt("#4ade80"),
            width: "100%", fontSize: 14, padding: "13px 0",
            background: "linear-gradient(135deg, rgba(74,222,128,0.22) 0%, rgba(34,211,238,0.18) 100%)",
            border: "1px solid rgba(74,222,128,0.55)",
            color: "#dcfce7", fontWeight: 800, letterSpacing: 2,
            boxShadow: "0 8px 24px -6px rgba(74,222,128,0.4)",
            transition: "transform 0.15s",
          }}
          onMouseDown={e => (e.currentTarget.style.transform = "translateY(1px)")}
          onMouseUp={e => (e.currentTarget.style.transform = "translateY(0)")}
        >
          ▶  RESUME
        </button>
        <button
          onClick={() => setScreen("menu")}
          style={{
            ...P.bt("#94a3b8"),
            width: "100%", marginTop: 10, padding: "10px 0", fontSize: 11, letterSpacing: 1,
          }}
        >
          ⌂ Quit to Menu
        </button>
      </div>
    </div>
  );
}
