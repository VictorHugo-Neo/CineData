import axios from 'axios';

export interface Movie {
  id: string;
  title: string;
  year: number;
  rating_imdb: number;
  director: string;
  star: string;
  genre: string;
  oscar: number;
  score_ranking: number;
}

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getRecommendations = async (genre: string): Promise<Movie[]> => {
  const response = await api.get(`/recommendations?genero=${genre}`);
  return response.data;
};