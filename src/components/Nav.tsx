"use client";
import React from "react";
import type { Nav } from "@/content/schema";
import { SplitText } from "@/components/SplitText";

type Props = { data: Nav };

export const NavBar: React.FC<Props> = ({ data }) => {
  // We render only the fields you provided (logo + right ops)
  const top = data.elements.find((e: any) => e.class === "top_nav");
  const left = top?.children?.find((c: any) => c.class === "nav_left");
  const right = top?.children?.find((c: any) => c.class === "nav_right");
  const logo = left?.children?.[0];
  const ops = right?.nav_right_ops || [];

  return (
    <nav className="top_nav">
      <div className="nav_left">
        {logo?.tag === "a" ? (
          <a className={logo.class} aria-label="Home">
            <SplitText as="span" className="Awrite" animate={{ stagger: 0.02, duration: 0.6 }}>
              {logo.nav_logo}
            </SplitText>
          </a>
        ) : null}
      </div>
      <div className="nav_right">
        {ops.map((op: any) => {
          return (
            <a
              key={op.label}
              className={op.class}
              href={op.url}
              aria-label={op.aria_label || op.label}
            >
              <SplitText as="span" className="Awrite" animate={{ stagger: 0.02, duration: 0.55 }}>
                {op.label}
      </div>
    </nav>
  );
};

export default NavBar;
