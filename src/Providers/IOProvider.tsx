"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useIOStore } from "@/stores/useIOStore";

type IOContextValue = {
  observer: IntersectionObserver | null;
};

const IOContext = createContext<IOContextValue>({ observer: null });

export function IOProvider({ children }: { children: React.ReactNode }) {
  const setInView = useIOStore((s) => s.setInView);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.ioid;
          if (id) setInView(id, entry.isIntersecting);
        }
      },
      { threshold: 0.1 }
    );
    observerRef.current = obs;
    return () => {
      obs.disconnect();
      observerRef.current = null;
    };
  }, [setInView]);

  const value = useMemo(
    () => ({ observer: observerRef.current }),
    [observerRef.current]
  );

  return <IOContext.Provider value={value}>{children}</IOContext.Provider>;
}

/**
 * Hook: attach a node to the global IntersectionObserver.
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   useIO("hero-tt-1", ref);
 */
export function useIO(id: string, ref: React.RefObject<HTMLElement>) {
  const { observer } = useContext(IOContext);

  useEffect(() => {
    const el = ref.current;
    if (!el || !observer) return;
    el.dataset.ioid = id;
    observer.observe(el);
    return () => {
      observer.unobserve(el);
      // do not delete dataset: keeps id stable across mounts if needed
    };
  }, [id, ref, observer]);
}
