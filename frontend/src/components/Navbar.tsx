import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Film, Clapperboard } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-red-500' : 'text-zinc-400';

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/50 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Clapperboard className="text-red-600 group-hover:rotate-12 transition-transform" />
          <span className="text-xl font-black uppercase tracking-tighter">CineData</span>
        </Link>
        
        <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
          <Link to="/" className={`${isActive('/')} hover:text-white transition-colors flex items-center gap-2`}>
            <Film size={18} /> Filmes
          </Link>
          <Link to="/analytics" className={`${isActive('/analytics')} hover:text-white transition-colors flex items-center gap-2`}>
            <LayoutDashboard size={18} /> Analytics
          </Link>
        </div>
      </div>
    </nav>
  );
}