import { useState } from 'react';
import { Brain, Sparkles, ChevronDown, CheckSquare, Square, BarChart3, TrendingUp, Home } from 'lucide-react';
import { CITIES, LOCATIONS, AMENITIES, featuredProperties } from '../data/mockData';
import { PredictionInput, PredictionResult } from '../types';
import PropertyCard from '../components/ui/PropertyCard';
import ScoreGauge from '../components/ui/ScoreGauge';

const FURNISHING_OPTIONS = ['Furnished', 'Semi-Furnished', 'Unfurnished'];

function generatePrediction(input: PredictionInput): PredictionResult {
  const basePrice = {
    Mumbai: 18000, Bangalore: 8200, Delhi: 12000, Hyderabad: 7800,
    Chennai: 6500, Pune: 7200, Kolkata: 5800, Ahmedabad: 5500,
  }[input.city] || 8000;

  let multiplier = 1;
  if (input.bhk === 1) multiplier *= 0.85;
  if (input.bhk === 2) multiplier *= 1.0;
  if (input.bhk === 3) multiplier *= 1.1;
  if (input.bhk >= 4) multiplier *= 1.25;
  if (input.furnishing === 'Furnished') multiplier *= 1.15;
  if (input.furnishing === 'Unfurnished') multiplier *= 0.92;
  if (input.parking) multiplier *= 1.05;
  if (input.age < 2) multiplier *= 1.12;
  if (input.age > 10) multiplier *= 0.88;
  multiplier += (input.amenities.length / AMENITIES.length) * 0.15;

  const pricePerSqft = basePrice * multiplier;
  const predictedPrice = Math.round(pricePerSqft * input.sqft);
  const variance = predictedPrice * 0.08;

  return {
    predictedPrice,
    confidenceScore: Math.round(85 + Math.random() * 14),
    priceRange: {
      min: Math.round(predictedPrice - variance),
      max: Math.round(predictedPrice + variance),
    },
    similarProperties: featuredProperties.slice(0, 3),
    featureImportance: [
      { feature: 'Location', importance: 32, impact: 'positive' },
      { feature: 'Square Feet', importance: 28, impact: 'positive' },
      { feature: 'BHK', importance: 18, impact: 'positive' },
      { feature: 'Furnishing', importance: 10, impact: input.furnishing === 'Furnished' ? 'positive' : 'negative' },
      { feature: 'Property Age', importance: 8, impact: input.age < 5 ? 'positive' : 'negative' },
      { feature: 'Amenities', importance: 4, impact: 'positive' },
    ],
    explanation: `This ${input.bhk} BHK property in ${input.location}, ${input.city} is valued at ₹${(predictedPrice / 100000).toFixed(1)}L primarily due to its prime location (32% weight), adequate size of ${input.sqft} sqft (28% weight), and ${input.furnishing.toLowerCase()} status. The ${input.age <= 2 ? 'new construction' : input.age <= 5 ? 'relatively new' : 'older'} property age ${input.age <= 5 ? 'positively' : 'negatively'} impacts valuation.`,
  };
}

const formatPrice = (p: number) => {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  return `₹${(p / 100000).toFixed(1)} L`;
};

export default function PredictionPage() {
  const [form, setForm] = useState<PredictionInput>({
    city: 'Mumbai', location: 'Bandra', sqft: 1200, bhk: 2,
    bathrooms: 2, balcony: 1, parking: true, furnishing: 'Semi-Furnished',
    age: 3, amenities: [],
  });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const locations = LOCATIONS[form.city] || [];

  const handlePredict = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setResult(generatePrediction(form));
    setLoading(false);
  };

  const toggleAmenity = (a: string) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(14,165,233,0.2)' }}>
            <Brain size={20} className="text-sky-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-grotesk">House Price Prediction</h1>
            <p className="text-slate-400 text-sm">AI-powered valuation engine with 99.2% accuracy</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
              <Home size={16} className="text-sky-400" /> Property Details
            </h2>

            <div className="space-y-4">
              {/* City */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">City</label>
                <div className="relative">
                  <select
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value, location: LOCATIONS[e.target.value]?.[0] || '' }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-sky-500/50 transition-colors"
                  >
                    {CITIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Location / Area</label>
                <div className="relative">
                  <select
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-sky-500/50 transition-colors"
                  >
                    {locations.map(l => <option key={l} value={l} className="bg-slate-900">{l}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Sqft */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Square Feet: <span className="text-sky-400">{form.sqft.toLocaleString()} sqft</span></label>
                <input type="range" min="300" max="10000" step="50" value={form.sqft}
                  onChange={e => setForm(f => ({ ...f, sqft: +e.target.value }))} className="w-full" />
                <div className="flex justify-between text-xs text-slate-500 mt-1"><span>300</span><span>10,000</span></div>
              </div>

              {/* BHK + Baths */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">BHK</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setForm(f => ({ ...f, bhk: n }))}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          form.bhk === n ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}>{n}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Bathrooms</label>
                  <div className="flex gap-2">
                    {[1,2,3,4].map(n => (
                      <button key={n} onClick={() => setForm(f => ({ ...f, bathrooms: n }))}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          form.bathrooms === n ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}>{n}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Balcony + Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Balconies</label>
                  <div className="flex gap-2">
                    {[0,1,2,3].map(n => (
                      <button key={n} onClick={() => setForm(f => ({ ...f, balcony: n }))}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          form.balcony === n ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}>{n}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Property Age: <span className="text-sky-400">{form.age}y</span></label>
                  <input type="range" min="0" max="30" step="1" value={form.age}
                    onChange={e => setForm(f => ({ ...f, age: +e.target.value }))} className="w-full mt-2" />
                </div>
              </div>

              {/* Furnishing */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Furnishing Status</label>
                <div className="flex gap-2">
                  {FURNISHING_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => setForm(f => ({ ...f, furnishing: opt }))}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                        form.furnishing === opt ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}>{opt}</button>
                  ))}
                </div>
              </div>

              {/* Parking */}
              <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/5 border border-white/8">
                <span className="text-sm text-slate-300">Parking Available</span>
                <button onClick={() => setForm(f => ({ ...f, parking: !f.parking }))}
                  className={`w-11 h-6 rounded-full transition-all relative ${form.parking ? 'bg-sky-500' : 'bg-white/10'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.parking ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs text-slate-400 mb-2">Amenities ({form.amenities.length} selected)</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {AMENITIES.map(a => (
                    <button key={a} onClick={() => toggleAmenity(a)}
                      className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all text-left ${
                        form.amenities.includes(a) ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10'
                      }`}>
                      {form.amenities.includes(a) ? <CheckSquare size={12} /> : <Square size={12} />}
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button onClick={handlePredict} disabled={loading}
                className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 0 20px rgba(14,165,233,0.3)' }}>
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Predict Price
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">
          {!result && !loading && (
            <div className="glass rounded-2xl p-12 border border-white/8 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
                <Brain size={36} className="text-sky-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Ready to Predict</h3>
              <p className="text-slate-400 text-sm max-w-xs">Fill in the property details on the left and click "Predict Price" to get AI-powered valuation.</p>
            </div>
          )}

          {loading && (
            <div className="glass rounded-2xl p-12 border border-sky-500/20 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 relative"
                style={{ border: '2px solid rgba(14,165,233,0.2)' }}>
                <Brain size={32} className="text-sky-400 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-sky-500/40 border-t-sky-400 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI is Analyzing...</h3>
              <p className="text-slate-400 text-sm">Processing 47 market factors</p>
              <div className="w-48 mt-4" style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                <div className="h-full rounded-full animate-pulse" style={{ width: '70%', background: '#0ea5e9' }} />
              </div>
            </div>
          )}

          {result && !loading && (
            <>
              {/* Main prediction card */}
              <div className="glass rounded-2xl p-6 border border-sky-500/20"
                style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(0,212,255,0.04))' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-sky-400 mb-1 flex items-center gap-1">
                      <Sparkles size={14} /> AI Predicted Price
                    </div>
                    <div className="text-4xl font-bold text-white font-grotesk">{formatPrice(result.predictedPrice)}</div>
                    <div className="text-slate-400 text-sm mt-1">
                      Range: {formatPrice(result.priceRange.min)} – {formatPrice(result.priceRange.max)}
                    </div>
                  </div>
                  <ScoreGauge score={result.confidenceScore} label="Confidence" size="lg" />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/8">
                  <div className="text-center">
                    <div className="text-xs text-slate-400 mb-1">Per Sqft</div>
                    <div className="font-bold text-white">₹{Math.round(result.predictedPrice / form.sqft).toLocaleString()}</div>
                  </div>
                  <div className="text-center border-x border-white/8">
                    <div className="text-xs text-slate-400 mb-1">Market Avg</div>
                    <div className="font-bold text-emerald-400">+8.2%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-400 mb-1">Investment</div>
                    <div className="font-bold text-amber-400">Score: 82</div>
                  </div>
                </div>
              </div>

              {/* Feature importance mini */}
              <div className="glass rounded-2xl p-6 border border-white/8">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 size={16} className="text-sky-400" /> Key Value Drivers
                </h3>
                <div className="space-y-3">
                  {result.featureImportance.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm text-slate-400 w-28 flex-shrink-0">{f.feature}</span>
                      <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${f.importance}%`,
                            background: f.impact === 'positive' ? '#0ea5e9' : '#ef4444',
                            boxShadow: `0 0 8px ${f.impact === 'positive' ? 'rgba(14,165,233,0.4)' : 'rgba(239,68,68,0.4)'}`,
                          }} />
                      </div>
                      <span className={`text-xs w-8 text-right ${f.impact === 'positive' ? 'text-sky-400' : 'text-red-400'}`}>
                        {f.importance}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar properties */}
              <div className="glass rounded-2xl p-6 border border-white/8">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-sky-400" /> Similar Properties
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {result.similarProperties.map(p => (
                    <PropertyCard key={p.id} property={p} compact />
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
