import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Map as MapIcon, Search, MapPin, BedDouble, Square, Filter } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function MapPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [cityFilter, setCityFilter] = useState('All');
  const [activeProperty, setActiveProperty] = useState<any | null>(null);

  useEffect(() => {
    // Fetch 200 real properties to plot on the map
    const url = cityFilter === 'All' 
      ? 'http://localhost:8000/api/properties/?limit=200' 
      : `http://localhost:8000/api/properties/?city=${cityFilter}&limit=200`;

    fetch(url)
      .then(res => res.json())
      .then(data => setProperties(data))
      .catch(err => console.error("Error fetching map properties:", err));
  }, [cityFilter]);

  const formatPrice = (p: number) => {
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)}Cr`;
    return `₹${(p / 100000).toFixed(1)}L`;
  };

  // Center of India
  const defaultCenter: [number, number] = [20.5937, 78.9629];

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-500/15">
            <MapIcon size={20} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-grotesk">Interactive Property Map</h1>
            <p className="text-slate-400 text-sm">Real geographic data from your database</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-slate-400" />
          <select 
            value={cityFilter} 
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-violet-500/50"
          >
            {['All', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="flex-1 glass rounded-3xl border border-white/10 overflow-hidden relative">
        {/* The Real Interactive Map */}
        <MapContainer 
          center={defaultCenter} 
          zoom={5} 
          style={{ height: '100%', width: '100%', zIndex: 10 }}
        >
          {/* Dark Mode Map Tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {properties.map(property => (
            <Marker 
              key={property.id} 
              position={[property.lat, property.lng]} 
              icon={customIcon}
              eventHandlers={{ click: () => setActiveProperty(property) }}
            >
              <Popup className="custom-popup">
                <div className="text-slate-900 w-48">
                  <img src={property.image} alt={property.title} className="w-full h-24 object-cover rounded-lg mb-2" />
                  <h3 className="font-bold text-sm line-clamp-1">{property.title}</h3>
                  <div className="text-violet-600 font-bold my-1">{formatPrice(property.price)}</div>
                  <div className="text-xs text-slate-500 flex justify-between">
                    <span>{property.bhk} BHK</span>
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Selected Property Overlay Overlay */}
        {activeProperty && (
          <div className="absolute bottom-6 left-6 z-[20] w-80 glass bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-2xl animate-slide-up">
            <button onClick={() => setActiveProperty(null)} className="absolute top-2 right-3 text-slate-400 hover:text-white">✕</button>
            <img src={activeProperty.image} alt={activeProperty.title} className="w-full h-32 object-cover rounded-xl mb-3" />
            <h3 className="text-white font-bold">{activeProperty.title}</h3>
            <div className="flex items-center gap-1 text-slate-400 text-xs mt-1 mb-2">
              <MapPin size={12} /> {activeProperty.location}, {activeProperty.city}
            </div>
            <div className="text-xl font-bold text-violet-400">{formatPrice(activeProperty.price)}</div>
            <div className="flex gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-slate-300">
              <span className="flex items-center gap-1"><BedDouble size={14} className="text-slate-400" /> {activeProperty.bhk} BHK</span>
              <span className="flex items-center gap-1"><Square size={14} className="text-slate-400" /> {activeProperty.sqft} sqft</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}