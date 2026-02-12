import { useState } from 'react';
import { getRecommendations } from './api';
import type { Movie } from './api';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await getRecommendations(genre);
      setMovies(data);
    } catch (error) {
      console.error("Erro ao buscar filmes", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
      <h1>🎬 CineData: Recomendador</h1>

      <div style={{ marginBottom: '20px' }}>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{ padding: '10px', marginRight: '10px', borderRadius: '4px' }}
        >
          <option value="">Selecione um Gênero</option>
          <option value="Action">Ação</option>
          <option value="Drama">Drama</option>
          <option value="Crime">Crime</option>
          <option value="Adventure">Aventura</option>
        </select>

        <button onClick={handleSearch} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Buscar Recomendações
        </button>
      </div>

      {loading && <p>Carregando...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {movies.map(movie => (
          <div key={movie.id} style={{
            border: '1px solid #333',
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: '#1e1e1e',
            transition: 'transform 0.2s'
          }}>
            <h3 style={{ color: '#e50914', marginBottom: '10px' }}>{movie.title}</h3>
            <p><strong>📅 Ano:</strong> {movie.year}</p>
            <p><strong>🎬 Diretor:</strong> {movie.director}</p>
            <p><strong>⭐ Nota:</strong> {movie.rating_imdb}</p>
            {movie.oscar > 0 && (
              <p style={{ color: '#ffd700' }}><strong>🏆 Oscars:</strong> {movie.oscar}</p>
            )}
            <p style={{ fontSize: '0.9rem', color: '#aaa' }}><strong>👥 Elenco:</strong> {movie.star}</p>
            <div style={{ marginTop: '10px', fontSize: '0.8rem', background: '#333', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
              Score: {movie.score_ranking.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;