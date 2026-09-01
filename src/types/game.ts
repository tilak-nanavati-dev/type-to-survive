import type { MutableRefObject, Dispatch, SetStateAction } from "react";

export type Difficulty = "easy" | "medium" | "hard";
export type DifficultyPreset = "beginner" | "intermediate" | "advanced" | "adaptive";
export type ZombieType = "standard" | "runner" | "armored" | "vocab" | "boss";
export type PowerUpType = "freeze" | "shield" | "heal" | "blast";
export type Screen = "menu" | "playing" | "paused" | "waveEnd" | "gameOver" | "stats" | "vocab";

export interface VocabEntry {
  word: string;
  difficulty: Difficulty;
  category: string;
  definition: string;
  example: string;
}

export interface ZombieTypeDef {
  speed: number;
  color: string;
  emoji: string;
  size: number;
}

export interface PowerUpDef {
  name: string;
  icon: string;
  color: string;
}

export interface Zombie {
  id: string;
  tp: ZombieType;
  x: number;
  y: number;
  spd: number;
  word: string;
  vc: VocabEntry;
  typed: number;
  col: string;
  emo: string;
  sz: number;
  mhp: number;
  chp: number;
  bw: string[] | null;
  bwi: number;
  st: number;
  wb: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  a: number;
  s: number;
  l: number;
  c: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  l: number;
  ml: number;
  c: string;
  sz: number;
}

export interface Drop {
  id: string;
  x: number;
  y: number;
  tp: PowerUpType;
  l: number;
}

export interface ActivePowerUp {
  tp: PowerUpType;
}

export interface GameState {
  z: Zombie[];
  proj: Projectile[];
  part: Particle[];
  drops: Drop[];
  buf: string;
  tid: string | null;
  hp: number;
  sc: number;
  wv: number;
  pau: boolean;
  frz: boolean;
  shd: boolean;
  lsp: number;
  sr: number;
  sm: number;
  mz: number;
  cc: number;
  ic: number;
  wc: number;
  wm: number;
  stk: number;
  bst: number;
  st: number;
  wk: number;
  wd: boolean;
  ws: number;
  ziw: number;
  zpw: number;
  wa: boolean;
  bs: boolean;
  aw: number;
  aa: number;
}

export type GameRef = MutableRefObject<GameState>;

export interface WpmSample {
  t: number;
  wpm: number;
  acc: number;
}

export interface WaveStats {
  k: number;
  acc: number;
  wpm: number;
  nd: boolean;
}

export interface WordLog {
  word: string;
  cat: string;
  diff: Difficulty;
  ok: boolean;
}

export interface CategoryStat {
  g: number;
  t: number;
}

export type CategoryStats = Record<string, CategoryStat>;

export interface CategoryDataPoint {
  cat: string;
  acc: number;
}

export interface DifficultyDistPoint {
  d: string;
  n: number;
}

export type SetState<T> = Dispatch<SetStateAction<T>>;
