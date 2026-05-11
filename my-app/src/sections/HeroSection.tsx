import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import MemoryGridCanvas from '../components/MemoryGridCanvas';
import LiquidGlass from '../components/LiquidGlass';
import ScrollIndicator from '../components/ScrollIndicator';

interface HeroSectionProps {
  visible: boolean;
}

export default function HeroSection({ visible }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!visible) return;

    const tl = gsap.timeline({ delay: 2.8 });

    if (eyebrowRef.current) {
      tl.from(eyebrowRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
      }, 0);
    }

    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll('.word');
      tl.from(words, {
        yPercent: 100,
        duration: 1.2,
        stagger: 0.08,
        ease: 'expo.out',
      }, 0.12);
    }

    if (subRef.current) {
      tl.from(subRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
      }, 0.24);
    }

    if (ctaRef.current) {
      tl.from(ctaRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
      }, 0.36);
    }
  }, { scope: sectionRef, dependencies: [visible] });

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100vh' }}
    >
      <MemoryGridCanvas fadeIn={visible} />

      <div className="relative z-10 flex items-center justify-center h-full px-10">
        <LiquidGlass className="max-w-[900px] w-full text-center rounded-3xl px-12 py-16">
          <span
            ref={eyebrowRef}
            className="font-mono text-sm tracking-[0.08em] uppercase text-warm-white-2/70 block mb-8 opacity-0"
          >
            Persistent Memory Architecture
          </span>

          <h1
            ref={headlineRef}
            className="font-display text-[clamp(48px,10vw,120px)] leading-[0.85] tracking-[-0.03em] text-white mb-6"
          >
            <span className="overflow-hidden inline-block">
              <span className="word inline-block">Memory-native</span>
            </span>{' '}
            <span className="overflow-hidden inline-block">
              <span className="word inline-block">AI</span>
            </span>{' '}
            <span className="overflow-hidden inline-block">
              <span className="word inline-block">systems.</span>
            </span>
          </h1>

          <p
            ref={subRef}
            className="text-xl leading-relaxed text-warm-white max-w-[640px] mx-auto opacity-0"
            style={{ letterSpacing: '-0.4px' }}
          >
            Mnemo transforms LLMs from stateless token predictors into persistent
            cognitive systems with hierarchical memory, belief formation, and
            procedural intelligence.
          </p>

          <div ref={ctaRef} className="flex items-center justify-center gap-4 mt-12 opacity-0">
            <a
              href="#architecture"
              className="font-mono text-sm bg-white text-black px-8 py-3.5 rounded-full hover:bg-white/90 transition-colors duration-300"
            >
              View Architecture
            </a>
            <a
              href="#research"
              className="font-mono text-sm border border-white/30 text-white px-8 py-3.5 rounded-full hover:border-white/60 transition-colors duration-300"
            >
              Research Paper
            </a>
          </div>
        </LiquidGlass>
      </div>

      <ScrollIndicator />
    </section>
  );
}
