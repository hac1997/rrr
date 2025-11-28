import React from 'react';
import { DUMMY_NEWS } from '@/lib/services/getDataseService';
import { NewsArticle } from '@/lib/types';
import { IoTimeOutline } from 'react-icons/io5';

// Define a cor de fundo com base no tipo
const getCategoryStyles = (newsType: 'Announcement' | 'Event' | 'Conquest') => {
  switch (newsType) {
    case 'Announcement':
      return 'bg-green-100 text-green-700';
    case 'Event':
      return 'bg-blue-100 text-blue-700';
    case 'Conquest':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const ArticleCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 flex flex-col h-full">
    <div className="p-6 flex flex-col justify-between flex-grow">
      {/* Categoria e Data */}
      <div className="mb-4">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryStyles(article.newsType)}`}
        >
          {article.newsType}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
        {article.title}
      </h3>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {article.body}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t pt-4 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <IoTimeOutline className="text-base" />
          <span>{article.publishDate}</span>
        </div>
        <button className="text-primary hover:underline font-medium transition-colors">
          Ler Mais
        </button>
      </div>
    </div>
  </div>
);

export default function NewsSection() {
  // Limita a exibição aos 4 primeiros artigos
  const limitedNews = DUMMY_NEWS.slice(0, 4);

  return (
    <section className="py-12 bg-aux-2-translucid backdrop-blur-xs">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Últimas Notícias e Impacto</h2>
          <p className="text-lg text-gray-600 mt-2">Mantenha-se atualizado com o que está acontecendo no mundo do voluntariado.</p>
        </div>
        
        {/* Grade ajustada para 4 colunas em telas grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {limitedNews.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}