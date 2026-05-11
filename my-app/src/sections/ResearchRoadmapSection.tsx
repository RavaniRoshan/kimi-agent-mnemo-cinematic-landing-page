import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';
import WordReveal from '../components/WordReveal';

gsap.registerPlugin(ScrollTrigger);

const ROADMAP_ITEMS = [
  {
    date: '2024 Q3',
    title: 'Cognitive Telemetry',
    description: 'Real-time observation and logging of agent reasoning chains. Understanding how models think before changing how they remember.',
  },
  {
    date: '2024 Q4',
    title: 'Episodic Graphs',
    description: 'Structured memory formation from raw interactions. Experiences compressed into queryable episode graphs with full provenance.',
  },
  {
    date: '2025 Q1',
    title: 'Belief Audit',
    description: 'Automated contradiction detection and belief repair. The immune system activates — corrupted abstractions are identified and quarantined.',
  },
  {
    date: '2025 Q2',
    title: 'Memory-Native Training',
    description: 'Post-training procedures that optimize for persistent memory. Models learn to store, retrieve, and update knowledge more efficiently.',
  },
  {
    date: '2025 Q3',
    title: 'Autonomous Agents',
    description: 'Full integration. Agents with working memory, episodic recall, semantic beliefs, procedural skills, and self-healing cognition.',
  },
];

export default function ResearchRoadmapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!lineRef.current) return;

    gsap.from(lineRef.current, {
      scaleY: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      transformOrigin: 'top center',
      scrollTrigger: {
        trigger: timelineRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });

    if (!timelineRef.current) return;
    const items = timelineRef.current.querySelectorAll('.roadmap-item');

    gsap.from(items, {
      x: -20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: timelineRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="research"
      className="relative bg-black py-40 px-10"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Research Statement */}
        <SectionLabel text="05 / RESEARCH" />

        <WordReveal
          tag="h2"
          className="text-[clamp(36px,5vw,60px)] leading-[1.07] tracking-[-0.03em] text-white mt-4"
        >
          An operating system for machine memory.
        </WordReveal>

        <p
          className="text-xl leading-relaxed text-dimmed max-w-[640px] mt-5"
          style={{ letterSpacing: '-0.4px' }}
        >
          We are building the cognitive infrastructure that will power the next
          generation of autonomous agents. Our research spans memory architectures,
          belief systems, and self-improving AI.
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-12">
          <a
            href="#"
            className="font-mono text-sm bg-blue text-white px-8 py-3.5 rounded-full hover:bg-blue/90 transition-colors duration-300"
          >
            Request Research Access
          </a>
          <a
            href="#"
            className="font-mono text-sm border border-white/30 text-white px-8 py-3.5 rounded-full hover:border-white/60 transition-colors duration-300"
          >
            Read Technical Thesis
          </a>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="mt-30 relative">
          {/* Timeline line */}
          <div
            ref={lineRef}
            className="absolute left-[5px] top-0 bottom-0 w-px bg-blue/30"
          />

          <div className="space-y-20">
            {ROADMAP_ITEMS.map((item) => (
              <div
                key={item.title}
                className="roadmap-item relative pl-12"
              >
                {/* Dot */}
                <div
                  className="absolute left-0 top-1 w-3 h-3 rounded-full bg-blue -translate-x-1/2"
                />

                <span className="font-mono text-sm text-blue block mb-2">
                  {item.date} — {item.title}
                </span>

                <p
                  className="text-base leading-6 text-dimmed max-w-[600px]"
                  style={{ letterSpacing: '-0.16px' }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
