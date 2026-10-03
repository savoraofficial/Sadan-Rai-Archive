import React from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { ComingSoonPlaceholder } from '../common/ComingSoonPlaceholder';
import { ResearchBadge } from '../common/ResearchBadge';
import { TRANSLATIONS } from '../../data/translations';
import { Landmark, ArrowRight, BookOpenCheck } from 'lucide-react';
import { CIVILIZATION_SECTIONS } from '../../data/archiveData';

export const CivilizationView: React.FC = () => {
  const { articles, navigateTo, language } = useArchive();
  const t = TRANSLATIONS[language];
  const civArticles = articles.filter(a => a.category === 'civilization');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800">
          <Landmark className="w-4 h-4" />
          <span>{t.sections.civilizationCategory}</span>
        </div>
        <h1 className="font-serif-np text-3xl sm:text-4xl font-bold text-stone-900">
          {t.sections.civilizationTitle}
        </h1>
        <p className="text-stone-600 text-sm max-w-3xl leading-relaxed font-sans">
          {t.sections.civilizationSubtitle}
        </p>
      </div>

      <section className="space-y-5" aria-labelledby="civilization-index">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-800 font-semibold">{language === 'ne' ? 'सभ्यता अभिलेख संरचना' : 'Civilization Archive Index'}</p>
            <h2 id="civilization-index" className="mt-1 text-2xl font-serif-np font-bold text-stone-900">{language === 'ne' ? 'सभ्यताभित्रका विषयगत खण्डहरू' : 'Civilization topic sections'}</h2>
            <p className="mt-1 text-sm text-stone-600">{language === 'ne' ? 'प्रत्येक खण्डमा स्रोत, प्रमाण र अनुसन्धान अभिलेख क्रमशः थपिनेछन्।' : 'Each section can grow with source-backed research and evidence records.'}</p>
          </div>
          <BookOpenCheck className="hidden sm:block w-7 h-7 text-amber-800" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CIVILIZATION_SECTIONS.map((section, index) => (
            <div key={section.key} className="group rounded-xl border border-stone-200 bg-white p-4 shadow-sm hover:border-amber-700/60 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 h-7 w-7 shrink-0 rounded-lg bg-amber-50 text-amber-900 border border-amber-100 flex items-center justify-center text-xs font-semibold">{index + 1}</span>
                <div>
                  <h3 className="font-serif-np font-semibold text-stone-900 leading-snug">{language === 'ne' ? section.nepaliTitle : section.englishTitle}</h3>
                  <p className="mt-1 text-[11px] text-stone-500">{language === 'ne' ? section.englishTitle : section.nepaliTitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {civArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {civArticles.map((article) => (
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
