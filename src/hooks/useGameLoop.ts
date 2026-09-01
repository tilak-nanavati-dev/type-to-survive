import { useEffect, useCallback, useRef } from "react";
import { CW, CH, CX, CY, SCORING, PUPS } from "../data/config";
import { dist } from "../utils/helpers";
import type {
  GameState, GameRef, Zombie, Screen, WaveStats,
  ActivePowerUp, WordLog, CategoryStats, SetState,
} from "../types/game";

export function useDraw() {
  return useCallback((g: GameState) => {
    const canvas = document.getElementById("game-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, CW, CH);

    ctx.strokeStyle = "rgba(34,211,238,0.03)";
    ctx.lineWidth = 2;
    for (let x = 0; x < CW; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke();
    }
    for (let y = 0; y < CH; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke();
    }

    ctx.strokeStyle = "rgba(239,68,68,0.05)";
    for (let r = 60; r < 260; r += 65) {
      ctx.beginPath(); ctx.arc(CX, CY, r, 0, 6.28); ctx.stroke();
    }

    const tgt = g.z.find(z => z.id === g.tid);
    const barrelAngle = tgt
      ? Math.atan2(tgt.y - CY, tgt.x - CX)
      : -Math.PI / 2;

    if (tgt) {
      ctx.save();
      ctx.strokeStyle = "rgba(251,191,36,0.3)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(tgt.x, tgt.y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Tank turret
    ctx.save();
    ctx.translate(CX, CY);

    // Tank base — rounded rectangle body
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#164e63";
    ctx.beginPath(); ctx.roundRect(-12, -10, 24, 20, 4); ctx.fill();
    ctx.shadowBlur = 0;

    // Treads
    ctx.fillStyle = "#0e3a4a";
    ctx.fillRect(-14, -12, 28, 3);
    ctx.fillRect(-14, 9, 28, 3);

    // Barrel — rotates toward target
    ctx.rotate(barrelAngle);
    ctx.fillStyle = "#22d3ee";
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.roundRect(0, -2.5, 22, 5, 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Muzzle tip
    ctx.fillStyle = "#67e8f9";
    ctx.beginPath(); ctx.roundRect(19, -3.5, 5, 7, 2); ctx.fill();

    ctx.rotate(-barrelAngle);

    // Turret dome
    ctx.fillStyle = "#0e7490";
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#22d3ee";
    ctx.beginPath(); ctx.arc(0, 0, 3, 0, 6.28); ctx.fill();

    ctx.restore();

    // Shield ring
    if (g.shd) {
      ctx.save();
      ctx.strokeStyle = "rgba(167,139,250,0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.arc(CX, CY, 26, 0, 6.28); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    for (const p of g.proj) {
      ctx.save();
      ctx.shadowColor = p.c; ctx.shadowBlur = 6;
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 6.28); ctx.fill();
      ctx.restore();
    }

    for (const p of g.part) {
      const alpha = p.l / p.ml;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * alpha, 0, 6.28); ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (const d of g.drops) {
      const def = PUPS[d.tp];
      ctx.save();
      ctx.shadowColor = def.color; ctx.shadowBlur = 10;
      ctx.font = "18px serif"; ctx.textAlign = "center";
      ctx.fillText(def.icon, d.x, d.y + 5);
      const pulse = 0.5 + Math.sin(Date.now() / 300) * 0.3;
      ctx.strokeStyle = def.color; ctx.lineWidth = 1.5;
      ctx.globalAlpha = pulse;
      ctx.beginPath(); ctx.arc(d.x, d.y, 15, 0, 6.28); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    for (const z of g.z) {
      const isTarget = z.id === g.tid;
      const wobbleX = Math.sin(z.wb) * 2;

      if (isTarget) {
        ctx.save();
        ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 14;
        ctx.strokeStyle = "rgba(251,191,36,0.45)";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(z.x + wobbleX, z.y, z.sz + 5, 0, 6.28); ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.shadowColor = z.col;
      ctx.shadowBlur = isTarget ? 10 : 4;
      ctx.font = z.sz + "px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(z.emo, z.x + wobbleX, z.y);
      ctx.restore();

      if (z.tp === "boss" && z.mhp > 1) {
        const bw = 46;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(z.x - bw / 2, z.y - z.sz - 6, bw, 5);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(z.x - bw / 2, z.y - z.sz - 6, bw * (z.chp / z.mhp), 5);
      }

      const activeWord = z.bw ? z.bw[z.bwi] : z.word;
      const typedPart = activeWord.slice(0, z.typed);
      const restPart = activeWord.slice(z.typed);

      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      const textWidth = ctx.measureText(activeWord).width + 10;
      const labelX = z.x - textWidth / 2;
      const labelY = z.y - z.sz - 22;

      ctx.fillStyle = isTarget ? "rgba(251,191,36,0.1)" : "rgba(0,0,0,0.5)";
      ctx.beginPath(); ctx.roundRect(labelX, labelY, textWidth, 16, 3); ctx.fill();

      ctx.textAlign = "left";
      const startX = labelX + 5;
      if (typedPart) {
        ctx.fillStyle = "#4ade80";
        ctx.fillText(typedPart, startX, labelY + 12);
      }
      ctx.fillStyle = isTarget ? "#fbbf24" : "rgba(255,255,255,0.7)";
      ctx.fillText(restPart, startX + ctx.measureText(typedPart).width, labelY + 12);
    }

    if (g.frz) {
      ctx.fillStyle = "rgba(103,232,249,0.04)";
      ctx.fillRect(0, 0, CW, CH);
    }

    if (g.pau) {
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, CW, CH);

      ctx.font = "bold 28px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "#fbbf24";
      ctx.fillText("PAUSED", CW / 2, CH / 2);
    }
  }, []);
}

export default function useGameLoop(
  screen: Screen,
  spawn: () => Zombie,
  draw: (g: GameState) => void,
  G: GameRef,
  setHp: SetState<number>,
  setSc: SetState<number>,
  setWm: SetState<number>,
  setTid: SetState<string | null>,
  setBuf: SetState<string>,
  setWlog: SetState<WordLog[]>,
  setCatS: SetState<CategoryStats>,
  setPups: SetState<ActivePowerUp[]>,
  setWvS: SetState<WaveStats | null>,
  setScreen: SetState<Screen>,
) {
  const afRef = useRef<number | null>(null);

  useEffect(() => {
    if (screen !== "playing") {
      if (afRef.current) cancelAnimationFrame(afRef.current);
      return;
    }

    const tick = () => {
      const g = G.current;

      if (g.pau) {
        draw(g);
        afRef.current = requestAnimationFrame(tick);
        return;
      }

      const now = Date.now();

      if (g.wa && g.z.length < g.mz && now - g.lsp > g.sr && g.ziw < g.zpw) {
        g.z.push(spawn());
        g.ziw++;
        g.lsp = now;
      }

      if (g.ziw >= g.zpw && g.z.length === 0 && g.wa) {
        g.wa = false;
        const mins = (now - g.st) / 60000;
        const wpm = mins > 0 ? Math.round(g.wc / mins) : 0;
        const total = g.cc + g.ic;
        const accuracy = total > 0 ? Math.round((g.cc / total) * 100) : 100;
        setWvS({ k: g.wk, acc: accuracy, wpm, nd: !g.wd });
        setScreen("waveEnd");
        return;
      }

      for (const z of g.z) {
        const speed = g.frz ? z.spd * 0.12 : z.spd;
        const angle = Math.atan2(CY - z.y, CX - z.x);
        z.x += Math.cos(angle) * speed;
        z.y += Math.sin(angle) * speed;
        z.wb += 0.05;

        if (dist(z.x, z.y, CX, CY) < 28) {
          if (!g.shd) {
            g.hp = Math.max(0, g.hp - 20);
            setHp(g.hp);
            g.wd = true;
            g.sc += SCORING.zombieReached;
            setSc(v => v + SCORING.zombieReached);

            for (let i = 0; i < 6; i++) {
              g.part.push({
                x: CX, y: CY,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                l: 16, ml: 16, c: "#ef4444", sz: 4,
              });
            }
          } else {
            g.shd = false;
            setPups(a => a.filter(p => p.tp !== "shield"));
          }

          g.wm++;
          setWm(v => v + 1);
          setWlog(l => [...l, { word: z.vc.word, cat: z.vc.category, diff: z.vc.difficulty, ok: false }]);
          setCatS(prev => {
            const cat = z.vc.category;
            const old = prev[cat] || { g: 0, t: 0 };
            return { ...prev, [cat]: { g: old.g, t: old.t + 1 } };
          });

          if (g.tid === z.id) {
            g.tid = null; g.buf = "";
            setTid(null); setBuf("");
          }

          g.z = g.z.filter(zz => zz.id !== z.id);

          if (g.hp <= 0) { setScreen("gameOver"); return; }
        }
      }

      g.proj = g.proj.filter(p => {
        p.x += Math.cos(p.a) * p.s;
        p.y += Math.sin(p.a) * p.s;
        return --p.l > 0;
      });

      g.part = g.part.filter(p => {
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.95; p.vy *= 0.95;
        return --p.l > 0;
      });

      g.drops = g.drops.filter(d => --d.l > 0);

      draw(g);

      afRef.current = requestAnimationFrame(tick);
    };

    afRef.current = requestAnimationFrame(tick);
    return () => { if (afRef.current) cancelAnimationFrame(afRef.current); };
  }, [screen, spawn, draw]);
}
