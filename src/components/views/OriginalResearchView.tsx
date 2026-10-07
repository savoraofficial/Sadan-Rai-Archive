import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, FileSearch, FlaskConical, Sparkles } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';
import { fetchResearchRecords } from '../../services/dbService';
import { ResearchRecordItem } from '../../types';

export const OriginalResearchView: React.FC = () => {
  const { language, navigateTo } = useArchive();
  const ne = language === 'ne';
  const [records, setRecords] = useState<ResearchRecordItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchResearchRecords(false).then(items => {
      if (!active) return;
      setRecords(items.filter(item => {
        const finding = item.researchWorkflow?.originalFinding;
        return Boolean(finding && (finding.newFinding?.trim() || finding.exactObservation?.trim() || (finding.evidenceAttachments?.length || 0) > 0));
      }));
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const statusLabel = (status?: string) => {
    const map: Record<string, [string, string]> = {
      new_observation: ['नयाँ अवलोकन', 'New observation'],
      oral_lead: ['मौखिक अनुसन्धान संकेत', 'Oral lead'],
      documentary_lead: ['दस्तावेजी अनुसन्धान संकेत', 'Documentary lead'],
      partially_corroborated: ['आंशिक पुष्टि', 'Partially corroborated'],
      corroborated: ['पुष्टि भएको', 'Corroborated'],
      disputed: ['विवादित', 'Disputed'],
      not_verified: ['पुष्टि नभएको', 'Not verified'],
      further_research: ['थप अनुसन्धान आवश्यक', 'Further research'],
    };
    const pair = map[status || 'further_research'] || map.further_research;
    return ne ? pair[0] : pair[1];
  };

  const publishedCount = records.length;
  const evidenceCount = useMemo(() => records.filter(item => (item.researchWorkflow?.originalFinding?.evidenceAttachments?.length || 0) > 0).length, [records]);

  return (
    <div className="archive-original-research min-h-screen bg-[#FBF9F5] text-stone-900">
      <section className="bg-stone-950 text-white border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <button type="button" onClick={() => navigateTo('/')} className="inline-flex items-center gap-2 text-xs font-semibold text-stone-300 hover:text-amber-300">
            <ArrowLeft size={15} /> {ne ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Back to archive home'}
          </button>
          <div className="mt-8 flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-400/10 text-amber-300 border border-amber-300/20"><Sparkles size={21} /></span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-amber-300 font-mono">{ne ? 'सदन राई — मौलिक अनुसन्धान' : 'SADAN RAI — ORIGINAL RESEARCH'}</p>
              <h1 className="mt-2 font-serif-np text-3xl sm:text-4xl font-bold">{ne ? 'नयाँ खोज तथा निरन्तर अनुसन्धान' : 'New Findings & Ongoing Research'}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">
                {ne
                  ? 'विश्वभरका उपलब्ध स्रोत, अभिलेख र प्रमाणको अध्ययन, तुलनात्मक जाँच तथा क्षेत्रीय अनुसन्धानमार्फत इतिहास, सभ्यता र संस्कृतिसम्बन्धी नयाँ तथ्य तथा सम्भावित निष्कर्षहरूको खोजी भइरहेको छ।'
                  : 'Historical, civilizational and cultural questions are being explored through documented sources, archival records, comparative checking and field research from across the archive.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-12 space-y-8">
        <section className="grid md:grid-cols-2 gap-4">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-amber-800"><FileSearch size={18} /><span className="text-[10px] uppercase tracking-[0.18em] font-bold">{ne ? 'हालसम्मको अनुसन्धान' : 'Research in the archive'}</span></div>
            <h2 className="mt-2 font-serif-np text-xl font-bold">{ne ? 'स्रोत, प्रमाण र तुलनात्मक अनुसन्धान' : 'Sources, evidence & comparative research'}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{ne ? 'अभिलेखमा संकलित स्रोत, प्रमाण र अनुसन्धान अभिलेखहरू छुट्टाछुट्टै पहिचान, सन्दर्भ र प्रमाणको अवस्थासहित प्रस्तुत गरिन्छ।' : 'The archive presents collected sources, evidence and research records with clear provenance, context and evidence status.'}</p>
            <button type="button" onClick={() => navigateTo('/research')} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-amber-900 hover:text-amber-700">{ne ? 'अनुसन्धान तथा स्रोत हेर्नुहोस्' : 'Explore Research & Sources'} <ArrowRight size={14} /></button>
          </article>
          <article className="rounded-2xl border border-amber-200 bg-[#F7F2E8] p-6 shadow-sm">
            <div className="flex items-center gap-2 text-amber-900"><FlaskConical size={18} /><span className="text-[10px] uppercase tracking-[0.18em] font-bold">{ne ? 'अनुसन्धान जारी छ' : 'RESEARCH IS ONGOING'}</span></div>
            <h2 className="mt-2 font-serif-np text-xl font-bold">{ne ? 'नयाँ प्रमाण र field findings क्रमशः थपिँदैछन्' : 'New evidence and field findings are being documented'}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-700">{ne ? 'नयाँ कुरा भेटिनु मात्र पर्याप्त मानिँदैन। मौलिक finding लाई प्रमाण, स्रोत, स्वतन्त्र जाँच, मूल्याङ्कन र संस्करणगत अभिलेखसँगै अघि बढाइन्छ।' : 'A new observation is not automatically treated as historical fact. Original findings move through evidence, provenance, independent checking, assessment and versioned documentation.'}</p>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-mono">{ne ? 'मौलिक खोज अभिलेख' : 'ORIGINAL FINDING REGISTER'}</p><h2 className="mt-1 font-serif-np text-2xl font-bold">{ne ? 'प्रकाशनयोग्य मौलिक खोजहरू' : 'Publishable original findings'}</h2></div>
            <div className="flex gap-2 text-[10px] font-semibold"><span className="rounded-full bg-stone-100 px-3 py-1.5">{publishedCount} {ne ? 'खोज' : 'findings'}</span><span className="rounded-full bg-emerald-50 text-emerald-800 px-3 py-1.5">{evidenceCount} {ne ? 'प्रमाणसहित' : 'with evidence'}</span></div>
          </div>
          {loading ? <p className="mt-6 text-sm text-stone-500">{ne ? 'अभिलेख पढिँदैछ...' : 'Loading the finding register...'}</p> : records.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-7 text-center">
              <CheckCircle2 className="mx-auto text-emerald-700" size={25} />
              <h3 className="mt-3 font-serif-np font-bold text-lg">{ne ? 'अनुसन्धान जारी छ — प्रकाशनयोग्य नयाँ खोज अझै थपिँदैछ' : 'Research is ongoing — no publishable new finding has been added yet'}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{ne ? 'यस स्थानमा अनुमान वा अप्रमाणित दाबी राखिँदैन। पर्याप्त प्रमाण र स्वतन्त्र जाँच पूरा भएपछि मौलिक खोजहरू यहीँ संस्करणगत रूपमा प्रकाशित गरिनेछन्।' : 'This space does not invent or promote unverified claims. Findings will appear here when sufficient evidence and independent checking support publication.'}</p>
            </div>
          ) : (
            <div className="mt-6 grid md:grid-cols-2 gap-4">{records.map(item => {
              const finding = item.researchWorkflow!.originalFinding!;
              return <article key={item.id} className="rounded-xl border border-stone-200 p-5 hover:border-amber-300 transition-colors">
                <div className="flex flex-wrap gap-2"><span className="rounded-full bg-stone-900 text-white px-2.5 py-1 text-[10px] font-mono">{finding.findingId}</span><span className="rounded-full bg-amber-50 text-amber-900 px-2.5 py-1 text-[10px] font-semibold">{statusLabel(finding.findingStatus)}</span></div>
                <h3 className="mt-3 font-serif-np text-lg font-bold">{ne ? (item.nepaliTitle || item.title) : (item.englishTitle || item.title)}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{ne ? (finding.newFinding || finding.exactObservation) : (finding.newFinding || finding.exactObservation)}</p>
                <div className="mt-4 text-[10px] text-stone-500">{finding.discoveryLocation || item.location || '—'} · {finding.discoveryDate || item.date || '—'}</div>
              </article>;
            })}</div>
          )}
        </section>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => navigateTo('/research')} className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-xs font-bold text-white hover:bg-stone-800">{ne ? 'अनुसन्धान तथा स्रोत' : 'Research & Sources'} <ArrowRight size={14} /></button>
          <button type="button" onClick={() => navigateTo('/research-integrity')} className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 text-xs font-bold text-stone-700 hover:bg-stone-50">{ne ? 'अनुसन्धान निष्पक्षता' : 'Research Integrity'} <ArrowRight size={14} /></button>
        </div>
      </main>
    </div>
  );
};
