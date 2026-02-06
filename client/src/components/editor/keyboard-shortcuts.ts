import { useEffect } from "react";

interface KeyboardShortcutOptions {
  onUndo: () => void;
  onRedo: () => void;
  onEscape: () => void;
}

export function useEditorKeyboardShortcuts({ onUndo, onRedo, onEscape }: KeyboardShortcutOptions) {
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        onUndo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        onRedo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        onRedo();
      }
      if (e.key === "Escape") {
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [onUndo, onRedo, onEscape]);
}
