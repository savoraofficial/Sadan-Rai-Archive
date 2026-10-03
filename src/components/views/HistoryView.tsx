import React, { useState } from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { KIRAT_HISTORY_SECTIONS } from '../../data/archiveData';
import { KiratHistorySectionKey } from '../../types';
import { ComingSoonPlaceholder } from '../common/ComingSoonPlaceholder';
import { ResearchBadge } from '../common/ResearchBadge';
import { EvidenceArchiveList } from './EvidenceArchiveList';
import { fetchEvidenceRecords } from '../../services/dbService';
import { EvidenceRecordItem } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { 
  BookOpen, 
  Clock, 
  Users, 
  FileText, 
  Landmark, 
  MessageSquare, 
  AlertCircle, 
  Bookmark,
  Share2, 
  Printer, 
  ArrowRight,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { articles, navigateTo, language } = useArchive();
  const t = TRANSLATIONS[language];

  const [activeTab, setActiveTab] = useState<KiratHistorySectionKey>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      const valid = KIRAT_HISTORY_SECTIONS.some(s => s.key === hash);
      if (valid) return hash as KiratHistorySectionKey;
    }
    return 'intro';
  });

  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecordItem[]>([]);

  React.useEffect(() => {
    fetchEvidenceRecords(false).then(data => {
      setEvidenceList(data);
    }).catch(() => {});
  }, []);

  const handleTabChange = (key: KiratHistorySectionKey) => {
    setActiveTab(key);
    if (typeof window !== 'undefined') {
      window.location.hash = key;
    }
  };

  const historyArticles = articles.filter(a => a.category === 'history');

  const iconsMap: Record<KiratHistorySectionKey, React.ElementType> = {
    intro: BookOpen,
    timeline: Clock,
    authors_researchers: Users,
    evidence_archive: FileText,
    civilization: Landmark,
    oral_history: MessageSquare,
    disputed_topics: AlertCircle,
    sources_references: Bookmark
  };

  const currentSection = KIRAT_HISTORY_SECTIONS.find(s => s.key === activeTab) || KIRAT_HISTORY_SECTIONS[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Communities Architecture
  const communities = [
    { key: 'all', ne: 'समग्र किराँत', en: 'All Kirat' },
    { key: 'rai', ne: 'राई (Rai)', en: 'Rai' },
    { key: 'limbu', ne: 'लिम्बू (Limbu)', en: 'Limbu' },
    { key: 'yakkha', ne: 'याक्खा (Yakkha)', en: 'Yakkha' },
    { key: 'sunuwar', ne: 'सुनुवार (Sunuwar)', en: 'Sunuwar' },
    { key: 'other', ne: 'अन्य किराँती समुदाय', en: 'Other Kirati Communities' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. Header Banner */}
      <div className="bg-stone-900 text-white rounded-lg p-6 sm:p-10 border border-stone-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-amber-400 uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t.sections.historyCategory}</span>
        </div>

        <h1 className="font-serif-np text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          {t.sections.historyTitle}
        </h1>
        
        <p className="font-serif-np text-base sm:text-lg text-amber-200/90 font-medium">
          {t.sections.historySubtitle}
        </p>

        <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>
              {language === 'ne'
                ? '८ मुख्य विषयगत अभिलेख संरचना'
                : '8 Structured Thematic Sections'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? t.actions.linkCopied : t.actions.copyLink}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer no-print"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.actions.print}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kirat Community Architecture & Neutral Mundum / Mundhum Bar */}
      <div className="bg-[#F5F2EB] p-4 sm:p-5 rounded-lg border border-stone-300 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-900 tracking-wider font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>
              {language === 'ne'
                ? 'किराँती समुदाय अनुसन्धान संरचना'
                : 'Kirat Community Research Architecture'}
            </span>
          </div>
          <div className="text-[11px] font-mono text-stone-600">
            {language === 'ne' ? 'मुन्दुम / मुन्धुम' : 'Mundum / Mundhum Terminology'}
          </div>
        </div>

        <p className="text-xs text-stone-700 leading-relaxed font-sans">
          {language === 'ne'
            ? 'सबै किराँती समुदायहरूको इतिहास, भाषा, संस्कार, चुल्हा र रैथाने चलन ठ्याक्कै एउटै हुँदैन। राई स्रोतमा "मुन्दुम" र लिम्बू/याक्थुङ स्रोतमा "मुन्धुम" प्रयोग भएमा मूल स्रोतको मौलिक शब्दावली यथावत सुरक्षित राखिन्छ।'
            : 'Each Kirati community maintains its own distinct historical traditions, language, rituals, hearth practices, and terminology. Original source spellings (Mundum for Rai sources, Mundhum for Limbu/Yakthung sources) are strictly preserved without alteration.'}
        </p>

        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-thin">
          {communities.map((comm) => (
            <button
              key={comm.key}
              onClick={() => setSelectedCommunity(comm.key)}
              className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCommunity === comm.key
                  ? 'bg-amber-900 text-white'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
              }`}
            >
              {language === 'ne' ? comm.ne : comm.en}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Structured 8-Sections Navigation */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-stone-500 font-mono">
          {language === 'ne'
            ? 'किराँत इतिहासका ८ अभिलेख खण्डहरू:'
            : '8 Structured History & Civilization Sections:'}
        </p>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin border-b border-stone-200">
          {KIRAT_HISTORY_SECTIONS.map((section, index) => {
            const Icon = iconsMap[section.key];
            const isActive = activeTab === section.key;

            return (
              <button
                key={section.key}
                onClick={() => handleTabChange(section.key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
                <span>
                  {index + 1}. {language === 'ne' ? section.nepaliTitle : section.englishTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Reading & Structured Metadata Container */}
      <div className="bg-white p-6 sm:p-10 rounded-lg border border-stone-200 space-y-8 shadow-2xs">
        
        {/* Topic Header */}
        <div className="space-y-2 border-b border-stone-200 pb-5">
          <div className="flex items-center gap-2 text-xs text-amber-800 font-mono uppercase tracking-wider">
            <span>{t.sections.historyTitle}</span>
            <span aria-hidden="true">·</span>
            <span>{currentSection.englishTitle}</span>
          </div>
          
          <h2 className="font-serif-np text-2xl sm:text-3xl font-bold text-stone-900">
            {language === 'ne' ? currentSection.nepaliTitle : currentSection.englishTitle}
          </h2>
          
          <p className="text-stone-600 text-sm font-sans">
            {currentSection.summary}
          </p>
        </div>

        {/* Future-Ready Metadata Structure */}
        <div className="p-4 sm:p-5 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-stone-600 tracking-wider">
            <Database className="w-3.5 h-3.5 text-amber-800" />
            <span>
              {language === 'ne'
                ? 'अभिलेख संरचना प्रारूप (Future-Ready Archive Schema)'
                : 'Future-Ready Archive Schema'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs text-stone-700 font-sans">
            <div className="p-2.5 bg-white rounded border border-stone-200 space-y-1">
              <span className="text-[11px] text-stone-500 block">
                {language === 'ne' ? 'स्रोत' : 'Source'}
              </span>
              <span className={`font-mono ${activeTab === 'authors_researchers' ? 'text-amber-900 font-semibold' : 'text-stone-400'}`}>
                {activeTab === 'authors_researchers' ? (language === 'ne' ? 'स्रोतबाट चयनित अभिलेख' : 'Selected source record') : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-white rounded border border-stone-200 space-y-1">
              <span className="text-[11px] text-stone-500 block">
                {language === 'ne' ? 'लेखक / अनुसन्धाता' : 'Author / Researcher'}
              </span>
              <span className={`font-serif-np ${activeTab === 'authors_researchers' ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                {activeTab === 'authors_researchers' ? (language === 'ne' ? 'लेखक / अनुसन्धाता अभिलेख' : 'Author / Researcher record') : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-white rounded border border-stone-200 space-y-1">
              <span className="text-[11px] text-stone-500 block">
                {language === 'ne' ? 'मिति / काल' : 'Date / Period'}
              </span>
              <span className={`font-mono ${activeTab === 'authors_researchers' ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                {activeTab === 'authors_researchers' ? (language === 'ne' ? 'मूल स्रोतअनुसार' : 'As documented by source') : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-white rounded border border-stone-200 space-y-1">
              <span className="text-[11px] text-stone-500 block">
                {language === 'ne' ? 'प्रमाण प्रकार' : 'Evidence Type'}
              </span>
              <span className={`${activeTab === 'authors_researchers' ? 'text-stone-900 font-medium' : 'text-stone-400'}`}>
                {activeTab === 'authors_researchers' 
                  ? (language === 'ne' ? 'ऐतिहासिक पुस्तक / प्राथमिक स्रोत' : 'Historical Book / Primary Source') 
                  : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-white rounded border border-stone-200 space-y-1">
              <span className="text-[11px] text-stone-500 block">
                {language === 'ne' ? 'अनुसन्धान स्थिति' : 'Research Status'}
              </span>
              <span className={`${activeTab === 'authors_researchers' ? 'text-sky-800 font-semibold' : 'text-stone-400'}`}>
                {activeTab === 'authors_researchers' 
                  ? (language === 'ne' ? 'मूल स्रोतमा उल्लेखित विवरण' : 'Mentioned in Primary Source') 
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'evidence_archive' && evidenceList.length > 0 ? (
          <EvidenceArchiveList items={evidenceList} language={language} />
        ) : (
          <ComingSoonPlaceholder
              />
        )}

        {/* Next / Prev Navigation */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              const currentIndex = KIRAT_HISTORY_SECTIONS.findIndex(s => s.key === activeTab);
              if (currentIndex > 0) {
                handleTabChange(KIRAT_HISTORY_SECTIONS[currentIndex - 1].key);
              }
            }}
            disabled={activeTab === KIRAT_HISTORY_SECTIONS[0].key}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:hover:text-stone-600 cursor-pointer"
          >
            ← {language === 'ne' ? 'अघिल्लो खण्ड' : 'Previous Section'}
          </button>

          <span className="text-xs text-stone-400 font-mono">
            {KIRAT_HISTORY_SECTIONS.findIndex(s => s.key === activeTab) + 1} / {KIRAT_HISTORY_SECTIONS.length}
          </span>

          <button
            onClick={() => {
              const currentIndex = KIRAT_HISTORY_SECTIONS.findIndex(s => s.key === activeTab);
              if (currentIndex < KIRAT_HISTORY_SECTIONS.length - 1) {
                handleTabChange(KIRAT_HISTORY_SECTIONS[currentIndex + 1].key);
              }
            }}
            disabled={activeTab === KIRAT_HISTORY_SECTIONS[KIRAT_HISTORY_SECTIONS.length - 1].key}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:hover:text-stone-600 cursor-pointer"
          >
            {language === 'ne' ? 'पछिल्लो खण्ड' : 'Next Section'} →
          </button>
        </div>
      </div>

      {/* 4. Published Articles (if any) */}
      {historyArticles.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-stone-200">
          <h3 className="font-serif-np text-xl font-bold text-stone-900">
            {language === 'ne'
              ? 'प्रकाशित किराँत इतिहास अनुसन्धान लेखहरू'
              : 'Published History & Civilization Research Articles'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {historyArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => navigateTo(`/article/${article.slug}`)}
                className="bg-white rounded-lg border border-stone-200 p-6 hover:border-amber-800 transition-colors cursor-pointer space-y-4 shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span>{article.publicationDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.location}</span>
                  </div>
                  <h4 className="font-serif-np text-lg font-bold text-stone-900">
                    {article.title}
                  </h4>
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
        </div>
      )}

    </div>
  );
};
