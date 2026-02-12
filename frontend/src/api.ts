import axios from 'axios';

// Interface para garantir tipagem forte no React
export interface Movie {
  id_titulo: string;
  titulo_original: string;
  ano_lancamento: number;
  genero: string;
  nota_media: number;
  genero_principal: string;
  score_ranking: number;
}

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getRecommendations = async (genre: string): Promise<Movie[]> => {
  const response = await api.get(`/recommendations?genero=${genre}`);
  return response.data;
};