'use client';

import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// CRITICAL: These classnames must be preserved exactly for GSAP animations
export const TEXT_CLASSNAMES = {
  // DOM-based text animation classes (from anims.js)
  ATEXT: 'Atext',
  ALINE: 'Aline', 
  AWRITE: 'Awrite',
  AWRITE_INV: 'Awrite-inv',
  
  // WebGL text animation classes (from gl🌊🌊🌊 system)
  ATITLE: 'Atitle',
  CCOVER: 'cCover',
  OI: 'Oi',
  OI_ALT: 'OiAlt',
  
  // Character-level classes (used by both systems)
  CHAR: 'char',
  CHAR_NORMAL: 'n',
  CHAR_FILL: 'f', 
  CHAR_BACKGROUND: 'b',
  INVISIBLE_OVERLAY: 'iO',
  
  // Animation state classes
  STVIEW: 'stview',
  IVI: 'ivi',
  INVVIEW: 'inview',
  OKF: 'okF',
  MW: 'MW',
  NONO: 'nono'
};

// Base interface for all text animation components
interface BaseTextProps {
  text: string;
  className?: string;
  children?: ReactNode;
  onAnimationComplete?: () => void;
}

// DOM-based Text Animation Component (maps to anims.js)
export const AnimatedText: React.FC<BaseTextProps & {
  type?: 'Atext' | 'Aline' | 'Awrite' | 'Awrite-inv';
  animation?: 'fadeIn' | 'slideUp' | 'typewriter' | 'scramble';
  stagger?: number;
}> = ({ 
  text, 
  className = '', 
  type = 'Atext',
  animation = 'fadeIn',
  stagger = 0.05,
  onAnimationComplete 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isInView } = useIntersectionObserver(containerRef, { threshold: 0.1 });

  useGSAP(() => {
    if (!isInView || !containerRef.current) return;

    const container = containerRef.current;
    
    // Create SplitText instance (replaces Split-Type)
    const split = new SplitText(container, {
      type: 'chars,words,lines',
      charsClass: TEXT_CLASSNAMES.CHAR,
      wordsClass: 'word',
      linesClass: 'line'
    });

    // Create character structure (maintains original CSS structure)
    split.chars.forEach(char => {
      const originalText = char.textContent;
      
      // Create the character structure: <span class="char"><span class="n">text</span><span class="f">text</span><span class="b">text</span></span>
      char.innerHTML = `
        <span class="${TEXT_CLASSNAMES.CHAR_NORMAL}">${originalText}</span>
        <span class="${TEXT_CLASSNAMES.CHAR_FILL}">${originalText}</span>
        <span class="${TEXT_CLASSNAMES.CHAR_BACKGROUND}">${originalText}</span>
      `;
    });

    // Animation logic based on type and animation prop
    const tl = gsap.timeline({ onComplete: onAnimationComplete });

    switch (animation) {
      case 'fadeIn':
        tl.set(`.${TEXT_CLASSNAMES.CHAR}`, { opacity: 0 })
          .to(`.${TEXT_CLASSNAMES.CHAR}`, {
            opacity: 1,
            duration: 0.8,
            stagger,
            ease: 'power4.out'
          });
        break;

      case 'slideUp':
        tl.set(`.${TEXT_CLASSNAMES.CHAR}`, { opacity: 0, y: 50 })
          .to(`.${TEXT_CLASSNAMES.CHAR}`, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger,
            ease: 'power4.out'
          });
        break;

      case 'typewriter':
        tl.set(`.${TEXT_CLASSNAMES.CHAR}`, { opacity: 0 })
          .to(`.${TEXT_CLASSNAMES.CHAR}`, {
            opacity: 1,
            duration: 0.1,
            stagger: 0.05,
            ease: 'none'
          });
        break;

      case 'scramble':
        // Scramble effect with fake characters
        const fakes = "##·$%&/=€|()@+09*+]}{[";
        const times = [0.3, 0.05, 0.16, 0.05, 0.016];
        
        split.chars.forEach((char, i) => {
          const n = char.querySelector(`.${TEXT_CLASSNAMES.CHAR_NORMAL}`);
          const f = char.querySelectorAll(`.${TEXT_CLASSNAMES.CHAR_FILL}`);
          
          // Add fake characters for scramble effect
          for (let j = 0; j < 2; j++) {
            const fakeChar = fakes[Math.floor(Math.random() * fakes.length)];
            char.insertAdjacentHTML('afterbegin', `<span class="f" aria-hidden="true">${fakeChar}</span>`);
          }
          
          tl.set(char, { opacity: 1 }, 0)
            .to(n, { opacity: 1, duration: times[0], ease: 'power4.inOut' }, i * times[1])
            .fromTo(f, 
              { scaleX: 1, opacity: 1, display: 'block' },
              { scaleX: 0, opacity: 0, duration: times[2], ease: 'power4.inOut', stagger: { each: times[3] } },
              i * times[4]
            );
        });
        break;
    }

    // Add stview class when animation starts (maintains original behavior)
    container.classList.add(TEXT_CLASSNAMES.STVIEW);

  }, { scope: containerRef, dependencies: [isInView, text, type, animation] });

  return (
    <div 
      ref={containerRef}
      className={`${type} ${className}`}
    >
      {text}
    </div>
  );
};

// WebGL Text Animation Component (maps to gl🌊🌊🌊 system)
export const WebGLText: React.FC<BaseTextProps & {
  shaderType?: 'tt' | 'tta' | 'ttf'; // Maps to els.js data-temp values
  interactive?: boolean;
}> = ({ 
  text, 
  className = '', 
  shaderType = 'tt',
  interactive = true,
  onAnimationComplete 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isInView } = useIntersectionObserver(containerRef, { threshold: 0.1 });

  useGSAP(() => {
    if (!isInView || !containerRef.current) return;

    const container = containerRef.current;
    
    // Create SplitText instance for character positioning
    const split = new SplitText(container, {
      type: 'chars',
      charsClass: TEXT_CLASSNAMES.CHAR
    });

    // Add stview class for animation state
    container.classList.add(TEXT_CLASSNAMES.STVIEW);

    // Animation logic (maps to base.js + position.js)
    const tl = gsap.timeline({ onComplete: onAnimationComplete });
    
    // Initial state
    tl.set(`.${TEXT_CLASSNAMES.CHAR}`, { opacity: 0 })
      .to(`.${TEXT_CLASSNAMES.CHAR}`, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power4.out'
      });

  }, { scope: containerRef, dependencies: [isInView, text, shaderType] });

  return (
    <div 
      ref={containerRef}
      className={`${TEXT_CLASSNAMES.ATITLE} ${className}`}
      data-temp={shaderType}
    >
      <div className={TEXT_CLASSNAMES.CCOVER}>
        <div className={TEXT_CLASSNAMES.OI}>
          {text.split('').map((char, i) => (
            <span key={i} className={TEXT_CLASSNAMES.CHAR}>
              <span className={TEXT_CLASSNAMES.CHAR_NORMAL}>{char}</span>
              <span className={TEXT_CLASSNAMES.CHAR_FILL}>{char}</span>
              <span className={TEXT_CLASSNAMES.CHAR_BACKGROUND}>{char}</span>
            </span>
          ))}
        </div>
      </div>
      
      {/* WebGL canvas will be rendered by GLProvider */}
      <div className={TEXT_CLASSNAMES.INVISIBLE_OVERLAY} />
    </div>
  );
};

// Utility component for common text patterns
export const TextLine: React.FC<BaseTextProps & {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}> = ({ text, className = '', tag: Tag = 'p', ...props }) => (
  <Tag className={`${TEXT_CLASSNAMES.ALINE} ${className}`} {...props}>
    {text}
  </Tag>
);

export const TextBlock: React.FC<BaseTextProps & {
  tag?: 'div' | 'section' | 'article';
}> = ({ text, className = '', tag: Tag = 'div', ...props }) => (
  <Tag className={`${TEXT_CLASSNAMES.ATEXT} ${className}`} {...props}>
    {text}
  </Tag>
);

