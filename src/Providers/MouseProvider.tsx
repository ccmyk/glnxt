"use client";
import React, { useEffect, useRef } from "react";
import { useMouseStore } from "@/stores/useMouseStore";

export const MouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const set = useMouseStore((s) => s.set);
  const last = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const dx = x - last.current.x;
      const dy = y - last.current.y;
      last.current = { x, y };
      set({ x, y, dx, dy });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [set]);

  return <>{children}</>;
};
