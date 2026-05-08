import { Bell, Search, User, Wifi } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 px-6 py-4 border-b border-white/8 flex items-center justify-between"
      style={{ background: 'rgba(2,8,24,0.9)', backdropFilter: 'blur(20px)' }}>
      <div>
        <h1 className="text-xl font-bold text-white font-grotesk">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-emerald-400 border border-emerald-500/20">
          <Wifi size={12} className="animate-pulse" />
          <span>Live Data</span>
        </div>

        {/* Search */}
        <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/8">
          <Search size={16} />
        </button>

        {/* Notifications */}
        <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/8 relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full" />
        </button>

        {/* User */}
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-colors"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #00d4ff)' }}>
          <User size={16} />
        </button>
      </div>
    </header>
  );
}
