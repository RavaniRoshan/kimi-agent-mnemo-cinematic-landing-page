interface SectionLabelProps {
  text: string;
  className?: string;
}

export default function SectionLabel({ text, className = '' }: SectionLabelProps) {
  return (
    <span
      className={`font-mono text-sm tracking-[0.08em] text-grey ${className}`}
    >
      {text}
    </span>
  );
}
