import type { ZombieTypeDef, PowerUpDef, ZombieType, PowerUpType, DifficultyPreset } from "../types/game";

export const SCORING = {
  correctChar: 10,
  completedWord: 50,
  longWordBonus: 30,
  hardWordBonus: 80,
  streakBonus: 5,
  fastKillBonus: 40,
  vocabBonus: 100,
  waveNoDmg: 200,
  bossKill: 500,
  incorrectChar: -5,
  zombieReached: -50,
} as const;

export const ZTYPES: Record<ZombieType, ZombieTypeDef> = {
  standard: { speed: 0.35, color: "#6ee7b7", emoji: "🧟", size: 20 },
  runner:   { speed: 0.65, color: "#fbbf24", emoji: "💀", size: 18 },
  armored:  { speed: 0.22, color: "#818cf8", emoji: "🛡️", size: 24 },
  vocab:    { speed: 0.30, color: "#f472b6", emoji: "📖", size: 20 },
  boss:     { speed: 0.16, color: "#ef4444", emoji: "👹", size: 30 },
};

// Power-ups drop from killed zombies (see useKeyboardInput.ts) and are
// collected by clicking their glowing icon on the canvas (see App.tsx collectPU).
export const PUPS: Record<PowerUpType, PowerUpDef> = {
  // Slows all zombies to 12% speed for 5 seconds — buys typing breathing room.
  freeze: { name: "Freeze", icon: "❄️", color: "#67e8f9" },
  // Absorbs the next zombie hit at the base for 8 seconds — one free save.
  shield: { name: "Shield", icon: "🛡️", color: "#a78bfa" },
  // Instantly restores +25 HP (capped at 100) — emergency healing.
  heal:   { name: "Heal",   icon: "💚", color: "#4ade80" },
  // Vaporizes the 3 nearest zombies and awards +40 score per kill — panic button.
  blast:  { name: "Blast",  icon: "💥", color: "#fb923c" },
};

export const CW = 860;
export const CH = 500;
export const CX = CW / 2;
export const CY = CH / 2;

export const DIFFICULTY_PRESETS: Record<DifficultyPreset, [number, number, number]> = {
  beginner:     [3800, 0.55, 4],
  intermediate: [2800, 0.80, 7],
  advanced:     [1900, 1.15, 11],
  adaptive:     [3200, 0.65, 5],
};
