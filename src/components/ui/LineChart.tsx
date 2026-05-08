interface LineChartProps {
  series: {
    label: string;
    data: number[];
    color: string;
  }[];
  labels: string[];
  height?: number;
  showGrid?: boolean;
}

export default function LineChart({ series, labels, height = 200, showGrid = true }: LineChartProps) {
  const allValues = series.flatMap(s => s.data);
  const min = Math.min(...allValues) * 0.95;
  const max = Math.max(...allValues) * 1.05;
  const range = max - min;

  const W = 100;
  const H = 100;
  const px = (i: number) => (i / (labels.length - 1)) * W;
  const py = (v: number) => H - ((v - min) / range) * H;

  const toPath = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${py(v)}`).join(' ');

  const toArea = (data: number[]) => {
    const line = toPath(data);
    return `${line} L ${px(data.length - 1)} ${H} L 0 ${H} Z`;
  };

  return (
    <div style={{ height }} className="w-full relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          {series.map((s, i) => (
            <linearGradient key={i} id={`lg-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {showGrid && [0.25, 0.5, 0.75].map((pct) => (
          <line key={pct} x1="0" y1={pct * H} x2={W} y2={pct * H}
            stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        ))}

        {series.map((s, i) => (
          <g key={i}>
            <path d={toArea(s.data)} fill={`url(#lg-${i})`} />
            <path d={toPath(s.data)} fill="none" stroke={s.color} strokeWidth="0.8"
              style={{ filter: `drop-shadow(0 0 3px ${s.color})` }} />
            {s.data.map((v, j) => (
              <circle key={j} cx={px(j)} cy={py(v)} r="1.2" fill={s.color} />
            ))}
          </g>
        ))}
      </svg>

      {/* X labels */}
      <div className="flex justify-between mt-1 px-1">
        {labels.map((l, i) => (
          <span key={i} className="text-xs text-slate-500" style={{ fontSize: '10px' }}>{l}</span>
        ))}
      </div>
    </div>
  );
}
