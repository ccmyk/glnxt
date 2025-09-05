import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export const useGSAPTimeline = (config?: gsap.TimelineVars) => {
  const timelineRef = useRef<gsap.core.Timeline>();

  useEffect(() => {
    timelineRef.current = gsap.timeline({ paused: true, ...config });

    return () => {
      timelineRef.current?.kill();
    };
  }, [config]);

  return timelineRef.current;
};

