"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
// We don't ship SplitText plugin; if present, we use it. Types are provided via d.ts shim.
let SplitText: any = null;
try {
  // @ts-ignore - plugin path resolution is handled by user's setup (Club GSAP or trial)
  const maybe = (gsap as any).SplitText || null;
  SplitText = maybe;
} catch {}

type Options = {
  text: string;
  animate?: {
    delay?: number;
    stagger?: number;
    duration?: number;
    ease?: string;
    loop?: boolean;
  };
};

function fallbackSplit(el: HTMLElement, text: string) {
  // Builds the same structure your CSS expects (.char .n/.f/.b + .iO sentinel)
  el.innerHTML = "";
  const io = document.createElement("i");
  io.className = "iO";
  el.appendChild(io);

  for (const ch of text) {
    const wrap = document.createElement("span");
    wrap.className = "char";
    const n = document.createElement("span");
    n.className = "n";
    n.textContent = ch;
    const f = document.createElement("span");
    f.className = "f";
    f.textContent = ch;
    const b = document.createElement("span");
    b.className = "b";
    wrap.appendChild(n);
    wrap.appendChild(f);
    wrap.appendChild(b);
    el.appendChild(wrap);
  }
  return Array.from(el.querySelectorAll<HTMLElement>(".char .n"));
}

export function useSplitText(ref: React.MutableRefObject<HTMLElement | null>, opts: Options) {
  useEffect(() => {
    const target = ref.current as HTMLElement | null;
    if (!target) return;

    const text = opts.text ?? target.textContent ?? "";
    let chars: HTMLElement[] = [];
    let revert: null | (() => void) = null;

    if (SplitText) {
      // If the plugin exists in the user's setup, use it.
      // @ts-ignore
      const split = new SplitText(target, { type: "chars", charsClass: "char" });
      // Some setups produce .chars; ensure we use elements directly
      chars = (split.chars || Array.from(target.querySelectorAll(".char"))) as HTMLElement[];
      revert = () => {
        try {
          split.revert();
        } catch {}
      };
    } else {
      // Fallback to local structure (keeps your CSS working)
      chars = fallbackSplit(target, text);
      revert = () => {
        target.textContent = text;
      };
    }

    // Baseline animation — mirrors typical Awrite/Atext intent (opacity / slight y)
    const tl = gsap.timeline({ defaults: { ease: opts.animate?.ease || "power2.out" } });
    tl.set(chars, { opacity: 0, yPercent: 20, rotateZ: 0.001 });
    tl.to(chars, {
      opacity: 1,
      yPercent: 0,
      duration: opts.animate?.duration ?? 0.6,
      stagger: opts.animate?.stagger ?? 0.015,
      delay: opts.animate?.delay ?? 0,
    });

    if (opts.animate?.loop) {
      tl.to(chars, {
        opacity: 0,
        yPercent: -10,
        duration: 0.4,
        stagger: -(opts.animate?.stagger ?? 0.015),
      });
      tl.repeat(-1).yoyo(true);
    }

    return () => {
      tl.kill();
      revert && revert();
    };
  }, [ref, opts.text, opts.animate?.delay, opts.animate?.stagger, opts.animate?.duration, opts.animate?.ease, opts.animate?.loop]);
}
