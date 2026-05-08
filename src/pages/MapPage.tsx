import { useState } from 'react';
import { Map, Filter, Search, MapPin, BedDouble, Square, ZoomIn, ZoomOut, Home } from 'lucide-react';
import { featuredProperties } from '../data/mockData';
import { Property } from '../types';

const formatPrice = (p: number) => {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)}Cr`;
  return `₹${(p / 100000).toFixed(0)}L`;
};

const heatmapAreas = [
  { id: 1, label: 'Bandra', x: 22, y: 35, intensity: 0.95, city: 'Mumbai', price: 24000 },
  { id: 2, label: 'Andheri', x: 25, y: 25, intensity: 0.7, city: 'Mumbai', price: 16000 },
  { id: 3, label: 'Worli', x: 18, y: 42, intensity: 0.9, city: 'Mumbai', price: 28000 },
  { id: 4, label: 'Koramangala', x: 55, y: 38, intensity: 0.85, city: 'Bangalore', price: 12000 },
  { id: 5, label: 'Whitefield', x: 65, y: 30, intensity: 0.65, city: 'Bangalore', price: 7800 },
  { id: 6, label: 'Indiranagar', x: 58, y: 35, intensity: 0.75, city: 'Bangalore', price: 10500 },
  { id: 7, label: 'Jubilee Hills', x: 72, y: 55, intensity: 0.88, city: 'Hyderabad', price: 13000 },
  { id: 8, label: 'Hitech City', x: 68, y: 50, intensity: 0.78, city: 'Hyderabad', price: 9200 },
  { id: 9, label: 'Banjara Hills', x: 75, y: 58, intensity: 0.82, city: 'Hyderabad', price: 11500 },
  { id: 10, label: 'South Delhi', x: 40, y: 15, intensity: 0.92, city: 'Delhi', price: 18000 },
  { id: 11, label: 'Dwarka', x: 35, y: 18, intensity: 0.6, city: 'Delhi', price: 9000 },
  { id: 12, label: 'Koregaon Park', x: 48, y: 62, intensity: 0.8, city: 'Pune', price: 11000 },
];

const getHeatColor = (intensity: number) => {
  if (intensity >= 0.85) return 'rgba(239,68,68,0.8)';
  if (intensity >= 0.7) return 'rgba(251,146,60,0.8)';
  if (intensity >= 0.55) return 'rgba(250,204,21,0.7)';
  return 'rgba(34,197,94,0.7)';
};

export default function MapPage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredArea, setHoveredArea] = useState<typeof heatmapAreas[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'For Sale' | 'For Rent'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [zoom, setZoom] = useState(1);

  const filtered = featuredProperties.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (typeFilter !== 'All' && p.type !== typeFilter) return false;
    return true;
  });

  const propertyPositions = [
    { id: '1', x: 22, y: 35 }, { id: '2', x: 55, y: 38 }, { id: '3', x: 72, y: 55 },
    { id: '4', x: 48, y: 62 }, { id: '5', x: 40, y: 15 }, { id: '6', x: 18, y: 42 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)' }}>
          <Map size={20} className="text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white font-grotesk">Interactive Property Map</h1>
          <p className="text-slate-400 text-sm">Explore properties and market heatmap</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 glass rounded-xl border border-white/8">
          <Search size={14} className="text-slate-400" />
          <input type="text" placeholder="Search area or city..." className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-40" />
        </div>
        <div className="flex gap-2">
          {['all', 'For Sale', 'For Rent'].map(f => (
            <button key={f} onClick={() => setFilter(f as typeof filter)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                filter === f ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' : 'glass border-white/8 text-slate-400 hover:text-white'
              }`}>{f === 'all' ? 'All' : f}</button>
          ))}
        </div>
        <div className="flex gap-2">
          {['All', 'Apartment', 'Villa', 'Penthouse', 'Studio'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                typeFilter === t ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' : 'glass border-white/8 text-slate-400 hover:text-white'
              }`}>{t}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              showHeatmap ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'glass border-white/8 text-slate-400'
            }`}>
            <Filter size={12} /> Heatmap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl border border-white/8 overflow-hidden relative" style={{ height: '520px' }}>
            {/* Simulated map */}
            <div className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #0a1628 100%)',
                backgroundImage: `
                  linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}>

              {/* Decorative roads */}
              <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
                <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#0ea5e9" strokeWidth="1" />
                <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#0ea5e9" strokeWidth="1" />
                <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#0ea5e9" strokeWidth="1" />
                <line x1="60%" y1="0" x2="60%" y2="100%" stroke="#0ea5e9" strokeWidth="1" />
                <line x1="0" y1="0" x2="100%" y2="100%" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="5,10" />
                <line x1="100%" y1="0" x2="0" y2="100%" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="5,10" />
              </svg>

              {/* Heatmap circles */}
              {showHeatmap && heatmapAreas.map(area => (
                <div
                  key={area.id}
                  className="absolute rounded-full cursor-pointer transition-all duration-200"
                  style={{
                    left: `${area.x}%`,
                    top: `${area.y}%`,
                    width: `${area.intensity * 80 + 40}px`,
                    height: `${area.intensity * 80 + 40}px`,
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, ${getHeatColor(area.intensity)}, transparent 70%)`,
                    filter: 'blur(8px)',
                  }}
                  onMouseEnter={() => setHoveredArea(area)}
                  onMouseLeave={() => setHoveredArea(null)}
                />
              ))}

              {/* Area labels */}
              {heatmapAreas.map(area => (
                <div
                  key={area.id}
                  className="absolute text-center cursor-pointer"
                  style={{ left: `${area.x}%`, top: `${area.y}%`, transform: 'translate(-50%, -50%)', zIndex: 10 }}
                  onMouseEnter={() => setHoveredArea(area)}
                  onMouseLeave={() => setHoveredArea(null)}
                >
                  <div className="text-xs font-medium text-white/80 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{ fontSize: '10px' }}>{area.label}</div>
                </div>
              ))}

              {/* Property markers */}
              {filtered.map((property, i) => {
                const pos = propertyPositions.find(p => p.id === property.id);
                if (!pos) return null;
                return (
                  <button
                    key={property.id}
                    onClick={() => setSelectedProperty(selectedProperty?.id === property.id ? null : property)}
                    className="absolute z-20 transition-all hover:scale-110"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -100%)' }}
                  >
                    <div className={`px-2 py-1 rounded-lg text-xs font-bold shadow-lg transition-all ${
                      selectedProperty?.id === property.id
                        ? 'bg-sky-500 text-white scale-110'
                        : 'bg-slate-900/90 text-sky-400 hover:bg-sky-500 hover:text-white'
                    }`}
                      style={{ border: '1px solid rgba(14,165,233,0.5)', backdropFilter: 'blur(10px)' }}>
                      {formatPrice(property.price)}
                    </div>
                    <div className="w-2 h-2 bg-sky-400 rounded-full mx-auto shadow-lg"
                      style={{ boxShadow: '0 0 8px rgba(14,165,233,0.8)' }} />
                  </button>
                );
              })}

              {/* Hovered area tooltip */}
              {hoveredArea && (
                <div className="absolute z-30 px-3 py-2 rounded-xl border border-sky-500/30 text-xs pointer-events-none"
                  style={{
                    left: `${hoveredArea.x}%`, top: `${hoveredArea.y - 12}%`,
                    transform: 'translate(-50%, -100%)',
                    background: 'rgba(2,8,24,0.95)', backdropFilter: 'blur(10px)',
                  }}>
                  <div className="font-bold text-white mb-1">{hoveredArea.label}, {hoveredArea.city}</div>
                  <div className="text-sky-400">₹{hoveredArea.price.toLocaleString()}/sqft</div>
                  <div className={`mt-1 text-xs ${hoveredArea.intensity >= 0.8 ? 'text-red-400' : hoveredArea.intensity >= 0.65 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {hoveredArea.intensity >= 0.8 ? 'High Price Zone' : hoveredArea.intensity >= 0.65 ? 'Mid Price Zone' : 'Affordable Zone'}
                  </div>
                </div>
              )}

              {/* Zoom controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
                <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
                  className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <ZoomIn size={14} />
                </button>
                <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))}
                  className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <ZoomOut size={14} />
                </button>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 glass rounded-xl p-3 border border-white/8 z-20">
                <div className="text-xs text-slate-400 mb-2 font-medium">Price Heatmap</div>
                <div className="space-y-1.5">
                  {[
                    { color: '#ef4444', label: 'Premium (>₹20k/sqft)' },
                    { color: '#fb923c', label: 'High (₹15-20k)' },
                    { color: '#facc15', label: 'Mid (₹10-15k)' },
                    { color: '#22c55e', label: 'Affordable (<₹10k)' },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="w-3 h-3 rounded-full" style={{ background: l.color, opacity: 0.8 }} />
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* City labels */}
              <div className="absolute top-4 left-4 text-xs text-slate-500 space-y-1">
                <div>◦ Mumbai (West)</div>
                <div className="ml-8">◦ Delhi (North)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Property list */}
        <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '520px' }}>
          <div className="text-sm text-slate-400 mb-2">{filtered.length} properties found</div>
          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedProperty(selectedProperty?.id === p.id ? null : p)}
              className={`glass rounded-2xl p-4 border cursor-pointer transition-all card-hover ${
                selectedProperty?.id === p.id ? 'border-sky-500/40 bg-sky-500/5' : 'border-white/8'
              }`}
            >
              <div className="flex gap-3">
                <img src={p.image} alt={p.title} className="w-20 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{p.title}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin size={10} /> {p.location}, {p.city}
                  </div>
                  <div className="text-sm font-bold text-sky-400 mt-1">{formatPrice(p.price)}</div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-0.5"><BedDouble size={10} /> {p.bhk}BHK</span>
                    <span className="flex items-center gap-0.5"><Square size={10} /> {p.sqft}sqft</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected property detail */}
      {selectedProperty && (
        <div className="mt-5 glass rounded-2xl p-6 border border-sky-500/20 animate-fade-in">
          <div className="flex items-start gap-5">
            <img src={selectedProperty.image} alt={selectedProperty.title}
              className="w-36 h-24 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-grotesk">{selectedProperty.title}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                    <MapPin size={12} /> {selectedProperty.location}, {selectedProperty.city}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-sky-400 font-grotesk">{formatPrice(selectedProperty.price)}</div>
                  <div className="text-xs text-slate-400">₹{Math.round(selectedProperty.price / selectedProperty.sqft).toLocaleString()}/sqft</div>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-sm text-slate-400">
                <span className="flex items-center gap-1"><BedDouble size={13} /> {selectedProperty.bhk} BHK</span>
                <span className="flex items-center gap-1"><Home size={13} /> {selectedProperty.sqft} sqft</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-sky-500/15 text-sky-400">{selectedProperty.status}</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-slate-400">{selectedProperty.furnishing}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedProperty.amenities.slice(0, 5).map(a => (
                  <span key={a} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/8">{a}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
