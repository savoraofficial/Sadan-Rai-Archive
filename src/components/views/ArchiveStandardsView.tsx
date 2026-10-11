import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';

export const ArchiveStandardsView: React.FC<{ kind: 'integrity' | 'accuracy' }> = ({ kind }) => {
  const { language, navigateTo, getArchiveSection } = useArchive();
  const ne = language === 'ne';
  const key = kind === 'integrity' ? 'research_integrity' : 'accuracy_rules';
  const item = getArchiveSection(key);
  const fallbackTitle = kind === 'integrity' ? (ne ? 'अनुसन्धान निष्पक्षता' : 'Research Integrity') : (ne ? 'तथ्य शुद्धताको नियम' : 'Accuracy & Evidence Standards');
  const fallbackDescription = kind === 'integrity' ? (ne ? 'स्रोत, प्रमाण, uncertainty, disagreement र researcher analysis स्पष्ट राख्ने नियम।' : 'Standards for transparent sources, evidence, uncertainty, disagreement and researcher analysis.') : (ne ? 'दाबीलाई स्रोत, exact reference र cross-check सहित प्रस्तुत गर्ने नियम।' : 'Rules for presenting claims with sources, exact references and cross-checks.');
  return <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16 space-y-7">
    <div className="flex items-center gap-2 text-xs text-stone-500"><button onClick={()=>navigateTo('/')} className="font-semibold hover:text-stone-900">Home</button><span>›</span><span className="text-stone-900">{ne ? (item?.nepaliTitle || fallbackTitle) : (item?.englishTitle || fallbackTitle)}</span></div>
    <section className="rounded-3xl bg-stone-950 text-white p-8 sm:p-12">
      <ShieldCheck className="text-amber-400" size={28}/>
      <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-amber-400 font-mono">{kind === 'integrity' ? 'RESEARCH INTEGRITY' : 'ACCURACY & EVIDENCE'}</p>
      <h1 className="font-serif-np text-3xl sm:text-5xl font-bold mt-2">{ne ? (item?.nepaliTitle || fallbackTitle) : (item?.englishTitle || fallbackTitle)}</h1>
      <p className="text-stone-300 mt-4 max-w-3xl leading-relaxed">{ne ? (item?.nepaliDescription || fallbackDescription) : (item?.englishDescription || fallbackDescription)}</p>
    </section>
    <section className="rounded-3xl border border-stone-200 bg-white p-7 sm:p-9">
      <div className="flex items-start gap-3"><CheckCircle2 className="text-emerald-700 mt-1" size={21}/><div><h2 className="font-serif-np text-2xl font-bold text-stone-900">{ne ? 'अभिलेखमा लागू हुने मापदण्ड' : 'Standards applied across the archive'}</h2><p className="text-sm text-stone-600 leading-7 mt-4 whitespace-pre-line">{ne ? (item?.nepaliBody || fallbackDescription) : (item?.englishBody || fallbackDescription)}</p></div></div>
    </section>
    <button onClick={()=>navigateTo('/')} className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700"><ArrowLeft size={16}/> {ne ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Back to Home'}</button>
  </main>;
};
