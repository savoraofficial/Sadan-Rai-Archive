import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { UNIVERSAL_ARCHIVE_CORE_SECTIONS } from '../../data/universalArchiveStructure';
import { BookOpenCheck, Plus, Save, RefreshCw, Trash2, FilePlus2, AlertCircle } from 'lucide-react';

type ResearchSection = { id: string; title: string; content: string };
type FrameworkRecord = {
  id: string; title: string; nepaliTitle?: string; englishTitle?: string; collectionKey: string; customCollectionName?: string; topic: string; researchQuestion: string; nepaliResearchQuestion?: string; englishResearchQuestion?: string; summary: string; nepaliSummary?: string; englishSummary?: string; nepaliConclusion?: string; englishConclusion?: string;
  historicalPeriod?: string; geography?: string; researcher?: string; methodology?: string; sourceProvenance?: string; primarySources?: string; secondarySources?: string; exactReferences?: string;
  oralHistoryNotes?: string; archaeologicalEvidence?: string; evidenceAssessment?: string; alternativeInterpretations?: string; unresolvedQuestions?: string; confidenceAssessment?: string; reviewer?: string; reviewNotes?: string; rightsAndPermissions?: string; linkedRecords?: string;
  sections: ResearchSection[]; sources: string; counterEvidence: string; conclusion: string;
  workflowStatus: 'draft' | 'published'; version: number; createdAt?: string; updatedAt?: string; updatedBy?: string;
};
const OWNER_EMAIL = 'raiktosadan@gmail.com';
const COLLECTIONS = [
  ['buddhist', 'बौद्ध धर्म / Buddhist History & Civilization'], ['hindu', 'हिन्दू धर्म / Hindu History & Civilization'],
  ['limbu', 'लिम्बू / याक्थुङ इतिहास'], ['rai', 'राई इतिहास तथा सभ्यता'], ['kiranti', 'किरात तथा सम्बन्धित समुदाय'],
  ['tamang', 'तामाङ इतिहास तथा सभ्यता'], ['archaeology', 'पुरातत्त्व तथा भौतिक इतिहास'], ['ancient_medieval', 'प्राचीन तथा मध्यकालीन इतिहास'],
  ['comparative_world', 'तुलनात्मक तथा विश्व इतिहास'],
  ['other_future', 'अन्य तथा भविष्यका सभ्यताहरू / Other & Future Civilizations'],
] as const;
const emptyRecord = (): FrameworkRecord => ({ id: '', title: '', nepaliTitle: '', englishTitle: '', collectionKey: 'buddhist', customCollectionName: '', topic: '', researchQuestion: '', nepaliResearchQuestion: '', englishResearchQuestion: '', summary: '', nepaliSummary: '', englishSummary: '', nepaliConclusion: '', englishConclusion: '', historicalPeriod: '', geography: '', researcher: '', methodology: '', sourceProvenance: '', primarySources: '', secondarySources: '', exactReferences: '', oralHistoryNotes: '', archaeologicalEvidence: '', evidenceAssessment: '', alternativeInterpretations: '', unresolvedQuestions: '', confidenceAssessment: '', reviewer: '', reviewNotes: '', rightsAndPermissions: '', linkedRecords: '', sections: [{ id: 'overview', title: 'अनुसन्धानको दायरा / Scope', content: '' }, { id: 'evidence', title: 'प्रमाण र स्रोत / Evidence & Sources', content: '' }, { id: 'crosscheck', title: 'विश्वव्यापी तुलना / Worldwide Cross-check', content: '' }, { id: 'counter', title: 'विरोधी प्रमाण तथा मतभेद / Counter-evidence', content: '' }, { id: 'conclusion', title: 'निष्कर्ष / Conclusion', content: '' }], sources: '', counterEvidence: '', conclusion: '', workflowStatus: 'draft', version: 0 });

export const ResearchFrameworkCMS: React.FC<{ language: 'ne' | 'en' }> = ({ language }) => {
  const [records, setRecords] = useState<FrameworkRecord[]>([]);
  const [draft, setDraft] = useState<FrameworkRecord>(emptyRecord());
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const isNepali = language === 'ne';
  const isOwner = auth.currentUser?.email?.trim().toLowerCase() === OWNER_EMAIL;
  const sortedRecords = useMemo(() => [...records].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')), [records]);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(query(collection(db, 'research_frameworks'), orderBy('updatedAt', 'desc')));
      const next = snapshot.docs.map((item) => ({ ...emptyRecord(), ...item.data(), id: item.id } as FrameworkRecord));
      setRecords(next);
      if (selectedId) {
        const selected = next.find(item => item.id === selectedId);
        if (selected) setDraft(selected);
      }
      setMessage('');
    } catch (error) {
      console.error('Research framework load failed:', error);
      setMessage(isNepali ? 'लोड असफल भयो। Admin login र Firestore rules जाँच्नुहोस्।' : 'Load failed. Check admin login and Firestore rules.');
    } finally { setLoading(false); }
  }, [isNepali, selectedId]);
  useEffect(() => { if (isOwner) void loadRecords(); else setLoading(false); }, [isOwner, loadRecords]);

  const update = <K extends keyof FrameworkRecord>(key: K, value: FrameworkRecord[K]) => setDraft(prev => ({ ...prev, [key]: value }));
  const startNew = () => { setSelectedId(''); setDraft(emptyRecord()); setMessage(''); };
  const createCollectionStarters = async () => {
    if (!isOwner) return;
    setSaving(true); setMessage('');
    try {
      const now = new Date().toISOString();
      const existingStarterIds = new Set(records.map(item => item.id));
      const missing = COLLECTIONS.filter(([key]) => !existingStarterIds.has(`starter_${key}`));
      for (const [key, label] of missing) {
        const id = `starter_${key}`;
        const sections = UNIVERSAL_ARCHIVE_CORE_SECTIONS.map(section => ({
          id: section.id,
          title: isNepali ? section.nepaliTitle : section.englishTitle,
          content: '',
        }));
        const starter: FrameworkRecord = {
          ...emptyRecord(), id, title: `${label} — ${isNepali ? 'अनुसन्धान कार्यस्थान' : 'Research workspace'}`,
          collectionKey: key, topic: label, researchQuestion: '',
          summary: isNepali ? 'यो खाली अनुसन्धान ढाँचा हो। स्रोत-जाँच नभएसम्म ऐतिहासिक दाबीलाई प्रमाणित नमान्नुहोस्।' : 'This is a blank research template. Do not treat historical claims as verified until source checking is completed.',
          sections, workflowStatus: 'draft', version: 1, createdAt: now, updatedAt: now, updatedBy: OWNER_EMAIL,
        };
        await setDoc(doc(db, 'research_frameworks', id), { ...starter, serverUpdatedAt: serverTimestamp() }, { merge: true });
      }
      setMessage(isNepali ? `${missing.length} नयाँ collection workspace बनाइयो। पहिल्यै भएका संग्रह फेरि overwrite गरिएनन्।` : `Created ${missing.length} collection workspaces. Existing collection workspaces were not overwritten.`);
      await loadRecords();
    } catch (error) {
      console.error('Creating collection starters failed:', error);
      setMessage(isNepali ? 'Starter बनाउँदा त्रुटि भयो। Admin permission जाँच्नुहोस्।' : 'Could not create starters. Check admin permissions.');
    } finally { setSaving(false); }
  };
  const chooseRecord = (id: string) => { const found = records.find(item => item.id === id); if (found) { setSelectedId(id); setDraft(found); setMessage(''); } };
  const addCoreSection = (sectionId: string) => {
    const source = UNIVERSAL_ARCHIVE_CORE_SECTIONS.find(item => item.id === sectionId);
    if (!source || draft.sections.some(item => item.id === source.id)) return;
    update('sections', [...draft.sections, { id: source.id, title: isNepali ? source.nepaliTitle : source.englishTitle, content: '' }]);
  };
  const save = async () => {
    if (!isOwner || !draft.title.trim() || !draft.topic.trim()) { setMessage(isNepali ? 'शीर्षक र विषय अनिवार्य छन्। Admin login आवश्यक छ।' : 'Title and topic are required. Admin login is required.'); return; }
    setSaving(true); setMessage('');
    try {
      const now = new Date().toISOString();
      const id = draft.id || `framework_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const saved: FrameworkRecord = { ...draft, id, version: (draft.version || 0) + 1, updatedAt: now, updatedBy: auth.currentUser?.email || OWNER_EMAIL, createdAt: draft.createdAt || now };
      await setDoc(doc(db, 'research_frameworks', id), { ...saved, updatedAt: now, serverUpdatedAt: serverTimestamp() }, { merge: true });
      const revisionId = `framework_${id}_v${saved.version}`;
      await setDoc(doc(db, 'revisions', revisionId), { targetId: id, targetType: 'research_framework', version: saved.version, author: auth.currentUser?.displayName || 'SADAN RAI', authorEmail: auth.currentUser?.email || OWNER_EMAIL, changeNotes: 'Research Framework CMS save', snapshotData: saved, createdAt: now }, { merge: false });
      setSelectedId(id); setDraft(saved); setMessage(isNepali ? 'Firebase मा सुरक्षित भयो। संस्करण इतिहास पनि सुरक्षित भयो।' : 'Saved to Firebase. Version history was also recorded.');
      await loadRecords();
    } catch (error) {
      console.error('Research framework save failed:', error);
      setMessage(isNepali ? 'सुरक्षित गर्न सकिएन। Firestore permission/rules जाँच्नुहोस्।' : 'Save failed. Check Firestore permissions/rules.');
    } finally { setSaving(false); }
  };

  if (!isOwner) return <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">{isNepali ? 'यो कार्यस्थान अभिलेखको मालिक Admin account बाट मात्र खुल्छ।' : 'This workspace is available only to the archive owner Admin account.'}</div>;

  return <div className="space-y-4">
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-emerald-950"><BookOpenCheck className="h-5 w-5"/><h3 className="text-lg font-bold">{isNepali ? 'Worldwide Research Framework CMS' : 'Worldwide Research Framework CMS'}</h3></div><div className="flex gap-2"><button type="button" onClick={() => void loadRecords()} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs"><RefreshCw className="mr-1 inline h-3 w-3"/>{isNepali ? 'Reload' : 'Reload'}</button><button type="button" onClick={() => void createCollectionStarters()} disabled={saving} className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 disabled:opacity-50">{isNepali ? '१० संग्रहका कार्यस्थान तयार गर्नुहोस्' : 'Create 10 collection starters'}</button><button type="button" onClick={startNew} className="rounded-lg bg-stone-900 px-3 py-2 text-xs font-semibold text-white"><FilePlus2 className="mr-1 inline h-3 w-3"/>{isNepali ? 'नयाँ अनुसन्धान' : 'New research'}</button></div></div>
      <p className="mt-2 text-xs leading-6 text-stone-700">{isNepali ? 'यो CMS बाट आज अनुसन्धान थप्न, भोलि नयाँ विषय/खण्ड थप्न, Draft वा Published राख्न र version history सुरक्षित गर्न सकिन्छ। Framework आफैँले दाबी प्रमाणित गर्दैन—प्रमाण र cross-check वास्तविक रूपमा भर्नुपर्छ।' : 'Add research today and new topics/sections later, keep drafts or publish, and preserve version history. The framework does not verify claims by itself; evidence and cross-checks must be entered from real sources.'}</p>
    </div>
    {message && <div role="status" className="rounded-lg border border-stone-200 bg-white p-3 text-sm text-stone-700">{message}</div>}
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-xl border border-stone-200 bg-white p-3"><h4 className="mb-2 font-semibold">{isNepali ? 'सुरक्षित अनुसन्धान' : 'Saved research'} ({records.length})</h4>{loading ? <p className="p-3 text-xs text-stone-500">Loading…</p> : <div className="max-h-[70vh] space-y-1 overflow-y-auto">{sortedRecords.map(item => <button key={item.id} type="button" onClick={() => chooseRecord(item.id)} className={`w-full rounded-lg p-3 text-left ${selectedId === item.id ? 'bg-stone-900 text-white' : 'bg-stone-50 hover:bg-amber-50'}`}><span className="block text-xs font-semibold">{item.title || item.topic}</span><span className={`mt-1 block text-[10px] ${selectedId === item.id ? 'text-stone-300' : 'text-stone-500'}`}>{item.customCollectionName || COLLECTIONS.find(c => c[0] === item.collectionKey)?.[1] || item.collectionKey} · {item.workflowStatus} · v{item.version}</span></button>)}{records.length === 0 && <p className="p-3 text-xs text-stone-500">{isNepali ? 'अहिलेसम्म Firebase मा Framework record छैन। नयाँ अनुसन्धानबाट सुरु गर्नुहोस्।' : 'No framework records in Firebase yet. Start with New research.'}</p>}</div>}</aside>
      <section className="min-w-0 space-y-4 rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2"><label className="text-xs font-semibold text-stone-700">{isNepali ? 'अनुसन्धान शीर्षक *' : 'Research title *'}<input value={draft.title} onChange={e => update('title', e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 p-2.5 text-sm" placeholder="e.g. Historical Buddha: Sources and Chronology"/></label><label className="text-xs font-semibold text-stone-700">{isNepali ? 'संग्रह' : 'Collection'}<select value={draft.collectionKey} onChange={e => update('collectionKey', e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-2.5 text-sm">{COLLECTIONS.map(c => <option key={c[0]} value={c[0]}>{c[1]}</option>)}</select></label><label className="text-xs font-semibold text-stone-700">{isNepali ? 'विशिष्ट विषय *' : 'Specific topic *'}<input value={draft.topic} onChange={e => update('topic', e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 p-2.5 text-sm" placeholder="Historical question / claim"/></label><label className="text-xs font-semibold text-stone-700">{isNepali ? 'स्थिति' : 'Status'}<select value={draft.workflowStatus} onChange={e => update('workflowStatus', e.target.value as FrameworkRecord['workflowStatus'])} className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-2.5 text-sm"><option value="draft">Draft</option><option value="published">Published</option></select></label><label className="text-xs font-semibold text-stone-700">{isNepali ? 'नयाँ/विशेष संग्रह नाम (ऐच्छिक)' : 'Custom/future collection name (optional)'}<input value={draft.customCollectionName || ''} onChange={e => update('customCollectionName', e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 p-2.5 text-sm" placeholder={isNepali ? 'नयाँ समुदाय, देश वा सभ्यताको नाम' : 'New community, country or civilization name'}/></label></div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{([[ 'historicalPeriod', isNepali ? 'ऐतिहासिक कालखण्ड / मिति' : 'Historical period / date' ], ['geography', isNepali ? 'भूगोल / स्थान' : 'Geography / place'], ['researcher', isNepali ? 'अनुसन्धानकर्ता' : 'Researcher'], ['methodology', isNepali ? 'अनुसन्धान विधि' : 'Research methodology']] as const).map(([key,label]) => <label key={key} className="text-xs font-semibold text-stone-700">{label}<input value={String(draft[key] || '')} onChange={e => update(key, e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 p-2.5 text-sm" /></label>)}</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{([[ 'nepaliTitle', isNepali ? 'नेपाली अनुसन्धान शीर्षक' : 'Nepali research title' ], ['englishTitle', isNepali ? 'English अनुसन्धान शीर्षक' : 'English research title']] as const).map(([key,label]) => <label key={key} className="text-xs font-semibold text-stone-700">{label}<input value={String(draft[key] || '')} onChange={e => update(key, e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 p-2.5 text-sm" /></label>)}</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{([[ 'nepaliResearchQuestion', isNepali ? 'नेपाली अनुसन्धान प्रश्न' : 'Nepali research question' ], ['englishResearchQuestion', isNepali ? 'English अनुसन्धान प्रश्न' : 'English research question']] as const).map(([key,label]) => <label key={key} className="block text-xs font-semibold text-stone-700">{label}<textarea value={String(draft[key] || '')} onChange={e => update(key, e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-stone-300 p-3 text-sm font-normal" /></label>)}</div>
        <label className="block text-xs font-semibold text-stone-700">{isNepali ? 'अनुसन्धान प्रश्न' : 'Research question'}<textarea value={draft.researchQuestion} onChange={e => update('researchQuestion', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-stone-300 p-3 text-sm"/></label>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{([[ 'nepaliSummary', isNepali ? 'नेपाली सारांश' : 'Nepali summary' ], ['englishSummary', isNepali ? 'English सारांश' : 'English summary']] as const).map(([key,label]) => <label key={key} className="block text-xs font-semibold text-stone-700">{label}<textarea value={String(draft[key] || '')} onChange={e => update(key, e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-stone-300 p-3 text-sm font-normal" /></label>)}</div>
        <label className="block text-xs font-semibold text-stone-700">{isNepali ? 'सारांश / हालको अनुसन्धान स्थिति' : 'Summary / current research status'}<textarea value={draft.summary} onChange={e => update('summary', e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-stone-300 p-3 text-sm" placeholder={isNepali ? 'जाँचिएका तथ्य, बाँकी काम र सीमाहरू छुट्याएर लेख्नुहोस्।' : 'Separate checked findings, pending work and limitations.'}/></label>
        <div className="space-y-3"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-semibold">{isNepali ? 'अनुसन्धान खण्डहरू' : 'Research sections'} ({draft.sections.length})</h4><select aria-label="Add universal section" defaultValue="" onChange={e => { if (e.target.value) addCoreSection(e.target.value); e.currentTarget.value = ''; }} className="max-w-full rounded-lg border border-stone-300 bg-white p-2 text-xs"><option value="">{isNepali ? '+ ५० साझा खण्डबाट थप्नुहोस्' : '+ Add from 50 universal sections'}</option>{UNIVERSAL_ARCHIVE_CORE_SECTIONS.filter(section => !draft.sections.some(s => s.id === section.id)).map(section => <option key={section.id} value={section.id}>{section.order}. {isNepali ? section.nepaliTitle : section.englishTitle}</option>)}</select></div>
          {draft.sections.map((section, index) => <div key={section.id} className="rounded-lg border border-stone-200 p-3"><div className="flex gap-2"><input value={section.title} onChange={e => update('sections', draft.sections.map((s,i) => i === index ? { ...s, title: e.target.value } : s))} className="min-w-0 flex-1 rounded border border-stone-300 p-2 text-sm font-semibold" aria-label="Section title"/><button type="button" onClick={() => update('sections', draft.sections.filter((_,i) => i !== index))} className="rounded border border-red-200 px-2 text-red-700" aria-label="Remove section"><Trash2 className="h-4 w-4"/></button></div><textarea value={section.content} onChange={e => update('sections', draft.sections.map((s,i) => i === index ? { ...s, content: e.target.value } : s))} rows={4} className="mt-2 w-full rounded border border-stone-300 p-2.5 text-sm leading-6" placeholder={isNepali ? 'स्रोत, प्रमाण, पृष्ठ/folio, cross-check र सीमासहित लेख्नुहोस्…' : 'Enter source, evidence, page/folio, cross-check and limitations…'}/></div>)}<button type="button" onClick={() => update('sections', [...draft.sections, { id: `custom_${Date.now()}`, title: isNepali ? 'नयाँ अनुसन्धान खण्ड' : 'New research section', content: '' }])} className="rounded-lg border border-dashed border-stone-400 px-3 py-2 text-xs font-semibold"><Plus className="mr-1 inline h-3.5 w-3.5"/>{isNepali ? 'आफ्नै नयाँ खण्ड थप्नुहोस्' : 'Add custom section'}</button>
        </div>
        <div className="space-y-3 rounded-xl border border-stone-200 bg-stone-50 p-4"><h4 className="font-semibold text-stone-900">{isNepali ? 'स्रोतको उत्पत्ति, प्रमाण र समीक्षा विवरण' : 'Source provenance, evidence and review metadata'}</h4>{([[ 'sourceProvenance', isNepali ? 'स्रोत कहाँबाट प्राप्त भयो / provenance' : 'Source provenance / where obtained'], ['primarySources', isNepali ? 'प्राथमिक स्रोतहरू' : 'Primary sources'], ['secondarySources', isNepali ? 'द्वितीयक / विद्वत् स्रोतहरू' : 'Secondary / scholarly sources'], ['exactReferences', isNepali ? 'ठ्याक्कै पृष्ठ, folio, inscription वा catalogue नम्बर' : 'Exact page, folio, inscription or catalogue references'], ['oralHistoryNotes', isNepali ? 'मौखिक इतिहास, सहमति र साक्षात्कार टिप्पणी' : 'Oral history, consent and interview notes'], ['archaeologicalEvidence', isNepali ? 'पुरातात्त्विक / भौतिक प्रमाण विवरण' : 'Archaeological / material evidence details'], ['evidenceAssessment', isNepali ? 'प्रमाणको गुणस्तर, सीमा र पुष्टि अवस्था' : 'Evidence quality, limitations and verification status'], ['alternativeInterpretations', isNepali ? 'वैकल्पिक व्याख्या / फरक विद्वत् मत' : 'Alternative interpretations / competing scholarship'], ['unresolvedQuestions', isNepali ? 'अनसुल्झिएका प्रश्न र थप अनुसन्धान' : 'Unresolved questions and further research'], ['confidenceAssessment', isNepali ? 'निष्कर्षको निश्चितता र त्यसको आधार' : 'Confidence/uncertainty and rationale'], ['reviewer', isNepali ? 'समीक्षक' : 'Reviewer'], ['reviewNotes', isNepali ? 'समीक्षा तथा Cross-check टिप्पणी' : 'Review and cross-check notes'], ['rightsAndPermissions', isNepali ? 'प्रतिलिपि अधिकार, अनुमति र गोपनीयता' : 'Rights, permissions and privacy'], ['linkedRecords', isNepali ? 'सम्बन्धित अभिलेख ID / लिंकहरू' : 'Related record IDs / links']] as const).map(([key,label]) => <label key={key} className="block text-xs font-semibold text-stone-700">{label}<textarea value={String(draft[key] || '')} onChange={e => update(key, e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-2.5 text-sm font-normal" /></label>)}</div>
        <label className="block text-xs font-semibold text-stone-700">{isNepali ? 'स्रोत सूची (प्रति लाइन एउटा स्रोत; exact page/folio सहित)' : 'Sources (one source per line; include exact page/folio)'}<textarea value={draft.sources} onChange={e => update('sources', e.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-stone-300 p-3 text-sm"/></label>
        <label className="block text-xs font-semibold text-stone-700">{isNepali ? 'विरोधी प्रमाण / फरक विद्वत् मत' : 'Counter-evidence / competing scholarship'}<textarea value={draft.counterEvidence} onChange={e => update('counterEvidence', e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-stone-300 p-3 text-sm"/></label>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{([[ 'nepaliConclusion', isNepali ? 'नेपाली निष्कर्ष' : 'Nepali conclusion' ], ['englishConclusion', isNepali ? 'English निष्कर्ष' : 'English conclusion']] as const).map(([key,label]) => <label key={key} className="block text-xs font-semibold text-stone-700">{label}<textarea value={String(draft[key] || '')} onChange={e => update(key, e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-stone-300 p-3 text-sm font-normal" /></label>)}</div>
        <label className="block text-xs font-semibold text-stone-700">{isNepali ? 'प्रमाणले समर्थन गर्ने निष्कर्ष र बाँकी अनिश्चितता' : 'Evidence-bounded conclusion and remaining uncertainty'}<textarea value={draft.conclusion} onChange={e => update('conclusion', e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-stone-300 p-3 text-sm"/></label>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-4"><span className="text-[11px] text-stone-500">{selectedId ? `ID: ${selectedId} · v${draft.version}` : (isNepali ? 'नयाँ record · save गरेपछि ID/version बन्नेछ' : 'New record · ID/version created on save')}</span><button type="button" onClick={() => void save()} disabled={saving || !draft.title.trim() || !draft.topic.trim()} className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Save className="mr-2 inline h-4 w-4"/>{saving ? (isNepali ? 'सुरक्षित हुँदैछ…' : 'Saving…') : (isNepali ? 'Firebase मा सुरक्षित गर्नुहोस्' : 'Save to Firebase')}</button></div>
        <p className="flex items-start gap-2 text-[11px] leading-5 text-stone-500"><AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0"/>{isNepali ? 'प्रकाशित अभिलेख सार्वजनिक Research पृष्ठमा देखिन्छ। Draft अभिलेख मालिकको Admin Console मा मात्र रहन्छ।' : 'Published records appear on the public Research page. Draft records remain available only in the owner Admin Console.'}</p>
      </section>
    </div>
  </div>;
};
