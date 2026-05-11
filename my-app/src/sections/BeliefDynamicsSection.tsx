import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';
import WordReveal from '../components/WordReveal';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const INPUT_NODES = 8;
const HIDDEN_NODES = 10;
const OUTPUT_NODES = 7;
const LAYER_X = [80, 300, 520];
const NODE_RADIUS = 6;

function generateNodePositions() {
  const nodes: { x: number; y: number; layer: number; color: string }[] = [];

  for (let i = 0; i < INPUT_NODES; i++) {
    nodes.push({
      x: LAYER_X[0],
      y: 50 + (i * 500) / (INPUT_NODES - 1),
      layer: 0,
      color: '#3B3BFF',
    });
  }

  for (let i = 0; i < HIDDEN_NODES; i++) {
    nodes.push({
      x: LAYER_X[1],
      y: 30 + (i * 540) / (HIDDEN_NODES - 1),
      layer: 1,
      color: i % 2 === 0 ? '#9747FF' : '#24D4D4',
    });
  }

  for (let i = 0; i < OUTPUT_NODES; i++) {
    nodes.push({
      x: LAYER_X[2],
      y: 60 + (i * 480) / (OUTPUT_NODES - 1),
      layer: 2,
      color: '#C8FF1F',
    });
  }

  return nodes;
}

function getConnections(nodes: ReturnType<typeof generateNodePositions>) {
  const connections: { from: number; to: number }[] = [];
  const inputEnd = INPUT_NODES;
  const hiddenEnd = INPUT_NODES + HIDDEN_NODES;

  for (let i = 0; i < inputEnd; i++) {
    for (let j = inputEnd; j < hiddenEnd; j++) {
      connections.push({ from: i, to: j });
    }
  }

  for (let i = inputEnd; i < hiddenEnd; i++) {
    for (let j = hiddenEnd; j < nodes.length; j++) {
      connections.push({ from: i, to: j });
    }
  }

  return connections;
}

export default function BeliefDynamicsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodesRef = useRef<ReturnType<typeof generateNodePositions>>([]);
  const connectionsRef = useRef<ReturnType<typeof getConnections>>([]);

  if (nodesRef.current.length === 0) {
    nodesRef.current = generateNodePositions();
    connectionsRef.current = getConnections(nodesRef.current);
  }

  useGSAP(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const nodeEls = svg.querySelectorAll('.nn-node');
    const lineEls = svg.querySelectorAll('.nn-line');

    gsap.from(svg, {
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    gsap.from(nodeEls, {
      scale: 0,
      duration: 0.5,
      stagger: 0.03,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    gsap.from(lineEls, {
      opacity: 0,
      duration: 0.6,
      delay: 0.5,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    // Signal flow animation
    const signalInterval = setInterval(() => {
      const connections = connectionsRef.current;
      if (connections.length === 0) return;

      const randomConn = connections[Math.floor(Math.random() * connections.length)];
      const fromNode = nodesRef.current[randomConn.from];
      const toNode = nodesRef.current[randomConn.to];

      const signal = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      signal.setAttribute('r', '3');
      signal.setAttribute('fill', fromNode.color);
      signal.setAttribute('opacity', '0');
      signal.style.filter = `drop-shadow(0 0 4px ${fromNode.color})`;
      svg.appendChild(signal);

      gsap.to(signal, {
        attr: { cx: toNode.x, cy: toNode.y },
        duration: 1.5,
        ease: 'power1.inOut',
        onStart: () => signal.setAttribute('opacity', '1'),
        onComplete: () => {
          gsap.to(signal, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => signal.remove(),
          });
        },
      });
      gsap.fromTo(signal, { attr: { cx: fromNode.x, cy: fromNode.y }, opacity: 0 }, {
        attr: { cx: toNode.x, cy: toNode.y },
        opacity: 1,
        duration: 1.5,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.to(signal, { opacity: 0, duration: 0.3, onComplete: () => signal.remove() });
        },
      });
    }, 300);

    // Contradiction flash animation
    const contradictionInterval = setInterval(() => {
      const outputNodeEls = svg.querySelectorAll('[data-layer="2"]');
      if (outputNodeEls.length === 0) return;

      const randomNode = outputNodeEls[Math.floor(Math.random() * outputNodeEls.length)];
      const nodeIndex = parseInt(randomNode.getAttribute('data-index') || '0');
      const actualIndex = INPUT_NODES + HIDDEN_NODES + nodeIndex;

      gsap.to(randomNode, {
        fill: '#FF1F1F',
        filter: 'drop-shadow(0 0 20px #FF1F1F)',
        duration: 0.5,
        onComplete: () => {
          gsap.to(randomNode, {
            fill: '#C8FF1F',
            filter: 'drop-shadow(0 0 0px transparent)',
            duration: 2,
            ease: 'power2.out',
          });
        },
      });

      // Highlight connections to this node
      const relatedLines = svg.querySelectorAll(`[data-target="${actualIndex}"]`);
      gsap.to(relatedLines, {
        stroke: '#FF1F1F',
        strokeOpacity: 0.3,
        duration: 0.5,
        onComplete: () => {
          gsap.to(relatedLines, {
            stroke: '#ffffff',
            strokeOpacity: 0.06,
            duration: 2,
          });
        },
      });
    }, 6000);

    return () => {
      clearInterval(signalInterval);
      clearInterval(contradictionInterval);
    };
  }, { scope: sectionRef });

  const nodes = nodesRef.current;
  const connections = connectionsRef.current;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-black py-40 px-10"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          {/* Left column - text */}
          <div className="lg:w-[45%]">
            <SectionLabel text="04 / BELIEF DYNAMICS" />

            <WordReveal
              tag="h2"
              className="text-[clamp(36px,5vw,60px)] leading-[1.07] tracking-[-0.03em] text-white mt-4"
            >
              Memories evolve. Beliefs adapt.
            </WordReveal>

            <p
              className="text-xl leading-relaxed text-warm-white mt-6"
              style={{ letterSpacing: '-0.4px' }}
            >
              Every belief in Mnemo's semantic memory carries a confidence score.
              As new experiences arrive, related beliefs are reinforced or challenged.
            </p>

            <p
              className="text-xl leading-relaxed text-dimmed mt-5"
              style={{ letterSpacing: '-0.4px' }}
            >
              When a contradiction is detected, the Belief Immune System triggers
              a repair cascade. Conflicting beliefs are compared against validated
              memories. The stronger evidence prevails. Corrupted abstractions are
              quarantined and rebuilt.
            </p>

            <p
              className="text-xl leading-relaxed text-dimmed mt-5"
              style={{ letterSpacing: '-0.4px' }}
            >
              Over time, the system's understanding becomes more accurate, more
              robust, and more aligned with reality.
            </p>

            <a
              href="#research"
              className="inline-flex items-center gap-2 font-mono text-sm text-blue mt-10 hover:underline transition-all duration-300 group"
            >
              Explore the Research
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Right column - neural network SVG */}
          <div className="lg:w-[55%] w-full">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(59,59,255,0.04) 0%, transparent 70%)',
              }}
            >
              <svg
                ref={svgRef}
                viewBox="0 0 600 580"
                className="w-full h-auto"
                style={{ maxHeight: '500px' }}
              >
                {/* Connections */}
                {connections.map((conn, i) => {
                  const from = nodes[conn.from];
                  const to = nodes[conn.to];
                  return (
                    <line
                      key={i}
                      className="nn-line"
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#ffffff"
                      strokeOpacity={0.06}
                      strokeWidth={1}
                      data-target={conn.to}
                    />
                  );
                })}

                {/* Nodes */}
                {nodes.map((node, i) => {
                  const nodeIndexInLayer =
                    node.layer === 0 ? i :
                    node.layer === 1 ? i - INPUT_NODES :
                    i - INPUT_NODES - HIDDEN_NODES;

                  return (
                    <circle
                      key={i}
                      className="nn-node"
                      cx={node.x}
                      cy={node.y}
                      r={NODE_RADIUS + (node.layer === 1 ? 2 : 0)}
                      fill={node.color}
                      data-layer={node.layer}
                      data-index={nodeIndexInLayer}
                      style={{
                        filter: `drop-shadow(0 0 6px ${node.color}40)`,
                      }}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
