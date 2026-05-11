import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

interface WordRevealProps {
  children: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  stagger?: number;
  duration?: number;
  delay?: number;
  scrollTrigger?: boolean;
  start?: string;
}

export default function WordReveal({
  children,
  className = '',
  tag: Tag = 'h2',
  stagger = 0.06,
  duration = 0.8,
  delay = 0,
  scrollTrigger = true,
  start = 'top 80%',
}: WordRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const split = new SplitType(containerRef.current, { types: 'words' });

    if (!split.words || split.words.length === 0) return;

    const wordElements = split.words;

    gsap.set(wordElements, {
      yPercent: 100,
      display: 'inline-block',
    });

    const animConfig: gsap.TweenVars = {
      yPercent: 0,
      duration,
      stagger,
      delay,
      ease: 'expo.out',
    };

    if (scrollTrigger) {
      animConfig.scrollTrigger = {
        trigger: containerRef.current,
        start,
        toggleActions: 'play none none none',
      };
    }

    gsap.to(wordElements, animConfig);

    return () => {
      split.revert();
    };
  }, { scope: containerRef });

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
      className={className}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </Tag>
  );
}
