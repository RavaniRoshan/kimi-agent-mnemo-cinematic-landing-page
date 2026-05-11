import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LiquidGlass from '../components/LiquidGlass';
import WordReveal from '../components/WordReveal';

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  '/images/helix-chaos-1.jpg',
  '/images/helix-order-1.jpg',
  '/images/helix-chaos-2.jpg',
  '/images/helix-order-2.jpg',
  '/images/helix-chaos-3.jpg',
  '/images/helix-order-3.jpg',
  '/images/helix-chaos-4.jpg',
  '/images/helix-order-4.jpg',
  '/images/helix-chaos-5.jpg',
  '/images/helix-order-5.jpg',
];

const ITEM_COUNT = 40;
const scrollSensitivity = 0.0005;

export default function HelixGallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const spiralRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!spiralRef.current) return;

    const spiral = spiralRef.current;
    const items = itemsRef.current.filter(Boolean);

    items.forEach((item, index) => {
      const angle = index * (360 / ITEM_COUNT);
      const radius = 300;

      item.style.setProperty('--angle', String(angle));
      item.style.setProperty('--radius', `${radius}px`);
      item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px) rotateY(${180 - angle}deg)`;
      item.style.transition = `transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.05}s`;
    });

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const sectionTop = sectionRef.current?.offsetTop || 0;
      const sectionHeight = sectionRef.current?.offsetHeight || 0;
      const sectionScroll = scrollPos - sectionTop;
      const progress = Math.max(0, Math.min(1, sectionScroll / (sectionHeight + window.innerHeight)));
      const targetRotation = progress * scrollSensitivity * 360 * 1000;

      if (spiral) {
        spiral.style.transform = `rotateY(${targetRotation}deg)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    if (!contentRef.current) return;

    gsap.from(contentRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ height: '100vh' }}
    >
      {/* 3D Helix Container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          perspective: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <div
          ref={spiralRef}
          style={{
            transformStyle: 'preserve-3d',
            width: '250px',
            height: '350px',
            position: 'relative',
          }}
        >
          {Array.from({ length: ITEM_COUNT }).map((_, index) => (
            <div
              key={index}
              ref={(el) => { if (el) itemsRef.current[index] = el; }}
              className="absolute inset-0 rounded-xl overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={IMAGES[index % IMAGES.length]}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content overlay */}
      <div
        ref={contentRef}
        className="relative z-10 flex items-center justify-center px-10"
      >
        <LiquidGlass className="max-w-[800px] w-full text-center rounded-3xl px-12 py-16">
          <span className="font-mono text-sm tracking-[0.08em] uppercase text-warm-white-2/70 block mb-8">
            The Thesis
          </span>

          <WordReveal
            tag="h2"
            className="font-display text-[clamp(40px,8vw,100px)] leading-[0.92] tracking-[-0.03em] text-white"
            scrollTrigger={false}
          >
            The future is persistent cognition.
          </WordReveal>

          <p
            className="text-xl leading-relaxed text-warm-white mt-6"
            style={{ letterSpacing: '-0.4px' }}
          >
            Larger context windows are a temporary patch. True intelligence
            requires systems that remember, reason, and improve — not models
            that replay transcripts.
          </p>

          <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
            <span className="font-mono text-xs text-dimmed border border-grey px-6 py-2.5 rounded-full">
              Traditional LLMs
            </span>
            <span className="text-blue text-lg">→</span>
            <span className="font-mono text-xs text-white bg-blue px-6 py-2.5 rounded-full">
              Mnemo
            </span>
          </div>
        </LiquidGlass>
      </div>
    </section>
  );
}
