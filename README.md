# LiquidColor

## General Information

**LiquidColor** is distributed under the terms of the **GNU LESSER GENERAL PUBLIC LICENSE**, version 3.0. The text of the license is included in the file [`LICENSE.TXT`][url_license] in the project root.

This is a single player game written in TypeScript and Vue.js. It takes advantage of HTML5 canvas.

The app combines a small Vue shell with game-domain logic in TypeScript classes.

## Current Architecture (TypeScript)

The current codebase applies several patterns:

- **State pattern** for game phases (`setup`, `inprogress`, `gameover`)
- **Command pattern** for move/reset execution and undo/redo
- **Strategy pattern** for AI behavior (`greedy`, `minimax`)
- **Observer pattern** for score/winner UI notifications
- **Repository pattern** for highscore persistence
- **Facade pattern** for UI DOM access
- **Dependency injection (lightweight)** for timer runtime, storage, and randomness

## Code Map

### Entry + Composition

- `src/liquidcolor.ts`
  : App entrypoint. Creates `Definitions`, players, board dependencies, wires observers, mounts Vue, and binds Reset/Undo/Redo actions.

- `src/boarddependencies.ts`
  : Central composition helper for default runtime dependencies (`BrowserTimerRuntime`, `LocalStorageHighscoreRepository`, `MathRandomSource`).

### Core Game Domain

- `src/board.ts`
  : Main orchestrator of gameplay and UI updates. Handles initialization, moves, game-state evaluation, snapshots/restore, and command invoker integration.

- `src/definitions.ts`
  : Board/game configuration (dimensions, cell size, winner threshold) with sanitization/clamping.

- `src/gamephase.ts`
  : State objects for phase-specific behavior (`canAcceptMove`, `isOver`).

- `src/grid.ts`
  : Grid creation/reset, player cell discovery, border analysis, and available-color counting.

- `src/cell.ts`
  : Cell state, drawing, neighborhood traversal logic, border detection, random color pick.

- `src/player.ts`
  : Player actions (init/move), flood-capture propagation, scoring updates, AI color decision delegation.

### Commands (Undo/Redo)

- `src/commands/commandinvoker.ts`
  : Executes commands and maintains undo/redo stacks.

- `src/commands/commandplaycolor.ts`
  : Color-move command with **delta-based** undo/redo payloads (changed cells + changed metadata) instead of full snapshots.

- `src/commands/commandresetgame.ts`
  : Reset command delegating to board re-initialization.

### AI Strategies

- `src/strategies/computerstrategyfactory.ts`
  : Strategy selection and delegation.

- `src/strategies/strategygreedy.ts`
  : Chooses best immediate gain.

- `src/strategies/strategyminimax.ts`
  : Two-ply style evaluation with deny/diversity weighting.

- `src/strategies/capturesimulator.ts`
  : Shared simulation utility used by both strategies.

### UI + Infrastructure

- `src/uifacade.ts`
  : Single facade for DOM queries/updates and UI element creation.

- `src/util.ts`
  : Thin utility wrappers delegating to UI facade.

- `src/timer.ts`
  : Game timer logic with injectable runtime (`now`, interval scheduler).

- `src/subject.ts`, `src/scoreobserver.ts`, `src/winnerobserver.ts`, `src/iobserver.ts`, `src/observerdata.ts`
  : Observer pipeline for UI notifications.

### Persistence

- `src/highscore.ts`
  : Highscore domain model and repository abstraction.

- `src/localstoragehighscorerepository.ts`
  : LocalStorage implementation of highscore persistence.

### Types / Supporting Files

- `src/types/*`
  : Shared domain and application type definitions (state snapshots, strategy input, observer payloads, and DI contracts).

- `src/highscorewinner.ts`, `src/offset.ts`, `src/randomsource.ts`
  : Compatibility re-export modules for key shared types.

## Architecture Diagram

![LiquidColor Architecture](doc/LiquidColor%20Architecture.png)

> Source: [`doc/LiquidColor Architecture.puml`](doc/LiquidColor%20Architecture.puml)

## Runtime Flow

1. App bootstraps in `src/liquidcolor.ts` and initializes board dependencies.
2. `board.init()` creates canvas/grid, buttons, player setup, timer, and highscore rendering.
3. A color button click executes `CommandPlayColor` through `CommandInvoker`.
4. Board validates move, applies human move, computes AI move through selected strategy, and evaluates win/draw conditions.
5. Undo/redo uses command deltas to restore only changed state efficiently.

## Undo/Redo

Undo and redo are supported for color-move commands.

- History is **unlimited** (no fixed max depth).
- Move commands store **delta payloads** (changed cells/metadata), not full-grid snapshots.

## Local Start

1. Install dependencies:

```bash
npm install
```

2. Build the browser bundle:

```bash
npm run build:dev
```

3. Open `index.html` directly in your browser (double-click or use your browser's "Open file" action).

The game does not require a local web server after the bundle has been built.

## Requirements

To run this game you need an internet browser supporting JavaScript and HTML5 canvas. Modern browsers are supported.

## Build, Lint, Test

```bash
npm run build:dev
npm run lint
npm run typecheck
npm test
```

## Test

You can test this game on [GitHub][url_github_liquidcolor].

## Supported Platforms

The game is developed on Google Chrome. If you get problems, please report the used browser. As fallback you can use Google Chrome.

## Motivation

Saw this game on [Android][url_android]. Thought by myself - looks easy. This is the try to implement this game.

### Credits

- Thanks to [Jonas][url_jonas] for the hints with JavaScript filters and to use HTML div for messages instead of alert.
- Thanks to [Sascha][url_sascha] for common hints about HTML and JavaScript.

[url_android]: https://play.google.com/store/apps/details?id=yio.filler&hl=de "yioFiller"
[url_license]: https://github.com/ThirtySomething/LiquidColor/blob/master/LICENSE.TXT "LGPL-3.0"
[url_sascha]: https://github.com/Foomy "Foomy"
[url_jonas]: https://github.com/DonatJR "DonatJR"
[url_github_liquidcolor]: https://thirtysomething.github.io/LiquidColor/ "LiquidColor@GitHub"
