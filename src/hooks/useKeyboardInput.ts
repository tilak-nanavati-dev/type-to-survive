import { useEffect, type MutableRefObject } from "react";
import { SCORING } from "../data/config";
import { CX, CY } from "../data/config";
import { uid, dist, rr, pick } from "../utils/helpers";
import { PUPS } from "../data/config";
import type {
  GameRef, Screen, VocabEntry, ActivePowerUp, WordLog, CategoryStats, SetState,
} from "../types/game";

export default function useKeyboardInput(
  screen: Screen,
  G: GameRef,
  vtRef: MutableRefObject<ReturnType<typeof setTimeout> | null>,
  setBuf: SetState<string>,
  setTid: SetState<string | null>,
  setIc: SetState<number>,
  setStreak: SetState<number>,
  setCc: SetState<number>,
  setBest: SetState<number>,
  setSc: SetState<number>,
  setHp: SetState<number>,
  setWc: SetState<number>,
  setWm: SetState<number>,
  setVcard: SetState<VocabEntry | null>,
  setWlog: SetState<WordLog[]>,
  setCatS: SetState<CategoryStats>,
  setPups: SetState<ActivePowerUp[]>,
) {
  useEffect(() => {
    if (screen !== "playing") return;

    const handleKey = (e: KeyboardEvent) => {
      const g = G.current;

      if (g.pau) return;

      if (e.key === "Escape") {
        e.preventDefault();
        g.buf = ""; g.tid = null;
        setBuf(""); setTid(null);
        return;
      }

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        if (g.buf.length > 0) {
          g.buf = g.buf.slice(0, -1);
          const target = g.z.find(z => z.id === g.tid);
          if (target && target.typed > 0) target.typed--;
          if (!g.buf.length) { g.tid = null; setTid(null); }
          setBuf(g.buf);
        }
        return;
      }

      if (e.key.length !== 1 || !/[a-zA-Z]/.test(e.key)) return;
      e.preventDefault();
      const ch = e.key.toLowerCase();

      let target = g.z.find(z => z.id === g.tid);

      if (!target) {
        const candidates = g.z.filter(z => {
          const w = z.bw ? z.bw[z.bwi] : z.word;
          return w[0] === ch && z.typed === 0;
        });

        if (!candidates.length) {
          g.ic++; g.stk = 0;
          setIc(v => v + 1); setStreak(0);
          return;
        }

        target = candidates.sort(
          (a, b) => dist(a.x, a.y, CX, CY) - dist(b.x, b.y, CX, CY)
        )[0];
        g.tid = target.id;
        setTid(target.id);
      }

      const activeWord = target.bw ? target.bw[target.bwi] : target.word;
      const expected = activeWord[target.typed];

      if (ch === expected) {
        target.typed++;
        g.buf += ch;
        g.cc++;
        g.stk++;
        if (g.stk > g.bst) g.bst = g.stk;

        setCc(v => v + 1);
        setStreak(g.stk);
        setBest(g.bst);

        const charScore = SCORING.correctChar + SCORING.streakBonus * Math.min(g.stk, 20);
        g.sc += charScore;
        setSc(v => v + charScore);

        const angle = Math.atan2(target.y - CY, target.x - CX);
        g.proj.push({
          id: uid(), x: CX, y: CY,
          a: angle, s: 14, l: 25, c: target.col,
        });

        if (target.typed >= activeWord.length) {
          if (target.bw && target.bwi < target.bw.length - 1) {
            target.bwi++;
            target.typed = 0;
            target.chp--;
            g.buf = "";
            setBuf("");
          } else {
            let bonus = SCORING.completedWord;
            if (activeWord.length > 6)           bonus += SCORING.longWordBonus;
            if (target.vc.difficulty === "hard")  bonus += SCORING.hardWordBonus;
            if (target.tp === "vocab")            bonus += SCORING.vocabBonus;
            if (target.tp === "boss")             bonus += SCORING.bossKill;
            if (Date.now() - target.st < 3000)   bonus += SCORING.fastKillBonus;
            g.sc += bonus;
            setSc(v => v + bonus);

            for (let i = 0; i < 10; i++) {
              const a2 = (6.28 * i) / 10;
              g.part.push({
                x: target.x, y: target.y,
                vx: Math.cos(a2) * rr(2, 4),
                vy: Math.sin(a2) * rr(2, 4),
                l: 35, ml: 35,
                c: target.col, sz: rr(2, 5),
              });
            }

            if (Math.random() < 0.14 || target.tp === "boss") {
              g.drops.push({
                id: uid(), x: target.x, y: target.y,
                tp: pick(Object.keys(PUPS)) as keyof typeof PUPS, l: 200,
              });
            }

            setVcard(target.vc);
            if (vtRef.current) clearTimeout(vtRef.current);
            vtRef.current = setTimeout(() => setVcard(null), 3500);

            setWlog(l => [...l, {
              word: target.vc.word,
              cat: target.vc.category,
              diff: target.vc.difficulty,
              ok: true,
            }]);

            setCatS(prev => {
              const c = target.vc.category;
              const old = prev[c] || { g: 0, t: 0 };
              return { ...prev, [c]: { g: old.g + 1, t: old.t + 1 } };
            });

            g.wc++;
            g.wk++;
            setWc(v => v + 1);

            g.z = g.z.filter(z => z.id !== target.id);
            g.tid = null;
            g.buf = "";
            setTid(null);
            setBuf("");
          }
        } else {
          setBuf(g.buf);
        }
      } else {
        g.ic++;
        g.stk = 0;
        setIc(v => v + 1);
        setStreak(0);
        g.sc += SCORING.incorrectChar;
        setSc(v => v + SCORING.incorrectChar);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [screen]);
}
