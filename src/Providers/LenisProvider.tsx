"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { useAnimationStore } from "@/stores/useAnimationStore";

type LenisContextType = { lenis: Lenis | null };
const LenisContext = createContext<LenisContextType>({ lenis: null });

export const useLenis = () => useContext(LenisContext);

export const LenisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<Lenis | null>(null);
  const setScroll = useAnimationStore((s) => s.setScroll);

  useEffect(() => {
    // See: https://github.com/darkroomengineering/lenis#settings
    const lenis = new Lenis({
      // defaults are good; keep it explicit where useful
      smoothWheel: true,
      gestureOrientation: "vertical",
      // If you want touch to behave like inertial smooth scroll on iOS:
      // syncTouch: true,
    });
    ref.current = lenis;

    let raf: number;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    const onScroll = (e: any) => {
      setScroll({
        y: e.scroll,
        progress: e.progress,
        velocity: e.velocity,
      });
    };
    lenis.on("scroll", onScroll);

    return () => {
      lenis.off("scroll", onScroll);
      cancelAnimationFrame(raf);
      lenis.destroy();
      ref.current = null;
    };
  }, [setScroll]);

  return <LenisContext.Provider value={{ lenis: ref.current }}>{children}</LenisContext.Provider>;
};
