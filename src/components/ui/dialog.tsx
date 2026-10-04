"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * The single modal overlay: mobile menu, filter sheet and command palette.
 *
 * When to use: a temporary layer that must hold focus until it is dismissed.
 * When not to use: inline disclosure (use `<details>`), or a key that should stay
 * open beside the content (use the Legend popover).
 *
 * Keyboard: `showModal()` holds focus inside and Tab cycles; Escape requests a
 * close. There is deliberately no Escape veto: under the close-watcher rules a
 * `cancel` is not always cancelable, so a control that wants Escape for itself
 * cancels its own `keydown` before the close request starts.
 *
 * Behaviour: controlled by `open`. The native `<dialog>` is mounted only while
 * open, so `[role="dialog"]` exists exactly while the layer does. On close the
 * element plays EXIT if it is still open, then unmounts; if the browser already
 * closed it natively, EXIT is skipped. Focus returns to the element that was
 * focused at open, or to `#main` if that element is gone.
 *
 * Evidence: none. Content decides its own evidence obligations.
 */

export type DialogCloseReason = "escape" | "scrim";

const PANEL: Record<DialogProps["variant"], string> = {
  "panel-right":
    "m-0 ml-auto h-dvh max-h-dvh w-[min(20rem,100vw-3rem)] max-w-none border-y-0 border-r-0",
  "sheet-bottom":
    "m-0 mt-auto h-[92dvh] max-h-[92dvh] w-full max-w-none rounded-t-md border-x-0 border-b-0",
  "palette-top":
    "mx-auto mt-2 w-[calc(100vw-1rem)] max-w-none rounded-md sm:mt-[12vh] sm:w-[min(40rem,100vw-2rem)]",
};

interface DialogProps {
  open: boolean;
  onRequestClose: (reason: DialogCloseReason) => void;
  onExited?: () => void;
  variant: "panel-right" | "sheet-bottom" | "palette-top";
  labelledBy: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocus?: boolean;
  children: ReactNode;
}

export function Dialog({
  open,
  onRequestClose,
  onExited,
  variant,
  labelledBy,
  initialFocusRef,
  returnFocus = true,
  children,
}: DialogProps) {
  // `mounted` trails `open` by the exit wait, so EXIT can play before unmount.
  const [mounted, setMounted] = useState(open);
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const latest = useRef({ open, onRequestClose, onExited, returnFocus });

  useLayoutEffect(() => {
    latest.current = { open, onRequestClose, onExited, returnFocus };
  });

  if (open && !mounted) setMounted(true);

  // Open: store the opener, then showModal() before paint.
  useLayoutEffect(() => {
    if (!open || !mounted) return;
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    const active = document.activeElement;
    opener.current = active instanceof HTMLElement && active !== document.body ? active : null;
    try {
      dialog.showModal();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.warn("Dialog could not open", error);
      latest.current.onRequestClose("escape");
      return;
    }
    initialFocusRef?.current?.focus();
  }, [open, mounted, initialFocusRef]);

  // Close: play EXIT if the element is still open, then unmount.
  useEffect(() => {
    if (open || !mounted) return;
    const dialog = ref.current;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      dialog?.close();
      setMounted(false);
    };
    if (!dialog || !dialog.open) {
      finish();
      return;
    }
    // Only the panel's own transition ends EXIT: `transitionend` bubbles, and a
    // child control's colour transition must not unmount the layer early.
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target === dialog) finish();
    };
    dialog.setAttribute("data-closing", "");
    const duration = parseFloat(getComputedStyle(dialog).transitionDuration) || 0;
    const timer = window.setTimeout(finish, duration * 1000 + 50);
    dialog.addEventListener("transitionend", onTransitionEnd);
    return () => {
      window.clearTimeout(timer);
      dialog.removeEventListener("transitionend", onTransitionEnd);
      // A reopen during EXIT must not leave the exit styling on an open layer.
      dialog.removeAttribute("data-closing");
    };
  }, [open, mounted]);

  // After unmount: restore focus and report.
  const wasMounted = useRef(false);
  useEffect(() => {
    if (mounted) {
      wasMounted.current = true;
      return;
    }
    if (!wasMounted.current) return;
    wasMounted.current = false;
    if (latest.current.returnFocus) {
      const target = opener.current?.isConnected ? opener.current : document.getElementById("main");
      target?.focus();
    }
    opener.current = null;
    latest.current.onExited?.();
  }, [mounted]);

  // Native events, attached once and read through the ref.
  useEffect(() => {
    if (!mounted) return;
    const dialog = ref.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      if (event.cancelable) event.preventDefault();
      latest.current.onRequestClose("escape");
    };
    const onClose = () => {
      if (latest.current.open) latest.current.onRequestClose("escape");
    };
    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) latest.current.onRequestClose("scrim");
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("click", onClick);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("click", onClick);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <dialog
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      data-ef-modal=""
      data-variant={variant}
      data-palette={variant === "palette-top" ? "" : undefined}
      className={cn(
        "material-elevated overflow-hidden p-0 text-fg shadow-overlay backdrop:bg-(--scrim)",
        PANEL[variant],
      )}
    >
      {/* The panel fills the dialog so a click on the dialog element itself is
          always a click on the scrim, outside the panel's box. */}
      <div className="flex h-full max-h-[inherit] flex-col overflow-y-auto overscroll-contain">{children}</div>
    </dialog>
  );
}
