import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: ReactNode;
  iconBg?: string;
  subtitle?: string;
}

export default function StatCard({ title, value, change, icon, iconBg, subtitle }: StatCardProps) {
  return (
    <div className="glass rounded-2xl p-5 card-hover border border-white/8">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: iconBg || 'rgba(14,165,233,0.15)' }}
        >
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            change >= 0
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-red-500/15 text-red-400'
          }`}>
            {change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white font-grotesk mb-1">{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
    </div>
  );
}
