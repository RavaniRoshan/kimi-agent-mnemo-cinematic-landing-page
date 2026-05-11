import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!overlayRef.current) return;

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          setVisible(false);
          onComplete();
        },
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
    >
      <span className="font-display text-5xl text-white">Mnemo</span>
    </div>
  );
}
