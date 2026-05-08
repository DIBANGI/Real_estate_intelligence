import { useState } from 'react';
import { Scale, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, XCircle, ChevronDown, ArrowRight } from 'lucide-react';
import { CITIES, LOCATIONS } from '../data/mockData';

interface AnalysisResult {
  aiPrice: number;
  marketPrice: number;
  listedPrice: number;
  verdict: 'great-deal' | 'fair' | 'overpriced';
  percentDiff: number;
  negotiationTip: string;
  comparables: { address: string; price: number; sqft: number; diff: number }[];
}

const formatPrice = (p: number) => {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  return `₹${(p / 100000).toFixed(1)} L`;
};

function analyze(city: string, sqft: number, listedPrice: number): AnalysisResult {
  const basePsf = { Mumbai: 18000, Bangalore: 8200, Delhi: 12000, Hyderabad: 7800, Chennai: 6500, Pune: 7200 }[city] || 8000;
  const aiPrice = Math.round(basePsf * sqft * (0.9 + Math.random() * 0.2));
  const marketPrice = Math.round(aiPrice * (0.95 + Math.random() * 0.1));
  const percentDiff = ((listedPrice - aiPrice) / aiPrice) * 100;

  let verdict: AnalysisResult['verdict'] = 'fair';
  let negotiationTip = '';

  if (percentDiff <= -8) {
    verdict = 'great-deal';
    negotiationTip = `This property is listed ${Math.abs(percentDiff).toFixed(1)}% below AI-predicted value. This is an excellent deal — act quickly as underpriced properties sell fast. You may still negotiate 2-3% off asking price citing minor repairs or closing timeline flexibility.`;
  } else if (percentDiff <= 5) {
    verdict = 'fair';
    negotiationTip = `This property is fairly priced within 5% of AI-predicted market value. You can attempt to negotiate 3-5% off the listed price by highlighting comparable properties and requesting seller to cover stamp duty or registration fees.`;
  } else {
    verdict = 'overpriced';
    negotiationTip = `This property is overpriced by ${percentDiff.toFixed(1)}% compared to AI prediction. Negotiate firmly — offer ${formatPrice(aiPrice)} as your initial bid. Cite comparable transactions and insist on a home inspection report to justify your offer.`;
  }

  return {
    aiPrice, marketPrice, listedPrice, verdict, percentDiff,
    negotiationTip,
    comparables: [
      { address: 'Similar Property A', price: Math.round(aiPrice * 0.97), sqft, diff: -3 },
      { address: 'Similar Property B', price: Math.round(aiPrice * 1.04), sqft: sqft + 100, diff: 4 },
      { address: 'Similar Property C', price: Math.round(aiPrice * 0.99), sqft: sqft - 50, diff: -1 },
    ],
  };
}

const verdictConfig = {
  'great-deal': {
    label: 'Great Deal',
    color: '#00ff88',
    bg: 'rgba(0,255,136,0.1)',
    border: 'rgba(0,255,136,0.3)',
    Icon: CheckCircle,
    desc: 'Below market value — excellent investment opportunity',
  },
  fair: {
    label: 'Fair Price',
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.1)',
    border: 'rgba(14,165,233,0.3)',
    Icon: AlertTriangle,
    desc: 'Priced in line with market — reasonable transaction',
  },
  overpriced: {
    label: 'Overpriced',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.3)',
    Icon: XCircle,
    desc: 'Above market value — negotiate before buying',
  },
};

export default function FairPricePage() {
  const [city, setCity] = useState('Mumbai');
  const [location, setLocation] = useState('Bandra');
  const [sqft, setSqft] = useState(1200);
  const [listedPrice, setListedPrice] = useState(28000000);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setResult(analyze(city, sqft, listedPrice));
    setLoading(false);
  };

  const verdict = result ? verdictConfig[result.verdict] : null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,255,136,0.15)' }}>
          <Scale size={20} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white font-grotesk">Fair Price Analyzer</h1>
          <p className="text-slate-400 text-sm">Know if you are overpaying or getting a steal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input form */}
        <div className="glass rounded-2xl p-6 border border-white/8">
          <h2 className="text-base font-semibold text-white mb-5">Property Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">City</label>
              <div className="relative">
                <select value={city} onChange={e => { setCity(e.target.value); setLocation(LOCATIONS[e.target.value]?.[0] || ''); }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-sky-500/50">
                  {CITIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Location</label>
              <div className="relative">
                <select value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-sky-500/50">
                  {(LOCATIONS[city] || []).map(l => <option key={l} value={l} className="bg-slate-900">{l}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Size: <span className="text-sky-400">{sqft.toLocaleString()} sqft</span></label>
              <input type="range" min="400" max="8000" step="50" value={sqft}
                onChange={e => setSqft(+e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Listed Price</label>
              <input
                type="number"
                value={listedPrice}
                onChange={e => setListedPrice(+e.target.value)}
                placeholder="Enter listed price in ₹"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-500/50 transition-colors"
              />
              <div className="text-xs text-slate-500 mt-1">{formatPrice(listedPrice)}</div>
            </div>
            <button onClick={handleAnalyze} disabled={loading}
              className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
              ) : (
                <><Scale size={18} /> Analyze Price</>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-5">
          {!result && !loading && (
            <div className="glass rounded-2xl p-12 border border-white/8 text-center flex flex-col items-center gap-4">
              <Scale size={48} className="text-slate-600" />
              <p className="text-slate-400 text-sm">Enter property details to analyze fair price</p>
            </div>
          )}

          {loading && (
            <div className="glass rounded-2xl p-12 border border-white/8 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-emerald-500/20 relative">
                <Scale size={28} className="text-emerald-400 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 animate-spin" />
              </div>
              <p className="text-slate-400 text-sm">Comparing with 847 similar transactions...</p>
            </div>
          )}

          {result && verdict && !loading && (
            <>
              {/* Verdict card */}
              <div className="rounded-2xl p-6 border"
                style={{ background: verdict.bg, borderColor: verdict.border }}>
                <div className="flex items-center gap-4 mb-4">
                  <verdict.Icon size={32} style={{ color: verdict.color }} />
                  <div>
                    <div className="text-xl font-bold font-grotesk" style={{ color: verdict.color }}>{verdict.label}</div>
                    <div className="text-sm text-slate-400">{verdict.desc}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className={`text-3xl font-bold font-grotesk ${result.percentDiff <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.percentDiff > 0 ? '+' : ''}{result.percentDiff.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-400">vs AI estimate</div>
                  </div>
                </div>

                {/* Price comparison bar */}
                <div className="space-y-3 mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  {[
                    { label: 'Listed Price', price: result.listedPrice, w: 100, color: result.verdict === 'overpriced' ? '#ef4444' : '#0ea5e9' },
                    { label: 'AI Predicted', price: result.aiPrice, w: (result.aiPrice / result.listedPrice) * 100, color: '#00ff88' },
                    { label: 'Market Average', price: result.marketPrice, w: (result.marketPrice / result.listedPrice) * 100, color: '#ffb700' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-slate-400 w-32 flex-shrink-0">{row.label}</span>
                      <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="h-full rounded-lg flex items-center px-2 transition-all duration-700"
                          style={{ width: `${Math.min(row.w, 100)}%`, background: `${row.color}40`, border: `1px solid ${row.color}40` }}>
                          <span className="text-xs font-medium" style={{ color: row.color }}>{formatPrice(row.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Negotiation tip */}
              <div className="glass rounded-2xl p-6 border border-amber-500/20" style={{ background: 'rgba(251,191,36,0.04)' }}>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-400" /> Negotiation Strategy
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{result.negotiationTip}</p>
                <div className="mt-4 flex gap-3">
                  <div className="flex-1 p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="text-xs text-slate-400 mb-1">Recommended Offer</div>
                    <div className="font-bold text-emerald-400">{formatPrice(Math.round(result.aiPrice * 0.97))}</div>
                  </div>
                  <div className="flex-1 p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="text-xs text-slate-400 mb-1">Walk Away If Above</div>
                    <div className="font-bold text-red-400">{formatPrice(Math.round(result.aiPrice * 1.08))}</div>
                  </div>
                  <div className="flex-1 p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="text-xs text-slate-400 mb-1">Target Price</div>
                    <div className="font-bold text-sky-400">{formatPrice(result.aiPrice)}</div>
                  </div>
                </div>
              </div>

              {/* Comparable transactions */}
              <div className="glass rounded-2xl p-6 border border-white/8">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <ArrowRight size={16} className="text-sky-400" /> Comparable Transactions
                </h3>
                <div className="space-y-3">
                  {result.comparables.map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div>
                        <div className="text-sm text-white">{c.address}</div>
                        <div className="text-xs text-slate-400">{c.sqft.toLocaleString()} sqft</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{formatPrice(c.price)}</div>
                        <div className={`text-xs ${c.diff < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {c.diff > 0 ? '+' : ''}{c.diff}% vs listed
                        </div>
                      </div>
                      {c.diff <= 0
                        ? <TrendingDown size={16} className="text-emerald-400 ml-3" />
                        : <TrendingUp size={16} className="text-red-400 ml-3" />}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
