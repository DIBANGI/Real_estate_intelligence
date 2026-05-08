interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreGauge({ score, label, size = 'md' }: ScoreGaugeProps) {
  const sizes = { sm: 64, md: 80, lg: 100 };
  const dim = sizes[size];
  const r = (dim / 2) - 8;
  const circ = 2 * Math.PI * r;
  const pct = score / 100;
  const dash = pct * circ * 0.75;
  const gap = circ - dash;
  const rot = -135;

  const color = score >= 80 ? '#00ff88' : score >= 60 ? '#0ea5e9' : score >= 40 ? '#ffb700' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={dim} height={dim} style={{ transform: `rotate(${rot}deg)` }}>
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} />
        <circle
          cx={dim / 2} cy={dim / 2} r={r} fill="none"
          stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${gap + circ * 0.25}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.2s ease', filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <text x={dim / 2} y={dim / 2 + 6} textAnchor="middle" fill="white" fontSize={size === 'sm' ? 14 : size === 'md' ? 18 : 22} fontWeight="700"
          style={{ transform: `rotate(${-rot}deg)`, transformOrigin: `${dim / 2}px ${dim / 2}px` }}>
          {score}
        </text>
      </svg>
      <span className="text-xs text-slate-400 text-center">{label}</span>
    </div>
  );
}
