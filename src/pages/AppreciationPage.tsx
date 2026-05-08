import { useState } from 'react';
import { TrendingUp, Star, Zap, ChevronDown } from 'lucide-react';
import { CITIES, appreciationData } from '../data/mockData';
import LineChart from '../components/ui/LineChart';

const formatPrice = (p: number) => {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  return `₹${(p / 100000).toFixed(1)} L`;
};

const investmentInsights = [
  { city: 'Hyderabad', score: 93, growth: 15.6, reason: 'Booming IT sector, metro expansion, and affordable base prices make it the top pick.' },
  { city: 'Bangalore', score: 91, growth: 12.1, reason: 'Consistent demand from tech professionals. Limited supply in premium zones.' },
  { city: 'Pune', score: 87, growth: 11.8, reason: 'Strong IT/manufacturing mix, quality of life, and growing startup ecosystem.' },
  { city: 'Chennai', score: 82, growth: 9.2, reason: 'Manufacturing corridor and port city advantage. Steady long-term growth.' },
];

export default function AppreciationPage() {
  const [investAmount, setInvestAmount] = useState(10000000);
  const [city, setCity] = useState('Bangalore');
  const [scenario, setScenario] = useState<'conservative' | 'moderate' | 'optimistic'>('moderate');

  const seriesData = {
    conservative: appreciationData.conservative.map(v => Math.round(v * (investAmount / 10000000))),
    moderate: appreciationData.moderate.map(v => Math.round(v * (investAmount / 10000000))),
    optimistic: appreciationData.optimistic.map(v => Math.round(v * (investAmount / 10000000))),
  };

  const selected = seriesData[scenario];
  const finalValue = selected[selected.length - 1];
  const totalReturn = ((finalValue - investAmount) / investAmount) * 100;
  const annualReturn = (Math.pow(finalValue / investAmount, 1 / 6) - 1) * 100;

  const scenarioConfigs = {
    conservative: { color: '#0ea5e9', label: 'Conservative', rate: '8%/yr' },
    moderate: { color: '#00ff88', label: 'Moderate', rate: '12%/yr' },
    optimistic: { color: '#ffb700', label: 'Optimistic', rate: '18%/yr' },
  };

  const allSeries = [
    { label: 'Conservative', data: seriesData.conservative, color: '#0ea5e9' },
    { label: 'Moderate', data: seriesData.moderate, color: '#00ff88' },
    { label: 'Optimistic', data: seriesData.optimistic, color: '#ffb700' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.15)' }}>
          <TrendingUp size={20} className="text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white font-grotesk">Future Appreciation Forecast</h1>
          <p className="text-slate-400 text-sm">AI-powered 6-year property value projection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h2 className="text-base font-semibold text-white mb-4">Investment Parameters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">City</label>
                <div className="relative">
                  <select value={city} onChange={e => setCity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-sky-500/50">
                    {CITIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Investment Amount: <span className="text-amber-400">{formatPrice(investAmount)}</span></label>
                <input type="range" min="2000000" max="100000000" step="500000" value={investAmount}
                  onChange={e => setInvestAmount(+e.target.value)} className="w-full" />
                <div className="flex justify-between text-xs text-slate-500 mt-1"><span>₹20L</span><span>₹10Cr</span></div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-3">Growth Scenario</label>
                <div className="space-y-2">
                  {(['conservative', 'moderate', 'optimistic'] as const).map((s) => {
                    const c = scenarioConfigs[s];
                    return (
                      <button key={s} onClick={() => setScenario(s)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                          scenario === s ? 'border-opacity-50' : 'border-white/8 hover:bg-white/5'
                        }`}
                        style={scenario === s ? { borderColor: c.color, background: `${c.color}10` } : {}}>
                        <div className="w-3 h-3 rounded-full" style={{ background: c.color, boxShadow: scenario === s ? `0 0 8px ${c.color}` : 'none' }} />
                        <span className="flex-1 text-sm text-white font-medium">{c.label}</span>
                        <span className="text-xs" style={{ color: c.color }}>{c.rate}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="glass rounded-2xl p-6 border border-white/8 space-y-4">
            <h3 className="text-sm font-semibold text-white">Projected Returns (2030)</h3>
            {[
              { label: 'Final Value', value: formatPrice(finalValue), color: scenarioConfigs[scenario].color },
              { label: 'Total Return', value: `+${totalReturn.toFixed(0)}%`, color: '#00ff88' },
              { label: 'Annual CAGR', value: `${annualReturn.toFixed(1)}%`, color: '#ffb700' },
              { label: 'Net Gain', value: formatPrice(finalValue - investAmount), color: '#f472b6' },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-slate-400">{m.label}</span>
                <span className="font-bold text-sm" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass rounded-2xl p-6 border border-white/8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-white">Property Value Projection (2024–2030)</h2>
              <div className="flex items-center gap-4 text-xs">
                {allSeries.map(s => (
                  <span key={s.label} className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 inline-block rounded" style={{ background: s.color }} />
                    <span className="text-slate-400">{s.label}</span>
                  </span>
                ))}
              </div>
            </div>
            <LineChart series={allSeries} labels={appreciationData.years.map(String)} height={260} />
          </div>

          {/* Year-by-year table */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h3 className="font-semibold text-white mb-4">Year-by-Year Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left text-xs text-slate-400 pb-3 font-medium">Year</th>
                    <th className="text-right text-xs text-sky-400 pb-3 font-medium">Conservative</th>
                    <th className="text-right text-xs text-emerald-400 pb-3 font-medium">Moderate</th>
                    <th className="text-right text-xs text-amber-400 pb-3 font-medium">Optimistic</th>
                    <th className="text-right text-xs text-slate-400 pb-3 font-medium">YoY Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {appreciationData.years.map((year, i) => {
                    const yoy = i === 0 ? 0 : ((selected[i] - selected[i - 1]) / selected[i - 1]) * 100;
                    return (
                      <tr key={year} className={`transition-colors hover:bg-white/3 ${i === 0 ? 'opacity-60' : ''}`}>
                        <td className="py-3 text-white font-medium">{year}</td>
                        <td className="py-3 text-right text-sky-400">{formatPrice(seriesData.conservative[i])}</td>
                        <td className="py-3 text-right text-emerald-400">{formatPrice(seriesData.moderate[i])}</td>
                        <td className="py-3 text-right text-amber-400">{formatPrice(seriesData.optimistic[i])}</td>
                        <td className="py-3 text-right">
                          {i === 0 ? (
                            <span className="text-slate-500">Base</span>
                          ) : (
                            <span className="text-emerald-400">+{yoy.toFixed(1)}%</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Investment score cities */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Star size={15} className="text-amber-400" fill="currentColor" /> Top Investment Cities
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {investmentInsights.map((ins, i) => (
                <div key={i} className="p-4 rounded-xl border border-white/8 hover:border-sky-500/30 transition-all cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white text-sm">{ins.city}</span>
                    <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88' }}>
                      <Zap size={10} /> {ins.score}
                    </div>
                  </div>
                  <div className="text-xs text-emerald-400 mb-2 flex items-center gap-1">
                    <TrendingUp size={11} /> +{ins.growth}% annual growth
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{ins.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
