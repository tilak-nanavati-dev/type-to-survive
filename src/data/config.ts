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

export const PUPS: Record<PowerUpType, PowerUpDef> = {
  freeze: { name: "Freeze", icon: "❄️", color: "#67e8f9" },
  shield: { name: "Shield", icon: "🛡️", color: "#a78bfa" },
  heal:   { name: "Heal",   icon: "💚", color: "#4ade80" },
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
