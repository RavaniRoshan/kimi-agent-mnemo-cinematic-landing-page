import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';
import WordReveal from '../components/WordReveal';
import { Eye, FileStack, Brain, Target, Wrench, Cog } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { label: 'Observe', color: '#3B3BFF', icon: Eye },
  { label: 'Form Episode', color: '#9747FF', icon: FileStack },
  { label: 'Generate Beliefs', color: '#24D4D4', icon: Brain },
  { label: 'Validate Outcomes', color: '#C8FF1F', icon: Target },
  { label: 'Repair Contradictions', color: '#FF9F1F', icon: Wrench },
  { label: 'Proceduralize', color: '#FF1F1F', icon: Cog },
];

export default function CognitiveLoopSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);
  const connectorsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!nodesRef.current) return;

    const nodes = nodesRef.current.querySelectorAll('.loop-node');
    const connectors = connectorsRef.current?.querySelectorAll('.connector-line');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });

    tl.from(nodes, {
      scale: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'back.out(1.7)',
    });

    if (connectors) {
      tl.from(connectors, {
        scaleX: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        transformOrigin: 'left center',
      }, 0.4);
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="cognitive-loop"
      className="relative py-40 px-10"
      style={{ background: 'linear-gradient(180deg, #000000 0%, #0a0a1a 100%)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        <SectionLabel text="03 / COGNITIVE LOOP" />

        <WordReveal
          tag="h2"
          className="text-[clamp(36px,5vw,60px)] leading-[1.07] tracking-[-0.03em] text-white mt-4"
        >
          Observe. Believe. Learn.
        </WordReveal>

        <p
          className="text-xl leading-relaxed text-dimmed mt-5"
          style={{ letterSpacing: '-0.4px' }}
        >
          Every interaction strengthens the system's understanding of the world.
        </p>

        <div className="mt-20 relative">
          {/* Desktop: horizontal layout */}
          <div className="hidden lg:block">
            {/* Connectors */}
            <div
              ref={connectorsRef}
              className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center justify-between px-[60px]"
              style={{ zIndex: 0 }}
            >
              {STEPS.slice(0, -1).map((step, i) => {
                const nextStep = STEPS[i + 1];
                return (
                  <div
                    key={i}
                    className="connector-line flex-1 h-px relative mx-2"
                    style={{
                      background: `linear-gradient(90deg, ${step.color}, ${nextStep.color})`,
                      opacity: 0.4,
                    }}
                  >
                    {/* Traveling particles */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                      style={{
                        background: step.color,
                        animation: `flow-particle 3s linear infinite`,
                        animationDelay: `${i * 0.5}s`,
                        boxShadow: `0 0 6px ${step.color}`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                      style={{
                        background: nextStep.color,
                        animation: `flow-particle 3s linear infinite`,
                        animationDelay: `${i * 0.5 + 1.5}s`,
                        boxShadow: `0 0 6px ${nextStep.color}`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Nodes */}
            <div
              ref={nodesRef}
              className="relative flex items-center justify-between"
              style={{ zIndex: 1 }}
            >
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className="loop-node flex flex-col items-center gap-4"
                    style={{
                      animation: `pulse-node 4s ease-in-out infinite`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  >
                    <div
                      className="w-[120px] h-[120px] rounded-full flex items-center justify-center border-2 bg-black/50"
                      style={{
                        borderColor: step.color,
                        boxShadow: `0 0 20px ${step.color}20, inset 0 0 20px ${step.color}10`,
                      }}
                    >
                      <Icon className="w-8 h-8" style={{ color: step.color }} strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-sm text-warm-white-2 whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: vertical layout */}
          <div className="lg:hidden flex flex-col items-center gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex flex-col items-center gap-4">
                  <div
                    className="loop-node w-[100px] h-[100px] rounded-full flex items-center justify-center border-2 bg-black/50"
                    style={{
                      borderColor: step.color,
                      boxShadow: `0 0 20px ${step.color}20, inset 0 0 20px ${step.color}10`,
                    }}
                  >
                    <Icon className="w-7 h-7" style={{ color: step.color }} strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-sm text-warm-white-2">{step.label}</span>
                  {i < STEPS.length - 1 && (
                    <div
                      className="w-px h-8"
                      style={{
                        background: `linear-gradient(180deg, ${step.color}, ${STEPS[i + 1].color})`,
                        opacity: 0.4,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
