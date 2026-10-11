import React from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { ComingSoonPlaceholder } from '../common/ComingSoonPlaceholder';
import { ResearchBadge } from '../common/ResearchBadge';
import { TRANSLATIONS } from '../../data/translations';
import { MessageSquareQuote, ShieldAlert, ArrowRight } from 'lucide-react';

export const OralHistoryView: React.FC = () => {
  const { articles, navigateTo, language, getArchiveSection } = useArchive();
  const section = getArchiveSection('oral_history');
  const t = TRANSLATIONS[language];
  const oralArticles = articles.filter(a => a.category === 'oral-history' || a.researchStatus === 'oral_history');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800">
          <MessageSquareQuote className="w-4 h-4" />
          <span>{t.sections.oralHistoryCategory}</span>
        </div>
        <h1 className="font-serif-np text-3xl sm:text-4xl font-bold text-stone-900">
          {language === 'ne' ? (section?.nepaliTitle || t.sections.oralHistoryTitle) : (section?.englishTitle || t.sections.oralHistoryTitle)}
        </h1>
        <p className="text-stone-600 text-sm max-w-3xl leading-relaxed font-sans">
          {language === 'ne' ? (section?.nepaliDescription || t.sections.oralHistorySubtitle) : (section?.englishDescription || t.sections.oralHistorySubtitle)}
        </p>
      </div>

      {/* Oral Ethics Guideline Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-300/70 rounded-md flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h3 className="font-bold text-amber-950 font-serif-np text-sm">
            {language === 'ne' ? 'मौखिक इतिहास सम्बन्धी अनुसन्धान नियम:' : 'Oral History Ethical & Verification Standards:'}
          </h3>
          <p className="text-amber-900 leading-relaxed font-sans">
            {t.researchStatus.oralEthicsNotice}
          </p>
        </div>
      </div>

      {oralArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {oralArticles.map((article) => (
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
