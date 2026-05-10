interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  height?: number;
  showValues?: boolean;
}

export default function BarChart({ data, maxValue, height = 160, showValues = true }: BarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value)) * 1.1;

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end gap-2 h-full pb-6 relative">
        {data.map((item, i) => {
          const pct = (item.value / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              {showValues && (
                <span className="text-xs text-slate-400 font-medium">{item.value.toLocaleString()}</span>
              )}
              <div
                className="w-full rounded-t-md transition-all duration-1000 ease-out"
                style={{
                  height: `${pct}%`,
                  background: item.color || 'linear-gradient(to top, #0ea5e9, #38bdf8)',
                  minHeight: 4,
                  boxShadow: item.color ? undefined : '0 0 10px rgba(14,165,233,0.4)',
                }}
              />
              <span className="text-xs text-slate-500 truncate w-full text-center absolute bottom-0">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
