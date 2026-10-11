import React, { useState } from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { KIRAT_HISTORY_SECTIONS } from '../../data/archiveData';
import { KIRAT_FINAL_RESEARCH_INTRO, KIRAT_FINAL_RESEARCH_SECTIONS, KIRAT_FINAL_RESEARCH_SOURCES } from '../../data/kiratFinalResearch';
import { KiratHistorySectionKey } from '../../types';
import { ResearchBadge } from '../common/ResearchBadge';
import { EvidenceArchiveList } from './EvidenceArchiveList';
import { fetchEvidenceRecords, fetchResearchRecords } from '../../services/dbService';
import { EvidenceRecordItem } from '../../types';
import { KiratCivilizationSynthesis } from './KiratCivilizationSynthesis';
import { TRANSLATIONS } from '../../data/translations';
import { KIRAT_VISITOR_CHAPTERS } from '../../data/kiratVisitorResearch';
import { 
  BookOpen, 
  Clock, 
  Users, 
  FileText, 
  Landmark, 
  MessageSquare, 
  AlertCircle, 
  Bookmark,
  Printer, 
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Globe2
} from 'lucide-react';

const VisitorChapterContent: React.FC<{
  activeTab: KiratHistorySectionKey;
  language: 'ne' | 'en';
}> = ({ activeTab, language }) => {
  const chapter = KIRAT_VISITOR_CHAPTERS.find(item => item.key === activeTab);
  if (!chapter) return null;

  const sources = chapter.evidenceIds
    .map(id => KIRAT_FINAL_RESEARCH_SOURCES.find(source => source.id === id))
    .filter(Boolean) as typeof KIRAT_FINAL_RESEARCH_SOURCES;

  const roleForSource = (sourceId: string) => {
    if (sourceId.startsWith('bl-')) return language === 'ne' ? 'अभिलेखीय पाण्डुलिपि / archival object' : 'Archival manuscript / object';
    if (sourceId.startsWith('documenta-') || sourceId.startsWith('nepalica-')) return language === 'ne' ? 'प्राथमिक ऐतिहासिक दस्तावेज' : 'Primary historical document';
    if (sourceId.includes('evidence')) return language === 'ne' ? 'प्रत्यक्ष प्रमाण extract' : 'Direct evidence extract';
    if (sourceId.includes('hamilton')) return language === 'ne' ? 'ऐतिहासिक documentary account' : 'Historical documentary account';
    return language === 'ne' ? 'विद्वत् अनुसन्धान' : 'Scholarly research';
  };

  return (
    <div className="space-y-7">
      <section className="space-y-5">
        <div className="text-xs font-mono uppercase tracking-wider text-amber-800">
          {language === 'ne' ? 'पढेर बुझ्ने मुख्य प्रश्न' : 'The main question this chapter answers'}
        </div>
        <h3 className="font-serif-np text-xl sm:text-2xl font-bold text-stone-900">
          {language === 'ne' ? chapter.questionNepali : chapter.questionEnglish}
        </h3>
        <div className="space-y-4">
          {(language === 'ne' ? chapter.bodyNepali : chapter.bodyEnglish).split('\n\n').filter(Boolean).map((paragraph, index, all) => (
            <p
              key={index}
              className={index === all.length - 1
                ? 'font-serif-np text-base sm:text-lg leading-8 text-stone-800 bg-[#FBF7EE] border-l-4 border-amber-700 rounded-r-xl px-5 py-4'
                : index === 0
                  ? 'font-serif-np text-lg sm:text-xl leading-8 text-stone-800'
                  : 'font-serif-np text-base sm:text-lg leading-8 text-stone-700'}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-3">
          {language === 'ne' ? 'यस अध्यायमा प्रमाण कसरी जाँचिन्छ' : 'How this chapter is checked'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {[
            language === 'ne' ? 'मूल स्रोत' : 'Original source',
            language === 'ne' ? 'ठ्याक्कै page / folio' : 'Exact page / folio',
            language === 'ne' ? 'स्वतन्त्र cross-check' : 'Independent cross-check',
            language === 'ne' ? 'प्रमाण पुगेको निष्कर्ष' : 'Evidence-bounded conclusion'
          ].map((item, index) => (
            <div key={item} className="rounded-lg bg-stone-50 border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700">
              <span className="text-amber-800 mr-1">0{index + 1}</span>{item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-amber-200 bg-[#FBF7EE] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-900">
              {language === 'ne' ? 'मुख्य प्रमाण' : 'Main Evidence'}
            </div>
            <p className="text-xs text-stone-600 mt-1">
              {language === 'ne' ? 'यस अध्यायलाई support गर्ने प्रमुख स्रोतहरू मात्र यहाँ देखाइएका छन्।' : 'Only the principal evidence-bearing sources for this chapter are shown here.'}
            </p>
          </div>
          <span className="text-[11px] font-mono text-stone-500">{sources.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sources.map(source => (
            <div key={source.id} className="rounded-lg bg-white border border-stone-200 p-4 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-800">
                {roleForSource(source.id)}
              </div>
              <div className="font-semibold text-stone-900 text-sm">{source.author}</div>
              <div className="font-serif-np text-sm text-stone-800 leading-snug">{source.work}</div>
              <div className="text-xs text-stone-500">{source.year}</div>
              {source.evidence && (
                <div className="text-[11px] leading-relaxed text-stone-600 bg-stone-50 rounded-md px-2.5 py-2 border border-stone-100">
                  {source.evidence}
                </div>
              )}
              {source.url && (
                <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950">
                  {language === 'ne' ? 'मूल स्रोत हेर्नुहोस्' : 'Open source'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2 text-[11px] font-medium">
        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
          {language === 'ne' ? 'प्रत्यक्ष प्रमाणलाई प्राथमिकता' : 'Direct evidence prioritized'}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
          {language === 'ne' ? 'विद्वत् व्याख्या छुट्टै' : 'Scholarly interpretation separated'}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
          {language === 'ne' ? 'असमाधित दाबी खुला राखिन्छ' : 'Unresolved claims remain open'}
        </span>
      </div>
    </div>
  );
};

const FinalResearchSectionContent: React.FC<{ activeTab: KiratHistorySectionKey; language: 'ne' | 'en'; publishedRecord?: import('../../types').ResearchRecordItem }> = ({ activeTab, language, publishedRecord }) => {
  const section = KIRAT_FINAL_RESEARCH_SECTIONS.find(item => item.key === activeTab);
  if (!section) return null;

  const displayTitleNe = publishedRecord?.nepaliTitle || section.nepaliTitle;
  const displayTitleEn = publishedRecord?.englishTitle || publishedRecord?.title || section.englishTitle;
  const displaySummaryNe = publishedRecord?.nepaliExplanation || publishedRecord?.researchConclusion || section.summaryNepali;
  const displaySummaryEn = publishedRecord?.englishExplanation || publishedRecord?.researchConclusion || section.summaryEnglish;

  const publicSourceIds = [
    'hamilton-1819',
    'kirkpatrick-1811',
    'hodgson-ras-manuscript',
    'bl-eap1023-22-17-kirat-dharma',
    'bl-eap1023-21-5-kirat-dharma',
    'documenta-pallo-kirata-records',
    'documenta-rrc-0036-0252',
    'van-driem-limbu'
  ];
  const sourceIds = section.sourceIds.includes('ALL')
    ? publicSourceIds
    : section.sourceIds;
  const sources = KIRAT_FINAL_RESEARCH_SOURCES.filter(source => sourceIds.includes(source.id));

  const isStrongEvidence = (status: string) =>
    status.includes('PAGE_LEVEL') || status.includes('VERIFIED_FOLIO') || status.includes('ARTICLE_IDENTITY_AND_PAGE_RANGE_VERIFIED');

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-800 mt-0.5 shrink-0" />
          <div className="space-y-2">
            <p className="text-sm font-semibold text-stone-900">
              {language === 'ne' ? KIRAT_FINAL_RESEARCH_INTRO.nepali : KIRAT_FINAL_RESEARCH_INTRO.english}
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'ne'
                ? 'प्रत्येक निष्कर्षलाई उपलब्ध प्रमाणको सीमाभित्र मात्र प्रस्तुत गरिएको छ।'
                : 'Every conclusion is stated only within the boundary of the evidence currently available.'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-serif-np text-xl sm:text-2xl font-bold text-stone-900">
          {language === 'ne' ? displayTitleNe : displayTitleEn}
        </h3>
        <p className="text-sm text-stone-700 leading-relaxed">
          {language === 'ne' ? displaySummaryNe : displaySummaryEn}
        </p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-600">
            {language === 'ne' ? 'सम्बन्धित स्रोत तथा प्रमाण स्थिति' : 'Related Sources & Evidence Status'}
          </div>
          <div className="text-[11px] text-stone-500 font-mono">
            {sources.length} {language === 'ne' ? 'स्रोत' : 'sources'}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {sources.map(source => {
            const strong = isStrongEvidence(source.status);
            return (
              <div key={source.id} className="rounded-md border border-stone-200 bg-white p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-stone-900">{source.author}</div>
                    <div className="text-sm font-medium text-stone-800 leading-snug">{source.work}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{source.year}</div>
                  </div>
                  {source.url && (
                    <a href={source.url} target="_blank" rel="noreferrer" className="text-stone-500 hover:text-stone-900 shrink-0" aria-label="Open source">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <div className={`flex items-start gap-2 text-[11px] leading-relaxed rounded p-2 ${strong ? 'bg-emerald-50 text-emerald-900' : 'bg-stone-100 text-stone-700'}`}>
                  {strong ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                  <span>{source.evidence}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeTab === 'sources_references' && (
        <div className="text-xs text-stone-500 leading-relaxed border-t border-stone-200 pt-4">
          {language === 'ne'
            ? 'यहाँ visitor-friendly मुख्य स्रोत मात्र देखाइएका छन्। पूर्ण 45-source audit, duplicate institutional records, page/folio status र research notes अनुसन्धान तहमा सुरक्षित छन्।'
            : 'This public view shows only the main visitor-friendly sources. The complete 45-source audit, institutional variants, page/folio status, and research notes remain in the research layer.'}
        </div>
      )}
    </div>
  );
};

export const KiratHistoryView: React.FC = () => {
  const { articles, navigateTo, language } = useArchive();
  const t = TRANSLATIONS[language];

  const [activeTab, setActiveTab] = useState<KiratHistorySectionKey>(() => {
    if (typeof window !== 'undefined') {
      // IMPORTANT: the app uses the URL hash for top-level routing (e.g. #/history).
      // Never write a section key directly into window.location.hash or the router will
      // interpret it as a route and fall back to Home. Section state is kept separately.
      try {
        const saved = sessionStorage.getItem('sadan_rai_history_section');
        if (saved && KIRAT_HISTORY_SECTIONS.some(s => s.key === saved)) {
          return saved as KiratHistorySectionKey;
        }
      } catch {
        // Ignore unavailable session storage.
      }
    }
    return 'intro';
  });

  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [evidenceList, setEvidenceList] = useState<EvidenceRecordItem[]>([]);
  const [publishedFinalResearch, setPublishedFinalResearch] = useState<import('../../types').ResearchRecordItem[]>([]);

  React.useEffect(() => {
    fetchEvidenceRecords(false).then(data => {
      setEvidenceList(data);
    }).catch(() => {});
  }, []);

  React.useEffect(() => {
    fetchResearchRecords(false).then(data => {
      setPublishedFinalResearch(data.filter(record => record.id.startsWith('kirat-final-')));
    }).catch(() => {});
  }, []);

  const handleTabChange = (key: KiratHistorySectionKey) => {
    setActiveTab(key);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('sadan_rai_history_section', key);
      } catch {
        // Ignore unavailable session storage.
      }
      // Keep the top-level route exactly as #/history. Do not change the hash here.
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    sources_references: Bookmark,
    geography_settlements: Landmark,
    origins_migration: Users,
    political_history: Landmark,
    social_structure: Users,
    religion_worldview: Sparkles,
    language_literature: BookOpen,
    archaeology_material: FileText,
    economy_livelihood: Database,
    places_sacred_landscape: Landmark,
    external_records_comparison: Layers,
    modern_identity: Sparkles,
    research_method_conclusions: CheckCircle2
  };

  const currentSection = KIRAT_HISTORY_SECTIONS.find(s => s.key === activeTab) || KIRAT_HISTORY_SECTIONS[0];
  const publishedRecord = publishedFinalResearch.find(record => record.id === `kirat-final-${activeTab}`);

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
                ? `${KIRAT_HISTORY_SECTIONS.length} मुख्य विषयगत अनुसन्धान खण्डहरू`
                : `${KIRAT_HISTORY_SECTIONS.length} Structured Research Sections`}
            </span>
          </div>
          <div className="flex items-center gap-2">
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

      {/* 2. Twenty visitor-friendly research chapters */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-stone-500 font-mono">
          {language === 'ne'
            ? `किराँत इतिहासका ${KIRAT_HISTORY_SECTIONS.length} अनुसन्धान खण्डहरू:`
            : `${KIRAT_HISTORY_SECTIONS.length} Structured History & Civilization Sections:`}
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

      {/* 3. Main reading chapter */}
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
            {language === 'ne' ? currentSection.summary : currentSection.summaryEnglish}
          </p>
        </div>

        {/* Visitor-first content: knowledge first, evidence second. */}
        {activeTab === 'evidence_archive' ? (
          <div className="space-y-7">
            <VisitorChapterContent activeTab={activeTab} language={language} />
            {evidenceList.length > 0 ? (
              <section className="pt-5 border-t border-stone-200 space-y-4">
                <h3 className="font-serif-np text-xl font-bold text-stone-900">
                  {language === 'ne' ? 'अभिलेखमा दर्ता गरिएका प्रमाणहरू' : 'Evidence objects registered in the archive'}
                </h3>
                <EvidenceArchiveList items={evidenceList} language={language} />
              </section>
            ) : (
              <section className="pt-5 border-t border-stone-200 rounded-xl bg-stone-50 p-5 space-y-2">
                <h3 className="font-serif-np text-lg font-bold text-stone-900">
                  {language === 'ne' ? 'सार्वजनिक evidence upload हुन बाँकी' : 'Public evidence uploads are not yet populated'}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {language === 'ne'
                    ? 'Catalogue र source identity पहिचान भएका प्रमाणहरू माथि देखिन्छन्। वास्तविक scan/photo/PDF/audio/video evidence अधिकारअनुसार Admin बाट upload भएपछि यही अभिलेखमा देखिन्छ।'
                    : 'Catalogue-identified evidence is shown above. Actual scan/photo/PDF/audio/video evidence will appear here after owner upload, subject to rights and access conditions.'}
                </p>
              </section>
            )}
          </div>
        ) : activeTab === 'sources_references' ? (
          <div className="space-y-7">
            <VisitorChapterContent activeTab={activeTab} language={language} />
            <FinalResearchSectionContent activeTab={activeTab} language={language} publishedRecord={publishedRecord} />
          </div>
        ) : (
          <VisitorChapterContent activeTab={activeTab} language={language} />
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


// Universal History & Civilization Hub — Kirat is the featured/main collection,
// while the same archive remains open to every civilization, community and future collection.
type HistoryCollection = {
  slug: string;
  ne: string;
  en: string;
  descriptionNe: string;
  descriptionEn: string;
  featured?: boolean;
  icon: React.ElementType;
};

const UNIVERSAL_HISTORY_COLLECTIONS: HistoryCollection[] = [
  {
    slug: 'kirat', ne: 'किरात इतिहास तथा सभ्यता', en: 'Kirat History & Civilization', featured: true,
    descriptionNe: 'यस अभिलेखको मुख्य अनुसन्धान संग्रह — २० संरचित अनुसन्धान खण्ड, स्रोत, प्रमाण, मौखिक इतिहास र नयाँ खोजसहित।',
    descriptionEn: 'The archive’s main research collection — 20 structured research sections with sources, evidence, oral history and new findings.', icon: Landmark
  },
  { slug: 'buddhist', ne: 'बौद्ध इतिहास तथा सभ्यता', en: 'Buddhist History & Civilization', descriptionNe: 'बौद्ध इतिहास, सभ्यता, ग्रन्थ, पुरातत्त्व, स्थल र प्रमाणका लागि संरचित संग्रह।', descriptionEn: 'A structured collection for Buddhist history, civilization, texts, archaeology, sites and evidence.', icon: Sparkles },
  { slug: 'hindu', ne: 'हिन्दू इतिहास तथा सभ्यता', en: 'Hindu History & Civilization', descriptionNe: 'हिन्दू इतिहास, परम्परा, सभ्यता, ग्रन्थ, स्थल र ऐतिहासिक प्रमाणका लागि संग्रह।', descriptionEn: 'A collection for Hindu history, traditions, civilization, texts, sites and historical evidence.', icon: BookOpen },
  { slug: 'limbu', ne: 'लिम्बू इतिहास तथा सभ्यता', en: 'Limbu History & Civilization', descriptionNe: 'लिम्बू इतिहास, भाषा, अभिलेख, परम्परा, भूगोल र सांस्कृतिक निरन्तरताका लागि संग्रह।', descriptionEn: 'A collection for Limbu history, language, records, traditions, geography and cultural continuity.', icon: Users },
  { slug: 'rai', ne: 'राई इतिहास तथा सभ्यता', en: 'Rai History & Civilization', descriptionNe: 'राई समुदायका इतिहास, मौखिक परम्परा, भाषा, अभिलेख र प्रमाणका लागि संग्रह।', descriptionEn: 'A collection for Rai history, oral traditions, language, records and evidence.', icon: Users },
  { slug: 'tamang', ne: 'तामाङ इतिहास तथा सभ्यता', en: 'Tamang History & Civilization', descriptionNe: 'तामाङ इतिहास, संस्कृति, भूगोल, अभिलेख र अनुसन्धानका लागि संरचित स्थान।', descriptionEn: 'A structured space for Tamang history, culture, geography, records and research.', icon: Users },
  { slug: 'kiranti', ne: 'किराँती तथा अन्य सम्बन्धित समुदाय', en: 'Kiranti & Related Communities', descriptionNe: 'विभिन्न किराँती समुदायका छुट्टाछुट्टै इतिहास, भाषा, परम्परा र प्रमाणलाई अलग पहिचानसहित राख्ने संग्रह।', descriptionEn: 'A collection designed to preserve distinct histories, languages, traditions and evidence of Kiranti communities.', icon: Layers },
  { slug: 'archaeology', ne: 'पुरातात्त्विक तथा भौतिक इतिहास', en: 'Archaeological & Material History', descriptionNe: 'पुरातत्त्व, वस्तु, स्मारक, उत्खनन र भौतिक प्रमाणका लागि विश्वव्यापी संरचना।', descriptionEn: 'A universal structure for archaeology, objects, monuments, excavations and material evidence.', icon: Database },
  { slug: 'ancient-medieval', ne: 'प्राचीन तथा मध्यकालीन इतिहास', en: 'Ancient & Medieval History', descriptionNe: 'प्राचीन र मध्यकालीन इतिहासलाई स्रोत, कालक्रम र प्रमाणका आधारमा व्यवस्थित गर्ने संग्रह।', descriptionEn: 'A collection for ancient and medieval history organized through sources, chronology and evidence.', icon: Clock },
  { slug: 'comparative-world', ne: 'तुलनात्मक तथा विश्व इतिहास', en: 'Comparative & World History', descriptionNe: 'विभिन्न क्षेत्र र सभ्यताबीच प्रमाणमा आधारित तुलनात्मक अनुसन्धानका लागि संग्रह।', descriptionEn: 'A collection for evidence-based comparative research across regions and civilizations.', icon: Globe2 },
  { slug: 'other', ne: 'अन्य तथा भविष्यका सभ्यताहरू', en: 'Other & Future Civilizations', descriptionNe: 'भविष्यमा थपिने अन्य इतिहास, सभ्यता र अनुसन्धान संग्रहका लागि खुला संरचना।', descriptionEn: 'An open structure for additional histories, civilizations and research collections added in the future.', icon: Layers },
];

export const HistoryCollectionView: React.FC<{ slug: string }> = ({ slug }) => {
  const { language, navigateTo, getArchiveSection } = useArchive();
  const section = getArchiveSection('history_civilization');
  const collection = UNIVERSAL_HISTORY_COLLECTIONS.find(item => item.slug === slug);
  if (!collection) {
    navigateTo('/history');
    return null;
  }
  const Icon = collection.icon;
  const isNe = language === 'ne';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
        <button onClick={() => navigateTo('/')} className="hover:text-stone-900 font-semibold cursor-pointer">{isNe ? 'गृहपृष्ठ' : 'Home'}</button>
        <span>›</span>
        <button onClick={() => navigateTo('/history')} className="hover:text-stone-900 font-semibold cursor-pointer">{isNe ? (section?.nepaliTitle || 'इतिहास तथा सभ्यता') : (section?.englishTitle || 'History & Civilization')}</button>
        <span>›</span>
        <span className="text-stone-900">{isNe ? collection.ne : collection.en}</span>
      </div>

      <section className="rounded-3xl bg-stone-900 text-white p-7 sm:p-10 lg:p-12 border border-stone-800">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-amber-300 font-semibold">
              <Icon className="w-4 h-4" />
              <span>{isNe ? 'इतिहास तथा सभ्यता संग्रह' : 'History & Civilization Collection'}</span>
            </div>
            <h1 className="font-serif-np text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{isNe ? collection.ne : collection.en}</h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">{isNe ? collection.descriptionNe : collection.descriptionEn}</p>
          </div>
          {collection.featured && <span className="shrink-0 rounded-full bg-amber-300 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-900">{isNe ? 'मुख्य संग्रह' : 'Main Collection'}</span>}
        </div>
      </section>

      {collection.featured ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 sm:p-8 space-y-4">
          <div className="text-xs uppercase tracking-[0.18em] text-amber-900 font-semibold">{isNe ? 'मुख्य अनुसन्धान प्रवेशद्वार' : 'Main Research Gateway'}</div>
          <h2 className="font-serif-np text-2xl font-bold text-stone-900">{isNe ? 'किरात इतिहासको पूर्ण अनुसन्धान अभिलेख खोल्नुहोस्' : 'Open the complete Kirat research archive'}</h2>
          <p className="text-sm text-stone-600 leading-relaxed">{isNe ? 'मूल २० अनुसन्धान खण्ड, स्रोत तथा सन्दर्भ, प्रमाण अभिलेख, मौखिक इतिहास, विवादित विषय र अनुसन्धान निष्कर्ष यही संग्रहभित्र सुरक्षित छन्।' : 'The original 20 research sections, sources, evidence archive, oral history, disputed topics and research conclusions remain inside this collection.'}</p>
          <button onClick={() => navigateTo('/history/kirat')} className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-900 transition-colors cursor-pointer">
            {isNe ? 'किरात अनुसन्धान खोल्नुहोस्' : 'Open Kirat Research'} <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      ) : (
        <section className="rounded-2xl border border-stone-200 bg-white p-7 sm:p-9 space-y-3">
          <div className="text-xs uppercase tracking-[0.18em] text-stone-500 font-semibold">{isNe ? 'अनुसन्धान स्थिति' : 'Research status'}</div>
          <h2 className="font-serif-np text-2xl font-bold text-stone-900">{isNe ? 'यो संग्रह विस्तार हुँदैछ' : 'This collection is being developed'}</h2>
          <p className="text-sm text-stone-600 leading-relaxed">{isNe ? 'यस विषयका प्रमाण, स्रोत र अनुसन्धान अभिलेख क्रमशः थपिँदै जानेछन्। प्रमाण नभएको सामग्रीलाई तथ्यका रूपमा प्रस्तुत गरिँदैन।' : 'Sources, evidence and research records for this subject will be added progressively. Material without adequate evidence will not be presented as established fact.'}</p>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-6">
        <button onClick={() => navigateTo('/history')} className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 hover:border-stone-500 cursor-pointer">← {isNe ? 'इतिहास तथा सभ्यता संग्रह' : 'History & Civilization Hub'}</button>
        <button onClick={() => navigateTo('/')} className="text-sm font-semibold text-stone-600 hover:text-stone-900 cursor-pointer">{isNe ? 'गृहपृष्ठ' : 'Home'}</button>
      </div>
    </div>
  );
};

export const HistoryView: React.FC = () => {
  const { language, navigateTo, getArchiveSection } = useArchive();
  const section = getArchiveSection('history_civilization');
  const isNe = language === 'ne';
  const featured = UNIVERSAL_HISTORY_COLLECTIONS[0];
  const Icon = featured.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
        <button onClick={() => navigateTo('/')} className="hover:text-stone-900 font-semibold cursor-pointer">{isNe ? 'गृहपृष्ठ' : 'Home'}</button>
        <span>›</span>
        <span className="text-stone-900">{isNe ? (section?.nepaliTitle || 'इतिहास तथा सभ्यता') : (section?.englishTitle || 'History & Civilization')}</span>
      </div>

      <section className="rounded-3xl bg-stone-900 text-white p-7 sm:p-10 lg:p-12 border border-stone-800">
        <div className="max-w-4xl space-y-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold"><BookOpen className="w-4 h-4" />{isNe ? 'सार्वभौमिक इतिहास तथा सभ्यता अभिलेख' : 'Universal History & Civilization Archive'}</div>
          <h1 className="font-serif-np text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">{isNe ? 'इतिहास तथा सभ्यता' : 'History & Civilization'}</h1>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">{isNe ? (section?.nepaliBody || section?.nepaliDescription) : (section?.englishBody || section?.englishDescription)}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-stone-900 p-3 text-amber-300"><Icon className="w-7 h-7" /></div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-amber-900 font-bold">{isNe ? 'मुख्य फोकस' : 'Main Focus'}</div>
              <h2 className="font-serif-np text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{isNe ? featured.ne : featured.en}</h2>
              <p className="text-sm text-stone-600 mt-2 max-w-3xl leading-relaxed">{isNe ? featured.descriptionNe : featured.descriptionEn}</p>
            </div>
          </div>
          <button onClick={() => navigateTo('/history/kirat')} className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-900 transition-colors cursor-pointer">{isNe ? 'मुख्य अनुसन्धान खोल्नुहोस्' : 'Open Main Research'} <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-stone-500 font-semibold">{isNe ? 'अन्य तथा विस्तारित संग्रह' : 'Other & Expanded Collections'}</div>
          <h2 className="font-serif-np text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{isNe ? 'हरेक इतिहासका लागि एउटै संरचना' : 'One structure for every history'}</h2>
          <p className="text-sm text-stone-600 mt-2 max-w-3xl">{isNe ? 'कुनै विषयलाई Kirat मा जबर्जस्ती मिसाइँदैन। हरेक संग्रह आफ्नै पहिचान, स्रोत, प्रमाण र अनुसन्धान अवस्थासहित विस्तार हुन सक्छ।' : 'No subject is forced into the Kirat collection. Each collection can grow with its own identity, sources, evidence and research status.'}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {UNIVERSAL_HISTORY_COLLECTIONS.slice(1).map((item) => {
            const ItemIcon = item.icon;
            return (
              <button key={item.slug} onClick={() => navigateTo(`/history/${item.slug}`)} className="group text-left rounded-2xl border border-stone-200 bg-white p-5 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4"><span className="rounded-xl bg-stone-100 p-2.5 text-stone-700 group-hover:bg-amber-50 group-hover:text-amber-900"><ItemIcon className="w-5 h-5" /></span><ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 mt-1" /></div>
                <h3 className="font-serif-np text-lg font-bold text-stone-900 mt-4">{isNe ? item.ne : item.en}</h3>
                <p className="text-xs text-stone-600 leading-relaxed mt-2">{isNe ? item.descriptionNe : item.descriptionEn}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-stone-50 p-6 sm:p-8">
        <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" /><div><h2 className="font-serif-np text-xl font-bold text-stone-900">{isNe ? 'समान प्रमाण-आधारित मापदण्ड' : 'A shared evidence-based standard'}</h2><p className="text-sm text-stone-600 leading-relaxed mt-2">{isNe ? 'स्रोत, सन्दर्भ, प्रमाण, अनुसन्धान, विवादित दाबी र निष्कर्षलाई छुट्टाछुट्टै पहिचानसहित व्यवस्थित गरिनेछ। विषयअनुसार सामग्री फरक हुन सक्छ, तर अभिलेखको गुणस्तर र अनुसन्धान अनुशासन समान रहनेछ।' : 'Sources, references, evidence, research, disputed claims and conclusions are kept distinct. Content varies by subject, but the archive’s quality and research discipline remain consistent.'}</p></div></div>
      </section>
    </div>
  );
};
