# CineData - Analytics & Insights

O **CineData** é um ecossistema completo de análise cinematográfica que utiliza dados reais do IMDB para gerar visualizações dinâmicas, métricas financeiras e recomendações inteligentes. O projeto demonstra a integração entre Engenharia de Dados, Backend robusto e um Frontend de alta performance.

---

## Tecnologias Utilizadas

### **Engenharia de Dados**
* **Python & Pandas**: Extração, limpeza e transformação do dataset real do IMDB.
* **NumPy**: Cálculos estatísticos para o score de ranking personalizado.
* **SQLAlchemy**: Interface de comunicação para injeção de dados no banco.

### **Backend**
* **Node.js & TypeScript**: Ambiente de execução e tipagem estática para a API.
* **Prisma ORM**: Mapeamento e consultas ao banco de dados PostgreSQL.
* **Express**: Gerenciamento de rotas e middleware de segurança (CORS).

### **Frontend**
* **React 19 & Vite**: Framework moderno para uma interface rápida e reativa.
* **Tailwind CSS v4**: Estilização baseada em utilitários para um design dark-mode premium.
* **Recharts**: Visualização de dados interativa para BI (Business Intelligence).
* **Lucide React**: Biblioteca de ícones moderna e leve.

### **Infraestrutura**
* **Docker & Docker-Compose**: Orquestração de containers para garantir que o projeto rode em qualquer ambiente (como Linux openSUSE).
* **PostgreSQL**: Banco de dados relacional para armazenamento persistente.

---

## Funcionalidades Principais

* **Home**: Exploração de filmes com sistema de filtragem e ranking baseado em sucesso crítico e comercial.
* **Data Insights**: Painel de BI que permite cruzar dimensões (Diretor, Gênero, Produtora) com métricas de faturamento, orçamento e premiações.
* **Roleta Cine**: Sorteio aleatório de filmes com base na categoria escolhida pelo usuário.
* **Observações Metodológicas**: Rodapé dinâmico que explica a origem e o cálculo de cada métrica visualizada.

---

## Como Rodar o Projeto

### Pré-requisitos
* Docker e Docker-Compose instalados.


1. **Clonar o Repositório**:
    ```bash
   git clone [https://github.com/VictorHugo-Neo/CineData.git](https://github.com/VictorHugo-Neo/CineData.git)
   cd CineData
2. **Subir os Containers:**
    ```bash
    docker-compose up -d --build

3. **Inserir os dados no Banco de Dados:**
    ```bash
    docker exec -it cinedata_python python extraction.py

4. **Sincronizar o Prisma:**
    ```bash
    docker exec -it cinedata_node npx prisma db pull
    docker exec -it cinedata_node npx prisma generate
    docker-compose restart backend