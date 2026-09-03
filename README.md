# Type to Survive 🧟

> **Free typing/vocab game for classes 5–9. No accounts, no data collected. Best on a keyboard.**

A zombie-horde survival typing game built with React 18, Vite, and Recharts.
Type the word above each zombie to eliminate it before it reaches your base.

---

## 🚀 Try it

Then open http://localhost:3000 in your browser.

```bash
npm install
npm run dev
```

## 🎮 How to Play

- **Type** a letter to target the nearest zombie starting with that letter
- **Keep typing** to complete the word and destroy the zombie
- **Backspace** to correct a mistake
- **Escape** to cancel the current target
- **Click** glowing power-up drops on the battlefield to collect them

## ✨ Features

- 5 zombie types: Standard, Runner, Armored, Vocab, Boss
- 159+ vocabulary words across 8 categories with definitions and examples
- 4 difficulty modes including **Adaptive** (adjusts to your WPM)
- Power-ups: **Freeze** (slows horde), **Shield** (blocks one hit), **Heal** (+25 HP), **Blast** (kills nearest 3)
- Wave system with escalating difficulty and boss fights every 5th wave
- Live dashboard: WPM trend, accuracy trend, combat log
- Full analytics screen: radar chart, bar chart, line chart, per-category breakdown
- Vocabulary review screen — every word you've completed, with meanings
- Persistent high score (local browser only)
- Auto-pause on tab switch

## 🎯 Who this is for

Students in **classes 5 to 9** (ages ~10 to 15). It's a **free learning tool** —
no accounts, no ads, no data collection, no cookies. Everything stays on your
device. Teachers and parents are welcome to share the link freely.

## 🔒 Privacy

We collect **nothing**. There are no accounts, no cookies, no analytics, and no
external servers. Your progress (best wave + best score only) is stored in your
own browser's localStorage — you can clear it any time from the menu.

## 🛠 Tech Stack

- React 18 · TypeScript · Vite 5
- Recharts (dashboards)
- HTML5 Canvas (gameplay rendering)

## 📁 Project Structure

```
type-to-survive/
  index.html            - Entry HTML file (meta tags, favicon)
  vite.config.js        - Vite configuration
  src/
    main.tsx            - React root mount + error boundary
    App.tsx             - Root component (screen routing, game state)
    ErrorBoundary.tsx   - Catches crashes so the screen never goes white
    data/               - vocabulary, zombie/power-up config
    hooks/              - keyboard input, game loop, visibility, stats
    screens/            - menu, playing, paused, wave-end, game-over, stats, vocab
    utils/              - helpers, localStorage persistence
    styles/             - shared inline-style presets
    types/              - shared TypeScript types
```

## 📄 License

MIT — free to fork, remix, and share.
