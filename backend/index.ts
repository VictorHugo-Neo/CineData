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

app.get('/random-movie', async (req: Request, res: Response) => {
  const { genero } = req.query;

  try {
    // Busca os IDs dos filmes que correspondem ao gênero
    const movies = await prisma.movies.findMany({
      where: {
        genre: genero ? { contains: String(genero), mode: 'insensitive' } : undefined,
      },
      select: { id: true }
    });

    if (movies.length === 0) {
      return res.status(404).json({ error: "Nenhum filme encontrado para este gênero." });
    }

    // Sorteia um ID da lista
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomId = movies[randomIndex].id;

    // Busca o filme completo
    const movie = await prisma.movies.findUnique({
      where: { id: randomId }
    });

    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: "Erro ao sortear filme." });
  }
});


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
    console.log("Buscando recomendações para:", genero || "Todos");

    const movies = await prisma.movies.findMany({
      where: {
        genre: genero ? { contains: String(genero), mode: 'insensitive' } : undefined,
      },
      orderBy: {
        score_ranking: 'desc', // VERIFIQUE SE ESSE CAMPO EXISTE NO SCHEMA
      },
      take: 50,
    });

    res.json(movies);
  } catch (error: any) {
    // ESTE LOG VAI APARECER NO DOCKER LOGS AGORA
    console.error("❌ ERRO NO PRISMA:", error.message); 
    res.status(500).json({ error: "Erro interno no servidor", details: error.message });
  }
});


app.listen(port, () => {
  console.log(`API CineData rodando na porta ${port}`);
});