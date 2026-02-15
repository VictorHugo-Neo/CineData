import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid
} from 'recharts';
import {
  LayoutDashboard, TrendingUp, Award, BarChart3, Info,
  HelpCircle, Landmark, GraduationCap
} from 'lucide-react';

interface AnalyticsDataItem {
  name: string;
  value: number;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsDataItem[]>([]);
  const [dimension, setDimension] = useState('director');
  const [metric, setMetric] = useState('count');
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value.toLocaleString('en-US')}`;
  };

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

  const isFinancial = ['gross_world_wide', 'budget'].includes(metric);
  const primaryColor = isFinancial ? '#10b981' : '#dc2626';

  // Dicionário de Explicações (Rodapé Dinâmico)
  const getMetricObservation = () => {
    const obs: Record<string, string> = {
      count: "Representa o volume total de títulos produzidos. Útil para medir a produtividade histórica de diretores ou estúdios.",
      oscar: "Soma acumulada de estatuetas do Oscar recebidas pelos filmes deste grupo. Nota: Reflete o sucesso das obras, não necessariamente vitórias individuais da pessoa.",
      nomination: "Total de indicações a prêmios importantes. É o melhor indicador de prestígio e reconhecimento constante pela crítica.",
      win: "Contagem total de vitórias em diversos festivais e premiações (incluindo mas não limitado ao Oscar).",
      rating_imdb: "Média aritmética das notas atribuídas pelos usuários. Indica a consistência de qualidade percebida pelo público.",
      gross_world_wide: "Soma da bilheteria global bruta. Mede o impacto comercial e o poder de mercado do grupo selecionado.",
      budget: "Total investido na produção dos filmes. Indica o nível de confiança e recursos financeiros movimentados."
    };
    return obs[metric] || "Análise estatística baseada nos dados processados do IMDB.";
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header e Controles */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter flex items-center gap-3">
            <BarChart3 className="text-red-600" size={32} />
            DATA <span className="text-zinc-500">INSIGHTS</span>
          </h2>
          <p className="text-zinc-400 mt-2">Análise de dados reais com agregação por {dimension}.</p>
        </div>

        <div className="flex flex-wrap gap-3 p-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <div className="flex flex-col px-3 border-r border-zinc-800 text-zinc-100">
            <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Dimensão</label>
            <select
              value={dimension}
              onChange={(e) => setDimension(e.target.value)}
              className="bg-transparent outline-none text-sm font-bold cursor-pointer"
            >
              <option value="director" className="bg-zinc-900">Diretor</option>
              <option value="genre" className="bg-zinc-900">Gênero</option>
              <option value="production_company" className="bg-zinc-900">Produtora</option>
            </select>
          </div>

          <div className="flex flex-col px-3 text-zinc-100">
            <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Métrica Analítica</label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className={`bg-transparent outline-none text-sm font-bold cursor-pointer ${isFinancial ? 'text-emerald-500' : 'text-red-500'}`}
            >
              <option value="count" className="bg-zinc-900">Volume de Produção</option>
              <option value="oscar" className="bg-zinc-900">Oscars Acumulados</option>
              <option value="nomination" className="bg-zinc-900">Total de Indicações</option>
              <option value="gross_world_wide" className="bg-zinc-900">Faturamento Global</option>
              <option value="budget" className="bg-zinc-900">Orçamento Investido</option>
            </select>
          </div>
        </div>
      </section>
      {/* NOTA DE RODAPÉ DINÂMICA (OBSERVAÇÃO ESPECÍFICA) */}
      <div className="mt-8 pt-6 border-t border-zinc-800 flex items-start gap-4 text-zinc-500">
        <div className="p-2 bg-zinc-800 rounded-lg shrink-0">
          <GraduationCap size={18} className="text-red-600" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-tighter mb-1">Observação Metodológica</h4>
          <p className="text-sm leading-relaxed italic">
            {getMetricObservation()}
          </p>
        </div>
      </div>
      {/* Gráfico Principal */}
      <div className="bg-zinc-900/20 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative">
        {loading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-8 text-zinc-400">
          <TrendingUp size={16} />
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Ranking: {dimension} vs {metric.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="h-[550px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#a1a1aa"
                fontSize={10}
                width={180}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.length > 25 ? `${value.substring(0, 25)}...` : value}
              />
              <Tooltip
                cursor={{ fill: primaryColor, opacity: 0.1 }}
                contentStyle={{
                  backgroundColor: '#09090b',
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  color: '#f4f4f5',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#f4f4f5' }}
                itemStyle={{ color: '#f4f4f5' }}
                formatter={(value: any) => {
                  const numericValue = Number(value?? 0);
                  return[
                    isFinancial ? formatCurrency(numericValue) : numericValue.toLocaleString(),
                    "Valor Acumulado"
                  ]
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? primaryColor : '#27272a'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumo Rápido */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-red-600/10 rounded-lg text-red-500"><Award /></div>
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Top Liderança</p>
            <p className="text-lg font-bold truncate">{data[0]?.name || '---'}</p>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 rounded-lg text-blue-500"><Landmark /></div>
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Valor do Topo</p>
            <p className="text-lg font-bold">
              {isFinancial ? formatCurrency(data[0]?.value || 0) : (data[0]?.value || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-zinc-800 rounded-lg text-zinc-400"><HelpCircle /></div>
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Métrica Ativa</p>
            <p className="text-lg font-bold capitalize">{metric.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}