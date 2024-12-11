# Auto-Battler Roguelike

A proof-of-concept browser game that combines elements of Super Auto Pets' auto-battling mechanics with Slay the Spire's roguelike progression. Built with React and focused on clean UI-based gameplay rather than complex graphics.

## Overview

This project explores creating an accessible browser game where players build a team of units and navigate through a branching map of encounters. Combat is fully automated, with strategy coming from team composition and resource management rather than direct control.

## Key Features

### Combat System

- Automated battle system where units fight based on position
- Real-time deterministic combat visualization with health bars
- Detailed battle log showing all actions
- Boss encounters with enhanced enemy units

### Team Building

- Multiple unit types with different stats
- Team size management and positioning
- Unit upgrading and dismissal mechanics
- Shop system for recruiting new units

### Adventure Map

- Node-based progression system
- Multiple node types:
  - Combat encounters
  - Merchant shops
  - Treasure rooms
  - Random events
  - Boss battles
- Branching paths with multiple possible routes
- Visual node connections and availability tracking

### Economy

- Gold management system
- Risk/reward decisions in events
- Unit purchasing and selling
- Treasure rewards

## Technical Implementation

### Core Technologies

- React for UI components
- Framer Motion for animations
- Tailwind CSS for styling
- shadcn/ui for component library

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

## Future Enhancements

- Additional unit types and abilities
- More varied event types
- Equipment system
- Meta-progression between runs
- Daily challenges
- Run history tracking
- Advanced team synergies
