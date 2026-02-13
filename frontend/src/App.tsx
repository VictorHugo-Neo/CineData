import { useState, useEffect } from 'react';
import { getRecommendations, type Movie } from './api';
import { 
  Search, Film, Star, Trophy, Users, 
  Calendar, Clapperboard, TrendingUp, Filter, Tag 
} from 'lucide-react';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]); // Lista dinâmica de gêneros
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(false);

  // Carrega todos os gêneros únicos do CSV processado ao iniciar
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:3000/genres');
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("Erro ao carregar gêneros dinâmicos:", error);
      }
    };
    fetchGenres();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await getRecommendations(selectedGenre);
      setMovies(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-red-500/30">
      {/* Navegação */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-red-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Clapperboard size={22} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">CineData</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
            <span className="text-white border-b-2 border-red-600 pb-1">Dashboard</span>
            <span className="hover:text-white transition-colors cursor-pointer">Explorar CSV</span>
            <span className="hover:text-white transition-colors cursor-pointer">Sobre o Projeto</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Filtros Dinâmicos */}
        <section className="mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              O que vamos <span className="text-red-600">descobrir</span> hoje?
            </h2>
            <p className="text-zinc-400 text-lg mb-8">
              Analise {movies.length > 0 ? movies.length : 'centenas de'} filmes do IMDB filtrados por multicategorias.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-zinc-800">
                <Filter size={18} className="text-zinc-500" />
                <select 
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="bg-transparent w-full outline-none text-sm font-medium appearance-none cursor-pointer text-zinc-200"
                >
                  <option value="" className="bg-zinc-900">Todos os Gêneros Disponíveis</option>
                  {genres.map((g) => (
                    <option key={g} value={g} className="bg-zinc-900">
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-50 transition-all px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Search size={18} />}
                Gerar Insight
              </button>
            </div>
          </div>
        </section>

        {/* Grid Profissional */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <article key={movie.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:ring-2 hover:ring-red-600/50 transition-all shadow-xl flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-yellow-500 text-black px-2 py-1 rounded text-[10px] font-black">
                    IMDB {movie.rating_imdb}
                  </div>
                  {movie.oscar > 0 && (
                    <div className="flex items-center gap-1 text-yellow-500 animate-pulse">
                      <Trophy size={14} />
                      <span className="text-[10px] font-bold">{movie.oscar}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">
                  {movie.title}
                </h3>

                {/* Exibição de Múltiplos Gêneros */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre?.split(',').map((g) => (
                    <span key={g.trim()} className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700">
                      {g.trim()}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-zinc-500 text-xs font-medium">
                    <Calendar size={14} className="text-zinc-600" />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500 text-xs font-medium">
                    <Film size={14} className="text-zinc-600" />
                    <span className="truncate">{movie.director}</span>
                  </div>
                </div>
              </div>

              {/* Data Science Footer */}
              <div className="bg-black/40 px-6 py-4 flex items-center justify-between border-t border-zinc-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-zinc-500">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Rank Score</span>
                </div>
                <span className="text-red-500 font-mono font-bold text-sm">
                  {movie.score_ranking?.toFixed(2)}
                </span>
              </div>
            </article>
          ))}
        </div>
        
        {!loading && movies.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl">
            <Film size={48} className="mx-auto text-zinc-800 mb-4" />
            <p className="text-zinc-500 font-medium">Selecione um gênero para carregar os dados do CSV.</p>
          </div>
        )}
      </main>
    </div>
  );
}