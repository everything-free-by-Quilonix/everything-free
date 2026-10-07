"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ResourceCard } from "@/features/resources/components/resource-card";
import type { Resource } from "@/types/resource";

/**
 * Animated Resource Grid (FilterGrid foundation).
 *
 * Implements smooth layout reflow and card reorganization:
 * - Cards smoothly reposition when categories change
 * - Graceful fade without flashing or full-page reloads
 * - Zero decorative scale or tilt
 * - Respects prefers-reduced-motion
 */
export function AnimatedResourceGrid({
  resources,
  reasonsBySlug,
  label,
  renderCompare,
}: {
  resources: Resource[];
  reasonsBySlug?: Record<string, string[]>;
  label?: string;
  renderCompare?: (resource: Resource) => ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <ul
      aria-label={label}
      className="grid list-none grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {resources.map((resource) => (
          <motion.li
            key={resource.slug}
            layout={!shouldReduceMotion}
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 4 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.18, ease: [0.2, 0, 0, 1] }
            }
            className="flex"
          >
            <ResourceCard
              resource={resource}
              matchReasons={reasonsBySlug?.[resource.slug]}
              compareSlot={renderCompare?.(resource)}
              className="w-full"
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
