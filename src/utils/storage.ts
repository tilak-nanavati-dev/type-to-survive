const KEY = "tts_best_v1";

export interface BestRun {
  wave: number;
  score: number;
  at: number;
}

export function loadBest(): BestRun | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.wave === "number" && typeof parsed?.score === "number") {
      return parsed as BestRun;
    }
  } catch {}
  return null;
}

// Saves only if the run beats the stored one (higher wave wins;
// same wave with higher score wins). Returns the record now on disk.
export function maybeSaveBest(wave: number, score: number): BestRun | null {
  try {
    const prev = loadBest();
    const beats = !prev || wave > prev.wave || (wave === prev.wave && score > prev.score);
    if (!beats) return prev;
    const next: BestRun = { wave, score, at: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

export function clearBest(): void {
  try { localStorage.removeItem(KEY); } catch {}
}
