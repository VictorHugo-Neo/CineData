import { useState } from 'react';
import { getRecommendations } from './api';
import type { Movie } from './api';
import { 
  Search, Film, Star, Trophy, Users, 
  Calendar, Clapperboard, TrendingUp, Filter 
} from 'lucide-react';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await getRecommendations(genre);
      setMovies(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-red-500/30">
      {/* Navegação Profissional */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-red-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Clapperboard size={22} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">CineData</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="hover:text-white transition-colors">Minha Lista</a>
            <a href="#" className="hover:text-white transition-colors">Arquitetura</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Seção de Filtros (Responsiva) */}
        <section className="mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              O que vamos <span className="text-red-600">descobrir</span> hoje?
            </h2>
            <p className="text-zinc-400 text-lg mb-8">
              Filtre dados reais do IMDB processados por algoritmos em Python.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-zinc-800">
                <Filter size={18} className="text-zinc-500" />
                <select 
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="bg-transparent w-full outline-none text-sm font-medium appearance-none cursor-pointer"
                >
                  <option value="">Gêneros Disponíveis</option>
                  <option value="Action">Ação</option>
                  <option value="Drama">Drama</option>
                  <option value="Sci-Fi">Ficção Científica</option>
                </select>
              </div>
              <button 
                onClick={handleSearch}
                className="bg-red-600 hover:bg-red-700 active:scale-95 transition-all px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Search size={18} />
                Gerar Insight
              </button>
            </div>
          </div>
        </section>

        {/* Grid de Recomendações Profissional */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <article key={movie.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:ring-2 hover:ring-red-600/50 transition-all shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-yellow-500 text-black px-2 py-1 rounded text-[10px] font-black">
                    IMDB {movie.rating_imdb}
                  </div>
                  {movie.oscar > 0 && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Trophy size={14} />
                      <span className="text-[10px] font-bold">{movie.oscar}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">
                  {movie.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-zinc-500 text-xs">
                    <Calendar size={14} />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500 text-xs">
                    <Star size={14} className="text-yellow-500" />
                    <span className="truncate">{movie.director}</span>
                  </div>
                </div>
              </div>

              {/* Data Science Badge */}
              <div className="bg-zinc-950/80 px-6 py-4 flex items-center justify-between border-t border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-medium tracking-widest uppercase">AI Score</span>
                </div>
                <span className="text-red-500 font-mono font-bold text-sm">
                  {movie.score_ranking.toFixed(2)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}