"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

const INITIAL_DIR: Direction = "UP";

function getRandomFood(snake: Point[]): Point {
  while (true) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (!snake.some((segment) => segment.x === x && segment.y === y)) {
      return { x, y };
    }
  }
}

export function GameSnake() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 10, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dirRef = useRef<Direction>(INITIAL_DIR);

  const speedMs = speed === "slow" ? 140 : speed === "normal" ? 100 : 70;

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    dirRef.current = INITIAL_DIR;
    setFood({ x: 10, y: 5 });
    setIsGameOver(false);
    setScore(0);
    setIsRunning(true);
  }, []);

  const changeDirection = useCallback((newDir: Direction) => {
    const current = dirRef.current;
    if (newDir === "UP" && current !== "DOWN") {
      dirRef.current = "UP";
    }
    if (newDir === "DOWN" && current !== "UP") {
      dirRef.current = "DOWN";
    }
    if (newDir === "LEFT" && current !== "RIGHT") {
      dirRef.current = "LEFT";
    }
    if (newDir === "RIGHT" && current !== "LEFT") {
      dirRef.current = "RIGHT";
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "KeyW", "KeyS", "KeyA", "KeyD"].includes(
          e.code,
        )
      ) {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
          e.preventDefault();
        }

        if (e.code === "Space") {
          setIsRunning((prev) => !prev);
          return;
        }

        if (e.code === "ArrowUp" || e.code === "KeyW") changeDirection("UP");
        if (e.code === "ArrowDown" || e.code === "KeyS") changeDirection("DOWN");
        if (e.code === "ArrowLeft" || e.code === "KeyA") changeDirection("LEFT");
        if (e.code === "ArrowRight" || e.code === "KeyD") changeDirection("RIGHT");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeDirection]);

  // Main game tick loop
  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const dir = dirRef.current;

        const newHead: Point = {
          x: dir === "LEFT" ? head.x - 1 : dir === "RIGHT" ? head.x + 1 : head.x,
          y: dir === "UP" ? head.y - 1 : dir === "DOWN" ? head.y + 1 : head.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          setIsRunning(false);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          setIsRunning(false);
          return prevSnake;
        }

        // Check if food eaten
        const ateFood = newHead.x === food.x && newHead.y === food.y;
        const newSnake = [newHead, ...prevSnake];

        if (ateFood) {
          setScore((s) => {
            const next = s + 10;
            setHighScore((h) => Math.max(h, next));
            return next;
          });
          setFood(getRandomFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speedMs);

    return () => clearInterval(interval);
  }, [isRunning, isGameOver, food, speedMs]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear board
    ctx.fillStyle = "#161616";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw subtle grid lines
    ctx.strokeStyle = "#242424";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    // Draw snake
    snake.forEach((segment, idx) => {
      ctx.fillStyle = idx === 0 ? "#22c55e" : "#16a34a";
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2,
      );
    });
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score & Controls Bar */}
      <div className="flex w-full max-w-[420px] items-center justify-between rounded-md border border-border bg-bg-subtle p-3 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-fg-muted">Score: </span>
            <span className="font-mono text-sm font-bold text-fg">{score}</span>
          </div>
          <div>
            <span className="text-fg-muted">Best: </span>
            <span className="font-mono text-sm font-bold text-fg">{highScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={speed === "slow" ? "secondary" : "ghost"}
            className="h-6 px-1.5 text-[11px]"
            onClick={() => setSpeed("slow")}
          >
            Slow
          </Button>
          <Button
            size="sm"
            variant={speed === "normal" ? "secondary" : "ghost"}
            className="h-6 px-1.5 text-[11px]"
            onClick={() => setSpeed("normal")}
          >
            Normal
          </Button>
          <Button
            size="sm"
            variant={speed === "fast" ? "secondary" : "ghost"}
            className="h-6 px-1.5 text-[11px]"
            onClick={() => setSpeed("fast")}
          >
            Fast
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative overflow-hidden rounded-md border-2 border-border-strong bg-[#161616] shadow-md">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block max-w-full"
        />

        {(!isRunning || isGameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-6 text-center text-white backdrop-none">
            {isGameOver ? (
              <>
                <p className="text-lg font-bold text-red-400">Game Over</p>
                <p className="mt-1 text-xs text-neutral-300">Final Score: {score}</p>
                <Button size="sm" variant="primary" className="mt-4" onClick={resetGame}>
                  <Icon name="refresh-cw" size={14} />
                  Play Again
                </Button>
              </>
            ) : (
              <>
                <p className="text-base font-semibold">Classic Retro Snake</p>
                <p className="mt-1 text-xs text-neutral-400">Use arrow keys or WASD to navigate</p>
                <Button
                  size="sm"
                  variant="primary"
                  className="mt-4"
                  onClick={() => {
                    setIsRunning(true);
                  }}
                >
                  <Icon name="play-circle" size={14} />
                  Start Game
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsRunning((r) => !r)}
          disabled={isGameOver}
        >
          {isRunning ? "Pause" : "Resume"}
        </Button>
        <Button size="sm" variant="secondary" onClick={resetGame}>
          <Icon name="refresh-cw" size={14} />
          Reset
        </Button>
      </div>

      {/* Directional Navigation D-Pad for Mouse Clicks & Touch */}
      <div className="flex flex-col items-center gap-1">
        <Button
          size="sm"
          variant="secondary"
          className="h-10 w-12"
          onClick={() => changeDirection("UP")}
        >
          <Icon name="chevron-up" size={16} />
        </Button>
        <div className="flex gap-4">
          <Button
            size="sm"
            variant="secondary"
            className="h-10 w-12"
            onClick={() => changeDirection("LEFT")}
          >
            <Icon name="arrow-left" size={16} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-10 w-12"
            onClick={() => changeDirection("RIGHT")}
          >
            <Icon name="arrow-right" size={16} />
          </Button>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="h-10 w-12"
          onClick={() => changeDirection("DOWN")}
        >
          <Icon name="chevron-down" size={16} />
        </Button>
      </div>
    </div>
  );
}
