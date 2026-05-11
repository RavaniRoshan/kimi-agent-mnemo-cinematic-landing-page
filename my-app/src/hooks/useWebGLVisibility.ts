import { useEffect, useRef } from 'react';

export function useWebGLVisibility(containerRef: React.RefObject<HTMLElement | null>) {
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  return isVisibleRef;
}
