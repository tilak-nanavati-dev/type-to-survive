import { useState, useRef, useCallback, useMemo } from "react";

import { SCORING, ZTYPES, PUPS, CW, CX, CY, DIFFICULTY_PRESETS } from "./data/config";
import { uid, pick, rr, getWords } from "./utils/helpers";

import useKeyboardInput from "./hooks/useKeyboardInput";
import useVisibility from "./hooks/useVisibility";
import useStatsInterval from "./hooks/useStatsInterval";
import useGameLoop, { useDraw } from "./hooks/useGameLoop";

import MenuScreen from "./screens/MenuScreen";
import VocabScreen from "./screens/VocabScreen";
import StatsScreen from "./screens/StatsScreen";
import WaveEndScreen from "./screens/WaveEndScreen";
import GameOverScreen from "./screens/GameOverScreen";
import PausedScreen from "./screens/PausedScreen";
import PlayingScreen from "./screens/PlayingScreen";

import type {
  Screen, DifficultyPreset, GameState, VocabEntry, ActivePowerUp,
  WpmSample, CategoryStats, WordLog, WaveStats, Zombie, ZombieType,
} from "./types/game";

declare global {
  interface Window {
    __G?: React.MutableRefObject<GameState>;
  }
}

export default function App() {

  /* ─── Screen & Settings ─── */
  const [screen, setScreen] = useState<Screen>("menu");
  const [diff, setDiff]     = useState<DifficultyPreset>("adaptive");

  /* ─── Game State (triggers UI re-renders) ─── */
  const [hp, setHp]         = useState(100);
  const [sc, setSc]         = useState(0);
  const [wv, setWv]         = useState(1);
  const [buf, setBuf]       = useState("");
  const [tid, setTid]       = useState<string | null>(null);
  const [pups, setPups]     = useState<ActivePowerUp[]>([]);
  const [vcard, setVcard]   = useState<VocabEntry | null>(null);

  /* ─── Statistics ─── */
  const [cc, setCc]         = useState(0);
  const [ic, setIc]         = useState(0);
  const [wc, setWc]         = useState(0);
  const [wm, setWm]         = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest]     = useState(0);
  const [t0, setT0]         = useState<number | null>(null);
  const [wpmH, setWpmH]     = useState<WpmSample[]>([]);
  const [catS, setCatS]     = useState<CategoryStats>({});
  const [wlog, setWlog]     = useState<WordLog[]>([]);
  const [wvS, setWvS]       = useState<WaveStats | null>(null);

  /* ─── Refs ─── */
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const vtRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const G = useRef<GameState>({
    z: [], proj: [], part: [], drops: [],
    buf: "", tid: null, hp: 100, sc: 0, wv: 1,
    pau: false, frz: false, shd: false,
    lsp: 0, sr: 3000, sm: 0.65, mz: 5,
    cc: 0, ic: 0, wc: 0, wm: 0, stk: 0, bst: 0,
    st: 0, wk: 0, wd: false, ws: 0,
    ziw: 0, zpw: 8, wa: true, bs: false, aw: 30, aa: 0.9,
  });

  if (typeof window !== "undefined") window.__G = G;

  /* ─── Spawn Zombie ─── */
  const spawn = useCallback((forceType?: ZombieType): Zombie => {
    const g = G.current;
    const pool = diff === "adaptive"
      ? (g.aw > 45 ? "hard" : g.aw > 25 ? "medium" : "easy")
      : (diff === "beginner" ? "easy" : diff === "intermediate" ? "medium" : "hard");
    const words = getWords(pool);

    let type: ZombieType = forceType || "standard";
    if (!forceType) {
      const r = Math.random();
      if (g.wv >= 5 && g.wv % 5 === 0 && !g.bs) { type = "boss"; g.bs = true; }
      else if (r < 0.15) type = "runner";
      else if (r < 0.25) type = "armored";
      else if (r < 0.35) type = "vocab";
    }

    const td = ZTYPES[type];
    let vocab: VocabEntry;
    if (type === "armored" || type === "boss") {
      vocab = pick(words.filter(w => w.word.length >= 5)) || pick(words);
    } else if (type === "runner") {
      vocab = pick(words.filter(w => w.word.length <= 5)) || pick(words);
    } else {
      vocab = pick(words);
    }

    const CW_VAL = 860, CH_VAL = 500;
    const edge = Math.floor(Math.random() * 4);
    let x: number, y: number;
    if (edge === 0)      { x = rr(50, CW_VAL - 50); y = -25; }
    else if (edge === 1) { x = CW_VAL + 25;          y = rr(50, CH_VAL - 50); }
    else if (edge === 2) { x = rr(50, CW_VAL - 50); y = CH_VAL + 25; }
    else                 { x = -25;                   y = rr(50, CH_VAL - 50); }

    const bossWords = type === "boss"
      ? [vocab, pick(words), pick(words)].map(v => v.word)
      : null;

    return {
      id: uid(), tp: type, x, y,
      spd: td.speed * g.sm * rr(0.85, 1.15),
      word: vocab.word, vc: vocab, typed: 0,
      col: td.color, emo: td.emoji, sz: td.size,
      mhp: type === "boss" ? 3 : 1,
      chp: type === "boss" ? 3 : 1,
      bw: bossWords, bwi: 0,
      st: Date.now(), wb: Math.random() * 6.28,
    };
  }, [diff]);


  /* ─── Start Game ─── */
  const start = useCallback(() => {
    const [sr, sm, mz] = DIFFICULTY_PRESETS[diff];
    const now = Date.now();

    G.current = {
      z: [], proj: [], part: [], drops: [],
      buf: "", tid: null, hp: 100, sc: 0, wv: 1,
      pau: false, frz: false, shd: false,
      lsp: now, sr, sm, mz,
      cc: 0, ic: 0, wc: 0, wm: 0, stk: 0, bst: 0,
      st: now, wk: 0, wd: false, ws: now,
      ziw: 0, zpw: 8, wa: true, bs: false, aw: 30, aa: 0.9,
      };

    setHp(100); setSc(0); setWv(1);
    setBuf(""); setTid(null);
    setPups([]); setVcard(null);
    setCc(0); setIc(0); setWc(0); setWm(0);
    setStreak(0); setBest(0);
    setT0(now); setWpmH([]);
    setCatS({}); setWlog([]); setWvS(null);
    setScreen("playing");
  }, [diff]);


  /* ─── Collect Power-Up ─── */
  const collectPU = useCallback((mouseX: number, mouseY: number) => {
    const g = G.current;
    const dist2 = (ax: number, ay: number, bx: number, by: number) => Math.hypot(bx - ax, by - ay);
    for (let i = 0; i < g.drops.length; i++) {
      const d = g.drops[i];
      if (dist2(mouseX, mouseY, d.x, d.y) < 24) {
        g.drops.splice(i, 1);

        if (d.tp === "heal") {
          g.hp = Math.min(100, g.hp + 25);
          setHp(g.hp);
        } else if (d.tp === "blast") {
          const nearest = [...g.z]
            .sort((a, b) => dist2(a.x, a.y, CX, CY) - dist2(b.x, b.y, CX, CY))
            .slice(0, 3);
          for (const z of nearest) {
            for (let j = 0; j < 6; j++) {
              const a = (6.28 * j) / 6;
              g.part.push({
                x: z.x, y: z.y,
                vx: Math.cos(a) * 3, vy: Math.sin(a) * 3,
                l: 18, ml: 18, c: "#fb923c", sz: 4,
              });
            }
          }
          const ids = new Set(nearest.map(z => z.id));
          if (g.tid && ids.has(g.tid)) {
            g.tid = null; g.buf = "";
            setTid(null); setBuf("");
          }
          g.z = g.z.filter(z => !ids.has(z.id));
          g.wk += nearest.length;
          g.sc += nearest.length * 40;
          setSc(v => v + nearest.length * 40);
        } else if (d.tp === "freeze") {
          g.frz = true;
          setPups(a => [...a.filter(p => p.tp !== "freeze"), { tp: "freeze" }]);
          setTimeout(() => {
            g.frz = false;
            setPups(a => a.filter(p => p.tp !== "freeze"));
          }, 5000);
        } else if (d.tp === "shield") {
          g.shd = true;
          setPups(a => [...a.filter(p => p.tp !== "shield"), { tp: "shield" }]);
          setTimeout(() => {
            if (G.current.shd) {
              G.current.shd = false;
              setPups(a => a.filter(p => p.tp !== "shield"));
            }
          }, 8000);
        }

        break;
      }
    }
  }, []);


  /* ─── Next Wave ─── */
  const nextWave = useCallback(() => {
    const g = G.current;
    g.wv++;
    g.wa = true;
    g.ziw = 0;
    g.zpw = 8 + g.wv * 2;
    g.wk = 0;
    g.wd = false;
    g.bs = false;
    g.ws = Date.now();

    if (diff !== "adaptive") {
      g.sr = Math.max(1300, g.sr - 80);
      g.sm = Math.min(1.4, g.sm + 0.035);
      g.mz = Math.min(14, g.mz + 1);
    }

    setWv(g.wv);
    setScreen("playing");
  }, [diff]);


  /* ─── Hooks ─── */
  useKeyboardInput(
    screen, G, vtRef,
    setBuf, setTid, setIc, setStreak, setCc, setBest, setSc,
    setHp, setWc, setWm, setVcard, setWlog, setCatS, setPups,
  );
  useVisibility(screen, G, setScreen);
  useStatsInterval(screen, diff, G, setWpmH);
  const draw = useDraw();
  useGameLoop(
    screen, spawn, draw, G,
    setHp, setSc, setWm, setTid, setBuf, setWlog, setCatS, setPups, setWvS, setScreen,
  );


  /* ─── Derived Statistics ─── */
  const elapsed = t0 ? (Date.now() - t0) / 60000 : 0;
  const curWpm  = elapsed > 0 ? Math.round(wc / elapsed) : 0;
  const totC    = cc + ic;
  const acc     = totC > 0 ? Math.round((cc / totC) * 100) : 100;
  const surv    = t0 ? Math.round((Date.now() - t0) / 1000) : 0;

  const categoryData = useMemo(() =>
    Object.entries(catS).map(([k, v]) => ({
      cat: k.charAt(0).toUpperCase() + k.slice(1),
      acc: v.t > 0 ? Math.round((v.g / v.t) * 100) : 0,
    })),
  [catS]);

  const difficultyDist = useMemo(() => {
    const counts: Record<string, number> = { easy: 0, medium: 0, hard: 0 };
    wlog.filter(w => w.ok).forEach(w => counts[w.diff]++);
    return Object.entries(counts).map(([k, v]) => ({ d: k, n: v }));
  }, [wlog]);


  /* ─── Screen Routing ─── */
  if (screen === "menu") {
    return <MenuScreen diff={diff} setDiff={setDiff} start={start} setScreen={setScreen} />;
  }

  if (screen === "vocab") {
    return <VocabScreen wlog={wlog} setScreen={setScreen} />;
  }

  if (screen === "stats") {
    return (
      <StatsScreen
        wpmH={wpmH} difficultyDist={difficultyDist} categoryData={categoryData}
        curWpm={curWpm} acc={acc} wc={wc} best={best} surv={surv} setScreen={setScreen}
      />
    );
  }

  if (screen === "waveEnd" && wvS) {
    return <WaveEndScreen wv={wv} sc={sc} wvS={wvS} G={G} setSc={setSc} nextWave={nextWave} />;
  }

  if (screen === "gameOver") {
    return (
      <GameOverScreen
        wv={wv} sc={sc} curWpm={curWpm} acc={acc} wc={wc} best={best} surv={surv}
        start={start} setScreen={setScreen}
      />
    );
  }

  if (screen === "paused") {
    return <PausedScreen G={G} setScreen={setScreen} />;
  }

  return (
    <PlayingScreen
      hp={hp} sc={sc} wv={wv} curWpm={curWpm} acc={acc} streak={streak}
      wc={wc} wm={wm} best={best}
      buf={buf} tid={tid} pups={pups} vcard={vcard} wpmH={wpmH}
      cvRef={cvRef} collectPU={collectPU}
    />
  );
}
