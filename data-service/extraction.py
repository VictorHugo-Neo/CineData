import pandas as pd
import numpy as np
from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://admin:password123@db:5432/cinedata_imdb"
engine = create_engine(DATABASE_URL)

def fetch_and_load_real_data():
    file_path = "world_imdb_movies_top_movies_per_year.csv"
    print(f"Lendo dados reais de {file_path}...")
    
    # Carrega todo o dataset do CSV
    df = pd.read_csv(file_path)

    print("Iniciando Tratamento de Dados...")
    
    # 1. Tratamento de nulos para colunas críticas
    df['rating_imdb'] = pd.to_numeric(df['rating_imdb'], errors='coerce').fillna(0)
    df['vote'] = pd.to_numeric(df['vote'], errors='coerce').fillna(0)
    df['oscar'] = pd.to_numeric(df['oscar'], errors='coerce').fillna(0)

    # 2. Lógica para Múltiplos Gêneros:
    # Mantemos a coluna 'genre' original intacta para o filtro 'contains' no Backend
    # Criamos a 'genero_principal' apenas para fins de exibição rápida
    df['genero_principal'] = df['genre'].str.split(',').str[0]
    
    # 3. Cálculo de Score Robusto (Lógica de Negócio)
    # Ponderamos a nota pelo volume de votos (escala logarítmica) e bônus por Oscars
    df['score_ranking'] = (df['rating_imdb'] * np.log10(df['vote'] + 1)) + (df['oscar'] * 2)

    print("Enviando para PostgreSQL...")
    # 'replace' garante que toda a estrutura do CSV real seja refletida no banco
    df.to_sql('movies', engine, if_exists='replace', index=False)
    
    # 4. PASSO CRUCIAL: PK e Índices para Performance
    with engine.connect() as conn:
        # Define a chave primária para o Prisma reconhecer a tabela
        conn.execute(text("ALTER TABLE movies ADD PRIMARY KEY (id);"))
        # Cria um índice na coluna genre para acelerar buscas por texto (LIKE / CONTAINS)
        conn.execute(text("CREATE INDEX idx_genre ON movies USING gin (to_tsvector('english', genre));"))
        conn.commit()
    
    print("--- Sucesso! Dados reais inseridos e otimizados para filtros ---")

if __name__ == "__main__":
    fetch_and_load_real_data()