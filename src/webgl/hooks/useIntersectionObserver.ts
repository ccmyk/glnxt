import { useRef, useState, useEffect } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  onIntersect?: (isIntersecting: boolean) => void;
}

export const useIntersectionObserver = (options: UseIntersectionObserverOptions = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const { onIntersect, ...observerOptions } = options;
    
    observerRef.current = new IntersectionObserver(([entry]) => {
      const intersecting = entry.isIntersecting;
      setIsIntersecting(intersecting);
      onIntersect?.(intersecting);
    }, observerOptions);

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observerRef.current.observe(currentTarget);
    }

    return () => {
      if (observerRef.current && currentTarget) {
        observerRef.current.unobserve(currentTarget);
      }
    };
  }, [options]);

  return [targetRef, isIntersecting] as const;
};

