import React, { useState, useEffect } from "react";

export interface UseIntroDoorOptions {
  previewMode?: boolean;
  initialTapText?: string;
  litTapText?: string;
  onOpen?: () => void;
  onReady?: () => void;
  onGone?: () => void;
}

export function useIntroDoor({
  previewMode = false,
  initialTapText = "",
  litTapText = "",
  onOpen,
  onReady,
  onGone,
}: UseIntroDoorOptions = {}) {
  const [isLit, setIsLit] = useState(previewMode);
  const [isOpen, setIsOpen] = useState(previewMode);
  const [isGone, setIsGone] = useState(previewMode);
  const [isReady, setIsReady] = useState(previewMode);
  const [tapText, setTapText] = useState(initialTapText);

  // Sync tap text when initial changes (e.g. language toggle)
  useEffect(() => {
    if (!isLit) {
      setTapText(initialTapText);
    }
  }, [initialTapText, isLit]);

  // Lock body scroll
  useEffect(() => {
    if (previewMode) return;
    if (!isGone) {
      document.body.classList.add("locked");
    } else {
      document.body.classList.remove("locked");
      document.body.classList.add("ready");
    }
    return () => {
      document.body.classList.remove("locked");
      document.body.classList.remove("ready");
    };
  }, [isGone, previewMode]);

  const handleOpenCard = () => {
    if (isLit) return;
    setIsLit(true);
    if (litTapText) setTapText(litTapText);

    setTimeout(() => {
      setIsOpen(true);
      onOpen?.();
    }, 1500);

    setTimeout(() => {
      setIsReady(true);
      onReady?.();
    }, 3000);

    setTimeout(() => {
      setIsGone(true);
      onGone?.();
    }, 4500);
  };

  return {
    isLit,
    isOpen,
    isGone,
    isReady,
    tapText,
    handleOpenCard,
    setIsLit,
    setIsOpen,
    setIsGone,
    setIsReady,
    setTapText,
  };
}

export interface IntroDoorProps {
  isLit: boolean;
  isOpen: boolean;
  isGone: boolean;
  previewMode?: boolean;
  onOpenCard: () => void;
  overlayClassName?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}

export function IntroDoor({
  isLit,
  isOpen,
  isGone,
  previewMode = false,
  onOpenCard,
  overlayClassName = "",
  ariaLabel = "Open invitation",
  children,
}: IntroDoorProps) {
  if (previewMode || isGone) return null;

  const classes = [
    overlayClassName,
    isLit ? "lit" : "",
    isOpen ? "open" : "",
    isGone ? "gone" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id="intro"
      className={classes}
      onClick={onOpenCard}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
    >
      <div className="door l" />
      <div className="door r" />
      <div className="seam" />
      <div className="glow" />
      <div className="cn">{children}</div>
    </div>
  );
}
