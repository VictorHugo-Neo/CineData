import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173', // Origem do seu Vite
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Função auxiliar para lidar com BigInt no JSON
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};
app.get('/analytics', async (req: Request, res: Response) => {
  const { dimension, metric } = req.query; // ex: dimension=genre, metric=oscar

  try {
    const allMovies = await prisma.movies.findMany();
    
    // Processamento de Dados em Memória (ideal para datasets de médio porte)
    const stats: Record<string, number> = {};

    allMovies.forEach(movie => {
      // Lidando com categorias múltiplas (ex: "Action, Sci-Fi")
      const keys = dimension === 'genre' 
        ? (movie.genre?.split(', ') || ['N/A']) 
        : [String((movie as any)[dimension as string] || 'Desconhecido')];

      keys.forEach(key => {
        const val = Number(movie[metric as keyof typeof movie] || 0);
        
        if (metric === 'count') {
          stats[key] = (stats[key] || 0) + 1;
        } else {
          stats[key] = (stats[key] || 0) + val;
        }
      });
    });

    // Formata para o Recharts e ordena pelos maiores valores
    const chartData = Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 para não poluir o gráfico

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar estatísticas." });
  }
});
app.get('/genres', async (req, res) => {
  try {
    const movies = await prisma.movies.findMany({ select: { genre: true } });
    const allGenres = [...new Set(movies.flatMap(m => m.genre?.split(', ') || []))].sort();
    res.json(allGenres);
  } catch (error) {
    res.status(500).json({ error: "Erro ao carregar gêneros" });
  }
});

app.get('/recommendations', async (req: Request, res: Response) => {
  try {
    const { genero } = req.query;

    const movies = await prisma.movies.findMany({
      where: {
        genre: genero ? {
          contains: String(genero), // Busca o gênero dentro da string completa
          mode: 'insensitive'      // Ignora maiúsculas/minúsculas
        } : undefined,
      },
      orderBy: {
        score_ranking: 'desc',
      },
      take: 50, // Aumentado para mostrar mais resultados do CSV real
    });

    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados." });
  }
});


app.listen(port, () => {
  console.log(`API CineData rodando na porta ${port}`);
});