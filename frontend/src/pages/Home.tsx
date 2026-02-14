import { useState, useEffect } from 'react';
import { getRecommendations } from '../api';
import type { Movie } from '../api';
import { Search, Star, Trophy, Calendar, Filter, Film } from 'lucide-react';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(false);

  // Carrega os gêneros únicos extraídos do CSV real
  useEffect(() => {
    fetch('http://localhost:3000/genres')
      .then(res => res.json())
      .then(data => setGenres(data))
      .catch(err => console.error("Erro ao carregar gêneros:", err));
    
    // Busca inicial para não deixar a tela vazia
    handleSearch();
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
    <div className="space-y-12">
      {/* Hero Section e Filtros */}
      <section className="relative py-12">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-black tracking-tighter mb-4 italic">
            EXPLORE A <span className="text-red-600">SÉTIMA ARTE</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Análise preditiva e curadoria baseada em dados reais do IMDB.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 p-3 bg-zinc-900/40 border border-zinc-800 rounded-2xl backdrop-blur-sm">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Filter size={20} className="text-red-600" />
              <select 
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-transparent w-full outline-none text-sm font-bold h-12 appearance-none cursor-pointer"
              >
                <option value="">Todos os Gêneros</option>
                {genres.map(g => (
                  <option key={g} value={g} className="bg-zinc-900">{g}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleSearch}
              className="bg-red-600 hover:bg-red-700 active:scale-95 transition-all px-8 h-12 rounded-xl font-black flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
            >
              <Search size={18} />
              FILTRAR
            </button>
          </div>
        </div>
      </section>

      {/* Grid de Cards */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {movies.map((movie) => (
            <article key={movie.id} className="group bg-zinc-900/20 border border-zinc-800/50 rounded-3xl overflow-hidden hover:bg-zinc-900/40 hover:border-red-600/50 transition-all duration-500 shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-[10px] font-black">
                    IMDB {movie.rating_imdb}
                  </span>
                  {movie.oscar > 0 && (
                    <div className="flex items-center gap-1 text-yellow-500 animate-pulse">
                      <Trophy size={14} />
                      <span className="text-[10px] font-bold">{movie.oscar}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-tight min-h-[3rem]">
                  {movie.title}
                </h3>

                <div className="space-y-2 text-zinc-500 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-red-600" />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-red-600" />
                    <span className="truncate">{movie.director}</span>
                  </div>
                </div>
              </div>

              {/* Data Badge */}
              <div className="px-6 py-4 bg-black/40 border-t border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-2 opacity-50">
                  <Film size={12} />
                  <span className="text-[10px] tracking-widest uppercase">Rank Score</span>
                </div>
                <span className="text-red-500 font-mono font-bold text-sm">
                  {movie.score_ranking.toFixed(2)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}