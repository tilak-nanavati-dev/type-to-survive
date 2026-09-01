import VOCAB from "../data/vocabulary";
import type { VocabEntry } from "../types/game";

export const uid   = (): string => Math.random().toString(36).slice(2, 10);
export const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));
export const dist  = (ax: number, ay: number, bx: number, by: number): number => Math.hypot(bx - ax, by - ay);
export const pick  = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
export const rr    = (lo: number, hi: number): number => lo + Math.random() * (hi - lo);

export function getWords(pool: string): VocabEntry[] {
  if (pool === "easy")   return VOCAB.filter(v => v.difficulty === "easy");
  if (pool === "medium") return VOCAB.filter(v => v.difficulty !== "hard");
  return VOCAB;
}
