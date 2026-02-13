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