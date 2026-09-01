import type { MouseEvent } from "react";
import {
  LineChart, Line, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { CW, CH, PUPS } from "../data/config";
import { P } from "../styles/shared";
import type { ActivePowerUp, VocabEntry, WpmSample } from "../types/game";

interface PlayingScreenProps {
  hp: number;
  sc: number;
  wv: number;
  curWpm: number;
  acc: number;
  streak: number;
  wc: number;
  wm: number;
  best: number;
  buf: string;
  tid: string | null;
  pups: ActivePowerUp[];
  vcard: VocabEntry | null;
  wpmH: WpmSample[];
  cvRef: React.RefObject<HTMLCanvasElement>;
  collectPU: (x: number, y: number) => void;
}

export default function PlayingScreen({
  hp, sc, wv, curWpm, acc, streak, wc, wm, best,
  buf, tid, pups, vcard, wpmH,
  cvRef, collectPU,
}: PlayingScreenProps) {
  return (
    <div style={{
      minHeight: "100vh", ...P.bg, ...P.ft, color: "#e2e8f0",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "6px 6px 0",
    }}>

      {/* TOP HUD */}
      <div style={{
        width: "100%", maxWidth: CW,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 5, padding: "0 2px",
      }}>
        <div style={{ display: "flex", gap: 14 }}>
          {([["Wave", wv, "#22d3ee"], ["Score", sc, "#fbbf24"]] as [string, number, string][]).map(([label, value, color]) => (
            <div key={label}>
              <span style={{ color: "#64748b", fontSize: 9, textTransform: "uppercase" }}>{label}</span>
              <div style={{ color, fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, maxWidth: 170, margin: "0 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ color: "#64748b", fontSize: 8, textTransform: "uppercase" }}>HP</span>
            <span style={{
              color: hp > 50 ? "#4ade80" : hp > 25 ? "#fbbf24" : "#ef4444",
              fontSize: 10, fontWeight: 700,
            }}>{hp}%</span>
          </div>
          <div style={{ height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 4, transition: "width 0.3s",
              width: hp + "%",
              background: hp > 50 ? "linear-gradient(90deg,#4ade80,#22d3ee)" : hp > 25 ? "#fbbf24" : "#ef4444",
            }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {([["WPM", curWpm, "#4ade80"], ["Acc", acc + "%", "#818cf8"], ["Streak", streak, "#f472b6"]] as [string, string | number, string][]).map(([label, value, color]) => (
            <div key={label} style={{ textAlign: "right" }}>
              <span style={{ color: "#64748b", fontSize: 9, textTransform: "uppercase" }}>{label}</span>
              <div style={{ color, fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* GAME CANVAS */}
      <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(34,211,238,0.1)" }}>
        <canvas
          id="game-canvas"
          ref={cvRef}
          width={CW}
          height={CH}
          style={{ display: "block", background: "#0f0f1a", maxWidth: "100%", width: CW }}
          onClick={(e: MouseEvent<HTMLCanvasElement>) => {
            const rect = cvRef.current!.getBoundingClientRect();
            const scaleX = CW / rect.width;
            collectPU(
              (e.clientX - rect.left) * scaleX,
              (e.clientY - rect.top) * scaleX,
            );
          }}
        />

        {/* Typing buffer overlay */}
        <div style={{
          position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.72)",
          border: `1px solid ${tid ? "#fbbf2466" : "#33415566"}`,
          borderRadius: 7, padding: "6px 20px", minWidth: 170, textAlign: "center",
        }}>
          <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", marginBottom: 3 }}>
            {tid ? "🎯 Targeting" : "Start typing..."}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, minHeight: 24 }}>
            {buf
              ? <span style={{ color: "#4ade80" }}>{buf}</span>
              : <span style={{ color: "#334155" }}>_</span>
            }
            <span style={{ color: "#22d3ee", animation: "blink 1s infinite" }}>|</span>
          </div>
        </div>

        {/* Active power-up indicators */}
        {pups.length > 0 && (
          <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5 }}>
            {pups.map((p, i) => (
              <div key={i} style={{
                background: "rgba(0,0,0,0.65)", borderRadius: 5, padding: "3px 8px",
                border: `1px solid ${PUPS[p.tp].color}33`, fontSize: 11,
              }}>
                {PUPS[p.tp].icon}{" "}
                <span style={{ color: PUPS[p.tp].color, fontSize: 9 }}>{PUPS[p.tp].name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Vocabulary card popup */}
        {vcard && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: "rgba(12,12,28,0.9)",
            border: "1px solid rgba(244,114,182,0.25)",
            borderRadius: 7, padding: "8px 12px", maxWidth: 195,
          }}>
            <div style={{ color: "#f472b6", fontWeight: 700, fontSize: 13 }}>{vcard.word}</div>
            <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 3 }}>{vcard.definition}</div>
            <div style={{ color: "#64748b", fontSize: 9, marginTop: 3, fontStyle: "italic" }}>
              "{vcard.example}"
            </div>
          </div>
        )}
      </div>

      {/* MINI DASHBOARD */}
      <div style={{ width: "100%", maxWidth: CW, display: "flex", gap: 6, marginTop: 6 }}>
        <div style={{ ...P.pn, flex: 1, padding: "6px 10px" }}>
          <div style={{ color: "#64748b", fontSize: 8, textTransform: "uppercase" }}>WPM Trend</div>
          <div style={{ height: 40 }}>
            {wpmH.length > 2 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wpmH.slice(-15)}>
                  <Line type="monotone" dataKey="wpm" stroke="#22d3ee" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: "#334155", fontSize: 9, paddingTop: 10 }}>Collecting data...</div>
            )}
          </div>
        </div>

        <div style={{ ...P.pn, flex: 1, padding: "6px 10px" }}>
          <div style={{ color: "#64748b", fontSize: 8, textTransform: "uppercase" }}>Accuracy</div>
          <div style={{ height: 40 }}>
            {wpmH.length > 2 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={wpmH.slice(-15)}>
                  <Area type="monotone" dataKey="acc" stroke="#4ade80" fill="#4ade8012" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: "#334155", fontSize: 9, paddingTop: 10 }}>Collecting data...</div>
            )}
          </div>
        </div>

        <div style={{ ...P.pn, padding: "6px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          {([["Killed", wc, "#4ade80"], ["Missed", wm, "#ef4444"], ["Best", best, "#fbbf24"]] as [string, number, string][]).map(([label, value, color]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ color, fontSize: 14, fontWeight: 800 }}>{value}</div>
              <div style={{ color: "#64748b", fontSize: 7, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}`}</style>
    </div>
  );
}
