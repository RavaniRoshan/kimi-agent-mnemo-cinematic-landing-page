import { type ReactNode } from 'react';

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
  intense?: boolean;
}

export default function LiquidGlass({ children, className = '', intense = false }: LiquidGlassProps) {
  return (
    <div
      className={`${intense ? 'liquid-glass-intense' : 'liquid-glass'} ${className}`}
    >
      {children}
    </div>
  );
}
