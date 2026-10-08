"use client";

import { useId, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/icons";
import type { AIImageCommand } from "@/types/ai-image-command";
import { CommandDetailView } from "./CommandDetailView";

interface CommandModalProps {
  command: AIImageCommand | null;
  onClose: () => void;
}

export function CommandModal({ command, onClose }: CommandModalProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  if (!command) return null;

  return (
    <Dialog
      open={Boolean(command)}
      onRequestClose={() => onClose()}
      variant="palette-top"
      labelledBy={titleId}
      initialFocusRef={closeButtonRef}
    >
      <div className="relative max-h-[85vh] overflow-y-auto p-5 sm:p-6 bg-surface text-fg rounded-md border border-border shadow-raised">
        {/* Close Button */}
        <div className="sticky top-0 right-0 z-20 flex justify-end pb-2">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close command details"
            className="inline-flex size-8 items-center justify-center rounded-sm border border-border bg-surface-raised text-fg-muted hover:text-fg hover:bg-surface-hover pointer-coarse:size-10 transition-colors"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Content */}
        <div id={titleId}>
          <CommandDetailView command={command} isModal={true} />
        </div>
      </div>
    </Dialog>
  );
}
