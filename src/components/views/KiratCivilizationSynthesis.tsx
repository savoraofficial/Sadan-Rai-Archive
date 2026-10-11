import React from 'react';
import { ExternalLink, Landmark, ShieldCheck, BookOpen, Globe2, Clock3, FileCheck2, SearchCheck } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';
import { KIRAT_CIVILIZATION_INTRO, KIRAT_NAME_ANALYSIS, KIRAT_AGE_STATEMENT, KIRAT_TIMELINE, KIRAT_MAIN_EVIDENCE, KIRAT_GLOBAL_CROSSCHECK, KIRAT_PUBLIC_CONCLUSION } from '../../data/kiratCivilizationSynthesis';

const levelLabel = (level: string, language: 'ne' | 'en') => {
  const labels: Record<string, { ne: string; en: string }> = {
    direct: { ne: 'प्रत्यक्ष / अभिलेखीय', en: 'Direct / archival' },
    chronicle: { ne: 'क्रोनिकल / परम्परागत', en: 'Chronicle / traditional' },
    scholarship: { ne: 'विद्वत् व्याख्या', en: 'Scholarly interpretation' },
    identity: { ne: 'आधुनिक पहिचान', en: 'Modern identity' }
  };
  return labels[level]?.[language] || level;
};

export const KiratCivilizationSynthesis: React.FC = () => {
  const { language } = useArchive();
  const isNe = language === 'ne';

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-stone-800 bg-stone-950 text-white p-6 sm:p-8 lg:p-10 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,119,6,0.16),transparent_38%)]" />
        <div className="relative space-y-5 max-w-4xl">
          <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-[0.18em] font-semibold"><Landmark className="w-4 h-4" />{isNe ? 'प्रमाणमा आधारित सभ्यता परिचय' : 'Evidence-led civilization profile'}</div>
          <h3 className="font-serif-np text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{isNe ? 'किराँत सभ्यता: नाम, गठन, प्रमाण र ऐतिहासिक विकास' : 'Kirat Civilization: Name, Formation, Evidence & Historical Development'}</h3>
          <p className="text-stone-300 text-sm sm:text-base leading-7 max-w-3xl">{isNe ? KIRAT_CIVILIZATION_INTRO.ne : KIRAT_CIVILIZATION_INTRO.en}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['direct', 'chronicle', 'scholarship'].map(level => <span key={level} className="px-3 py-1.5 rounded-full border border-stone-700 bg-stone-900/70 text-xs text-stone-200">{levelLabel(level, language)}</span>)}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl border border-stone-200 bg-white p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider"><BookOpen className="w-4 h-4" />{isNe ? 'नाम र पहिचान' : 'Name & identity'}</div>
          <h4 className="font-serif-np text-2xl font-bold text-stone-900">{isNe ? KIRAT_NAME_ANALYSIS.ne.heading : KIRAT_NAME_ANALYSIS.en.heading}</h4>
          <p className="text-sm text-stone-700 leading-7">{isNe ? KIRAT_NAME_ANALYSIS.ne.body : KIRAT_NAME_ANALYSIS.en.body}</p>
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-xs leading-6 text-stone-700">{isNe ? KIRAT_NAME_ANALYSIS.ne.evidence : KIRAT_NAME_ANALYSIS.en.evidence}</div>
        </div>
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider"><Clock3 className="w-4 h-4" />{isNe ? 'कति पुरानो?' : 'How old?'}</div>
          <h4 className="font-serif-np text-2xl font-bold text-stone-900">{isNe ? 'एकै वर्ष-संख्या होइन, प्रमाणका तह' : 'Evidence layers, not one age-number'}</h4>
          <p className="text-sm text-stone-700 leading-7">{isNe ? KIRAT_AGE_STATEMENT.ne : KIRAT_AGE_STATEMENT.en}</p>
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700"><ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />{isNe ? 'अतिरञ्जित संख्या प्रयोग गरिएको छैन' : 'No unsupported age claim'}</div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3"><div><p className="text-[11px] uppercase tracking-[0.18em] text-amber-800 font-semibold">01 · {isNe ? 'गठन र विकास' : 'Formation & development'}</p><h4 className="font-serif-np text-2xl font-bold text-stone-900">{isNe ? 'किरात इतिहासलाई कसरी बुझ्ने?' : 'How should Kirat history be reconstructed?'}</h4></div><SearchCheck className="w-6 h-6 text-stone-400" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {KIRAT_TIMELINE.map((item, index) => (
            <article key={`${item.titleEn}-${index}`} className="rounded-xl border border-stone-200 bg-white p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between gap-2"><span className="text-[11px] font-mono text-stone-500">{item.periodEn}</span><span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] font-medium text-stone-600">{levelLabel(item.level, language)}</span></div>
              <h5 className="font-serif-np text-lg font-bold text-stone-900">{isNe ? item.titleNe : item.titleEn}</h5>
              <p className="text-sm text-stone-600 leading-6">{isNe ? item.bodyNe : item.bodyEn}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[11px] uppercase tracking-[0.18em] text-amber-800 font-semibold">02 · {isNe ? 'मुख्य प्रमाण' : 'Main evidence'}</p><h4 className="font-serif-np text-2xl font-bold text-stone-900">{isNe ? 'कुन स्रोतले वास्तवमै के देखाउँछ?' : 'What does each main source actually show?'}</h4><p className="text-sm text-stone-600 mt-1">{isNe ? 'मुख्य evidence मात्र यहाँ देखाइएको छ; पूर्ण 45-source audit अलग अनुसन्धान तहमा सुरक्षित छ।' : 'Only the main evidence-bearing sources are surfaced here; the full 45-source audit remains in the research layer.'}</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {KIRAT_MAIN_EVIDENCE.map(source => (
            <article key={source.id} className="rounded-xl border border-stone-200 bg-white p-5 space-y-4">
              <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2 mb-1"><FileCheck2 className="w-4 h-4 text-emerald-700" /><span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">{levelLabel(source.level, language)}</span></div><h5 className="font-serif-np text-lg font-bold text-stone-900">{isNe ? source.titleNe : source.titleEn}</h5><p className="text-xs text-stone-500 mt-1">{isNe ? source.institutionNe : source.institutionEn} · {isNe ? source.countryNe : source.countryEn} · {source.date}</p></div>{source.url && <a href={source.url} target="_blank" rel="noreferrer" className="shrink-0 rounded-lg border border-stone-200 p-2 text-stone-500 hover:text-stone-900" aria-label={isNe ? 'मूल स्रोत खोल्नुहोस्' : 'Open original source'}><ExternalLink className="w-4 h-4" /></a>}</div>
              <div className="grid gap-3 text-xs"><div className="rounded-lg bg-stone-50 border border-stone-100 p-3"><span className="block text-stone-500 mb-1">{isNe ? 'ठ्याक्कै evidence target' : 'Exact evidence target'}</span><span className="text-stone-800 leading-5">{isNe ? source.targetNe : source.targetEn}</span></div><div><span className="block text-stone-500 mb-1">{isNe ? 'स्रोतले देखाउने कुरा' : 'What it shows'}</span><p className="text-stone-700 leading-6">{isNe ? source.findingNe : source.findingEn}</p></div><div className="border-t border-stone-100 pt-3"><span className="block text-stone-500 mb-1">{isNe ? 'सीमा' : 'Limit'}</span><p className="text-stone-600 leading-6">{isNe ? source.limitationNe : source.limitationEn}</p></div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider"><Globe2 className="w-4 h-4" />03 · {isNe ? 'अन्तर्राष्ट्रिय cross-check' : 'International cross-check'}</div>
        <div><h4 className="font-serif-np text-2xl font-bold text-stone-900">{isNe ? 'एउटै देशको स्रोतमा निर्भर होइन' : 'Not dependent on one country or one archive'}</h4><p className="text-sm text-stone-600 mt-1">{isNe ? 'हालको defined evidence inventory मा विभिन्न देश/संस्थाका independent records मिलाएर जाँच गरिएको छ। यसलाई “विश्वका सबै अभिलेख 100% जाँच” भनेर दाबी गरिएको छैन।' : 'The defined evidence inventory is cross-checked across independent institutions and countries. This is not represented as a claim that every archive in the world has been exhaustively checked.'}</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          {KIRAT_GLOBAL_CROSSCHECK.map(item => <div key={item.countryEn} className="rounded-xl bg-white border border-stone-200 p-4 space-y-2"><p className="text-xs font-semibold text-stone-900">{isNe ? item.countryNe : item.countryEn}</p><p className="text-xs text-amber-900 font-medium">{isNe ? item.institutionNe : item.institutionEn}</p><p className="text-[11px] text-stone-600 leading-5">{isNe ? item.roleNe : item.roleEn}</p></div>)}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-7 space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider"><ShieldCheck className="w-4 h-4" />04 · {isNe ? 'अनुसन्धान निष्कर्ष' : 'Research conclusion'}</div>
        <p className="font-serif-np text-lg sm:text-xl font-semibold text-stone-900 leading-8">{isNe ? KIRAT_PUBLIC_CONCLUSION.ne : KIRAT_PUBLIC_CONCLUSION.en}</p>
      </section>

      <section className="border-t border-stone-200 pt-5 text-xs text-stone-500 leading-6">
        {isNe
          ? 'Evidence discipline: प्रत्यक्ष अभिलेख, क्रोनिकल/परम्परा, र scholarly interpretation लाई एउटै प्रमाण स्तरमा मिसाइएको छैन। Restricted/copyrighted objects लाई catalogue reference र lawful upload target का रूपमा मात्र देखाइन्छ।'
          : 'Evidence discipline: direct archival material, chronicle/traditional material, and scholarly interpretation are not merged into one evidence level. Restricted/copyrighted objects are shown as catalogue references and lawful upload targets only.'}
      </section>
    </div>
  );
};
