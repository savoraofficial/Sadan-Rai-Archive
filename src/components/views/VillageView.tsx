import React, { useState } from 'react';
import { MALBASE_SECTION_HEADINGS, BRAND_INFO } from '../../data/archiveData';
import { VillageSectionKey } from '../../types';
import { useArchive } from '../../context/ArchiveContext';
import { ComingSoonPlaceholder } from '../common/ComingSoonPlaceholder';
import { TRANSLATIONS } from '../../data/translations';
import { 
  MapPin, 
  BookOpen, 
  Users, 
  Sparkles, 
  Compass, 
  Trees, 
  Landmark, 
  Clock, 
  FolderArchive, 
  MessageSquare,
  Share2,
  Printer
} from 'lucide-react';

export const VillageView: React.FC = () => {
  const { navigateTo, language } = useArchive();
  const [activeTab, setActiveTab] = useState<VillageSectionKey>('intro');
  const [copied, setCopied] = useState(false);

  const t = TRANSLATIONS[language];

  const iconsMap: Record<VillageSectionKey, any> = {
    intro: MapPin,
    history: BookOpen,
    culture: Sparkles,
    customs: Clock,
    livelihood: Users,
    migration: Compass,
    nature: Trees,
    places: Landmark,
    elders: Users,
    archives: FolderArchive,
    stories: MessageSquare
  };

  const currentSection = MALBASE_SECTION_HEADINGS.find(s => s.key === activeTab) || MALBASE_SECTION_HEADINGS[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. Header Banner */}
      <div className="bg-stone-900 text-white rounded-lg p-6 sm:p-10 border border-stone-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-amber-400 uppercase">
          <MapPin className="w-3.5 h-3.5" />
          <span>{t.sections.villageCategory}</span>
        </div>

        <h1 className="font-serif-np text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          {t.sections.villageTitle}
        </h1>
        
        <p className="font-serif-np text-base sm:text-lg text-amber-200/90 font-medium">
          {t.location}
        </p>

        <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans">
          {t.sections.villageSubtitle}
        </p>

        <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>
              {language === 'ne'
                ? `अभिलेखक: ${BRAND_INFO.name} (${BRAND_INFO.nepaliName})`
                : `Archivist: ${BRAND_INFO.name}`}
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

      {/* 2. Interactive 11-Subsections Navigation Bar */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-stone-500 font-mono">
          {t.sections.villageSubheadingsCount}:
        </p>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin border-b border-stone-200">
          {MALBASE_SECTION_HEADINGS.map((section, index) => {
            const Icon = iconsMap[section.key];
            const isActive = activeTab === section.key;

            return (
              <button
                key={section.key}
                onClick={() => setActiveTab(section.key)}
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

      {/* 3. Main Reading Container */}
      <div className="bg-white p-6 sm:p-10 rounded-lg border border-stone-200 space-y-6 shadow-2xs">
        
        {/* Subsection Title */}
        <div className="space-y-2 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 text-xs text-amber-800 font-mono uppercase tracking-wider">
            <span>{t.sections.villageTitle}</span>
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

        {/* Content Area */}
        {currentSection.content.length > 0 ? (
          <div className="space-y-4 text-stone-700 text-sm leading-relaxed">
            {currentSection.content.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          <ComingSoonPlaceholder
              />
        )}

        {/* Next / Prev Navigation */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              const currentIndex = MALBASE_SECTION_HEADINGS.findIndex(s => s.key === activeTab);
              if (currentIndex > 0) {
                setActiveTab(MALBASE_SECTION_HEADINGS[currentIndex - 1].key);
              }
            }}
            disabled={activeTab === MALBASE_SECTION_HEADINGS[0].key}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:hover:text-stone-600 cursor-pointer"
          >
            ← {language === 'ne' ? 'अघिल्लो खण्ड' : 'Previous Section'}
          </button>

          <span className="text-xs text-stone-400 font-mono">
            {MALBASE_SECTION_HEADINGS.findIndex(s => s.key === activeTab) + 1} / {MALBASE_SECTION_HEADINGS.length}
          </span>

          <button
            onClick={() => {
              const currentIndex = MALBASE_SECTION_HEADINGS.findIndex(s => s.key === activeTab);
              if (currentIndex < MALBASE_SECTION_HEADINGS.length - 1) {
                setActiveTab(MALBASE_SECTION_HEADINGS[currentIndex + 1].key);
              }
            }}
            disabled={activeTab === MALBASE_SECTION_HEADINGS[MALBASE_SECTION_HEADINGS.length - 1].key}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:hover:text-stone-600 cursor-pointer"
          >
            {language === 'ne' ? 'पछिल्लो खण्ड' : 'Next Section'} →
          </button>
        </div>

      </div>

    </div>
  );
};
