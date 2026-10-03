import React, { useState } from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { ResearchBadge } from '../common/ResearchBadge';
import { ComingSoonPlaceholder } from '../common/ComingSoonPlaceholder';
import { ArchiveEngagement } from '../common/ArchiveEngagement';
import { TRANSLATIONS } from '../../data/translations';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Share2, 
  Printer, 
  BookOpen, 
  Clock
} from 'lucide-react';

interface ArticleDetailViewProps {
  slug: string;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({ slug }) => {
  const { getArticleBySlug, getSourcesForArticle, navigateTo, readingFontSize, setReadingFontSize, language } = useArchive();
  const [copied, setCopied] = useState(false);

  const t = TRANSLATIONS[language];
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <button
          onClick={() => navigateTo('/articles')}
          className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.actions.backToArticles}</span>
        </button>
        <div className="rounded-2xl border border-stone-200 bg-white/80 p-8 text-center text-sm text-stone-600 shadow-sm">
          {t.actions.contentComingSoon}
        </div>
      </div>
    );
  }

  const sources = getSourcesForArticle(article);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fontSizeClass = {
    normal: 'text-base leading-relaxed',
    large: 'text-lg leading-loose',
    larger: 'text-xl leading-loose'
  }[readingFontSize];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <button
          onClick={() => navigateTo('/articles')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.actions.backToArchive}</span>
        </button>

        {/* Reading Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 text-xs text-stone-500 border border-stone-200 rounded px-2 py-1 bg-white">
            <span className="text-[11px] mr-1 text-stone-400">
              {language === 'ne' ? 'फन्ट:' : 'Font:'}
            </span>
            <button
              onClick={() => setReadingFontSize('normal')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${readingFontSize === 'normal' ? 'bg-stone-200 font-bold text-stone-900' : 'hover:bg-stone-100'}`}
              title={t.actions.fontNormal}
            >
              A
            </button>
            <button
              onClick={() => setReadingFontSize('large')}
              className={`px-1.5 py-0.5 rounded text-sm cursor-pointer ${readingFontSize === 'large' ? 'bg-stone-200 font-bold text-stone-900' : 'hover:bg-stone-100'}`}
              title={t.actions.fontLarge}
            >
              A+
            </button>
            <button
              onClick={() => setReadingFontSize('larger')}
              className={`px-1.5 py-0.5 rounded text-base cursor-pointer ${readingFontSize === 'larger' ? 'bg-stone-200 font-bold text-stone-900' : 'hover:bg-stone-100'}`}
              title={t.actions.fontLarger}
            >
              A++
            </button>
          </div>

          <button
            onClick={handleShare}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
            title={t.actions.copyLink}
          >
            <Share2 className="w-4 h-4" />
          </button>
          {copied && <span className="text-xs text-amber-800 font-medium">{t.actions.linkCopied}</span>}

          <button
            onClick={() => window.print()}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer no-print"
            title={t.actions.print}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Article Header & Metadata */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-900 font-bold">
            {article.category}
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <ResearchBadge status={article.researchStatus} />
        </div>

        <h1 className="font-serif-np text-2xl sm:text-4xl lg:text-5xl font-bold text-stone-950 leading-tight">
          {article.title}
        </h1>

        <div className="pt-2 pb-4 border-b border-stone-200 flex flex-wrap items-center gap-4 text-xs text-stone-600 font-sans">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium text-stone-900">{article.author}</span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>{article.publicationDate}</span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span>{article.location}</span>
          </div>
          {article.readingTimeMinutes && (
            <>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  {article.readingTimeMinutes} {language === 'ne' ? 'मिनेट अध्ययन' : 'min read'}
                </span>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Prominent Research Disclaimer */}
      {article.statusDisclaimer && (
        <div className="p-4 rounded-md border border-stone-300 bg-[#F5F2EB] text-xs sm:text-sm">
          <p className="font-serif italic text-stone-800">
            “{article.statusDisclaimer}”
          </p>
        </div>
      )}

      {/* Excerpt */}
      {article.excerpt && (
        <div className="p-4 border-l-3 border-amber-800 bg-[#FBF9F5] text-stone-800 font-serif-np text-base sm:text-lg italic leading-relaxed">
          {article.excerpt}
        </div>
      )}

      {/* Content */}
      <div className={`text-stone-900 prose-editorial font-sans ${fontSizeClass} space-y-6`}>
        {article.content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={index} className="font-serif-np font-bold text-xl sm:text-2xl text-stone-950 pt-4 pb-1 border-b border-stone-200">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          return (
            <p key={index}>{paragraph}</p>
          );
        })}
      </div>

      <ArchiveEngagement contentType="article" contentId={article.id} />

      {/* Sources Section */}
      {sources.length > 0 && (
        <section className="bg-stone-50 p-6 rounded-lg border border-stone-200 space-y-3">
          <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
            <BookOpen className="w-4 h-4 text-amber-800" />
            <h3 className="font-serif-np font-bold text-base text-stone-900">
              {language === 'ne'
                ? `यस आलेखमा उद्धृत स्रोत तथा सन्दर्भ ग्रन्थहरू (${sources.length})`
                : `Cited Sources & Bibliography in this Article (${sources.length})`}
            </h3>
          </div>
          <div className="space-y-2">
            {sources.map((src, index) => (
              <div key={src.id} className="p-3 bg-white rounded border border-stone-200 text-xs">
                <p className="font-semibold text-stone-900">[{index + 1}] {src.title}</p>
                <p className="text-stone-600">{src.author} {src.year && `(${src.year})`} · {src.publicationOrArchive}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </article>
  );
};
