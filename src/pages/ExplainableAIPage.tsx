import { useState } from 'react';
import { Sparkles, Info, TrendingUp, TrendingDown, Brain, Zap } from 'lucide-react';

const featureData = [
  { feature: 'Location Premium', shap: 4.2, direction: 'positive', value: 'Bandra, Mumbai', desc: 'Prime Mumbai location adds significant premium' },
  { feature: 'Built-up Area', shap: 3.1, direction: 'positive', value: '1,850 sqft', desc: 'Above-average size boosts valuation' },
  { feature: 'Property Age', shap: 2.4, direction: 'positive', value: '2 years', desc: 'Near-new construction attracts premium' },
  { feature: 'Furnishing', shap: 1.8, direction: 'positive', value: 'Fully Furnished', desc: 'Ready-to-move furnished units command higher price' },
  { feature: 'Amenities Count', shap: 1.2, direction: 'positive', value: '8 amenities', desc: 'Rich amenity package adds desirability' },
  { feature: 'BHK Configuration', shap: 0.9, direction: 'positive', value: '3 BHK', desc: 'Popular 3BHK size has strong demand' },
  { feature: 'Floor Level', shap: -0.5, direction: 'negative', value: '4th Floor', desc: 'Mid-floor slightly reduces premium vs high floors' },
  { feature: 'Road Facing', shap: -0.3, direction: 'negative', value: 'Not Facing', desc: 'Non-road-facing reduces noise but lowers visibility' },
];

const explanationText = `The predicted price of ₹2.85 Cr for this property in Bandra, Mumbai is primarily driven by its exceptional location (contributing ₹4.2L to base value), which alone accounts for 32% of the total valuation. The property's above-average size of 1,850 sqft and near-new construction status collectively add another ₹5.5L in value. The fully furnished condition is a significant positive factor, particularly in the premium Mumbai market where furnished units see 12-18% higher demand.

Minor downward adjustments were applied for the mid-floor position and non-road-facing orientation, but these are largely offset by the premium amenities package including a swimming pool, gym, and clubhouse.

Overall, the AI model is 94% confident in this estimate, with a prediction interval of ₹2.62Cr – ₹3.08Cr based on comparable transactions in the last 90 days.`;

const modelMetrics = [
  { label: 'Model Accuracy', value: '99.2%', color: '#00ff88' },
  { label: 'Training Samples', value: '2.4M+', color: '#0ea5e9' },
  { label: 'Features Used', value: '47', color: '#ffb700' },
  { label: 'Confidence', value: '94%', color: '#f472b6' },
];

export default function ExplainableAIPage() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const positives = featureData.filter(f => f.direction === 'positive');
  const negatives = featureData.filter(f => f.direction === 'negative');
  const maxShap = Math.max(...featureData.map(f => Math.abs(f.shap)));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(251,146,60,0.2)' }}>
          <Sparkles size={20} className="text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white font-grotesk">Explainable AI</h1>
          <p className="text-slate-400 text-sm">Understand the why behind every prediction</p>
        </div>
      </div>

      {/* Model Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {modelMetrics.map((m, i) => (
          <div key={i} className="glass rounded-2xl p-4 border border-white/8 text-center">
            <div className="text-2xl font-bold font-grotesk mb-1" style={{ color: m.color }}>{m.value}</div>
            <div className="text-xs text-slate-400">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Waterfall Chart */}
        <div className="glass rounded-2xl p-6 border border-white/8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Brain size={16} className="text-orange-400" /> SHAP Value Analysis
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Positive</span>
              <span className="flex items-center gap-1 text-red-400"><span className="w-3 h-3 rounded bg-red-500 inline-block" /> Negative</span>
            </div>
          </div>

          <div className="space-y-3">
            {featureData.map((f, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                  activeFeature === i ? 'border-sky-500/40 bg-sky-500/5' : 'border-transparent hover:bg-white/5'
                }`}
                onClick={() => setActiveFeature(activeFeature === i ? null : i)}
              >
                <div className="w-32 text-xs text-slate-300 flex-shrink-0 truncate">{f.feature}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-6 relative flex items-center">
                    <div className="absolute inset-x-0 h-0.5 bg-white/10 top-1/2" />
                    <div
                      className="absolute h-5 rounded-md flex items-center justify-end pr-1 transition-all duration-500"
                      style={{
                        left: f.direction === 'positive' ? '50%' : `${50 - (Math.abs(f.shap) / maxShap) * 50}%`,
                        width: `${(Math.abs(f.shap) / maxShap) * 50}%`,
                        background: f.direction === 'positive'
                          ? 'linear-gradient(to right, rgba(16,185,129,0.6), rgba(16,185,129,0.9))'
                          : 'linear-gradient(to left, rgba(239,68,68,0.6), rgba(239,68,68,0.9))',
                        boxShadow: `0 0 8px ${f.direction === 'positive' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      }}
                    />
                  </div>
                  <span className={`text-xs w-12 text-right font-medium ${f.direction === 'positive' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {f.direction === 'positive' ? '+' : ''}{f.shap}L
                  </span>
                </div>
                <Info size={12} className="text-slate-600 flex-shrink-0" />
              </div>
            ))}
          </div>

          {activeFeature !== null && (
            <div className="mt-4 p-4 rounded-xl border border-sky-500/20" style={{ background: 'rgba(14,165,233,0.05)' }}>
              <div className="flex items-center gap-2 mb-2">
                {featureData[activeFeature].direction === 'positive'
                  ? <TrendingUp size={14} className="text-emerald-400" />
                  : <TrendingDown size={14} className="text-red-400" />}
                <span className="text-sm font-medium text-white">{featureData[activeFeature].feature}</span>
                <span className="text-xs text-sky-400 ml-auto">{featureData[activeFeature].value}</span>
              </div>
              <p className="text-xs text-slate-400">{featureData[activeFeature].desc}</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Feature importance donut */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Zap size={16} className="text-amber-400" /> Feature Importance Breakdown
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {(() => {
                    const slices = [
                      { pct: 32, color: '#0ea5e9' },
                      { pct: 28, color: '#00d4ff' },
                      { pct: 18, color: '#00ff88' },
                      { pct: 12, color: '#ffb700' },
                      { pct: 10, color: '#f472b6' },
                    ];
                    let offset = 0;
                    return slices.map((s, i) => {
                      const circ = 2 * Math.PI * 15.9;
                      const dash = (s.pct / 100) * circ;
                      const el = (
                        <circle key={i} cx="18" cy="18" r="15.9" fill="none" stroke={s.color} strokeWidth="3"
                          strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset}
                          style={{ filter: `drop-shadow(0 0 4px ${s.color})` }} />
                      );
                      offset += dash;
                      return el;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">47</span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {[
                  { label: 'Location', pct: 32, color: '#0ea5e9' },
                  { label: 'Area/Size', pct: 28, color: '#00d4ff' },
                  { label: 'BHK Type', pct: 18, color: '#00ff88' },
                  { label: 'Furnishing', pct: 12, color: '#ffb700' },
                  { label: 'Others', pct: 10, color: '#f472b6' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-slate-400 flex-1">{item.label}</span>
                    <span style={{ color: item.color }} className="font-medium">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Explanation */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Brain size={16} className="text-sky-400" /> AI-Generated Explanation
            </h2>
            <div className="space-y-3">
              {explanationText.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm text-slate-400 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>

          {/* Comparison bars */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h2 className="font-semibold text-white mb-4">Positive vs Negative Factors</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-emerald-400 mb-3 flex items-center gap-1"><TrendingUp size={11} /> Value Boosters</div>
                <div className="space-y-2">
                  {positives.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(f.shap / maxShap) * 100}%`, background: '#00ff88' }} />
                      </div>
                      <span className="text-emerald-400 w-10 text-right">+{f.shap}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-red-400 mb-3 flex items-center gap-1"><TrendingDown size={11} /> Value Reducers</div>
                <div className="space-y-2">
                  {negatives.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(Math.abs(f.shap) / maxShap) * 100}%`, background: '#ef4444' }} />
                      </div>
                      <span className="text-red-400 w-10 text-right">{f.shap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
