import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';
import WordReveal from '../components/WordReveal';
import { MemoryStick, GitBranch, ShieldAlert, RefreshCw, TrendingDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PROBLEMS = [
  {
    title: 'Context Explosion',
    description: 'Every interaction requires feeding the entire conversation history. Context windows grow until they exceed the model\'s capacity.',
    icon: MemoryStick,
    accent: 'card-accent-blue',
  },
  {
    title: 'Reasoning Drift',
    description: 'Without persistent beliefs, models contradict themselves across sessions. Each response is an island with no connection to prior conclusions.',
    icon: GitBranch,
    accent: 'card-accent-purple',
  },
  {
    title: 'Belief Corruption',
    description: 'Incorrect outputs from one session poison future reasoning. There is no immune system to detect and quarantine false beliefs.',
    icon: ShieldAlert,
    accent: 'card-accent-teal',
  },
  {
    title: 'No Procedural Learning',
    description: 'Models never learn how to do things better. Each task is solved from scratch, even if the same problem has been solved a thousand times before.',
    icon: RefreshCw,
    accent: 'card-accent-orange',
  },
  {
    title: 'No Memory Evolution',
    description: 'Important insights are forgotten. Useful patterns are never reinforced. The system has no mechanism to strengthen what works.',
    icon: TrendingDown,
    accent: 'card-accent-lime',
  },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!subRef.current) return;

    gsap.from(subRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: subRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll('.problem-card');

    gsap.from(cards, {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: cardsRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative bg-black py-40 px-10"
    >
      <div className="max-w-[1400px] mx-auto">
        <SectionLabel text="01 / THE PROBLEM" />

        <WordReveal
          tag="h2"
          className="text-[clamp(36px,5vw,60px)] leading-[1.07] tracking-[-0.03em] text-white mt-4"
        >
          Stateless systems cannot think.
        </WordReveal>

        <p
          ref={subRef}
          className="text-xl leading-relaxed text-dimmed max-w-[640px] mt-5"
          style={{ letterSpacing: '-0.4px' }}
        >
          Current LLMs replay entire transcripts for every task. They have no
          persistent self, no evolving memory, no ability to learn from experience.
        </p>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-16"
        >
          {PROBLEMS.map((problem, i) => {
            const Icon = problem.icon;
            return (
              <div
                key={problem.title}
                className={`problem-card bg-dark-grey rounded-2xl p-10 min-h-[280px] transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(59,59,255,0.08)] ${problem.accent} ${
                  i >= 3 ? 'lg:col-span-1 md:last:col-span-2 lg:last:col-span-1' : ''
                }`}
              >
                <Icon className="w-8 h-8 text-white/60 mb-6" strokeWidth={1.5} />
                <h3 className="text-[32px] font-medium leading-9 tracking-[-0.04em] text-white mb-4">
                  {problem.title}
                </h3>
                <p className="text-base leading-5 text-dimmed" style={{ letterSpacing: '-0.16px' }}>
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
