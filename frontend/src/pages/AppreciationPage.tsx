import { useState, useEffect } from 'react';
import { Calculator, ArrowRight, Loader2 } from 'lucide-react';
import LineChart from '../components/ui/LineChart';

export default function AppreciationPage() {
  const [city, setCity] = useState('Bangalore');
  const [currentPrice, setCurrentPrice] = useState<number>(10000000);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/market/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_price: currentPrice, city })
      });
      if (response.ok) {
        const data = await response.json();
        setForecast(data);
      }
    } catch (err) {
      console.error("Failed to fetch forecast:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchForecast(); 
  }, []);

  const formatPrice = (p: number) => {
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)}Cr`;
    return `₹${(p / 100000).toFixed(1)}L`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-grotesk">Investment Forecast</h1>
        <p className="text-slate-400 text-sm">6-year appreciation projections driven by live market data.</p>
      </div>

      <div className="glass rounded-3xl p-8 border border-white/10 flex gap-8 flex-col lg:flex-row">
        
        <div className="lg:w-1/3 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white font-grotesk flex items-center gap-2 mb-4">
              <Calculator className="text-sky-400" /> Parameters
            </h2>
            <label className="block text-sm text-slate-400 mb-2">City</label>
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none mb-4 focus:border-sky-500/50 transition-colors"
            >
              {['Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Delhi', 'Chennai'].map(c => <option key={c}>{c}</option>)}
            </select>

            <label className="block text-sm text-slate-400 mb-2">Current Property Value (₹)</label>
            <input 
              type="number" 
              value={currentPrice} 
              onChange={(e) => setCurrentPrice(Number(e.target.value))} 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none mb-6 focus:border-sky-500/50 transition-colors" 
            />
            
            <button 
              onClick={fetchForecast} 
              disabled={loading} 
              className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all shadow-[0_0_15px_rgba(14,165,233,0.4)] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Update Forecast'} 
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
        </div>

        <div className="lg:w-2/3">
          {forecast ? (
            <div className="glass bg-black/10 rounded-2xl p-6 border border-white/5 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">6-Year Trajectory</h3>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-1 bg-emerald-400 rounded"></span> Optimistic</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-1 bg-sky-400 rounded"></span> Moderate</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-1 bg-purple-500 rounded"></span> Conservative</span>
                </div>
              </div>
              
              <div className="flex-1">
                <LineChart
                  series={[
                    { label: 'Optimistic', data: forecast.optimistic, color: '#10b981' },
                    { label: 'Moderate', data: forecast.moderate, color: '#0ea5e9' },
                    { label: 'Conservative', data: forecast.conservative, color: '#8b5cf6' }
                  ]}
                  labels={forecast.years}
                  height={300}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl border border-white/5 bg-slate-500/10 text-center">
                  <div className="text-slate-400 text-xs mb-1">Conservative ROI</div>
                  <div className="text-white font-bold text-lg">{formatPrice(forecast.conservative[6])}</div>
                  <div className="text-xs text-emerald-400 mt-1">+{((forecast.conservative[6] - currentPrice) / currentPrice * 100).toFixed(1)}%</div>
                </div>
                <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/10 text-center">
                  <div className="text-sky-400 text-xs mb-1">Expected ROI</div>
                  <div className="text-white font-bold text-lg">{formatPrice(forecast.moderate[6])}</div>
                  <div className="text-xs text-emerald-400 mt-1">+{((forecast.moderate[6] - currentPrice) / currentPrice * 100).toFixed(1)}%</div>
                </div>
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-center">
                  <div className="text-emerald-400 text-xs mb-1">Optimistic ROI</div>
                  <div className="text-white font-bold text-lg">{formatPrice(forecast.optimistic[6])}</div>
                  <div className="text-xs text-emerald-400 mt-1">+{((forecast.optimistic[6] - currentPrice) / currentPrice * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-sky-400 w-10 h-10" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}