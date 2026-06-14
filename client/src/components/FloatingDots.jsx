import { useMemo } from 'react';

export default function FloatingDots() {
  const dots = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="dot-float absolute rounded-full bg-primary"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size + 'px',
            height: dot.size + 'px',
            opacity: dot.opacity,
          }}
        />
      ))}
    </div>
  );
}
