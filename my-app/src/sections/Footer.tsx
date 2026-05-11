import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = ['Architecture', 'Cognitive Loop', 'Research', 'About'];
const SOCIAL_LINKS = ['GitHub', 'Twitter', 'Discord'];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!footerRef.current) return;

    gsap.from(footerRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 95%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: footerRef });

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-dark-grey py-20 px-10"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <span className="font-display text-2xl text-white">Mnemo</span>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="font-mono text-sm text-grey hover:text-warm-white-2 transition-colors duration-300 px-4"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="font-mono text-sm text-grey hover:text-warm-white-2 transition-colors duration-300 px-3"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <p className="font-mono text-xs text-dark-grey-2 text-center mt-10">
          2025 Mnemo Research. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
