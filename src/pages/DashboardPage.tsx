import { TrendingUp, TrendingDown, BarChart3, Home, Activity, DollarSign } from 'lucide-react';
import { marketInsights, trendData, featuredProperties } from '../data/mockData';
import StatCard from '../components/ui/StatCard';
import LineChart from '../components/ui/LineChart';
import BarChart from '../components/ui/BarChart';

const demandData = [
  { label: 'Mumbai', value: 94, color: 'linear-gradient(to top, #ef4444, #f87171)' },
  { label: 'Bangalore', value: 92, color: 'linear-gradient(to top, #f97316, #fb923c)' },
  { label: 'Hyderabad', value: 89, color: 'linear-gradient(to top, #eab308, #facc15)' },
  { label: 'Delhi', value: 85, color: 'linear-gradient(to top, #22c55e, #4ade80)' },
  { label: 'Pune', value: 86, color: 'linear-gradient(to top, #0ea5e9, #38bdf8)' },
  { label: 'Chennai', value: 81, color: 'linear-gradient(to top, #a855f7, #c084fc)' },
];

const transactionData = [
  { label: 'Jan', value: 1820 }, { label: 'Feb', value: 1950 }, { label: 'Mar', value: 2100 },
  { label: 'Apr', value: 2280 }, { label: 'May', value: 2150 }, { label: 'Jun', value: 2400 },
  { label: 'Jul', value: 2600 }, { label: 'Aug', value: 2450 }, { label: 'Sep', value: 2700 },
  { label: 'Oct', value: 2900 }, { label: 'Nov', value: 2750 }, { label: 'Dec', value: 3100 },
];

const topAreas = [
  { area: 'Bandra, Mumbai', roi: 18.4, transactions: 342, trend: 'up' },
  { area: 'Koramangala, Bangalore', roi: 16.2, transactions: 287, trend: 'up' },
  { area: 'Jubilee Hills, Hyderabad', roi: 21.3, transactions: 198, trend: 'up' },
  { area: 'Koregaon Park, Pune', roi: 14.7, transactions: 156, trend: 'up' },
  { area: 'South Delhi', roi: 11.2, transactions: 421, trend: 'down' },
  { area: 'Powai, Mumbai', roi: 15.8, transactions: 264, trend: 'up' },
];

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(14,165,233,0.15)' }}>
          <BarChart3 size={20} className="text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white font-grotesk">Analytics Dashboard</h1>
          <p className="text-slate-400 text-sm">Real-time market intelligence and trends</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-emerald-500/20 text-emerald-400 text-xs">
          <Activity size={12} className="animate-pulse" /> Live · Updated 2m ago
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Listings" value="1,24,832" change={8.4} icon={<Home size={20} className="text-sky-400" />} />
        <StatCard title="Avg Market Price" value="₹9,200/sqft" change={5.2} icon={<DollarSign size={20} className="text-emerald-400" />} iconBg="rgba(16,185,129,0.15)" />
        <StatCard title="Transactions This Month" value="3,100" change={12.8} icon={<Activity size={20} className="text-amber-400" />} iconBg="rgba(245,158,11,0.15)" />
        <StatCard title="Avg Days on Market" value="18 days" change={-11.2} icon={<TrendingDown size={20} className="text-red-400" />} iconBg="rgba(239,68,68,0.15)" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Multi-city price trend */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Multi-City Price Trend 2024</h2>
            <div className="flex gap-3 text-xs">
              {[
                { label: 'Mumbai', color: '#ef4444' },
                { label: 'Bangalore', color: '#0ea5e9' },
                { label: 'Hyderabad', color: '#00ff88' },
                { label: 'Delhi', color: '#ffb700' },
              ].map(s => (
                <span key={s.label} className="flex items-center gap-1">
                  <span className="w-3 h-0.5 inline-block rounded" style={{ background: s.color }} />
                  <span className="text-slate-400">{s.label}</span>
                </span>
              ))}
            </div>
          </div>
          <LineChart
            series={[
              { label: 'Mumbai', data: trendData.mumbai, color: '#ef4444' },
              { label: 'Bangalore', data: trendData.bangalore, color: '#0ea5e9' },
              { label: 'Hyderabad', data: trendData.hyderabad, color: '#00ff88' },
              { label: 'Delhi', data: trendData.delhi, color: '#ffb700' },
            ]}
            labels={trendData.months}
            height={220}
          />
        </div>

        {/* Demand scores */}
        <div className="glass rounded-2xl p-6 border border-white/8">
          <h2 className="font-semibold text-white mb-4">City Demand Score</h2>
          <BarChart data={demandData} maxValue={100} height={220} showValues={false} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly transactions */}
        <div className="glass rounded-2xl p-6 border border-white/8">
          <h2 className="font-semibold text-white mb-4">Monthly Transactions 2024</h2>
          <BarChart data={transactionData} height={200} />
        </div>

        {/* Market insights table */}
        <div className="glass rounded-2xl p-6 border border-white/8">
          <h2 className="font-semibold text-white mb-4">City Market Overview</h2>
          <div className="space-y-3">
            {marketInsights.map((m, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `hsl(${i * 50}, 70%, 40%)` }}>
                  {m.city.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{m.city}</div>
                  <div className="text-xs text-slate-400">₹{m.avgPrice.toLocaleString()}/sqft</div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  m.priceChange > 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                }`}>
                  {m.priceChange > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  +{m.priceChange}%
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Invest.</div>
                  <div className="text-xs font-bold text-amber-400">{m.investmentScore}/100</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top investment areas */}
      <div className="glass rounded-2xl p-6 border border-white/8">
        <h2 className="font-semibold text-white mb-5">Top Investment Areas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left text-xs text-slate-400 pb-3 font-medium">#</th>
                <th className="text-left text-xs text-slate-400 pb-3 font-medium">Area</th>
                <th className="text-right text-xs text-slate-400 pb-3 font-medium">ROI</th>
                <th className="text-right text-xs text-slate-400 pb-3 font-medium">Transactions</th>
                <th className="text-right text-xs text-slate-400 pb-3 font-medium">Trend</th>
                <th className="text-right text-xs text-slate-400 pb-3 font-medium">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topAreas.map((a, i) => (
                <tr key={i} className="hover:bg-white/3 transition-colors">
                  <td className="py-3 text-slate-500 font-medium">{i + 1}</td>
                  <td className="py-3 text-white font-medium">{a.area}</td>
                  <td className="py-3 text-right text-emerald-400 font-bold">+{a.roi}%</td>
                  <td className="py-3 text-right text-slate-400">{a.transactions.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    {a.trend === 'up'
                      ? <TrendingUp size={14} className="text-emerald-400 inline" />
                      : <TrendingDown size={14} className="text-red-400 inline" />}
                  </td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88' }}>
                      {Math.round(70 + (a.roi / 25) * 30)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent listings */}
      <div className="glass rounded-2xl p-6 border border-white/8">
        <h2 className="font-semibold text-white mb-5">Recent High-Value Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredProperties.slice(0, 3).map(p => (
            <div key={p.id} className="flex gap-3 p-3 rounded-xl border border-white/8 hover:border-sky-500/30 transition-all cursor-pointer">
              <img src={p.image} alt={p.title} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{p.title}</div>
                <div className="text-xs text-slate-400 truncate">{p.location}, {p.city}</div>
                <div className="text-sm font-bold text-sky-400 mt-0.5">
                  {p.price >= 10000000 ? `₹${(p.price / 10000000).toFixed(1)}Cr` : `₹${(p.price / 100000).toFixed(0)}L`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
