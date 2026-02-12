import pandas as pd
import numpy as np
from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://admin:password123@db:5432/cinedata_imdb"
engine = create_engine(DATABASE_URL)

def fetch_and_load_real_data():
    file_path = "world_imdb_movies_top_movies_per_year.csv"
    print(f"Lendo dados reais de {file_path}...")
    
    df = pd.read_csv(file_path)

    print("Iniciando Tratamento de Dados...")
    
    # Ajuste: O CSV usa 'genre', o script antigo usava 'genero'
    # Vamos renomear para manter compatibilidade ou apenas usar 'genre'
    df['genero_principal'] = df['genre'].str.split(',').str[0]
    
    # Tratamento de nulos para colunas críticas
    df['rating_imdb'] = pd.to_numeric(df['rating_imdb'], errors='coerce').fillna(0)
    df['vote'] = pd.to_numeric(df['vote'], errors='coerce').fillna(0)

    # Cálculo de Score (Lógica de Negócio para o Portfólio)
    df['score_ranking'] = df['rating_imdb'] * np.log10(df['vote'] + 1)

    print("Enviando para PostgreSQL...")
    df.to_sql('movies', engine, if_exists='replace', index=False)
    
    # PASSO CRUCIAL: Definir a chave primária manualmente via SQL para o Prisma não ignorar a tabela
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE movies ADD PRIMARY KEY (id);"))
        conn.commit()
    
    print("--- Sucesso! Dados reais inseridos com PK ---")

if __name__ == "__main__":
    fetch_and_load_real_data()