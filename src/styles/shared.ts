import type { CSSProperties } from "react";

export const P = {
  bg: { background: "radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1a 100%)" } as CSSProperties,
  pn: { background: "rgba(12,12,28,0.92)", border: "1px solid rgba(34,211,238,0.12)", borderRadius: 12 } as CSSProperties,
  bt: (color: string): CSSProperties => ({
    background: `linear-gradient(135deg, ${color}20, ${color}08)`,
    border: `1px solid ${color}55`, color,
    padding: "10px 24px", borderRadius: 8, cursor: "pointer",
    fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 600,
  }),
  ft: { fontFamily: "'Courier New', monospace" } as CSSProperties,
};
