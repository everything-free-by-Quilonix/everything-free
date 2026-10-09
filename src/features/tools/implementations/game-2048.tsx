"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";

const GRID_SIZE = 4;

type Board = number[][];

interface GameState {
  board: Board;
  score: number;
}

function createEmptyBoard(): Board {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function getRandomEmptyCell(board: Board): [number, number] | null {
  const emptyCells: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c] === 0) {
        emptyCells.push([r, c]);
      }
    }
  }
  if (emptyCells.length === 0) return null;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function spawnRandomTile(board: Board): Board {
  const cell = getRandomEmptyCell(board);
  if (!cell) return board;
  const [r, c] = cell;
  const newBoard = board.map((row) => [...row]);
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

function initGame(): Board {
  let b = createEmptyBoard();
  b = spawnRandomTile(b);
  b = spawnRandomTile(b);
  return b;
}

function slideRowLeft(row: number[]): { newRow: number[]; scoreGained: number } {
  const filtered = row.filter((val) => val !== 0);
  const result: number[] = [];
  let scoreGained = 0;

  for (let i = 0; i < filtered.length; i++) {
    if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2;
      result.push(merged);
      scoreGained += merged;
      i++;
    } else {
      result.push(filtered[i]);
    }
  }

  while (result.length < GRID_SIZE) {
    result.push(0);
  }

  return { newRow: result, scoreGained };
}

function rotateBoard(board: Board): Board {
  const rotated = createEmptyBoard();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      rotated[c][GRID_SIZE - 1 - r] = board[r][c];
    }
  }
  return rotated;
}

function moveLeft(board: Board): { newBoard: Board; scoreGained: number; changed: boolean } {
  let scoreGained = 0;
  let changed = false;
  const newBoard: Board = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    const { newRow, scoreGained: rowScore } = slideRowLeft(board[r]);
    scoreGained += rowScore;
    if (newRow.some((val, idx) => val !== board[r][idx])) {
      changed = true;
    }
    newBoard.push(newRow);
  }

  return { newBoard, scoreGained, changed };
}

function moveRight(board: Board): { newBoard: Board; scoreGained: number; changed: boolean } {
  const reversed = board.map((row) => [...row].reverse());
  const { newBoard: slid, scoreGained, changed } = moveLeft(reversed);
  return { newBoard: slid.map((row) => row.reverse()), scoreGained, changed };
}

function moveUp(board: Board): { newBoard: Board; scoreGained: number; changed: boolean } {
  let b = rotateBoard(rotateBoard(rotateBoard(board)));
  const { newBoard: slid, scoreGained, changed } = moveLeft(b);
  b = rotateBoard(slid);
  return { newBoard: b, scoreGained, changed };
}

function moveDown(board: Board): { newBoard: Board; scoreGained: number; changed: boolean } {
  let b = rotateBoard(board);
  const { newBoard: slid, scoreGained, changed } = moveLeft(b);
  b = rotateBoard(rotateBoard(rotateBoard(slid)));
  return { newBoard: b, scoreGained, changed };
}

function hasMovesLeft(board: Board): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c] === 0) return true;
      if (r < GRID_SIZE - 1 && board[r][c] === board[r + 1][c]) return true;
      if (c < GRID_SIZE - 1 && board[r][c] === board[r][c + 1]) return true;
    }
  }
  return false;
}

function getTileColor(value: number): { bg: string; text: string; border: string } {
  switch (value) {
    case 2:
      return { bg: "bg-surface-raised", text: "text-fg", border: "border-border" };
    case 4:
      return { bg: "bg-surface-hover", text: "text-fg", border: "border-border-strong" };
    case 8:
      return { bg: "bg-amber-600/20", text: "text-amber-700 dark:text-amber-300", border: "border-amber-500/40" };
    case 16:
      return { bg: "bg-orange-600/25", text: "text-orange-700 dark:text-orange-300", border: "border-orange-500/50" };
    case 32:
      return { bg: "bg-rose-600/30", text: "text-rose-700 dark:text-rose-300", border: "border-rose-500/50" };
    case 64:
      return { bg: "bg-red-600/35", text: "text-red-700 dark:text-red-300", border: "border-red-500/60" };
    case 128:
      return { bg: "bg-yellow-500/30", text: "text-yellow-800 dark:text-yellow-200", border: "border-yellow-500/60" };
    case 256:
      return { bg: "bg-yellow-500/40", text: "text-yellow-900 dark:text-yellow-100", border: "border-yellow-400/70" };
    case 512:
      return { bg: "bg-emerald-600/35", text: "text-emerald-800 dark:text-emerald-200", border: "border-emerald-500/70" };
    case 1024:
      return { bg: "bg-cyan-600/40", text: "text-cyan-800 dark:text-cyan-100", border: "border-cyan-400/80" };
    case 2048:
      return { bg: "bg-primary/30", text: "text-primary-fg font-extrabold", border: "border-primary" };
    default:
      return value > 2048
        ? { bg: "bg-purple-600/40", text: "text-purple-800 dark:text-purple-100", border: "border-purple-400" }
        : { bg: "bg-surface", text: "text-fg-muted", border: "border-border" };
  }
}

export function Game2048() {
  const [board, setBoard] = useState<Board>(() => initGame());
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [history, setHistory] = useState<GameState | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [dismissWin, setDismissWin] = useState<boolean>(false);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleMove = useCallback(
    (direction: "left" | "right" | "up" | "down") => {
      if (gameOver) return;

      let moveFn;
      switch (direction) {
        case "left":
          moveFn = moveLeft;
          break;
        case "right":
          moveFn = moveRight;
          break;
        case "up":
          moveFn = moveUp;
          break;
        case "down":
          moveFn = moveDown;
          break;
      }

      const { newBoard, scoreGained, changed } = moveFn(board);

      if (!changed) return;

      // Save state for undo
      setHistory({ board, score });

      const spawnedBoard = spawnRandomTile(newBoard);
      const nextScore = score + scoreGained;

      setBoard(spawnedBoard);
      setScore(nextScore);
      setBestScore((prev) => Math.max(prev, nextScore));

      // Check win condition
      if (!hasWon && !dismissWin) {
        const reached2048 = spawnedBoard.some((row) => row.some((val) => val === 2048));
        if (reached2048) {
          setHasWon(true);
        }
      }

      // Check game over
      if (!hasMovesLeft(spawnedBoard)) {
        setGameOver(true);
      }
    },
    [board, score, gameOver, hasWon, dismissWin],
  );

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
        // Prevent default scrolling when playing inside the board container
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          handleMove("left");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          handleMove("right");
          break;
        case "ArrowUp":
        case "w":
        case "W":
          handleMove("up");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          handleMove("down");
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleMove]);

  // Touch gestures
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const start = touchStartRef.current;
    const end = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 30) {
      if (absX > absY) {
        handleMove(dx > 0 ? "right" : "left");
      } else {
        handleMove(dy > 0 ? "down" : "up");
      }
    }
    touchStartRef.current = null;
  };

  const resetGame = () => {
    setBoard(initGame());
    setScore(0);
    setHistory(null);
    setGameOver(false);
    setHasWon(false);
    setDismissWin(false);
  };

  const undoMove = () => {
    if (!history) return;
    setBoard(history.board);
    setScore(history.score);
    setHistory(null);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      {/* Score and Controls Header */}
      <div className="flex w-full max-w-sm items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-border bg-bg-subtle px-3 py-1.5 text-center">
            <div className="text-[10px] font-semibold tracking-wider text-fg-muted uppercase">Score</div>
            <div className="font-display text-lg font-bold tabular-nums text-fg">{score}</div>
          </div>
          <div className="rounded-lg border border-border bg-bg-subtle px-3 py-1.5 text-center">
            <div className="text-[10px] font-semibold tracking-wider text-fg-muted uppercase">Best</div>
            <div className="font-display text-lg font-bold tabular-nums text-fg">{bestScore}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={undoMove} disabled={!history || gameOver}>
            Undo
          </Button>
          <Button variant="primary" size="sm" onClick={resetGame}>
            New Game
          </Button>
        </div>
      </div>

      {/* Main 4x4 Game Grid Container */}
      <div
        className="relative touch-none select-none rounded-2xl border-2 border-border-strong bg-bg-subtle p-3 shadow-xs sm:p-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        tabIndex={0}
        role="region"
        aria-label="2048 game board. Use arrow keys to slide tiles."
      >
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {board.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const { bg, text, border } = getTileColor(val);
              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`flex h-16 w-16 items-center justify-center rounded-xl border text-xl font-bold transition-transform duration-100 sm:h-20 sm:w-20 sm:text-2xl ${bg} ${text} ${border}`}
                >
                  {val !== 0 ? val : ""}
                </div>
              );
            }),
          )}
        </div>

        {/* Win Overlay Banner */}
        {hasWon && !dismissWin && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-bg/95 p-4 text-center">
            <h3 className="font-display text-2xl font-bold text-fg">You Reached 2048!</h3>
            <p className="mt-1 text-xs text-fg-muted">Congratulations! Keep sliding for a higher score.</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => setDismissWin(true)}>
                Keep Playing
              </Button>
              <Button size="sm" variant="secondary" onClick={resetGame}>
                Restart
              </Button>
            </div>
          </div>
        )}

        {/* Game Over Overlay Banner */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-bg/95 p-4 text-center">
            <h3 className="font-display text-2xl font-bold text-fg">Game Over</h3>
            <p className="mt-1 text-xs text-fg-muted">No valid moves remaining. Final score: {score}</p>
            <div className="mt-4">
              <Button size="sm" onClick={resetGame}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Directional Navigation Buttons for Mouse Clicks, Touch and Accessibility */}
      <div className="flex flex-col items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          className="h-9 w-12"
          onClick={() => handleMove("up")}
          aria-label="Slide Up"
        >
          <Icon name="chevron-up" size={16} />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-9 w-12"
            onClick={() => handleMove("left")}
            aria-label="Slide Left"
          >
            <Icon name="arrow-left" size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-9 w-12"
            onClick={() => handleMove("down")}
            aria-label="Slide Down"
          >
            <Icon name="chevron-down" size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-9 w-12"
            onClick={() => handleMove("right")}
            aria-label="Slide Right"
          >
            <Icon name="arrow-right" size={16} />
          </Button>
        </div>
      </div>

      {/* Instructions footer */}
      <div className="max-w-md text-center text-xs leading-relaxed text-fg-muted">
        <p>
          Use arrow keys or swipe to merge matching tiles. Runs 100% in your browser with zero tracking and zero ads.
        </p>
      </div>
    </div>
  );
}
