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

app.get('/recommendations', async (req: Request, res: Response) => {
  try {
    const { genero } = req.query;

    const movies = await prisma.movies.findMany({
      where: {
        // Agora usamos 'genero_principal', coluna criada no seu Python
        genero_principal: genero ? String(genero) : undefined,
      },
      orderBy: {
        score_ranking: 'desc', // Usando o ranking calculado pelo Python
      },
      take: 12, 
    });

    res.json(movies);
  } catch (error) {
    console.error("ERRO NO BACKEND:", error);
    res.status(500).json({ error: "Erro ao buscar dados processados." });
  }
});

app.listen(port, () => {
  console.log(`API CineData rodando na porta ${port}`);
});