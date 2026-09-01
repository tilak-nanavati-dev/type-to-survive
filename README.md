# Type to Survive 🧟

A zombie-horde survival typing game built with React 18, Vite, and Recharts.

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

## How to Play

- **Type** a letter to target the nearest zombie starting with that letter
- **Keep typing** to complete the word and destroy the zombie
- **Backspace** to correct a mistake
- **Escape** to cancel current target
- **Click** glowing power-up drops on the battlefield to collect them

## Features

- 5 zombie types: Standard, Runner, Armored, Vocab, Boss
- 65+ vocabulary words across 8 categories with definitions
- 4 difficulty modes including Adaptive (adjusts to your WPM)
- Power-ups: Freeze, Shield, Heal, Blast
- Wave system with escalating difficulty
- Boss fights every 5th wave
- Live Recharts dashboard (WPM trend, accuracy trend)
- Full analytics screen with radar chart, bar chart, line chart
- Vocabulary review screen
- Auto-pause on tab switch

## Tech Stack

- React 18
- Vite 5
- Recharts
- HTML5 Canvas (for gameplay rendering)

## Project Structure

```
type-to-survive/
  index.html          - Entry HTML file
  package.json        - Dependencies and scripts
  vite.config.js      - Vite configuration
  src/
    main.jsx          - React root mount
    App.jsx           - Main game component (fully commented)
```
