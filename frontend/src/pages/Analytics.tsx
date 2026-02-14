import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid, PieChart, Pie
} from 'recharts';
import { LayoutDashboard, TrendingUp, Award, BarChart3, Info } from 'lucide-react';

interface AnalyticsDataItem {
  name: string;
  value: number;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsDataItem[]>([]);
  const [dimension, setDimension] = useState('genre'); // genre, director, production_company
  const [metric, setMetric] = useState('count');      // count, oscar, rating_imdb
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/analytics?dimension=${dimension}&metric=${metric}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro no Analytics:", err);
        setLoading(false);
      });
  }, [dimension, metric]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Cabeçalho da Página */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter flex items-center gap-3">
            <BarChart3 className="text-red-600" size={32} />
            DATA <span className="text-zinc-500">INSIGHTS</span>
          </h2>
          <p className="text-zinc-400 mt-2">Explore correlações e estatísticas do ecossistema cinematográfico.</p>
        </div>

        {/* Controlos de Filtragem Dinâmica */}
        <div className="flex flex-wrap gap-3 p-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <div className="flex flex-col px-3">
            <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Dimensão</label>
            <select
              value={dimension}
              onChange={(e) => setDimension(e.target.value)}
              className="bg-transparent outline-none text-sm font-bold cursor-pointer"
            >
              <option value="genre" className="bg-zinc-900">Gênero</option>
              <option value="director" className="bg-zinc-900">Diretor</option>
              <option value="production_company" className="bg-zinc-900">Produtora</option>
            </select>
          </div>

          <div className="w-px h-8 bg-zinc-800 self-center hidden md:block" />

          <div className="flex flex-col px-3">
            <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Métrica</label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="bg-transparent outline-none text-sm font-bold cursor-pointer text-red-500"
            >
              <option value="count" className="bg-zinc-900 text-white">Qtd de Filmes</option>
              <option value="oscar" className="bg-zinc-900 text-white">Total de Oscars</option>
              <option value="rating_imdb" className="bg-zinc-900 text-white">Média de Notas</option>
            </select>
          </div>
        </div>
      </section>

      {/* Área do Gráfico Principal */}
      <div className="bg-zinc-900/20 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-8 text-zinc-400">
          <TrendingUp size={16} />
          <span className="text-xs font-medium uppercase tracking-widest">
            Top 10: {dimension} vs {metric}
          </span>
        </div>

        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#a1a1aa"
                fontSize={12}
                width={120}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: '#ef4444', opacity: 0.1 }}
                contentStyle={{
                  backgroundColor: '#09090b',
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '8px 12px',
                  color: '#f4f4f5', // Cor do texto geral
                }}
                labelStyle={{
                  fontWeight: 'bold',
                  color: '#f4f4f5',
                  marginBottom: '4px'
                }}
                itemStyle={{
                  color: '#f4f4f5', // Força a cor do texto do valor (que estava invisível)
                  textTransform: 'capitalize'
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={30}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#dc2626' : '#27272a'}
                    className="hover:fill-red-500 transition-colors cursor-pointer"

                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cards de Resumo Rápido */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-red-600/10 rounded-lg text-red-500"><Award /></div>
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Destaque Atual</p>
            <p className="text-lg font-bold truncate">{data[0]?.name || '---'}</p>
          </div>
        </div>
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 rounded-lg text-blue-500"><Info /></div>
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Maior Valor</p>
            <p className="text-lg font-bold">{data[0]?.value || '0'}</p>
          </div>
        </div>
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-green-600/10 rounded-lg text-green-500"><LayoutDashboard /></div>
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Categorias</p>
            <p className="text-lg font-bold">{data.length} Amostras</p>
          </div>
        </div>
      </section>
    </div>
  );
}