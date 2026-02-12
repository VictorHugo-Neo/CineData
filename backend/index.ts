import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
// Inicialize assim:
const prisma = new PrismaClient();
const port = 3000;

app.use(cors()); // Libera o acesso para o seu futuro site em React
app.use(express.json());

// Rota: Obter recomendações baseadas em interesse
app.get('/recommendations', async (req: Request, res: Response) => {
  try {
    const { genero, notaMinima } = req.query;

    const movies = await prisma.movies.findMany({
      where: {
        // Garantimos que filtros vazios não quebrem a query
        genero_principal: genero ? String(genero) : undefined,
        nota_media: notaMinima ? { gte: Number(notaMinima) } : undefined,
      },
      orderBy: {
        score_ranking: 'desc',
      },
      take: 5,
    });

    res.json(movies);
  } catch (error) {
    console.error("ERRO NO BANCO:", error);
    res.status(500).json({ error: "Erro ao buscar dados no banco." });
  }
});

app.listen(port, () => {
  console.log(`Backend CineData rodando em http://localhost:${port}`);
});