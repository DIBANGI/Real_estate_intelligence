import { User, Wifi, LogOut } from 'lucide-react';
import { Page } from '../../types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onNavigate?: (page: Page) => void;
  onLogout?: () => void; // <-- NEW: Added logout prop
}

export default function Header({ title, subtitle, onNavigate, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 px-6 py-4 border-b border-white/8 flex items-center justify-between"
      style={{ background: 'rgba(2,8,24,0.9)', backdropFilter: 'blur(20px)' }}>
      <div>
        <h1 className="text-xl font-bold text-white font-grotesk">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-emerald-400 border border-emerald-500/20">
          <Wifi size={12} className="animate-pulse" />
          <span className="hidden sm:inline">Live Data</span>
        </div>

        {/* User Profile Button */}
        <button 
          onClick={() => onNavigate && onNavigate('profile')}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 shadow-lg border border-white/10"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #00d4ff)' }}
        >
          <User size={18} />
        </button>

        {/* NEW: Official Logout Button */}
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-slate-300 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all border border-white/10"
        >
          <LogOut size={16} />
          <span className="text-sm font-medium hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}