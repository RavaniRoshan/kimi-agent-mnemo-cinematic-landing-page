import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleFieldCanvas from '../components/ParticleFieldCanvas';
import SectionLabel from '../components/SectionLabel';
import WordReveal from '../components/WordReveal';

gsap.registerPlugin(ScrollTrigger);

const MEMORY_TYPES = [
  {
    title: 'Working Memory',
    description: 'Active reasoning scratchpad for the current task. Holds temporary context, intermediate calculations, and focus of attention.',
    accent: '#C8FF1F',
    image: '/images/architecture-working-memory.jpg',
  },
  {
    title: 'Episodic Memory',
    description: 'Structured record of experiences, conversations, and outcomes. Formed as compressed episodes with timestamps, participants, and results.',
    accent: '#9747FF',
    image: '/images/architecture-episodic-memory.jpg',
  },
  {
    title: 'Semantic Memory',
    description: 'Compressed knowledge distilled from episodes. Beliefs, facts, and learned abstractions stored as a queryable belief graph.',
    accent: '#24D4D4',
    image: '/images/architecture-semantic-memory.jpg',
  },
  {
    title: 'Procedural Memory',
    description: 'Learned skills and workflows. Successful patterns are proceduralized into reusable competencies that improve over time.',
    accent: '#FF1F1F',
    image: '/images/architecture-procedural-memory.jpg',
  },
  {
    title: 'Belief Immune System',
    description: 'Continuous audit of all memory layers. Detects contradictions, quarantines corrupted beliefs, and repairs poisoned abstractions.',
    accent: '#FF9F1F',
    image: '/images/architecture-belief-immune.jpg',
  },
];

const CARD_POSITIONS = [
  { x: -360, y: 10, rotate: -4 },
  { x: -180, y: 5, rotate: -2 },
  { x: 0, y: 0, rotate: 0 },
  { x: 180, y: 5, rotate: 2 },
  { x: 360, y: 10, rotate: 4 },
];

export default function ArchitectureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardsContainerRef.current) return;

    const cards = cardsContainerRef.current.querySelectorAll('.arch-card');
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: cardsContainerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    } else {
      gsap.set(cards, {
        x: 0,
        y: 50,
        rotation: 0,
        scale: 0.8,
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'top 20%',
          scrub: 1,
        },
      });

      cards.forEach((card, i) => {
        const pos = CARD_POSITIONS[i];
        tl.to(card, {
          x: pos.x,
          y: pos.y,
          rotation: pos.rotate,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'expo.out',
        }, i * 0.15);
      });
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="architecture"
      className="relative min-h-screen overflow-hidden"
    >
      <ParticleFieldCanvas />

      <div className="relative z-10 py-40 px-10">
        <div className="max-w-[1400px] mx-auto">
          <SectionLabel text="02 / ARCHITECTURE" />

          <WordReveal
            tag="h2"
            className="text-[clamp(36px,5vw,60px)] leading-[1.07] tracking-[-0.03em] text-white mt-4 max-w-[800px]"
          >
            A hierarchy of persistent memory.
          </WordReveal>

          <p
            className="text-xl leading-relaxed text-dimmed max-w-[600px] mt-5"
            style={{ letterSpacing: '-0.4px' }}
          >
            Five interconnected systems that transform language models into agents
            with persistent cognition.
          </p>
        </div>

        <div
          ref={cardsContainerRef}
          className="relative mt-20 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-0 min-h-[500px] max-w-[1400px] mx-auto"
        >
          {MEMORY_TYPES.map((memory, i) => (
            <div
              key={memory.title}
              className="arch-card w-full max-w-[320px] lg:w-[320px] lg:absolute lg:left-1/2 lg:-translate-x-1/2 rounded-2xl overflow-hidden border border-white/[0.06] transition-all duration-400 hover:scale-105 hover:rotation-0 hover:z-10 group"
              style={{
                background: 'rgba(20,20,20,0.85)',
                backdropFilter: 'blur(12px)',
                zIndex: i + 1,
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={memory.image}
                  alt={memory.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${memory.accent}, transparent 70%)`,
                  }}
                />
              </div>
              <div className="p-8">
                <div
                  className="w-2 h-2 rounded-full mb-4"
                  style={{ backgroundColor: memory.accent }}
                />
                <h3 className="text-2xl font-normal leading-7 tracking-[-0.04em] text-white mb-3">
                  {memory.title}
                </h3>
                <p className="text-base leading-5 text-dimmed" style={{ letterSpacing: '-0.16px' }}>
                  {memory.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
