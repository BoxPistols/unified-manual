import { useState, useCallback, useRef, useEffect } from "react";

const STORAGE_KEY = "chat-panel-size";

interface PanelSize {
  width: number;
  height: number;
}

const DEFAULT_SIZE: PanelSize = { width: 384, height: 480 };
const MIN_SIZE: PanelSize = { width: 320, height: 360 };
const MAX_SIZE: PanelSize = { width: 640, height: 720 };

function loadSize(): PanelSize {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SIZE;
    const parsed = JSON.parse(raw);
    return {
      width: Math.max(MIN_SIZE.width, Math.min(MAX_SIZE.width, parsed.width)),
      height: Math.max(
        MIN_SIZE.height,
        Math.min(MAX_SIZE.height, parsed.height),
      ),
    };
  } catch {
    return DEFAULT_SIZE;
  }
}

function saveSize(size: PanelSize) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(size));
}

export function useChatResize() {
  const [size, setSize] = useState<PanelSize>(loadSize);
  const [isResizing, setIsResizing] = useState(false);
  const startRef = useRef<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      startRef.current = {
        x: clientX,
        y: clientY,
        w: size.width,
        h: size.height,
      };
      setIsResizing(true);
    },
    [size],
  );

  useEffect(() => {
    if (!isResizing) return;

    function onMove(e: MouseEvent | TouchEvent) {
      if (!startRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      // 右下固定 → 左上方向にドラッグで拡大
      const dx = startRef.current.x - clientX;
      const dy = startRef.current.y - clientY;

      const newWidth = Math.max(
        MIN_SIZE.width,
        Math.min(MAX_SIZE.width, startRef.current.w + dx),
      );
      const newHeight = Math.max(
        MIN_SIZE.height,
        Math.min(MAX_SIZE.height, startRef.current.h + dy),
      );

      setSize({ width: newWidth, height: newHeight });
    }

    function onEnd() {
      setIsResizing(false);
      setSize((s) => {
        saveSize(s);
        return s;
      });
      startRef.current = null;
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onEnd);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };
  }, [isResizing]);

  return { size, isResizing, handleResizeStart };
}
