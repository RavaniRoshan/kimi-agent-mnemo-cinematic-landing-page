import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

interface NavigationProps {
  visible: boolean;
}

const NAV_ITEMS = [
  { label: 'Architecture', href: '#architecture' },
  { label: 'Cognitive Loop', href: '#cognitive-loop' },
  { label: 'Research', href: '#research' },
  { label: 'About', href: '#about' },
];

export default function Navigation({ visible }: NavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const [intense, setIntense] = useState(false);

  useEffect(() => {
    if (!navRef.current) return;

    if (visible) {
      gsap.to(navRef.current, {
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
      });
    }
  }, [visible]);

  useEffect(() => {
    const handleScroll = () => {
      setIntense(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] opacity-0"
    >
      <div
        className={`flex items-center gap-1 px-2 py-2 rounded-full ${
          intense ? 'liquid-glass-intense' : 'liquid-glass'
        }`}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className="font-mono text-sm text-warm-white-2 hover:text-white hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] px-4 py-2 rounded-full transition-all duration-300"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
