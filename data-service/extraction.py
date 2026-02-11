import pandas as pd
from sqlalchemy import create_engine
import os
import numpy as np

# Conexão com o Banco (Usando o nome do serviço definido no docker-compose)
DATABASE_URL = "postgresql://admin:password123@db:5432/cinedata_imdb"
engine = create_engine(DATABASE_URL)

def fetch_and_load_data():
    print("Carregando dados locais (Mock)...")
    
    try:
        # quotechar='"' garante que ele ignore vírgulas dentro das aspas
        df = pd.read_csv("movies_sample.csv", quotechar='"')
        
        print("Iniciando Tratamento de Dados...")

        # 1. Tratamento de Gêneros: Pega apenas o primeiro gênero da lista
        df['genero_principal'] = df['genero'].str.split(',').str[0].str.strip()

        # 2. NumPy: Cálculo de Score (Logaritmo para normalizar o peso dos votos)
        df['score_ranking'] = df['nota_media'] * np.log10(df['numero_votos'])

        # 3. Carga no Postgres
        df.to_sql('movies', engine, if_exists='replace', index=False)
        
        print("--- Sucesso! Dados inseridos no PostgreSQL ---")
        
    except Exception as e:
        print(f"Erro no processamento: {e}")

if __name__ == "__main__":
    fetch_and_load_data()