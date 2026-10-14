import React, { useEffect, useState } from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { ResearchRecordItem } from '../../types';
import { fetchResearchRecords } from '../../services/dbService';
import { ResearchSynthesisCard } from './ResearchSynthesisCard';
import { ContentProtectionAttribution } from '../common/ContentProtectionAttribution';
import { RESEARCH_STATUS_LABELS, BRAND_INFO } from '../../data/archiveData';
import { auth, db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { TRANSLATIONS } from '../../data/translations';
import { PREPARED_PUBLISHED_RESEARCH } from '../../data/preparedPublishedResearch';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Lock, 
  PlusCircle
} from 'lucide-react';

const FRAMEWORK_COLLECTION_LABELS: Record<string, [string, string]> = {
  buddhist: ['बौद्ध इतिहास तथा सभ्यता', 'Buddhist History & Civilization'],
  hindu: ['हिन्दू इतिहास तथा सभ्यता', 'Hindu History & Civilization'],
  limbu: ['लिम्बू इतिहास तथा सभ्यता', 'Limbu History & Civilization'],
  rai: ['राई इतिहास तथा सभ्यता', 'Rai History & Civilization'],
  kiranti: ['किराँती तथा सम्बन्धित समुदाय', 'Kiranti & Related Communities'],
  tamang: ['तामाङ इतिहास तथा सभ्यता', 'Tamang History & Civilization'],
  archaeology: ['पुरातात्त्विक तथा भौतिक इतिहास', 'Archaeological & Material History'],
  ancient_medieval: ['प्राचीन तथा मध्यकालीन इतिहास', 'Ancient & Medieval History'],
  comparative_world: ['तुलनात्मक तथा विश्व इतिहास', 'Comparative & World History'],
  other_future: ['अन्य तथा भविष्यका सभ्यताहरू', 'Other & Future Civilizations'],
};

type PublicSource = { id: string; sourceType?: string; author?: string; title?: string; publication?: string; year?: string; edition?: string; pageFolio?: string; url?: string; archiveId?: string; quotation?: string; provenance?: string; reliabilityNotes?: string; rights?: string };
type PublicClaim = { id: string; statement?: string; claimType?: string; dateRange?: string; supportingSourceIds?: string[]; opposingSourceIds?: string[]; assessment?: string; status?: string };
type PublicEvidence = { id: string; evidenceType?: string; title?: string; location?: string; datePeriod?: string; catalogueId?: string; sourceId?: string; description?: string; supportsClaimIds?: string[]; limitations?: string; verificationStatus?: string; mediaReference?: string; rights?: string };
type PublicFrameworkRecord = { id: string; structuredSources?: PublicSource[]; claims?: PublicClaim[]; evidenceItems?: PublicEvidence[]; title?: string; nepaliTitle?: string; englishTitle?: string; collectionKey?: string; customCollectionName?: string; topic?: string; researchQuestion?: string; nepaliResearchQuestion?: string; englishResearchQuestion?: string; summary?: string; nepaliSummary?: string; englishSummary?: string; nepaliConclusion?: string; englishConclusion?: string; historicalPeriod?: string; geography?: string; researcher?: string; methodology?: string; sections?: { id: string; title: string; content: string }[]; sources?: string; primarySources?: string; secondarySources?: string; exactReferences?: string; sourceProvenance?: string; oralHistoryNotes?: string; archaeologicalEvidence?: string; evidenceAssessment?: string; counterEvidence?: string; alternativeInterpretations?: string; unresolvedQuestions?: string; confidenceAssessment?: string; conclusion?: string; workflowStatus?: string; version?: number; updatedAt?: string; };

export const ResearchView: React.FC = () => {
  const { navigateTo, language, getArchiveSection } = useArchive();
  const section = getArchiveSection('research');
  const [publishedRecords, setPublishedRecords] = useState<ResearchRecordItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(() => auth.currentUser?.email === BRAND_INFO.contactEmail);
  const [loading, setLoading] = useState<boolean>(true);
  const [publishedFrameworks, setPublishedFrameworks] = useState<PublicFrameworkRecord[]>([]);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => setIsAdmin(user?.email === BRAND_INFO.contactEmail));
    fetchResearchRecords(false).then(records => {
      // The prepared research register is a safe public fallback until the owner imports
      // the same records into Firestore. Firestore remains the authoritative CMS when populated.
      setPublishedRecords(records.length > 0 ? records : PREPARED_PUBLISHED_RESEARCH);
    }).catch(err => {
      setPublishedRecords(PREPARED_PUBLISHED_RESEARCH);
      console.warn('Error loading research records:', err);
    }).finally(() => {
      setLoading(false);
    });
    // Public readers query only published framework documents. This matches Firestore rules
    // and keeps drafts and owner working notes private.
    getDocs(query(collection(db, 'research_frameworks'), where('workflowStatus', '==', 'published')))
      .then(snapshot => setPublishedFrameworks(snapshot.docs.map(item => ({ id: item.id, ...item.data() } as PublicFrameworkRecord))))
      .catch(err => { setPublishedFrameworks([]); console.warn('Published framework records could not be loaded:', err); });
    return unsubscribe;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800">
          <ShieldCheck className="w-4 h-4" />
          <span>{t.sections.researchCategory}</span>
        </div>
        <h1 className="font-serif-np text-3xl sm:text-4xl font-bold text-stone-900">
          {language === 'ne' ? (section?.nepaliTitle || t.sections.researchTitle) : (section?.englishTitle || t.sections.researchTitle)}
        </h1>
        <p className="text-stone-600 text-sm max-w-3xl leading-relaxed font-sans">
          {language === 'ne' ? (section?.nepaliDescription || t.sections.researchSubtitle) : (section?.englishDescription || t.sections.researchSubtitle)}
        </p>
        {(language === 'ne' ? section?.nepaliBody : section?.englishBody) && <p className="text-stone-700 text-sm max-w-4xl leading-7 whitespace-pre-line">{language === 'ne' ? section?.nepaliBody : section?.englishBody}</p>}
      </div>

      {/* Publication status — dated research snapshot */}
      <div className="rounded-lg border border-stone-300 bg-stone-50 p-5 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-700">
            {language === 'ne' ? 'प्रकाशित अनुसन्धान अवस्था' : 'Published Research Status'}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
            {language === 'ne' ? 'प्रकाशित · v1.0' : 'Published · v1.0'}
          </span>
        </div>
        <p className="text-sm text-stone-700 leading-relaxed">
          {language === 'ne'
            ? 'यो अनुसन्धान अभिलेख ३ अक्टोबर २०२६ सम्म संकलन, स्रोत-परीक्षण, क्रस-चेक र विश्लेषण गरिएको अवस्थाको प्रकाशित संस्करण हो। नयाँ प्रमाण वा स्रोत प्राप्त भएमा संस्करणगत रूपमा अद्यावधिक गरिनेछ।'
            : 'This is the published research snapshot compiled, source-checked, cross-checked, and analysed up to 3 October 2026. New evidence or sources may be incorporated through versioned updates.'}
        </p>
      </div>

      <section className="archive-research-workflow-strip" aria-label={language === 'ne' ? 'साझा अनुसन्धान कार्यप्रवाह' : 'Shared research workflow'}>
        <div className="archive-research-workflow-head">
          <div><span className="archive-research-workflow-kicker">{language === 'ne' ? 'साझा Master Workflow' : 'SHARED MASTER WORKFLOW'}</span><h3>{language === 'ne' ? 'सदन राई — अनुसन्धान कार्यप्रवाह' : 'Sadan Rai — Research Workflow'}</h3></div>
          <span className="archive-research-workflow-note">{language === 'ne' ? 'स्रोतदेखि संस्करण इतिहाससम्म' : 'Source to version history'}</span>
        </div>
        <div className="archive-research-workflow-steps">{(language === 'ne' ? ['स्रोत / संकेत','मूल अवलोकन','प्रमाण','स्वतन्त्र Cross-check','प्रमाण मूल्याङ्कन','अनुसन्धान विश्लेषण','निष्कर्ष / थप अनुसन्धान','प्रकाशन → संस्करण इतिहास'] : ['Source / Lead','Original Observation','Evidence','Independent Cross-check','Evidence Assessment','Researcher Analysis','Conclusion / Further Research','Publication → Version History']).map((step,i,steps)=><div key={step} className="archive-research-workflow-step"><span>{String(i+1).padStart(2,'0')}</span><strong>{step}</strong>{i<steps.length-1&&<ArrowRight className="archive-research-workflow-arrow" aria-hidden="true"/>}</div>)}</div>
      </section>

      {/* 3 Verification Standards */}
      <div className="space-y-4">
        <h2 className="font-serif-np text-2xl font-bold text-stone-900">
          {t.researchStatus.standardTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status 1 */}
          <div className="bg-emerald-50/70 p-6 rounded-lg border border-emerald-300/80 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold font-serif-np text-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>{t.researchStatus.verified}</span>
            </div>
            <p className="text-xs uppercase font-mono text-emerald-800 tracking-wider">
              Verified / Documented Source
            </p>
            <p className="text-xs text-stone-700 leading-relaxed font-sans">
              {t.researchStatus.verifiedDesc}
            </p>
          </div>

          {/* Status 2 */}
          <div className="bg-amber-50/70 p-6 rounded-lg border border-amber-300/80 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold font-serif-np text-lg">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <span>{t.researchStatus.oralHistory}</span>
            </div>
            <p className="text-xs uppercase font-mono text-amber-800 tracking-wider">
              Local Oral History
            </p>
            <p className="text-xs text-stone-700 leading-relaxed font-sans">
              {t.researchStatus.oralHistoryDesc}
            </p>
          </div>

          {/* Status 3 */}
          <div className="bg-stone-100 p-6 rounded-lg border border-stone-300 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-stone-900 font-bold font-serif-np text-lg">
              <FileText className="w-5 h-5 text-stone-700" />
              <span>{t.researchStatus.furtherResearch}</span>
            </div>
            <p className="text-xs uppercase font-mono text-stone-600 tracking-wider">
              Further Research Needed
            </p>
            <p className="text-xs text-stone-700 leading-relaxed font-sans">
              {t.researchStatus.furtherResearchDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Published Worldwide Research Framework records */}
      {publishedFrameworks.length > 0 && (
        <section className="space-y-5" aria-labelledby="published-worldwide-frameworks">
          <div className="border-b border-stone-200 pb-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-800 font-semibold">{language === 'ne' ? 'विश्वव्यापी अनुसन्धान अभिलेख' : 'WORLDWIDE RESEARCH FRAMEWORK'}</p>
            <h2 id="published-worldwide-frameworks" className="mt-2 font-serif-np text-2xl sm:text-3xl font-bold text-stone-900">{language === 'ne' ? 'प्रकाशित अनुसन्धान र प्रमाण' : 'Published research and evidence'}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{language === 'ne' ? 'यी अभिलेख Admin Console बाट प्रकाशित गरिएका अनुसन्धान हुन्। स्रोत, प्रमाण, फरक व्याख्या र अनिश्चितता उपलब्ध भएअनुसार छुट्टाछुट्टै देखाइन्छ।' : 'These records are published from the Admin Console. Sources, evidence, competing interpretations and uncertainty are shown as recorded.'}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {publishedFrameworks.map(record => (
              <article key={record.id} className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wide text-stone-500"><span>{record.customCollectionName || (record.collectionKey && FRAMEWORK_COLLECTION_LABELS[record.collectionKey] ? FRAMEWORK_COLLECTION_LABELS[record.collectionKey][language === 'ne' ? 0 : 1] : record.collectionKey) || (language === 'ne' ? 'साझा अनुसन्धान' : 'Shared research')}</span><span>·</span><span>{language === 'ne' ? 'प्रकाशित' : 'Published'}</span>{record.version ? <><span>·</span><span>v{record.version}</span></> : null}</div>
                <h3 className="font-serif-np text-xl font-bold text-stone-900">{(language === 'ne' ? record.nepaliTitle : record.englishTitle) || record.title || record.topic || record.id}</h3>
                {record.topic && <p className="text-sm font-semibold text-stone-700">{record.topic}</p>}
                {((language === 'ne' ? record.nepaliResearchQuestion : record.englishResearchQuestion) || record.researchQuestion) && <div><h4 className="text-xs font-bold text-stone-800">{language === 'ne' ? 'अनुसन्धान प्रश्न' : 'Research question'}</h4><p className="mt-1 text-sm leading-6 text-stone-600 whitespace-pre-line">{(language === 'ne' ? record.nepaliResearchQuestion : record.englishResearchQuestion) || record.researchQuestion}</p></div>}
                {((language === 'ne' ? record.nepaliSummary : record.englishSummary) || record.summary) && <p className="text-sm leading-6 text-stone-600 whitespace-pre-line">{(language === 'ne' ? record.nepaliSummary : record.englishSummary) || record.summary}</p>}
                {(record.historicalPeriod || record.geography || record.researcher) && <div className="flex flex-wrap gap-2 text-xs text-stone-600">{record.historicalPeriod && <span className="rounded-full bg-stone-100 px-2.5 py-1">{record.historicalPeriod}</span>}{record.geography && <span className="rounded-full bg-stone-100 px-2.5 py-1">{record.geography}</span>}{record.researcher && <span className="rounded-full bg-stone-100 px-2.5 py-1">{record.researcher}</span>}</div>}
                <details className="group rounded-xl border border-stone-200 bg-stone-50 p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-stone-800">{language === 'ne' ? 'पूरा अनुसन्धान, स्रोत र प्रमाण हेर्नुहोस्' : 'Read full research, sources and evidence'}</summary>
                  <div className="mt-4 space-y-4">
                    {record.methodology && <div><h4 className="text-xs font-bold">{language === 'ne' ? 'अनुसन्धान विधि' : 'Methodology'}</h4><p className="mt-1 whitespace-pre-line text-sm leading-6 text-stone-600">{record.methodology}</p></div>}
                    {(record.sections || []).map(section => <div key={section.id}><h4 className="text-sm font-bold text-stone-900">{section.title}</h4><p className="mt-1 whitespace-pre-line text-sm leading-6 text-stone-700">{section.content || (language === 'ne' ? 'यस खण्डमा सामग्री थपिएको छैन।' : 'No content has been added to this section.')}</p></div>)}
                    {(record.structuredSources || []).length > 0 && <section className="space-y-2"><h4 className="text-sm font-bold text-stone-900">{language === 'ne' ? 'संरचित स्रोत सूची' : 'Structured source register'}</h4>{record.structuredSources!.map((source,index)=><article key={source.id} className="rounded-lg border border-stone-200 bg-white p-3"><p className="text-sm font-semibold">{index+1}. {source.title || source.id}</p><p className="mt-1 text-xs text-stone-600">{[source.author,source.year,source.edition,source.publication,source.pageFolio && `p./folio: ${source.pageFolio}`].filter(Boolean).join(' · ')}</p>{source.quotation && <p className="mt-2 whitespace-pre-line text-sm">{source.quotation}</p>}{source.url && <a href={source.url} target="_blank" rel="noreferrer" className="mt-2 inline-block break-all text-xs text-amber-800 underline">{source.url}</a>}{source.reliabilityNotes && <p className="mt-2 text-xs text-stone-600">{source.reliabilityNotes}</p>}</article>)}</section>}
                    {(record.claims || []).length > 0 && <section className="space-y-2"><h4 className="text-sm font-bold text-stone-900">{language === 'ne' ? 'दाबी र प्रमाण सम्बन्ध' : 'Claims and evidence relationships'}</h4>{record.claims!.map((claim,index)=><article key={claim.id} className="rounded-lg border border-stone-200 p-3"><p className="text-sm font-semibold">{index+1}. {claim.statement}</p><p className="mt-1 text-xs text-stone-600">{language === 'ne' ? 'स्थिति' : 'Status'}: {claim.status || 'unverified'} · {language === 'ne' ? 'काल' : 'Period'}: {claim.dateRange || '—'}</p>{claim.assessment && <p className="mt-2 whitespace-pre-line text-sm text-stone-700">{claim.assessment}</p>}<p className="mt-1 text-xs text-stone-500">{language === 'ne' ? 'समर्थक स्रोत' : 'Supporting sources'}: {(claim.supportingSourceIds || []).join(', ') || '—'} · {language === 'ne' ? 'विरोधी स्रोत' : 'Opposing sources'}: {(claim.opposingSourceIds || []).join(', ') || '—'}</p></article>)}</section>}
                    {(record.evidenceItems || []).length > 0 && <section className="space-y-2"><h4 className="text-sm font-bold text-stone-900">{language === 'ne' ? 'प्रमाण वस्तु सूची' : 'Evidence object register'}</h4>{record.evidenceItems!.map((item,index)=><article key={item.id} className="rounded-lg border border-stone-200 p-3"><p className="text-sm font-semibold">{index+1}. {item.title || item.id}</p><p className="mt-1 text-xs text-stone-600">{[item.evidenceType,item.location,item.datePeriod,item.catalogueId,item.verificationStatus].filter(Boolean).join(' · ')}</p>{item.description && <p className="mt-2 whitespace-pre-line text-sm text-stone-700">{item.description}</p>}{item.mediaReference && <p className="mt-1 break-all text-xs text-stone-500">{language === 'ne' ? 'मिडिया सन्दर्भ' : 'Media reference'}: {item.mediaReference}</p>}{item.limitations && <p className="mt-2 text-xs text-stone-600">{item.limitations}</p>}<p className="mt-1 text-xs text-stone-500">{language === 'ne' ? 'सम्बन्धित दाबी' : 'Linked claims'}: {(item.supportsClaimIds || []).join(', ') || '—'} · {language === 'ne' ? 'स्रोत ID' : 'Source ID'}: {item.sourceId || '—'}</p></article>)}</section>}
                    {([[ 'sourceProvenance', language === 'ne' ? 'स्रोतको उत्पत्ति' : 'Source provenance' ], ['primarySources', language === 'ne' ? 'प्राथमिक स्रोत' : 'Primary sources'], ['secondarySources', language === 'ne' ? 'द्वितीयक / विद्वत् स्रोत' : 'Secondary / scholarly sources'], ['exactReferences', language === 'ne' ? 'ठ्याक्कै सन्दर्भ' : 'Exact references'], ['oralHistoryNotes', language === 'ne' ? 'मौखिक इतिहास' : 'Oral history'], ['archaeologicalEvidence', language === 'ne' ? 'पुरातात्त्विक / भौतिक प्रमाण' : 'Archaeological / material evidence'], ['evidenceAssessment', language === 'ne' ? 'प्रमाण मूल्याङ्कन' : 'Evidence assessment'], ['counterEvidence', language === 'ne' ? 'विरोधी प्रमाण' : 'Counter-evidence'], ['alternativeInterpretations', language === 'ne' ? 'वैकल्पिक व्याख्या' : 'Alternative interpretations'], ['unresolvedQuestions', language === 'ne' ? 'अनसुल्झिएका प्रश्न' : 'Unresolved questions'], ['confidenceAssessment', language === 'ne' ? 'निश्चितता र सीमा' : 'Confidence and limitations'], ['reviewer', language === 'ne' ? 'समीक्षक' : 'Reviewer'], ['reviewNotes', language === 'ne' ? 'समीक्षा तथा Cross-check टिप्पणी' : 'Review and cross-check notes'], ['rightsAndPermissions', language === 'ne' ? 'अधिकार, अनुमति र गोपनीयता' : 'Rights, permissions and privacy'], ['linkedRecords', language === 'ne' ? 'सम्बन्धित अभिलेख' : 'Related records'], ['sources', language === 'ne' ? 'स्रोत सूची' : 'Sources'], ['conclusion', language === 'ne' ? 'निष्कर्ष' : 'Conclusion']] as const).map(([key, label]) => { const value = key === 'conclusion' ? ((language === 'ne' ? record.nepaliConclusion : record.englishConclusion) || record.conclusion) : record[key as keyof PublicFrameworkRecord]; return typeof value === 'string' && value.trim() ? <div key={key}><h4 className="text-xs font-bold text-stone-800">{label}</h4><p className="mt-1 whitespace-pre-line text-sm leading-6 text-stone-600">{value}</p></div> : null; })}
                  </div>
                </details>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Published Research Records from CMS */}
      {publishedRecords.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-np text-2xl font-bold text-stone-900">
              {language === 'ne'
                ? `प्रकाशित अनुसन्धान अभिलेखहरू (${publishedRecords.length})`
                : `Published Research Records (${publishedRecords.length})`}
            </h2>
            {isAdmin && <button
              onClick={() => navigateTo('/sadan-rai-editorial-console')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
            >
              <span>
                {language === 'ne' ? '+ नयाँ प्रविष्टि थप्नुहोस् (प्रशासक कन्सोल)' : '+ New Entry (Editorial Console)'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>}
          </div>

          <div className="space-y-6">
            {publishedRecords.map(record => {
              const statusDef = RESEARCH_STATUS_LABELS[record.researchStatus] || RESEARCH_STATUS_LABELS.further_research;

              return (
                <div 
                  key={record.id}
                  className="bg-white rounded-lg border border-stone-200 p-6 sm:p-8 space-y-6 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {record.category}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusDef.color}`}>
                        {language === 'ne' ? statusDef.nepali : statusDef.english}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-stone-400">
                      v{record.version} · {record.date || record.createdAt.slice(0, 10)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif-np text-2xl font-bold text-stone-900">
                      {language === 'ne' ? record.nepaliTitle || record.title : record.englishTitle || record.title}
                    </h3>
                    {language === 'ne' && record.englishTitle && (
                      <p className="text-xs text-stone-500 italic">
                        {record.englishTitle}
                      </p>
                    )}
                  </div>

                  {record.nepaliExplanation && (
                    <p className="text-stone-700 font-serif-np text-sm leading-relaxed">
                      {record.nepaliExplanation}
                    </p>
                  )}

                  {/* Research Synthesis Card */}
                  {record.synthesis && (
                    <ResearchSynthesisCard synthesis={record.synthesis} language={language} />
                  )}

                  {/* Content Protection & Attribution */}
                  <ContentProtectionAttribution
                    title={record.nepaliTitle || record.title}
                    rightsStatus={record.rightsStatus}
                    createdAt={record.createdAt}
                    updatedAt={record.updatedAt}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sources System Link & Admin Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-stone-200 space-y-4 shadow-2xs">
          <h3 className="font-serif-np font-bold text-lg text-stone-900">
            {t.sections.sourcesTitle}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
            {language === 'ne'
              ? 'स्वीकार्य स्रोतहरू: पुस्तक, प्राज्ञिक शोधपत्र, सरकारी/पुरातत्व दस्तावेज, संग्रहालय अभिलेख र मौखिक इतिहास।'
              : 'Acceptable sources: Historical Books, Academic Papers, Government/Archaeological Reports, Museum Archives, and Documented Oral History.'}
          </p>
          <button
            onClick={() => navigateTo('/sources')}
            className="px-4 py-2 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>{language === 'ne' ? 'स्रोत तथा सन्दर्भ ग्रन्थ खण्ड हेर्नुहोस्' : 'Explore Sources & Bibliography'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isAdmin && <div className="bg-stone-900 text-white p-6 rounded-lg border border-stone-800 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400">
            <Lock className="w-4 h-4" />
            <span>{language === 'ne' ? 'स्थायी अनुसन्धान कन्सोल' : 'Archival Management CMS'}</span>
          </div>
          <h3 className="font-serif-np font-bold text-lg text-white">
            {language === 'ne' ? 'प्रशासक कन्सोल' : 'Editorial Console'}
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            {language === 'ne'
              ? 'नयाँ अनुसन्धान, लेखक दृष्टिकोण ("ऐतिहासिक ग्रन्थ तथा विद्वत् दृष्टिकोण"), प्रमाण, मौखिक इतिहास तथा तस्बिरहरू फाराममार्फत प्रत्यक्ष दर्ता गर्न प्रशासक कन्सोल खोल्नुहोस्।'
              : 'Directly manage and verify research records, scholarly perspectives ("Historical Texts & Scholarly Perspectives"), documentary evidence, and oral history testimonies.'}
          </p>
          <button
            onClick={() => navigateTo('/sadan-rai-editorial-console')}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded text-xs font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{language === 'ne' ? 'अनुसन्धान कन्सोल खोल्नुहोस्' : 'Open Editorial Console'}</span>
          </button>
        </div>}
      </div>

    </div>
  );
};
