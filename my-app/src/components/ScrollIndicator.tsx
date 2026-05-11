import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollIndicator() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      opacity: 0,
      scrollTrigger: {
        trigger: document.body,
        start: '200px top',
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
      <div className="relative w-px h-10 bg-white/30 overflow-hidden">
        <div
          className="absolute w-1.5 h-1.5 rounded-full bg-white left-1/2 -translate-x-1/2"
          style={{
            animation: 'scroll-dot 2s ease-in-out infinite',
          }}
        />
      </div>
      <span className="font-mono text-xs text-white/30">Scroll</span>
    </div>
  );
}
