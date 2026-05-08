import { useState } from 'react';
import { MapPin, Zap, ChevronDown, Home, Navigation, Shield, Star } from 'lucide-react';
import { CITIES, areaRecommendations } from '../data/mockData';
import ScoreGauge from '../components/ui/ScoreGauge';

const formatPrice = (p: number) => `₹${p.toLocaleString()}/sqft`;

const allRecos = [
  ...areaRecommendations,
  {
    area: 'Powai', city: 'Mumbai', affordabilityScore: 68, connectivityScore: 85, safetyScore: 90,
    amenitiesScore: 87, avgPrice: 14500, overallScore: 83,
    description: 'Lake-facing upscale neighborhood with premium tech park proximity and excellent lifestyle options.',
    image: 'https://images.pexels.com/photos/2179483/pexels-photo-2179483.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    area: 'Gachibowli', city: 'Hyderabad', affordabilityScore: 80, connectivityScore: 88, safetyScore: 86,
    amenitiesScore: 89, avgPrice: 7200, overallScore: 86,
    description: 'Major IT & financial hub with excellent roads, metro access, and growing social infrastructure.',
    image: 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

const scoreLabels = [
  { key: 'affordabilityScore', label: 'Affordability', icon: Home, color: '#0ea5e9' },
  { key: 'connectivityScore', label: 'Connectivity', icon: Navigation, color: '#00ff88' },
  { key: 'safetyScore', label: 'Safety', icon: Shield, color: '#ffb700' },
  { key: 'amenitiesScore', label: 'Amenities', icon: Star, color: '#f472b6' },
] as const;

export default function AreaRecommendationPage() {
  const [budget, setBudget] = useState(10000000);
  const [city, setCity] = useState('All Cities');
  const [officeLocation, setOfficeLocation] = useState('');
  const [priorities, setPriorities] = useState<string[]>(['Connectivity', 'Safety']);
  const [results, setResults] = useState(allRecos);
  const [loading, setLoading] = useState(false);
  const [selectedArea, setSelectedArea] = useState<typeof allRecos[0] | null>(null);

  const budgetPsf = budget / 1000;

  const togglePriority = (p: string) => {
    setPriorities(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleFind = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    let filtered = allRecos;
    if (city !== 'All Cities') filtered = filtered.filter(r => r.city === city);
    filtered = filtered.filter(r => r.avgPrice <= budgetPsf * 1.3);
    filtered.sort((a, b) => b.overallScore - a.overallScore);
    setResults(filtered.length ? filtered : allRecos.slice(0, 3));
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(244,114,182,0.15)' }}>
          <MapPin size={20} className="text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white font-grotesk">Smart Area Recommender</h1>
          <p className="text-slate-400 text-sm">AI finds the perfect neighborhood based on your lifestyle</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter panel */}
        <div className="glass rounded-2xl p-6 border border-white/8 space-y-5">
          <h2 className="text-base font-semibold text-white">Your Preferences</h2>

          {/* Budget */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Total Budget: <span className="text-pink-400">₹{(budget / 10000000).toFixed(1)} Cr</span>
            </label>
            <input type="range" min="2000000" max="80000000" step="500000" value={budget}
              onChange={e => setBudget(+e.target.value)} className="w-full" />
            <div className="text-xs text-slate-500 mt-1">≈ {formatPrice(Math.round(budget / 1000))}</div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Preferred City</label>
            <div className="relative">
              <select value={city} onChange={e => setCity(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-pink-500/50">
                <option value="All Cities" className="bg-slate-900">All Cities</option>
                {CITIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Office */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Office/Workplace Area</label>
            <input
              type="text"
              value={officeLocation}
              onChange={e => setOfficeLocation(e.target.value)}
              placeholder="e.g. Whitefield, Hitech City"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500/50 transition-colors placeholder-slate-600"
            />
          </div>

          {/* Priorities */}
          <div>
            <label className="block text-xs text-slate-400 mb-2">Priorities</label>
            <div className="space-y-2">
              {scoreLabels.map(({ label, color }) => (
                <button key={label} onClick={() => togglePriority(label)}
                  className={`w-full flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-all ${
                    priorities.includes(label) ? 'border-opacity-50' : 'border-white/8 text-slate-400 hover:bg-white/5'
                  }`}
                  style={priorities.includes(label) ? { borderColor: color, background: `${color}10`, color } : {}}>
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  {label}
                  {priorities.includes(label) && <span className="ml-auto text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleFind} disabled={loading}
            className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', boxShadow: '0 0 20px rgba(236,72,153,0.3)' }}>
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Searching...</>
            ) : (
              <><Zap size={18} /> Find Best Areas</>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">
          {loading && (
            <div className="glass rounded-2xl p-12 border border-white/8 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-pink-500/20 relative">
                <MapPin size={28} className="text-pink-400 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-pink-500/40 border-t-pink-400 animate-spin" />
              </div>
              <p className="text-slate-400 text-sm">AI analyzing 200+ neighborhoods...</p>
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((area, i) => (
                <div
                  key={i}
                  className={`glass rounded-2xl overflow-hidden border card-hover cursor-pointer transition-all ${
                    selectedArea?.area === area.area ? 'border-pink-500/40' : 'border-white/8'
                  }`}
                  onClick={() => setSelectedArea(selectedArea?.area === area.area ? null : area)}
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={area.image} alt={area.area} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <div className="font-bold text-white">{area.area}</div>
                      <div className="text-xs text-slate-300 flex items-center gap-1"><MapPin size={10} />{area.city}</div>
                    </div>
                    <div className="absolute top-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)' }}>
                      {area.overallScore}
                    </div>
                    {i === 0 && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(251,191,36,0.9)', color: '#000' }}>
                        <Star size={10} fill="currentColor" /> Top Pick
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed line-clamp-2">{area.description}</p>
                    <div className="text-sm font-semibold text-sky-400 mb-3">{formatPrice(area.avgPrice)}</div>

                    <div className="grid grid-cols-4 gap-2">
                      {scoreLabels.map(({ key, label, color }) => (
                        <div key={key} className="text-center">
                          <div className="text-xs font-bold mb-0.5" style={{ color }}>{area[key]}</div>
                          <div className="text-xs text-slate-500">{label.slice(0, 6)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Detail panel */}
          {selectedArea && !loading && (
            <div className="glass rounded-2xl p-6 border border-pink-500/20 animate-fade-in">
              <div className="flex items-start gap-6">
                <img src={selectedArea.image} alt={selectedArea.area}
                  className="w-32 h-24 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white font-grotesk">{selectedArea.area}</h3>
                    <span className="text-sm text-slate-400">{selectedArea.city}</span>
                    <span className="ml-auto text-lg font-bold text-emerald-400">{selectedArea.overallScore}/100</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{selectedArea.description}</p>
                  <div className="grid grid-cols-4 gap-3">
                    {scoreLabels.map(({ key, label, color, icon: Icon }) => (
                      <div key={key} className="text-center p-3 rounded-xl" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                        <Icon size={16} style={{ color }} className="mx-auto mb-1" />
                        <div className="text-lg font-bold" style={{ color }}>{selectedArea[key]}</div>
                        <div className="text-xs text-slate-400">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Score comparison */}
          {!loading && results.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-white/8">
              <h3 className="font-semibold text-white mb-4">Score Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="text-left text-slate-400 pb-3 font-medium">Area</th>
                      {scoreLabels.map(s => (
                        <th key={s.key} className="text-center text-slate-400 pb-3 font-medium" style={{ color: s.color }}>{s.label}</th>
                      ))}
                      <th className="text-center text-slate-400 pb-3 font-medium">Overall</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {results.slice(0, 5).map((r, i) => (
                      <tr key={i} className="hover:bg-white/3 transition-colors">
                        <td className="py-3 text-white font-medium">{r.area}, {r.city}</td>
                        {scoreLabels.map(s => (
                          <td key={s.key} className="py-3 text-center font-bold" style={{ color: s.color }}>{r[s.key]}</td>
                        ))}
                        <td className="py-3 text-center">
                          <span className="px-2 py-1 rounded-lg font-bold text-white" style={{ background: 'rgba(0,255,136,0.15)', color: '#00ff88' }}>{r.overallScore}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
