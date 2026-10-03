import React, { useState } from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { ComingSoonPlaceholder } from '../common/ComingSoonPlaceholder';
import { TRANSLATIONS } from '../../data/translations';
import { matchBilingualQuery } from '../../data/searchHelper';
import { BookOpen, FileCheck, MessageSquare, Search } from 'lucide-react';

export const SourcesView: React.FC = () => {
  const { sources, searchQuery, setSearchQuery, language } = useArchive();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const t = TRANSLATIONS[language];

  const categories = [
    { key: 'all', ne: 'सबै स्रोतहरू', en: 'All Sources' },
    { key: 'book', ne: 'पुस्तकहरू', en: 'Books' },
    { key: 'academic_paper', ne: 'शोधपत्रहरू', en: 'Academic Papers' },
    { key: 'government_doc', ne: 'सरकारी / अभिलेख दस्तावेज', en: 'Government / Archival Docs' },
    { key: 'museum_archive', ne: 'संग्रहालय अभिलेख', en: 'Museum Archives' },
    { key: 'oral_history', ne: 'मौखिक इतिहास', en: 'Oral History' },
    { key: 'interview', ne: 'प्रत्यक्ष अन्तर्वार्ता', en: 'Interviews' },
  ];

  const filteredSources = sources.filter(src => {
    if (selectedCategory !== 'all' && src.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      const matchTitle = matchBilingualQuery(src.title, q);
      const matchAuthor = matchBilingualQuery(src.author, q);
      const matchPub = matchBilingualQuery(src.publicationOrArchive, q);
      return matchTitle || matchAuthor || matchPub;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800">
          <BookOpen className="w-4 h-4" />
          <span>{t.sections.sourcesCategory}</span>
        </div>
        <h1 className="font-serif-np text-3xl sm:text-4xl font-bold text-stone-900">
          {t.sections.sourcesTitle}
        </h1>
        <p className="text-stone-600 text-sm max-w-3xl leading-relaxed font-sans">
          {t.sections.sourcesSubtitle}
        </p>
      </div>

      {/* Guide Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h3 className="font-bold text-emerald-950 font-serif-np">
              {language === 'ne' ? 'लिखित / दस्तावेजी प्रमाण' : 'Documentary Evidence'}
            </h3>
            <p className="text-emerald-900/80 leading-relaxed font-sans">
              {language === 'ne'
                ? 'पुरातात्त्विक प्रतिवेदन, प्रकाशित ऐतिहासिक पुस्तकहरू, पाण्डुलिपि तथा अभिलेखीय कागजात।'
                : 'Archaeological reports, published historical works, manuscripts, and archival documents.'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h3 className="font-bold text-amber-950 font-serif-np">
              {language === 'ne' ? 'स्थानीय मौखिक इतिहास' : 'Local Oral History'}
            </h3>
            <p className="text-amber-900/80 leading-relaxed font-sans">
              {t.researchStatus.oralEthicsNotice}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-white p-4 sm:p-5 rounded-lg border border-stone-200 shadow-2xs">
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

      {/* Sources List or Clean Placeholder */}
      {filteredSources.length > 0 ? (
        <div className="space-y-4">
          {filteredSources.map((source, index) => (
            <div
              key={source.id}
              className="p-4 sm:p-5 bg-white rounded-lg border border-stone-200 space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif-np font-bold text-base text-stone-900">
                  [{index + 1}] {source.title}
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${source.isDocumentaryEvidence ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                  {source.isDocumentaryEvidence
                    ? (language === 'ne' ? 'लिखित प्रमाण' : 'Documentary Evidence')
                    : (language === 'ne' ? 'मौखिक इतिहास' : 'Oral History')}
                </span>
              </div>
              <p className="text-xs text-stone-600 font-sans">
                {source.author} {source.year && `(${source.year})`} · {source.publicationOrArchive}
              </p>
              {source.quotationOrNote && (
                <p className="text-xs text-stone-500 font-serif italic pt-1 border-t border-stone-100">
                  "{source.quotationOrNote}"
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <ComingSoonPlaceholder
        />
      )}

    </div>
  );
};
