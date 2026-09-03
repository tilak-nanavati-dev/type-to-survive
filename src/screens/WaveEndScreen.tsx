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
  const stats: [string, string | number, string][] = [
    ["Kills",    wvS.k,          "#22d3ee"],
    ["Accuracy", wvS.acc + "%",  "#4ade80"],
    ["WPM",      wvS.wpm,        "#fbbf24"],
    ["Score",    sc,             "#f472b6"],
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, rgba(74,222,128,0.10) 0%, transparent 55%), radial-gradient(ellipse at 50% 90%, rgba(34,211,238,0.08) 0%, transparent 55%), linear-gradient(180deg,#0a0a15 0%,#0f0f1a 100%)",
      ...P.ft, color: "#e2e8f0",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      {/* Grid backdrop */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(74,222,128,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.05) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        ...P.pn,
        background: "linear-gradient(160deg, rgba(20,30,25,0.95) 0%, rgba(12,20,18,0.92) 100%)",
        border: "1px solid rgba(74,222,128,0.28)",
        boxShadow: "0 20px 60px -20px rgba(74,222,128,0.30), inset 0 1px 0 rgba(255,255,255,0.04)",
        padding: "32px 42px", maxWidth: 460, width: "100%", textAlign: "center",
      }}>
        <div style={{
          display: "inline-block", padding: "4px 12px", borderRadius: 999,
          background: "rgba(74,222,128,0.14)", border: "1px solid rgba(74,222,128,0.4)",
          fontSize: 9, color: "#86efac", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700,
        }}>
          ✓ Wave Cleared
        </div>

        <div style={{ fontSize: 48, marginTop: 12, lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(74,222,128,0.4))" }}>
          🏆
        </div>

        <h2 style={{
          fontSize: 30, fontWeight: 900, margin: "6px 0 2px",
          letterSpacing: 3, lineHeight: 1,
          background: "linear-gradient(90deg,#4ade80 0%,#22d3ee 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          WAVE&nbsp;{wv}
        </h2>
        <p style={{ color: "#94a3b8", fontSize: 12, margin: "2px 0 0", letterSpacing: 1 }}>
          Position held. Reloading…
        </p>

        {wvS.nd && (
          <div style={{
            marginTop: 16, padding: "8px 14px", borderRadius: 8,
            background: "linear-gradient(90deg, rgba(251,191,36,0.14) 0%, rgba(251,191,36,0.04) 100%)",
            border: "1px solid rgba(251,191,36,0.4)",
            color: "#fcd34d", fontSize: 11, fontWeight: 700, letterSpacing: 1,
          }}>
            ⭐ FLAWLESS · +{SCORING.waveNoDmg} bonus
          </div>
        )}

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
          margin: "20px 0 22px",
        }}>
          {stats.map(([label, value, color]) => (
            <div key={label} style={{
              background: `linear-gradient(140deg, ${color}12 0%, rgba(255,255,255,0.02) 100%)`,
              border: `1px solid ${color}25`,
              borderRadius: 9, padding: "12px 10px",
            }}>
              <div style={{ color, fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{value}</div>
              <div style={{ color: "#64748b", fontSize: 9, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            if (wvS.nd) { G.current.sc += SCORING.waveNoDmg; setSc(v => v + SCORING.waveNoDmg); }
            nextWave();
          }}
          style={{
            ...P.bt("#4ade80"),
            width: "100%", fontSize: 15, padding: "14px 0",
            background: "linear-gradient(135deg, rgba(74,222,128,0.22) 0%, rgba(34,211,238,0.18) 100%)",
            border: "1px solid rgba(74,222,128,0.55)",
            color: "#dcfce7", fontWeight: 800, letterSpacing: 2,
            boxShadow: "0 8px 24px -6px rgba(74,222,128,0.4)",
            transition: "transform 0.15s",
          }}
          onMouseDown={e => (e.currentTarget.style.transform = "translateY(1px)")}
          onMouseUp={e => (e.currentTarget.style.transform = "translateY(0)")}
        >
          ▶  WAVE {wv + 1}
        </button>
      </div>
    </div>
  );
}
