interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  isCircle: boolean;
}

const COLORS = ['#818cf8', '#fb7185', '#34d399', '#fbbf24', '#a78bfa', '#f472b6'];

function generatePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 7 + i * i * 3) % 100,
    color: COLORS[i % COLORS.length],
    delay: (i % 10) * 0.05,
    size: 4 + (i % 8),
    isCircle: i % 2 === 0,
  }));
}

// Pre-generate pieces once (deterministic, no randomness)
const CONFETTI_PIECES = generatePieces(50);

interface ConfettiProps {
  active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {CONFETTI_PIECES.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: '-10px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: piece.isCircle ? '50%' : '2px',
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
