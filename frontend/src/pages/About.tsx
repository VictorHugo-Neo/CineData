import { Github, Globe, Coffee, Code2, Database, Laptop, Heart } from 'lucide-react';

export default function About() {
  const authorUrl = "https://victorhugo.dev.br/";
  const pixKey = "33998453545";

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Seção 1: O Projeto */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black tracking-tighter flex items-center gap-3 italic">
          <Code2 className="text-red-600" size={36} />
          SOBRE O <span className="text-red-600">CINEDATA</span>
        </h2>
        <p className="text-zinc-400 text-lg leading-relaxed">
          O <strong>CineData</strong> é uma plataforma de análise cinematográfica desenvolvida para transformar dados brutos do IMDB em insights visuais e recomendações inteligentes. 
          O objetivo principal é demonstrar a integração entre <strong>Engenharia de Dados com Python</strong> e o desenvolvimento de <strong>Sistemas de Alta Performance</strong> com React e Node.js.
        </p>
      </section>

      {/* Seção 2: Como foi construído (Stack) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-4">
          <Database className="text-red-600" />
          <h3 className="font-bold">Dados & IA</h3>
          <p className="text-xs text-zinc-500">Extração e tratamento de CSVs reais com Pandas e NumPy, utilizando algoritmos de score personalizado.</p>
        </div>
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-4">
          <Laptop className="text-red-600" />
          <h3 className="font-bold">Infraestrutura</h3>
          <p className="text-xs text-zinc-500">Ambiente totalmente conteinerizado com Docker, utilizando PostgreSQL como banco de dados relacional e Prisma como ORM.</p>
        </div>
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-4">
          <Globe className="text-red-600" />
          <h3 className="font-bold">Frontend Pro</h3>
          <p className="text-xs text-zinc-500">Interface responsiva construída com React 19, Tailwind CSS v4 e visualização de dados via Recharts.</p>
        </div>
      </section>

      {/* Seção 3: O Autor */}
      <section className="bg-red-600/5 border border-red-600/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
        <div className="space-y-4 flex-1">
          <h3 className="text-2xl font-bold italic">Victor Hugo Lisboa Coutinho</h3>
          <p className="text-zinc-400">
            Professor de cursos técnicos em Desenvolvimento de Sistemas e entusiasta de arquiteturas escaláveis. 
            Este projeto reflete a aplicação prática de conceitos ensinados em sala de aula.
          </p>
          <div className="flex gap-4">
            <a href={authorUrl} target="_blank" className="flex items-center gap-2 text-sm font-bold hover:text-red-500 transition-colors">
              <Globe size={18} /> Portfolio
            </a>
            <a href="https://github.com/VictorHugo-Neo" target="_blank" className="flex items-center gap-2 text-sm font-bold hover:text-red-500 transition-colors">
              <Github size={18} /> GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Seção 4: Apoio ao Projeto (PIX) */}
      <section className="text-center py-12 border-t border-zinc-800 space-y-6">
        <div className="inline-flex p-3 bg-emerald-500/10 rounded-full text-emerald-500 mb-2">
          <Coffee size={24} />
        </div>
        <h3 className="text-2xl font-bold">Gostou do projeto?</h3>
        <p className="text-zinc-500 max-w-md mx-auto">
          Se este código ou as aulas te ajudaram, considere apoiar a manutenção do servidor e a criação de novos conteúdos.
        </p>
        
        <div className="inline-block bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500">Chave PIX (Mercado Pago)</p>
          <p className="text-xl font-mono font-bold text-emerald-500 selection:bg-emerald-500/30">{pixKey}</p>
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
            <Heart size={12} className="fill-zinc-600" /> 
            <span>Obrigado pelo incentivo!</span>
          </div>
        </div>
      </section>

    </div>
  );
}