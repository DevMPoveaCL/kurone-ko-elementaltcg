# Elemental Queens — Sumerian Edition

Elemental Queens is a Sumerian-inspired tactical TCG concept preview about four primordial Queens, elemental devotion, and a chess-like battlefield where deck destruction is the central pressure.

Production URL: [https://kurone-ko-elementaltcg.pages.dev/](https://kurone-ko-elementaltcg.pages.dev/)

Author: `DevMPoveaCL`

![Elemental Queens battlefield interface with card zones and player lanes](public/assets/landing/battlefield/battlefield/variants/image-1600w.webp)

## Live Production Preview

Open the current production preview here:

[https://kurone-ko-elementaltcg.pages.dev/](https://kurone-ko-elementaltcg.pages.dev/)

The preview presents the project concept, the elemental Queens, the card-type vocabulary, and the tactical board language in one guided landing experience.

## What This Project Is

This repository is a portfolio/concept preview for **Elemental Queens — Sumerian Edition**.

It documents the visual direction, lore premise, card categories, battlefield structure, and production build for a tactical trading-card videogame concept. The README intentionally stays high level: it explains what the visitor is seeing first, then gives local setup and quality commands for reviewers.

## The Game Idea

Four elemental Queens judge humanity through a ritual game: **Nammu** of Water, **Utu** of Fire, **An** of Air, and **Ki** of Earth.

Each player binds their strategy to a Queen and one of the four elements. Two Queens stand on one side of the verdict and two on the other, creating a mythic conflict where elemental allegiance shapes the deck, the board, and the final pressure.

The win condition is based on deck destruction. Combat is one against one; when one side loses a clash, the weaker side falls and its controller loses cards from the deck equal to the wound.

## How the Cards Work

**Allies** are the mortal and legendary figures that occupy the battlefield. Pawns form the front line, while Bishops and Knights represent stronger Sumerian figures that can be summoned through sacrifice.

**Rooks** are sacred structures: towers, temples, gates, archives, and ziggurats where divine law touches the field.

**Energy** is the ritual fuel. It pays card costs, awakens Queen gifts, and marks the threshold between mortal command and divine manifestation.

**Talismans** are hidden strategies and sealed ritual answers. They bend the rules at key moments rather than simply occupying a board space.

**Queens** are the elemental sovereigns. At seven energy, a Queen may enter the field, bless allied cards, and demand sacrifice in return.

## Battlefield and Strategy

The battlefield is a chess-inspired grid where two Queens face each other across twelve deployment zones per side.

Six Pawn lanes form the front line. Two Rooks hold the corners, two Knights guard the flanks, and two Bishops command the center. The Queen watches from the heart of the formation until the energy threshold opens the gate.

Turns are structured around visible phases: `DP`, `M`, `BP`, `SW`, `M2`, and `EP`. Position matters as much as card choice because the board defines where each role can apply pressure.

## Visual Language

The project uses a Sumerian reliquary aesthetic: dark ceremonial surfaces, gold ornament, cuneiform-inspired framing, elemental symbols, and goddess-centered card renders.

The README uses one wide battlefield image because it remains readable in GitHub. Full card renders exist in the project assets, but this document does not use tiny card thumbnails to explain card text; card details are better inspected in the live preview where the layout can provide enough space.

## Tech Stack

- **Astro** for the static site application shell.
- **TypeScript** for typed content and implementation safety.
- **Tailwind CSS** for styling.
- **Playwright** for end-to-end checks.
- **Cloudflare Pages** as the production preview target.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Quality Checks

Run the type and Astro checks:

```bash
npm run typecheck
```

Run the end-to-end test suite:

```bash
npm run test:e2e
```

Run the card-frame QA contract:

```bash
npm run qa:frame
```

## Deployment

Deployment target: Cloudflare Pages from the `main` branch.

Build command:

```bash
npm run build
```

Build output directory:

```text
dist
```

## Project Status

**Phase I: Sumerian Edition** is the current concept scope. It defines the first reliquary: allies, rooks, energy cards, talismans, and the four elemental Queens.

**Phase II: Story Mode**, **Phase III: Duelist**, and **Phase IV+: Future Eras** are planned concept directions documented by the landing content. They are presented as roadmap ideas, not as product commitments.

## License

© DevMPoveaCL. All rights reserved. This project is shared as a portfolio/concept preview and is not licensed for reuse, redistribution, or commercial use without permission.
