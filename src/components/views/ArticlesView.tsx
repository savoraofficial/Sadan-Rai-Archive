import React, { useState } from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { ArticleCategory } from '../../types';
import { ResearchBadge } from '../common/ResearchBadge';
import { ComingSoonPlaceholder } from '../common/ComingSoonPlaceholder';
import { TRANSLATIONS } from '../../data/translations';
import { matchBilingualQuery } from '../../data/searchHelper';
import { Search, BookOpen, ArrowRight } from 'lucide-react';

interface ArticlesViewProps {
  initialCategory?: ArticleCategory | 'all';
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({ initialCategory = 'all' }) => {
  const { articles, navigateTo, searchQuery, setSearchQuery, language } = useArchive();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const t = TRANSLATIONS[language];

  const categories = [
    { key: 'all', ne: 'सबै आलेखहरू', en: 'All Articles' },
    { key: 'history', ne: 'इतिहास तथा सभ्यता', en: 'History & Civilization' },
    { key: 'culture', ne: 'संस्कृति, धर्म तथा परम्परा', en: 'Culture, Religion & Traditions' },
    { key: 'civilization', ne: 'सभ्यता', en: 'Civilization' },
    { key: 'places', ne: 'स्थान तथा स्थानीय इतिहास', en: 'Places & Local History' },
    { key: 'oral-history', ne: 'मौखिक इतिहास', en: 'Oral History' },
    { key: 'research', ne: 'अनुसन्धान', en: 'Research' },
  ];

  const statusOptions = [
    { key: 'all', ne: 'सबै अनुसन्धान स्थिति', en: 'All Statuses' },
    { key: 'verified', ne: 'प्रमाणित स्रोत (Verified)', en: 'Verified / Documented' },
    { key: 'oral_history', ne: 'स्थानीय मौखिक इतिहास (Oral History)', en: 'Local Oral History' },
    { key: 'further_research', ne: 'अझै अनुसन्धान आवश्यक', en: 'Further Research Needed' },
  ];

  const filteredArticles = articles.filter(article => {
    if (selectedCategory !== 'all' && article.category !== selectedCategory) {
      return false;
    }
    if (selectedStatus !== 'all' && article.researchStatus !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      const matchTitle = matchBilingualQuery(article.title, q);
      const matchExcerpt = matchBilingualQuery(article.excerpt, q);
      const matchContent = matchBilingualQuery(article.content, q);
      const matchAuthor = matchBilingualQuery(article.author, q);
      const matchLocation = article.location ? matchBilingualQuery(article.location, q) : false;
      const matchCategory = matchBilingualQuery(article.category, q);
      return matchTitle || matchExcerpt || matchContent || matchAuthor || matchLocation || matchCategory;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800">
          <BookOpen className="w-4 h-4" />
          <span>{t.sections.articlesCategory}</span>
        </div>
        <h1 className="font-serif-np text-3xl sm:text-4xl font-bold text-stone-900">
          {t.sections.articlesTitle}
        </h1>
        <p className="text-stone-600 text-sm max-w-3xl leading-relaxed font-sans">
          {t.sections.articlesSubtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-white p-5 rounded-lg border border-stone-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.actions.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded focus:outline-hidden focus:border-stone-400 text-stone-900 placeholder:text-stone-400"
          />
        </div>

        {/* Category Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              {language === 'ne' ? cat.ne : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Feed */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => navigateTo(`/article/${article.slug}`)}
              className="bg-white rounded-lg border border-stone-200 p-6 hover:border-amber-800 transition-colors cursor-pointer space-y-4 flex flex-col justify-between shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-mono uppercase">{article.category}</span>
                  <span>{article.publicationDate}</span>
                </div>
                
                <h2 className="font-serif-np text-xl font-bold text-stone-900 leading-snug">
                  {article.title}
                </h2>
                
                <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <ResearchBadge status={article.researchStatus} />
                <span className="text-xs font-semibold text-amber-900 flex items-center gap-1">
                  <span>{t.actions.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <ComingSoonPlaceholder
        />
      )}

    </div>
  );
};
