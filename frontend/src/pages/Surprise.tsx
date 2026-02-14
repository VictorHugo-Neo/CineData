import { useState, useEffect } from 'react';
import { Dices, Film, Star, Trophy, RefreshCw } from 'lucide-react';

export default function Surprise() {
  const [movie, setMovie] = useState<any>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/genres').then(res => res.json()).then(setGenres);
  }, []);

  const drawMovie = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/random-movie?genero=${selectedGenre}`);
      const data = await res.json();
      setMovie(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter">ROLETA <span className="text-red-600">CINE</span></h2>
        <p className="text-zinc-500">Não sabe o que assistir? Deixe o CineData escolher por você.</p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <select 
          value={selectedGenre} 
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl w-full max-w-xs font-bold text-center appearance-none"
        >
          <option value="">Qualquer Gênero</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <button 
          onClick={drawMovie}
          disabled={loading}
          className="group bg-red-600 hover:bg-red-700 p-8 rounded-full transition-all active:scale-90 shadow-2xl shadow-red-600/20"
        >
          <Dices size={48} className={loading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'} />
        </button>
      </div>

      {movie && !loading && (
        <div className="bg-zinc-900/50 border border-red-600/30 rounded-3xl p-10 animate-in zoom-in duration-500">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-6">
              <span className="text-red-600 font-mono text-sm tracking-widest font-bold uppercase">Sugestão de Hoje</span>
              <h3 className="text-4xl font-bold leading-tight">{movie.title}</h3>
              <div className="flex flex-wrap gap-4 text-zinc-400 text-sm">
                <span className="flex items-center gap-2"><Star className="text-yellow-500" size={16} /> {movie.rating_imdb}</span>
                <span className="flex items-center gap-2 font-bold uppercase tracking-tighter"> {movie.genre}</span>
              </div>
              <p className="text-zinc-500 leading-relaxed italic border-l-2 border-red-600 pl-4">
                Dirigido por {movie.director}, este clássico de {movie.year} obteve {movie.oscar} Oscars.
              </p>
            </div>
            <button onClick={drawMovie} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
              <RefreshCw size={16} /> Tentar outro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}