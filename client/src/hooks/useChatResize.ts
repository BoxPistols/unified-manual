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

type ResizeDirection = "top" | "left" | "top-left";

export function useChatResize() {
  const [size, setSize] = useState<PanelSize>(loadSize);
  const cleanupRef = useRef<(() => void) | null>(null);

  // アンマウント時にリスナーをクリーンアップ
  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  const handleResizeStart = useCallback(
    (direction: ResizeDirection) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      cleanupRef.current?.();

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = size.width;
      const startH = size.height;

      const onMove = (ev: MouseEvent) => {
        // 右下固定 → 左上方向にドラッグで拡大
        const dx = startX - ev.clientX;
        const dy = startY - ev.clientY;

        setSize({
          width: direction.includes("left")
            ? Math.max(MIN_SIZE.width, Math.min(MAX_SIZE.width, startW + dx))
            : startW,
          height: direction.includes("top")
            ? Math.max(MIN_SIZE.height, Math.min(MAX_SIZE.height, startH + dy))
            : startH,
        });
      };

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        cleanupRef.current = null;
        // リサイズ確定時に保存
        setSize((s) => {
          saveSize(s);
          return s;
        });
      };

      cleanupRef.current = onUp;
      document.body.style.cursor =
        direction === "top-left"
          ? "nw-resize"
          : direction === "top"
            ? "n-resize"
            : "ew-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [size],
  );

  return { size, handleResizeStart };
}
