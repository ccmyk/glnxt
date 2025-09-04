"use client";
import React, { useRef } from "react";
import { useSplitText } from "@/hooks/useSplitText";

export type SplitTextProps = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: string;
  /** Matches your prior data-attributes semantics; pass through if useful for CSS hooks */
  dataAttributes?: Record<string, string>;
  /** Animation options roughly aligning with prior anims.js intent */
  animate?: {
    delay?: number;
    stagger?: number;
    duration?: number;
    ease?: string;
    loop?: boolean;
  };
};

export const SplitText: React.FC<SplitTextProps> = ({
  as: Tag = "span",
  className,
  children,
  dataAttributes,
  animate,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  useSplitText(ref, { text: children, animate });

  const passThrough = Object.fromEntries(
    Object.entries(dataAttributes || {}).map(([k, v]) => [`data-${k}`, v])
  );

  // We render an empty element; the hook fills it with the split nodes and animates.
  return <Tag ref={ref as any} className={className} {...passThrough} />;
};

export default SplitText;
