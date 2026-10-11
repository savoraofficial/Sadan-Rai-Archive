import React from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { ComingSoonPlaceholder } from '../common/ComingSoonPlaceholder';
import { ResearchBadge } from '../common/ResearchBadge';
import { TRANSLATIONS } from '../../data/translations';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CultureView: React.FC = () => {
  const { articles, navigateTo, language, getArchiveSection } = useArchive();
  const section = getArchiveSection('culture_religion_traditions');
  const t = TRANSLATIONS[language];
  const cultureArticles = articles.filter(a => a.category === 'culture');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800">
          <Sparkles className="w-4 h-4" />
          <span>{t.sections.cultureCategory}</span>
        </div>
        <h1 className="font-serif-np text-3xl sm:text-4xl font-bold text-stone-900">
          {language === 'ne' ? (section?.nepaliTitle || t.sections.cultureTitle) : (section?.englishTitle || t.sections.cultureTitle)}
        </h1>
        <p className="text-stone-600 text-sm max-w-3xl leading-relaxed font-sans">
          {language === 'ne' ? (section?.nepaliDescription || t.sections.cultureSubtitle) : (section?.englishDescription || t.sections.cultureSubtitle)}
        </p>
      </div>

      {cultureArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cultureArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => navigateTo(`/article/${article.slug}`)}
              className="bg-white rounded-lg border border-stone-200 p-6 hover:border-amber-800 transition-colors cursor-pointer space-y-4 shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span>{article.publicationDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.location}</span>
                </div>
                <h2 className="font-serif-np text-xl font-bold text-stone-900">
                  {article.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <ResearchBadge status={article.researchStatus} />
                <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
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
