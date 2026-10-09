"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";

type Difficulty = "beginner" | "intermediate";

interface DifficultyConfig {
  rows: number;
  cols: number;
  mines: number;
}

const CONFIGS: Record<Difficulty, DifficultyConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 14, cols: 14, mines: 30 },
};

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

type Grid = Cell[][];

function createBlankGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r,
      c,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    })),
  );
}

function populateMines(grid: Grid, rows: number, cols: number, mines: number, safeR: number, safeC: number): Grid {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  let placed = 0;

  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    // Keep safe cell and its immediate neighbors mine-free on first click
    const isAdjacentToSafe = Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1;
    if (!newGrid[r][c].isMine && !isAdjacentToSafe) {
      newGrid[r][c].isMine = true;
      placed++;
    }
  }

  // Calculate neighbor counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newGrid[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isMine) {
            count++;
          }
        }
      }
      newGrid[r][c].neighborMines = count;
    }
  }

  return newGrid;
}

export function GameMinesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const { rows, cols, mines } = CONFIGS[difficulty];

  const [grid, setGrid] = useState<Grid>(() => createBlankGrid(rows, cols));
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [timer, setTimer] = useState(0);
  const [flagMode, setFlagMode] = useState(false); // Mobile friendly flag toggle

  const flagsPlaced = grid.reduce(
    (acc, row) => acc + row.reduce((rAcc, cell) => rAcc + (cell.isFlagged ? 1 : 0), 0),
    0,
  );

  const resetGame = useCallback(() => {
    setGrid(createBlankGrid(rows, cols));
    setIsFirstClick(true);
    setGameState("idle");
    setTimer(0);
  }, [rows, cols]);

  const changeDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    const cfg = CONFIGS[diff];
    setGrid(createBlankGrid(cfg.rows, cfg.cols));
    setIsFirstClick(true);
    setGameState("idle");
    setTimer(0);
  };

  // Timer loop
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Flood fill reveal
  const revealCell = useCallback(
    (r: number, c: number) => {
      if (gameState === "won" || gameState === "lost") return;

      setGrid((prevGrid) => {
        let currentGrid = prevGrid;

        if (isFirstClick) {
          currentGrid = populateMines(prevGrid, rows, cols, mines, r, c);
          setIsFirstClick(false);
          setGameState("playing");
        }

        const cell = currentGrid[r][c];
        if (cell.isRevealed || cell.isFlagged) return currentGrid;

        const nextGrid = currentGrid.map((row) => row.map((cl) => ({ ...cl })));

        if (cell.isMine) {
          // Reveal all mines on loss
          nextGrid.forEach((row) =>
            row.forEach((cl) => {
              if (cl.isMine) cl.isRevealed = true;
            }),
          );
          setGameState("lost");
          return nextGrid;
        }

        // BFS flood fill
        const queue: [number, number][] = [[r, c]];
        nextGrid[r][c].isRevealed = true;

        while (queue.length > 0) {
          const [curR, curC] = queue.shift()!;
          const curCell = nextGrid[curR][curC];

          if (curCell.neighborMines === 0) {
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const nr = curR + dr;
                const nc = curC + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                  const neighbor = nextGrid[nr][nc];
                  if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
                    neighbor.isRevealed = true;
                    if (neighbor.neighborMines === 0) {
                      queue.push([nr, nc]);
                    }
                  }
                }
              }
            }
          }
        }

        // Check win condition: all non-mine cells revealed
        let nonMinesUnrevealed = 0;
        nextGrid.forEach((row) =>
          row.forEach((cl) => {
            if (!cl.isMine && !cl.isRevealed) {
              nonMinesUnrevealed++;
            }
          }),
        );

        if (nonMinesUnrevealed === 0) {
          setGameState("won");
        }

        return nextGrid;
      });
    },
    [gameState, isFirstClick, rows, cols, mines],
  );

  const toggleFlag = useCallback(
    (e: React.MouseEvent, r: number, c: number) => {
      e.preventDefault();
      if (gameState === "won" || gameState === "lost") return;

      setGrid((prevGrid) => {
        const cell = prevGrid[r][c];
        if (cell.isRevealed) return prevGrid;

        return prevGrid.map((row, ri) =>
          row.map((cl, ci) => {
            if (ri === r && ci === c) {
              return { ...cl, isFlagged: !cl.isFlagged };
            }
            return cl;
          }),
        );
      });
    },
    [gameState],
  );

  const handleCellClick = (e: React.MouseEvent, r: number, c: number) => {
    if (flagMode) {
      toggleFlag(e, r, c);
    } else {
      revealCell(r, c);
    }
  };

  const getNumberColor = (count: number) => {
    switch (count) {
      case 1:
        return "text-blue-500 font-bold";
      case 2:
        return "text-green-600 font-bold";
      case 3:
        return "text-red-500 font-bold";
      case 4:
        return "text-purple-600 font-bold";
      case 5:
        return "text-amber-600 font-bold";
      case 6:
        return "text-teal-600 font-bold";
      default:
        return "text-neutral-500 font-bold";
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Settings & Info Header */}
      <div className="flex w-full max-w-[460px] flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-bg-subtle p-3 text-xs">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={difficulty === "beginner" ? "secondary" : "ghost"}
            className="h-7 px-2 text-xs"
            onClick={() => changeDifficulty("beginner")}
          >
            9x9
          </Button>
          <Button
            size="sm"
            variant={difficulty === "intermediate" ? "secondary" : "ghost"}
            className="h-7 px-2 text-xs"
            onClick={() => changeDifficulty("intermediate")}
          >
            14x14
          </Button>
        </div>

        <div className="flex items-center gap-4 font-mono text-sm font-semibold text-fg">
          <div>
            <span className="text-xs font-normal text-fg-muted">Mines: </span>
            {Math.max(0, mines - flagsPlaced)}
          </div>
          <div>
            <span className="text-xs font-normal text-fg-muted">Time: </span>
            {timer}s
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant={flagMode ? "primary" : "secondary"}
            className="h-7 px-2 text-xs sm:hidden"
            onClick={() => setFlagMode((f) => !f)}
          >
            <Icon name="flag" size={12} />
            {flagMode ? "Flag mode" : "Dig mode"}
          </Button>
          <Button size="sm" variant="secondary" className="h-7 px-2 text-xs" onClick={resetGame}>
            <Icon name="refresh-cw" size={12} />
            Reset
          </Button>
        </div>
      </div>

      {/* Status banner on win/lose */}
      {gameState === "lost" && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-500">
          Mine detonated. Tap Reset to try again.
        </div>
      )}
      {gameState === "won" && (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-500">
          Victory! All safe territory cleared in {timer} seconds.
        </div>
      )}

      {/* Minesweeper Grid */}
      <div className="overflow-auto rounded-md border-2 border-border-strong bg-bg p-2 shadow-sm">
        <div
          className="grid gap-1 select-none"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={(e) => handleCellClick(e, r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  className={`flex h-8 w-8 items-center justify-center rounded-xs text-xs font-bold transition-colors ${
                    cell.isRevealed
                      ? cell.isMine
                        ? "bg-red-500/20 text-red-500"
                        : "bg-surface-raised border border-border"
                      : "bg-surface hover:bg-surface-hover border border-border-strong active:bg-neutral-300 dark:active:bg-neutral-800"
                  }`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      <Icon name="close" size={14} />
                    ) : cell.neighborMines > 0 ? (
                      <span className={getNumberColor(cell.neighborMines)}>
                        {cell.neighborMines}
                      </span>
                    ) : null
                  ) : cell.isFlagged ? (
                    <Icon name="flag" size={12} />
                  ) : null}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <p className="text-[11px] text-fg-muted">
        Tip: Left-click to dig, right-click to plant a flag. On mobile, use the Flag mode button.
      </p>
    </div>
  );
}
