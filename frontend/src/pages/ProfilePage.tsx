import { useState, useEffect } from 'react';
import { User, Mail, MapPin, Home, Wallet, Save, Loader2, CheckCircle2, Sparkles } from 'lucide-react'; // <-- ADDED SPARKLES HERE!

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const realUserEmail = localStorage.getItem('user_email') || 'user@example.com';

  const [profile, setProfile] = useState({
    name: 'New User', 
    email: realUserEmail, 
    targetCity: 'Bangalore',
    targetBhk: '2',
    maxBudget: '20000000'
  });

  useEffect(() => {
    const fetchDBProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/profile/${realUserEmail}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.email) {
            setProfile(data);
            localStorage.setItem('user_profile', JSON.stringify(data)); 
          }
        }
      } catch (error) {
        console.error("No existing profile found or DB offline.", error);
      }
    };
    
    fetchDBProfile();
  }, [realUserEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await fetch('http://localhost:8000/api/profile/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      
      localStorage.setItem('user_profile', JSON.stringify(profile));
      window.dispatchEvent(new Event('profileUpdated'));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20 border border-white/10"
             style={{ background: 'linear-gradient(135deg, #0ea5e9, #00d4ff)' }}>
          <User size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white font-grotesk">My Profile</h1>
          <p className="text-slate-400 text-sm">Manage your account and AI search preferences</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass rounded-3xl p-8 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <User size={18} className="text-sky-400" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
                <User size={14} className="text-slate-500" /> Full Name
              </label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
                <Mail size={14} className="text-slate-500" /> Email Address
              </label>
              <input type="email" name="email" value={profile.email} disabled
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-slate-500 outline-none cursor-not-allowed opacity-70" />
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles size={18} className="text-sky-400" /> AI Search Preferences
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
                <MapPin size={14} className="text-slate-500" /> Target City
              </label>
              <select name="targetCity" value={profile.targetCity} onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-500/50">
                {['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
                <Home size={14} className="text-slate-500" /> Preferred BHK
              </label>
              <select name="targetBhk" value={profile.targetBhk} onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-500/50">
                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n.toString()}>{n} BHK</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
                <Wallet size={14} className="text-slate-500" /> Max Budget (₹)
              </label>
              <input type="number" name="maxBudget" value={profile.maxBudget} onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-500/50" />
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 pt-4">
          {saved && (
            <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold animate-fade-in px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <CheckCircle2 size={18} /> Database Updated
            </span>
          )}
          <button type="submit" disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}