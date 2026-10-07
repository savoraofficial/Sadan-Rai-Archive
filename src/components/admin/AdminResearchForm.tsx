import React, { useEffect, useState } from 'react';
import { adminText } from '../../data/adminTranslations';
import { useBilingualAutoTranslate } from '../../hooks/useBilingualAutoTranslate';
import { useArchive } from '../../context/ArchiveContext';
import { 
  ResearchRecordItem, 
  ResearchStatus, 
  WorkflowStatus, 
  RightsStatus, 
  EvidenceType,
  ResearchWorkflowSourceEntry,
  ResearchWorkflowEvidenceAttachment,
  ResearchWorkflow,
  ResearcherOriginalFinding
} from '../../types';
import { RESEARCH_CATEGORIES, RESEARCH_STATUS_LABELS, RIGHTS_STATUS_LABELS, CIVILIZATION_FAMILIES } from '../../data/archiveData';
import { saveResearchRecord } from '../../services/dbService';
import { storage } from '../../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Save, 
  X, 
  Check, 
  BookOpen, 
  FileText, 
  Scale, 
  ShieldCheck, 
  Layers, 
  HelpCircle 
} from 'lucide-react';

interface AdminResearchFormProps {
  initialRecord?: ResearchRecordItem | null;
  onSuccess: () => void;
  onCancel: () => void;
  focusOriginalFinding?: boolean;
}

export const AdminResearchForm: React.FC<AdminResearchFormProps> = ({
  initialRecord,
  onSuccess,
  onCancel,
  focusOriginalFinding = false
}) => {
  const { language } = useArchive();
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCustomCivilization, setShowCustomCivilization] = useState(false);
  const [customCivilization, setCustomCivilization] = useState('');

  const emptyWorkflowSource = (): ResearchWorkflowSourceEntry => ({
    id: `wf-source-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sourceKind: 'foreign_scholar',
    authorOrInformant: '',
    workOrSource: '',
    whatItSays: '',
    reference: '',
    evidenceNote: '',
    evidenceAttachments: [],
    assessment: ''
  });

  const [formData, setFormData] = useState<Partial<ResearchRecordItem>>(() => {
    if (initialRecord) {
      return {
        ...initialRecord,
        researchWorkflow: initialRecord.researchWorkflow || {
          subjectFamily: initialRecord.category || 'history_civilization',
          civilizationOrTradition: initialRecord.community || '',
          sourceEntries: [{
            ...emptyWorkflowSource(),
            authorOrInformant: initialRecord.author || '',
            workOrSource: initialRecord.publication || '',
            whatItSays: initialRecord.originalQuotation || initialRecord.otherAuthorsViews || '',
            reference: [initialRecord.pageNumber, initialRecord.chapterSection].filter(Boolean).join(' · '),
            evidenceNote: initialRecord.evidence || '',
            assessment: initialRecord.researchConclusion || ''
          }],
          crossCheckAgreements: initialRecord.synthesis?.documentedInfo || '',
          crossCheckDifferences: initialRecord.conflictingViews || initialRecord.synthesis?.disputedInfo || '',
          evidenceAssessment: initialRecord.synthesis?.scholarlyInterpretation || '',
          localVerification: initialRecord.oralHistory || initialRecord.synthesis?.oralTradition || '',
          localVerificationLocation: initialRecord.location || '',
          localVerificationInformants: '',
          localVerificationDate: initialRecord.date || '',
          localVerificationAttachments: [],
          verificationOutcome: initialRecord.researchStatus === 'verified' ? 'corroborated' : initialRecord.researchStatus === 'oral_history' ? 'partially_supported' : 'not_checked',
          researcherAnalysis: initialRecord.synthesis?.scholarlyInterpretation || '',
          finalConclusion: initialRecord.researchConclusion || '',
          originalFinding: initialRecord.researchWorkflow?.originalFinding || {
            findingId: `SR-ORF-${Date.now()}`,
            findingType: 'field_observation',
            newFinding: '',
            findingStatus: 'new_observation',
            evidenceAttachments: []
          }
        }
      };
    }
    return {
      id: `res-${Date.now()}`,
      title: '',
      nepaliTitle: '',
      englishTitle: '',
      category: 'history_civilization',
      community: '',
      topic: '',
      author: '',
      publication: '',
      publicationYear: '',
      sourceUrl: '',
      pageNumber: '',
      chapterSection: '',
      originalQuotation: '',
      nepaliTranslation: '',
      englishTranslation: '',
      nepaliExplanation: '',
      englishExplanation: '',
      evidence: '',
      evidenceType: 'book',
      otherAuthorsViews: '',
      conflictingViews: '',
      oralHistory: '',
      researchConclusion: '',
      researchStatus: 'further_research', // Default: never automatically mark as verified!
      location: adminText(language, 'पूर्वी नेपाल'),
      date: new Date().toISOString().slice(0, 10),
      mediaAttachments: '',
      rightsStatus: 'original_sadan_rai',
      notes: '',
      synthesis: {
        documentedInfo: '',
        scholarlyInterpretation: '',
        oralTradition: '',
        disputedInfo: '',
        furtherResearchNeeded: ''
      },
      researchWorkflow: {
        subjectFamily: 'history_civilization',
        civilizationOrTradition: '',
        sourceEntries: [emptyWorkflowSource()],
        crossCheckAgreements: '',
        crossCheckDifferences: '',
        evidenceAssessment: '',
        localVerification: '',
        localVerificationLocation: '',
        localVerificationInformants: '',
        localVerificationDate: '',
        localVerificationAttachments: [],
        verificationOutcome: 'not_checked',
        researcherAnalysis: '',
        finalConclusion: '',
        originalFinding: {
          findingId: `SR-ORF-${Date.now()}`,
          findingType: 'field_observation',
          discoveryDate: '',
          discoveryLocation: '',
          informantOrContext: '',
          newFinding: '',
          exactObservation: '',
          whyItIsNew: '',
          relatedClaimsOrSections: '',
          evidenceAttachments: [],
          crossCheckSummary: '',
          findingStatus: 'new_observation',
          researcherInterpretation: '',
          conclusion: '',
          furtherResearch: '',
          publicationPermission: ''
        }
      },
      workflowStatus: 'draft',
      version: 1,
      createdAt: new Date().toISOString()
    };
  });

  const [changeNotes, setChangeNotes] = useState<string>(adminText(language, 'प्रारम्भिक अनुसन्धान प्रविष्टि'));
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadingSourceIndex, setUploadingSourceIndex] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { setPrimary: setEnglishTitle, setSecondary: setNepaliTitle } = useBilingualAutoTranslate(formData, setFormData, 'englishTitle', 'nepaliTitle');
  const { setPrimary: setEnglishTranslation, setSecondary: setNepaliTranslation } = useBilingualAutoTranslate(formData, setFormData, 'englishTranslation', 'nepaliTranslation');
  const { setPrimary: setEnglishExplanation, setSecondary: setNepaliExplanation } = useBilingualAutoTranslate(formData, setFormData, 'englishExplanation', 'nepaliExplanation');

  useEffect(() => {
    if (!focusOriginalFinding) return;
    const timer = window.setTimeout(() => {
      document.getElementById('admin-original-research-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [focusOriginalFinding]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() && !formData.nepaliTitle?.trim()) {
      setErrorMsg(adminText(language, 'कृपया अनुसन्धानको शीर्षक वा नेपाली शीर्षक अनिवार्य रूपमा भर्नुहोस्।'));
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      const recordToSave: ResearchRecordItem = {
        ...formData,
        id: formData.id || `res-${Date.now()}`,
        title: formData.title || formData.nepaliTitle || adminText(language, 'अनाम अनुसन्धान'),
        nepaliTitle: formData.nepaliTitle || formData.title || adminText(language, 'अनाम अनुसन्धान'),
        category: formData.category || 'history_civilization',
        topic: formData.topic || formData.nepaliTitle || adminText(language, 'सामान्य'),
        researchStatus: formData.researchStatus || 'further_research',
        workflowStatus: formData.workflowStatus || 'draft',
        rightsStatus: formData.rightsStatus || 'original_sadan_rai',
        version: formData.version || 1,
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as ResearchRecordItem;

      await saveResearchRecord(recordToSave, changeNotes);
      setSubmitting(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg(adminText(language, 'सुरक्षित गर्दा त्रुटि भयो। कृपया पुनः प्रयास गर्नुहोस्।'));
      setSubmitting(false);
    }
  };

  const updateField = (field: keyof ResearchRecordItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSynthesis = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      synthesis: {
        documentedInfo: '',
        scholarlyInterpretation: '',
        oralTradition: '',
        disputedInfo: '',
        furtherResearchNeeded: '',
        ...(prev.synthesis || {}),
        [field]: value
      }
    }));
  };

  const workflow = formData.researchWorkflow || {
    subjectFamily: 'history_civilization', civilizationOrTradition: '', sourceEntries: [],
    crossCheckAgreements: '', crossCheckDifferences: '', evidenceAssessment: '', localVerification: '',
    localVerificationLocation: '', localVerificationInformants: '', localVerificationDate: '', localVerificationAttachments: [],
    verificationOutcome: 'not_checked' as const, researcherAnalysis: '', finalConclusion: '',
    originalFinding: { findingId: `SR-ORF-${Date.now()}`, findingType: 'field_observation', newFinding: '', findingStatus: 'new_observation', evidenceAttachments: [] }
  };

  const updateWorkflow = <K extends keyof ResearchWorkflow>(field: K, value: ResearchWorkflow[K]) => {
    setFormData(prev => ({ ...prev, researchWorkflow: { ...workflow, [field]: value } as ResearchWorkflow }));
  };

  const updateWorkflowSource = <K extends keyof ResearchWorkflowSourceEntry>(index: number, field: K, value: ResearchWorkflowSourceEntry[K]) => {
    const next = [...(workflow.sourceEntries || [])];
    next[index] = { ...next[index], [field]: value };
    updateWorkflow('sourceEntries', next);
  };

  const handleSourceEvidenceUpload = async (index: number, files: FileList | null) => {
    if (!files?.length) return;
    const selected = Array.from(files).slice(0, 5);
    const maxBytes = 50 * 1024 * 1024;
    const allowed = new Set([
      'application/pdf', 'image/jpeg', 'image/png', 'image/webp',
      'audio/mpeg', 'audio/wav', 'audio/mp4', 'video/mp4', 'video/webm'
    ]);
    const invalid = selected.find(file => file.size > maxBytes || !allowed.has(file.type));
    if (invalid) {
      setErrorMsg(language === 'ne'
        ? `प्रमाण फाइल ${invalid.name} स्वीकार्य प्रकार वा ५० MB सीमा भित्र हुनुपर्छ।`
        : `Evidence file ${invalid.name} must be an accepted type and no larger than 50 MB.`);
      return;
    }

    try {
      setUploadingSourceIndex(index);
      setErrorMsg(null);
      const uploaded: ResearchWorkflowEvidenceAttachment[] = [];
      for (const file of selected) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `archive/research/${formData.id || 'new'}/source-${index + 1}/${Date.now()}-${safeName}`;
        const uploadedRef = await uploadBytes(storageRef(storage, path), file);
        const url = await getDownloadURL(uploadedRef.ref);
        uploaded.push({
          id: `wf-evidence-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          url,
          contentType: file.type || 'application/octet-stream',
          size: file.size,
          uploadedAt: new Date().toISOString()
        });
      }
      const current = workflow.sourceEntries?.[index]?.evidenceAttachments || [];
      updateWorkflowSource(index, 'evidenceAttachments', [...current, ...uploaded]);
    } catch (err) {
      console.error(err);
      setErrorMsg(language === 'ne' ? 'प्रमाण फाइल अपलोड गर्न सकिएन।' : 'Evidence upload failed.');
    } finally {
      setUploadingSourceIndex(null);
    }
  };

  const removeSourceEvidence = (index: number, attachmentId: string) => {
    const current = workflow.sourceEntries?.[index]?.evidenceAttachments || [];
    updateWorkflowSource(index, 'evidenceAttachments', current.filter(item => item.id !== attachmentId));
  };

  const handleLocalEvidenceUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const selected = Array.from(files).slice(0, 8);
    const maxBytes = 50 * 1024 * 1024;
    const allowed = new Set([
      'application/pdf', 'image/jpeg', 'image/png', 'image/webp',
      'audio/mpeg', 'audio/wav', 'audio/mp4', 'video/mp4', 'video/webm'
    ]);
    const invalid = selected.find(file => file.size > maxBytes || !allowed.has(file.type));
    if (invalid) {
      setErrorMsg(language === 'ne' ? `स्थानीय सत्यापन फाइल ${invalid.name} स्वीकार्य प्रकार वा ५० MB सीमा भित्र हुनुपर्छ।` : `Local verification file ${invalid.name} must be an accepted type and no larger than 50 MB.`);
      return;
    }
    try {
      setUploadingSourceIndex(-1);
      setErrorMsg(null);
      const uploaded: ResearchWorkflowEvidenceAttachment[] = [];
      for (const file of selected) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `archive/research/${formData.id || 'new'}/local-verification/${Date.now()}-${safeName}`;
        const uploadedRef = await uploadBytes(storageRef(storage, path), file);
        const url = await getDownloadURL(uploadedRef.ref);
        uploaded.push({ id: `local-evidence-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: file.name, url, contentType: file.type || 'application/octet-stream', size: file.size, uploadedAt: new Date().toISOString() });
      }
      updateWorkflow('localVerificationAttachments', [...(workflow.localVerificationAttachments || []), ...uploaded]);
    } catch (err) {
      console.error(err);
      setErrorMsg(language === 'ne' ? 'स्थानीय सत्यापन प्रमाण अपलोड गर्न सकिएन।' : 'Local verification evidence upload failed.');
    } finally {
      setUploadingSourceIndex(null);
    }
  };

  const removeLocalEvidence = (attachmentId: string) => {
    updateWorkflow('localVerificationAttachments', (workflow.localVerificationAttachments || []).filter(item => item.id !== attachmentId));
  };

  const updateOriginalFinding = <K extends keyof ResearcherOriginalFinding>(field: K, value: ResearcherOriginalFinding[K]) => {
    const current = workflow.originalFinding || {
      findingId: `SR-ORF-${Date.now()}`, findingType: 'field_observation' as const, newFinding: '', findingStatus: 'new_observation' as const, evidenceAttachments: []
    };
    updateWorkflow('originalFinding', { ...current, [field]: value });
  };

  const handleOriginalFindingEvidenceUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const selected = Array.from(files).slice(0, 12);
    const maxBytes = 50 * 1024 * 1024;
    const allowed = new Set([
      'application/pdf', 'image/jpeg', 'image/png', 'image/webp',
      'audio/mpeg', 'audio/wav', 'audio/mp4',
      'video/mp4', 'video/webm'
    ]);
    const invalid = selected.find(file => file.size > maxBytes || !allowed.has(file.type));
    if (invalid) {
      setErrorMsg(language === 'ne' ? `मौलिक खोजको प्रमाण फाइल ${invalid.name} स्वीकार्य प्रकार वा ५० MB सीमा भित्र हुनुपर्छ।` : `Original finding evidence ${invalid.name} must be an accepted type and no larger than 50 MB.`);
      return;
    }
    try {
      setUploadingSourceIndex(-2);
      setErrorMsg(null);
      const uploaded: ResearchWorkflowEvidenceAttachment[] = [];
      for (const file of selected) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `archive/research/${formData.id || 'new'}/original-finding/${Date.now()}-${safeName}`;
        const uploadedRef = await uploadBytes(storageRef(storage, path), file);
        const url = await getDownloadURL(uploadedRef.ref);
        uploaded.push({ id: `original-finding-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: file.name, url, contentType: file.type || 'application/octet-stream', size: file.size, uploadedAt: new Date().toISOString() });
      }
      const current = workflow.originalFinding?.evidenceAttachments || [];
      updateOriginalFinding('evidenceAttachments', [...current, ...uploaded]);
    } catch (err) {
      console.error(err);
      setErrorMsg(language === 'ne' ? 'मौलिक खोजको प्रमाण अपलोड गर्न सकिएन।' : 'Original finding evidence upload failed.');
    } finally {
      setUploadingSourceIndex(null);
    }
  };

  const removeOriginalFindingEvidence = (attachmentId: string) => {
    updateOriginalFinding('evidenceAttachments', (workflow.originalFinding?.evidenceAttachments || []).filter(item => item.id !== attachmentId));
  };

  return (
    <form id={focusOriginalFinding ? "admin-original-research-section" : "admin-research-form"} onSubmit={handleSubmit} className="bg-white rounded-lg border border-stone-300 p-6 sm:p-8 space-y-8 shadow-xs">
      
      {/* Form Top Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif-np text-xl sm:text-2xl font-bold text-stone-900">
              {focusOriginalFinding ? (initialRecord ? adminText(language, 'मौलिक अनुसन्धान सम्पादन') : adminText(language, 'नयाँ मौलिक अनुसन्धान / Field Finding')) : (initialRecord ? adminText(language, 'अनुसन्धान अभिलेख सम्पादन') : adminText(language, 'नयाँ अनुसन्धान अभिलेख प्रविष्टि'))}
            </h2>
            {focusOriginalFinding && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-900">Original Research</span>}
          </div>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            {focusOriginalFinding ? (language === 'ne' ? 'Field Finding → Original Evidence → Provenance → Cross-check → Assessment → Analysis → Conclusion → Version History' : 'Field Finding → Original Evidence → Provenance → Cross-check → Assessment → Analysis → Conclusion → Version History') : adminText(language, 'स्रोत, प्रमाण, अनुवाद र प्राज्ञिक संश्लेषणसहितको पूर्ण अनुसन्धान ढाँचा')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(value => !value)}
            className="px-3.5 py-1.5 text-xs text-stone-700 hover:text-stone-900 border border-stone-300 bg-white rounded cursor-pointer transition-colors"
          >
            {showPreview ? adminText(language, 'पूर्वावलोकन बन्द') : adminText(language, 'पूर्वावलोकन')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 rounded cursor-pointer transition-colors"
          >
            {adminText(language, 'रद्द गर्नुहोस्')}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 bg-amber-800 hover:bg-amber-700 text-white font-medium text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{submitting ? adminText(language, 'सुरक्षित गर्दै...') : adminText(language, 'सुरक्षित गर्नुहोस्')}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 font-sans">
          {errorMsg}
        </div>
      )}

      {showPreview && (
        <section className="rounded-2xl border border-amber-200 bg-[#F7F2E8] p-5 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-amber-800 font-semibold">RESEARCH PREVIEW</p>
              <h3 className="mt-1 font-serif-np text-xl font-bold text-stone-900">{language === 'ne' ? (formData.nepaliTitle || formData.title || 'शीर्षक बाँकी') : (formData.englishTitle || formData.title || 'Untitled research')}</h3>
            </div>
            <span className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-[10px] font-semibold text-stone-700">{formData.workflowStatus || 'draft'} · v{formData.version || 1}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="rounded-lg bg-white p-3 border border-stone-200"><span className="block text-[10px] text-stone-500">{language === 'ne' ? 'वर्ग' : 'Category'}</span><strong className="mt-1 block text-xs text-stone-800">{formData.category || '—'}</strong></div>
            <div className="rounded-lg bg-white p-3 border border-stone-200"><span className="block text-[10px] text-stone-500">{language === 'ne' ? 'विषय' : 'Topic'}</span><strong className="mt-1 block text-xs text-stone-800">{formData.topic || '—'}</strong></div>
            <div className="rounded-lg bg-white p-3 border border-stone-200"><span className="block text-[10px] text-stone-500">{language === 'ne' ? 'अनुसन्धान स्थिति' : 'Research status'}</span><strong className="mt-1 block text-xs text-stone-800">{formData.researchStatus || '—'}</strong></div>
            <div className="rounded-lg bg-white p-3 border border-stone-200"><span className="block text-[10px] text-stone-500">{language === 'ne' ? 'प्रमाण' : 'Evidence'}</span><strong className="mt-1 block text-xs text-stone-800">{formData.evidence ? '✓' : '—'}</strong></div>
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-3">
            <div className="rounded-xl bg-white border border-stone-200 p-4"><h4 className="font-semibold text-sm text-stone-900">{language === 'ne' ? 'अनुसन्धान निष्कर्ष' : 'Research conclusion'}</h4><p className="mt-2 whitespace-pre-line text-xs leading-6 text-stone-600">{formData.researchConclusion || formData.researchWorkflow?.finalConclusion || '—'}</p></div>
            <div className="rounded-xl bg-white border border-stone-200 p-4"><h4 className="font-semibold text-sm text-stone-900">Workflow trail</h4><p className="mt-2 text-xs leading-6 text-stone-600">{language === 'ne' ? 'स्रोत → प्रमाण → Cross-check → मूल्याङ्कन → विश्लेषण → निष्कर्ष → प्रकाशन → संस्करण इतिहास' : 'Source → Evidence → Cross-check → Assessment → Analysis → Conclusion → Publication → Version History'}</p></div>
          </div>
        </section>
      )}

      {/* 1. Core Identification & Category */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1">
          {adminText(language, '१. आधारभूत विवरण तथा वर्गीकरण (Identification & Category)')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'नेपाली शीर्षक (Nepali Title) *' )}</label>
            <input
              type="text"
              required
              value={formData.nepaliTitle || ''}
              onChange={e => setNepaliTitle(e.target.value)}
              placeholder={adminText(language, 'उदा: किराँत कालका शासन संरचना र अभिलेख')}
              className="w-full p-2 border border-stone-300 rounded font-serif-np text-sm"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'English Title')}</label>
            <input
              type="text"
              value={formData.englishTitle || ''}
              onChange={e => { const value = e.target.value; setEnglishTitle(value); updateField('title', value); }}
              placeholder={adminText(language, 'e.g. Administrative Structure of Kirat Era')}
              className="w-full p-2 border border-stone-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'विषयगत खण्ड / Category *' )}</label>
            <select
              value={RESEARCH_CATEGORIES.some(cat => cat.key === formData.category) ? (formData.category as string) : 'history_civilization'}
              onChange={e => {
                setShowCustomCategory(false);
                setCustomCategory('');
                updateField('category', e.target.value);
              }}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            >
              {RESEARCH_CATEGORIES.map(cat => (
                <option key={cat.key} value={cat.key}>{language === 'ne' ? cat.nepali : cat.english}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => { setShowCustomCategory(true); setCustomCategory(''); updateField('category', ''); }}
              className="mt-2 inline-flex items-center rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900"
            >{language === 'ne' ? '+ कस्टम' : '+ Custom'}</button>
            {showCustomCategory && (
              <input
                autoFocus
                type="text"
                value={customCategory}
                onChange={e => { setCustomCategory(e.target.value); updateField('category', e.target.value.trim()); }}
                placeholder={language === 'ne' ? 'नयाँ category नाम लेख्नुहोस्' : 'Type custom category name'}
                className="w-full p-2 mt-2 border border-amber-300 rounded text-xs bg-amber-50/40"
              />
            )}
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'समुदाय / जाति (Community)' )}</label>
            <input
              type="text"
              value={formData.community || ''}
              onChange={e => updateField('community', e.target.value)}
              placeholder={adminText(language, 'किराँत / राई / लिम्बू / तामाङ / साझा')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'मुख्य विषय (Topic)' )}</label>
            <input
              type="text"
              value={formData.topic || ''}
              onChange={e => updateField('topic', e.target.value)}
              placeholder={adminText(language, 'भौगोलिक सीमा, वंशावली, मुन्धुम...')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'स्थान / भूगोल (Location)' )}</label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={e => updateField('location', e.target.value)}
              placeholder={adminText(language, 'माल्बासे–१, पात्लेपानी / पूर्वी नेपाल')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>
        </div>
      </div>

      {/* 2. Source, Author & Bibliographic Details */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1">
          {adminText(language, '२. लेखक तथा सन्दर्भ ग्रन्थ (Author & Bibliographic Reference)')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'लेखक / शोधकर्ता (Author)' )}</label>
            <input
              type="text"
              value={formData.author || ''}
              onChange={e => updateField('author', e.target.value)}
              placeholder={adminText(language, 'उदा: Francis Buchanan Hamilton')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'पुस्तक / दस्तावेज (Publication)' )}</label>
            <input
              type="text"
              value={formData.publication || ''}
              onChange={e => updateField('publication', e.target.value)}
              placeholder={adminText(language, 'उदा: An Account of the Kingdom of Nepal...')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रकाशन वर्ष (Year)' )}</label>
            <input
              type="text"
              value={formData.publicationYear || ''}
              onChange={e => updateField('publicationYear', e.target.value)}
              placeholder={adminText(language, 'उदा: 1819')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'पृष्ठ नम्बर (Page Number)' )}</label>
            <input
              type="text"
              value={formData.pageNumber || ''}
              onChange={e => updateField('pageNumber', e.target.value)}
              placeholder={adminText(language, 'उदा: pp. 132–134 (थप अनुसन्धानपछि राखिने भए खाली छाड्नुहोस्)')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'अध्याय / खण्ड (Chapter/Section)' )}</label>
            <input
              type="text"
              value={formData.chapterSection || ''}
              onChange={e => updateField('chapterSection', e.target.value)}
              placeholder={adminText(language, 'उदा: Part II, Chapter II')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'मूल स्रोत URL / Archive Link' )}</label>
            <input
              type="url"
              value={formData.sourceUrl || ''}
              onChange={e => updateField('sourceUrl', e.target.value)}
              placeholder="https://archive.org/details/..."
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>
        </div>
      </div>

      {/* 3. Text Passages, Translations & Explanations */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1">
          {adminText(language, '३. मूल पाठ, नेपाली अनुवाद र व्याख्या (Quotations, Translations & Explanations)')}
        </h3>

        <div className="space-y-3 text-xs font-sans">
          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'मूल भाषाको हरफ / उद्धरण (Original Quotation)' )}</label>
            <textarea
              rows={3}
              value={formData.originalQuotation || ''}
              onChange={e => updateField('originalQuotation', e.target.value)}
              placeholder={adminText(language, 'मूल ग्रन्थमा जस्तो लेखिएको छ त्यस्तै प्रमाणीकृत हरफ...')}
              className="w-full p-2.5 border border-stone-300 rounded font-serif italic text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'नेपाली अनुवाद (Nepali Translation)' )}</label>
              <textarea
                rows={3}
                value={formData.nepaliTranslation || ''}
                onChange={e => setNepaliTranslation(e.target.value)}
                placeholder={adminText(language, 'उद्धरणको आधिकारिक नेपाली भावार्थ...')}
                className="w-full p-2.5 border border-stone-300 rounded font-serif-np text-xs"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'English Translation')}</label>
              <textarea
                rows={3}
                value={formData.englishTranslation || ''}
                onChange={e => setEnglishTranslation(e.target.value)}
                placeholder={adminText(language, 'English translation of passage (or leave empty for coming soon)...')}
                className="w-full p-2.5 border border-stone-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'नेपाली व्याख्या / पृष्ठभूमि (Nepali Explanation)' )}</label>
              <textarea
                rows={3}
                value={formData.nepaliExplanation || ''}
                onChange={e => setNepaliExplanation(e.target.value)}
                placeholder={adminText(language, 'यस विवरणको ऐतिहासिक सन्दर्भ, सूचनादाता तथा अर्थ...')}
                className="w-full p-2.5 border border-stone-300 rounded font-serif-np text-xs"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'English Explanation')}</label>
              <textarea
                rows={3}
                value={formData.englishExplanation || ''}
                onChange={e => setEnglishExplanation(e.target.value)}
                placeholder={adminText(language, 'Historical context and explanation in English...')}
                className="w-full p-2.5 border border-stone-300 rounded text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Evidence, Multi-author Views & Oral History */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1">
          {adminText(language, '४. प्रमाण, अन्य लेखकका दृष्टिकोण र मौखिक इतिहास (Evidence & Comparative Perspectives)')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रमाणको प्रकार (Evidence Type)' )}</label>
            <select
              value={formData.evidenceType || 'book'}
              onChange={e => updateField('evidenceType', e.target.value as EvidenceType)}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            >
              <option value="book">{adminText(language, 'पुस्तक (Book)' )}</option>
              <option value="academic_paper">{adminText(language, 'शोधपत्र (Academic Paper)' )}</option>
              <option value="government_doc">{adminText(language, 'सरकारी दस्तावेज (Government Doc)' )}</option>
              <option value="archive">{adminText(language, 'अभिलेखालय (Archive)' )}</option>
              <option value="museum_record">{adminText(language, 'संग्रहालय अभिलेख (Museum Record)' )}</option>
              <option value="archaeological_evidence">{adminText(language, 'पुरातात्विक प्रमाण (Archaeological Evidence)' )}</option>
              <option value="inscription">{adminText(language, 'शिलालेख / अभिलेख (Inscription)' )}</option>
              <option value="manuscript">{adminText(language, 'हस्तलिखित ग्रन्थ (Manuscript)' )}</option>
              <option value="photograph">{adminText(language, 'ऐतिहासिक तस्बिर (Photograph)' )}</option>
              <option value="map">{adminText(language, 'प्राचीन नक्सा (Map)' )}</option>
              <option value="interview">{adminText(language, 'अन्तर्वार्ता (Interview)' )}</option>
              <option value="oral_history">{adminText(language, 'मौखिक इतिहास (Oral History)' )}</option>
              <option value="other">{adminText(language, 'अन्य दस्तावेजी प्रमाण (Other)' )}</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रमाण विवरण (Evidence Details)' )}</label>
            <input
              type="text"
              value={formData.evidence || ''}
              onChange={e => updateField('evidence', e.target.value)}
              placeholder={adminText(language, 'प्रमाणको प्रकृति, भौतिक उपस्थिति वा स्रोत...')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, "अन्य लेखकहरूको दृष्टिकोण (Other Authors' Views)" )}</label>
            <textarea
              rows={2}
              value={formData.otherAuthorsViews || ''}
              onChange={e => updateField('otherAuthorsViews', e.target.value)}
              placeholder={adminText(language, 'Kirkpatrick, Hodgson, Chemjong आदिले के भनेका छन्...')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'विवादित वा फरक मत (Conflicting Views)' )}</label>
            <textarea
              rows={2}
              value={formData.conflictingViews || ''}
              onChange={e => updateField('conflictingViews', e.target.value)}
              placeholder={adminText(language, 'तथ्य, मिति वा नाममा देखिएका मतभेदहरू...')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'स्थानीय मौखिक इतिहास (Oral History)' )}</label>
            <textarea
              rows={2}
              value={formData.oralHistory || ''}
              onChange={e => updateField('oralHistory', e.target.value)}
              placeholder={adminText(language, 'स्थानीय जानकार तथा अग्रजहरूले भनेका मौखिक कथन...')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'अनुसन्धान निष्कर्ष / टिप्पणी (Research Conclusion)' )}</label>
            <textarea
              rows={2}
              value={formData.researchConclusion || ''}
              onChange={e => updateField('researchConclusion', e.target.value)}
              placeholder={adminText(language, 'अन्तिम निष्कर्ष (नोट: स्वतः अन्तिम सत्य मानिने छैन)...')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>
        </div>
      </div>

            {/* 5. Universal Research & Verification Workflow */}
      <div className="research-universal-workflow rounded-2xl border border-amber-200 bg-gradient-to-br from-stone-50 via-white to-amber-50/40 p-5 sm:p-7 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 border-b border-amber-200/80 pb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-800 font-bold">{language === 'ne' ? 'साझा अनुसन्धान कार्यप्रवाह' : 'Universal Research Workflow'}</div>
            <h3 className="mt-1 text-xl sm:text-2xl font-serif-np font-bold text-stone-900">{language === 'ne' ? 'स्रोत → प्रमाण → क्रस–चेक → स्थानीय सत्यापन → अन्तिम निष्कर्ष' : 'Sources → Evidence → Cross-check → Local Verification → Final Conclusion'}</h3>
            <p className="mt-2 max-w-3xl text-xs sm:text-sm leading-relaxed text-stone-600">{language === 'ne' ? 'यो एउटै workspace किराँत, बौद्ध, हिन्दू, अन्य सभ्यता, धर्म, संस्कृति, स्थान तथा मौखिक इतिहास सबै अनुसन्धानमा उही ढाँचामा प्रयोग हुन्छ।' : 'The same workspace is used for Kirat, Buddhist, Hindu, other civilizations, religions, cultures, places, and oral histories without rebuilding the workflow.'}</p>
          </div>
          <div className="inline-flex items-center rounded-full border border-amber-300 bg-white px-3 py-2 text-[11px] font-semibold text-stone-700 shadow-sm">{language === 'ne' ? 'भविष्यका विषयका लागि पुनः प्रयोगयोग्य' : 'Reusable for future subjects'}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-stone-700 font-medium mb-1">{language === 'ne' ? 'अनुसन्धान परिवार' : 'Research family'}</label>
            <select value={workflow.subjectFamily || 'history_civilization'} onChange={e => updateWorkflow('subjectFamily', e.target.value)} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white">
              {RESEARCH_CATEGORIES.map(cat => <option key={cat.key} value={cat.key}>{language === 'ne' ? cat.nepali : cat.english}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-stone-700 font-medium mb-1">{language === 'ne' ? 'सभ्यता / धर्म / परम्परा / विषय' : 'Civilization / Religion / Tradition / Subject'}</label>
            <select value={CIVILIZATION_FAMILIES.some(item => item.key === workflow.civilizationOrTradition) ? workflow.civilizationOrTradition : (workflow.civilizationOrTradition ? 'other' : '')} onChange={e => { const v=e.target.value; setShowCustomCivilization(v==='other'); updateWorkflow('civilizationOrTradition', v==='other' ? customCivilization : v); }} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white">
              <option value="">{language === 'ne' ? 'छान्नुहोस्…' : 'Select…'}</option>
              {CIVILIZATION_FAMILIES.map(item => <option key={item.key} value={item.key}>{language === 'ne' ? item.nepali : item.english}</option>)}
            </select>
            {(showCustomCivilization || (workflow.civilizationOrTradition && !CIVILIZATION_FAMILIES.some(item => item.key === workflow.civilizationOrTradition))) && (
              <input autoFocus value={customCivilization || (CIVILIZATION_FAMILIES.some(item => item.key === workflow.civilizationOrTradition) ? '' : workflow.civilizationOrTradition)} onChange={e => { setCustomCivilization(e.target.value); updateWorkflow('civilizationOrTradition', e.target.value); }} placeholder={language === 'ne' ? 'नयाँ सभ्यता / परम्परा / विषय लेख्नुहोस्' : 'Type another civilization / tradition / subject'} className="w-full p-2.5 mt-2 border border-amber-300 rounded-lg text-xs bg-amber-50/40" />
            )}
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-stone-900">{language === 'ne' ? 'स्रोत तुलना र “कसले के भने?”' : 'Source comparison & “Who said what?”'}</h4>
              <p className="text-[11px] text-stone-500 mt-1">{language === 'ne' ? 'विदेशी, नेपाली, स्थानीय तथा प्राथमिक स्रोत एउटै अनुसन्धानभित्र क्रमशः थप्नुहोस्।' : 'Add foreign, Nepali, local, and primary sources inside the same research record.'}</p>
            </div>
            <button type="button" onClick={() => updateWorkflow('sourceEntries', [...(workflow.sourceEntries || []), emptyWorkflowSource()])} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100">+ {language === 'ne' ? 'स्रोत थप्नुहोस्' : 'Add source'}</button>
          </div>

          {(workflow.sourceEntries || []).map((entry, index) => (
            <div key={entry.id} className="rounded-xl border border-stone-200 bg-stone-50/70 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold">{language === 'ne' ? `स्रोत ${index + 1}` : `Source ${index + 1}`}</span>{(workflow.sourceEntries || []).length > 1 && <button type="button" onClick={() => updateWorkflow('sourceEntries', (workflow.sourceEntries || []).filter((_,i)=>i!==index))} className="text-[11px] text-stone-500 hover:text-rose-700">{language === 'ne' ? 'हटाउनुहोस्' : 'Remove'}</button>}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select value={entry.sourceKind} onChange={e=>updateWorkflowSource(index,'sourceKind',e.target.value as ResearchWorkflowSourceEntry['sourceKind'])} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white">
                  <option value="foreign_scholar">{language === 'ne' ? 'विदेशी / बाह्य विद्वान्' : 'Foreign / External Scholar'}</option>
                  <option value="nepali_scholar">{language === 'ne' ? 'नेपाली विद्वान् / लेखक' : 'Nepali Scholar / Author'}</option>
                  <option value="local_researcher">{language === 'ne' ? 'स्थानीय अनुसन्धानकर्ता' : 'Local Researcher'}</option>
                  <option value="community_oral">{language === 'ne' ? 'समुदाय / मौखिक स्रोत' : 'Community / Oral Source'}</option>
                  <option value="primary_document">{language === 'ne' ? 'प्राथमिक दस्तावेज / अभिलेख' : 'Primary Document / Archive'}</option>
                  <option value="other">{language === 'ne' ? 'अन्य स्रोत' : 'Other Source'}</option>
                </select>
                <input value={entry.authorOrInformant} onChange={e=>updateWorkflowSource(index,'authorOrInformant',e.target.value)} placeholder={language === 'ne' ? 'लेखक / जानकार / सूचनादाता' : 'Author / informant'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" />
                <input value={entry.countryOrInstitution || ''} onChange={e=>updateWorkflowSource(index,'countryOrInstitution',e.target.value)} placeholder={language === 'ne' ? 'देश / संस्था / अभिलेखालय' : 'Country / institution / archive'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" />
                <input value={entry.workOrSource} onChange={e=>updateWorkflowSource(index,'workOrSource',e.target.value)} placeholder={language === 'ne' ? 'पुस्तक / लेख / दस्तावेज / अन्तर्वार्ता' : 'Book / article / document / interview'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" />
                <input value={entry.publicationYear || ''} onChange={e=>updateWorkflowSource(index,'publicationYear',e.target.value)} placeholder={language === 'ne' ? 'प्रकाशन वर्ष' : 'Publication year'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" />
                <input value={entry.publisher || ''} onChange={e=>updateWorkflowSource(index,'publisher',e.target.value)} placeholder={language === 'ne' ? 'प्रकाशक / संस्था' : 'Publisher / institution'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" />
                <input value={entry.edition || ''} onChange={e=>updateWorkflowSource(index,'edition',e.target.value)} placeholder={language === 'ne' ? 'संस्करण' : 'Edition'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" />
                <input value={entry.chapterSection || ''} onChange={e=>updateWorkflowSource(index,'chapterSection',e.target.value)} placeholder={language === 'ne' ? 'अध्याय / खण्ड' : 'Chapter / section'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" />
                <input value={entry.pageNumber || ''} onChange={e=>updateWorkflowSource(index,'pageNumber',e.target.value)} placeholder={language === 'ne' ? 'पृष्ठ नम्बर' : 'Page number'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" />
                <input value={entry.reference} onChange={e=>updateWorkflowSource(index,'reference',e.target.value)} placeholder={language === 'ne' ? 'पूर्ण अभिलेख / catalogue reference' : 'Full archive / catalogue reference'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" />
                <textarea rows={3} value={entry.whatItSays} onChange={e=>updateWorkflowSource(index,'whatItSays',e.target.value)} placeholder={language === 'ne' ? 'यस स्रोतले के भन्छ?' : 'What does this source say?'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white md:col-span-2" />
                <textarea rows={2} value={entry.evidenceNote} onChange={e=>updateWorkflowSource(index,'evidenceNote',e.target.value)} placeholder={language === 'ne' ? 'यस भनाइको प्रमाण / आधार — यो दाबी किन यस प्रमाणसँग जोडिन्छ?' : 'Evidence supporting this statement — why is this evidence linked to the claim?'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white md:col-span-2" />
                <div className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-stone-900">{language === 'ne' ? 'यस स्रोतको वास्तविक प्रमाण संलग्न गर्नुहोस्' : 'Attach the actual evidence for this source'}</div>
                      <div className="text-[10px] text-stone-600 mt-1">{language === 'ne' ? 'पुस्तकको सम्बन्धित पृष्ठको scan/photo, PDF, document, photo, audio वा video यही स्रोतसँग सुरक्षित हुन्छ।' : 'Attach the relevant book-page scan/photo, PDF, document, photo, audio or video directly to this source.'}</div>
                    </div>
                    <label className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-3 py-2 text-xs font-semibold text-white cursor-pointer hover:bg-stone-800">
                      {uploadingSourceIndex === index ? (language === 'ne' ? 'अपलोड हुँदैछ…' : 'Uploading…') : (language === 'ne' ? 'प्रमाण फाइल थप्नुहोस्' : 'Attach evidence files')}
                      <input type="file" multiple accept="application/pdf,image/jpeg,image/png,image/webp,audio/mpeg,audio/wav,audio/mp4,video/mp4,video/webm" className="sr-only" disabled={uploadingSourceIndex === index} onChange={e => { void handleSourceEvidenceUpload(index, e.target.files); e.currentTarget.value = ''; }} />
                    </label>
                  </div>
                  {(entry.evidenceAttachments || []).length > 0 && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(entry.evidenceAttachments || []).map(file => (
                        <div key={file.id} className="flex items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2">
                          <a href={file.url} target="_blank" rel="noreferrer" className="min-w-0 text-[11px] font-medium text-amber-900 hover:underline truncate">{file.name}</a>
                          <button type="button" onClick={() => removeSourceEvidence(index, file.id)} className="shrink-0 text-[10px] text-stone-500 hover:text-rose-700">{language === 'ne' ? 'हटाउनुहोस्' : 'Remove'}</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <textarea rows={2} value={entry.assessment || ''} onChange={e=>updateWorkflowSource(index,'assessment',e.target.value)} placeholder={language === 'ne' ? 'अनुसन्धान मूल्याङ्कन / टिप्पणी' : 'Research assessment / note'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white md:col-span-2" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'ne' ? '🔒 क्रस–चेक — Admin Only / Researcher Workspace' : '🔒 Cross-check — Admin Only / Researcher Workspace'}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900/80">{language === 'ne' ? 'यो भाग सार्वजनिक अनुसन्धान अभिलेखमा देखाइँदैन। प्रणालीले कुनै स्रोतलाई स्वतः सही/गलत वा अन्तिम सत्य घोषणा गर्दैन। तुलना, मूल्याङ्कन र व्याख्या अनुसन्धानकर्ताले आफैं लेख्नुहुन्छ।' : 'This working section is not exposed in the public research record. The system does not automatically declare a source true, false, or final; comparison, assessment, and interpretation remain researcher-controlled.'}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div><label className="block text-stone-700 font-medium mb-1">{language === 'ne' ? 'मिलेको कुरा / Agreement' : 'Agreements across sources'}</label><textarea rows={3} value={workflow.crossCheckAgreements} onChange={e=>updateWorkflow('crossCheckAgreements',e.target.value)} placeholder={language === 'ne' ? 'धेरै स्रोतमा समान रूपमा देखिएको कुरा…' : 'What multiple sources agree on…'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" /></div>
            <div><label className="block text-stone-700 font-medium mb-1">{language === 'ne' ? 'नमिलेको कुरा / Contradictions' : 'Differences / contradictions'}</label><textarea rows={3} value={workflow.crossCheckDifferences} onChange={e=>updateWorkflow('crossCheckDifferences',e.target.value)} placeholder={language === 'ne' ? 'स्रोतहरूबीच फरक वा विवाद…' : 'Differences or conflicting claims…'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" /></div>
            <div><label className="block text-stone-700 font-medium mb-1">{language === 'ne' ? 'प्रमाणको समग्र मूल्याङ्कन' : 'Evidence assessment'}</label><textarea rows={3} value={workflow.evidenceAssessment} onChange={e=>updateWorkflow('evidenceAssessment',e.target.value)} placeholder={language === 'ne' ? 'प्रमाणको गुणस्तर, सीमा र सम्बन्ध…' : 'Quality, limits, and relationship of the evidence…'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" /></div>
            <div><label className="block text-stone-700 font-medium mb-1">{language === 'ne' ? 'स्थानीय / समुदाय सत्यापन' : 'Local / community verification'}</label><textarea rows={3} value={workflow.localVerification} onChange={e=>updateWorkflow('localVerification',e.target.value)} placeholder={language === 'ne' ? 'गाउँ/ठाउँका जानकारसँग बुझ्दा के पुष्टि वा खण्डन भयो?' : 'What was corroborated or challenged by local/community verification?'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" /></div>
          </div>
          <input value={workflow.localVerificationLocation || ''} onChange={e=>updateWorkflow('localVerificationLocation',e.target.value)} placeholder={language === 'ne' ? 'सत्यापन स्थान' : 'Verification location'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" />
          <input value={workflow.localVerificationInformants || ''} onChange={e=>updateWorkflow('localVerificationInformants',e.target.value)} placeholder={language === 'ne' ? 'स्थानीय जानकार / सूचनादाता' : 'Local informants / knowledge holders'} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" />
          <input type="date" value={workflow.localVerificationDate || ''} onChange={e=>updateWorkflow('localVerificationDate',e.target.value)} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white" />
          <div className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div><div className="text-xs font-bold text-stone-900">{language === 'ne' ? 'स्थानीय सत्यापनको वास्तविक प्रमाण' : 'Actual evidence from local verification'}</div><div className="text-[10px] text-stone-600 mt-1">{language === 'ne' ? 'स्थलको फोटो, interview audio/video, स्थानीय document वा अन्य field evidence यही अनुसन्धानसँग जोड्नुहोस्।' : 'Attach site photos, interview audio/video, local documents or other field evidence directly to this research.'}</div></div>
              <label className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-3 py-2 text-xs font-semibold text-white cursor-pointer hover:bg-stone-800">
                {uploadingSourceIndex === -1 ? (language === 'ne' ? 'अपलोड हुँदैछ…' : 'Uploading…') : (language === 'ne' ? 'फिल्ड प्रमाण थप्नुहोस्' : 'Attach field evidence')}
                <input type="file" multiple accept="application/pdf,image/jpeg,image/png,image/webp,audio/mpeg,audio/wav,audio/mp4,video/mp4,video/webm" className="sr-only" disabled={uploadingSourceIndex === -1} onChange={e => { void handleLocalEvidenceUpload(e.target.files); e.currentTarget.value = ''; }} />
              </label>
            </div>
            {(workflow.localVerificationAttachments || []).length > 0 && <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">{(workflow.localVerificationAttachments || []).map(file => <div key={file.id} className="flex items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2"><a href={file.url} target="_blank" rel="noreferrer" className="min-w-0 text-[11px] font-medium text-amber-900 hover:underline truncate">{file.name}</a><button type="button" onClick={() => removeLocalEvidence(file.id)} className="shrink-0 text-[10px] text-stone-500 hover:text-rose-700">{language === 'ne' ? 'हटाउनुहोस्' : 'Remove'}</button></div>)}</div>}
          </div>
          <select value={workflow.verificationOutcome} onChange={e=>updateWorkflow('verificationOutcome',e.target.value as ResearchWorkflow['verificationOutcome'])} className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-white">
            <option value="not_checked">{language === 'ne' ? 'अझै जाँच नगरिएको' : 'Not yet checked'}</option>
            <option value="corroborated">{language === 'ne' ? 'बहु-स्रोत / स्थानीय रूपमा पुष्टि' : 'Corroborated'}</option>
            <option value="partially_supported">{language === 'ne' ? 'आंशिक रूपमा समर्थित' : 'Partially supported'}</option>
            <option value="conflicting">{language === 'ne' ? 'स्रोतहरूबीच विवादित' : 'Conflicting sources'}</option>
            <option value="not_verified">{language === 'ne' ? 'प्रमाणित हुन नसकेको' : 'Not verified'}</option>
            <option value="further_research">{language === 'ne' ? 'थप अनुसन्धान आवश्यक' : 'Further research required'}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <div><label className="block text-stone-800 font-semibold mb-1">{language === 'ne' ? 'अनुसन्धानकर्ताको विश्लेषण' : 'Researcher analysis'}</label><textarea rows={4} value={workflow.researcherAnalysis} onChange={e=>updateWorkflow('researcherAnalysis',e.target.value)} placeholder={language === 'ne' ? 'स्रोत, प्रमाण, तुलना र स्थानीय जाँचको समग्र विश्लेषण…' : 'Synthesize the sources, evidence, comparison, and local verification…'} className="w-full p-2.5 border border-amber-200 rounded-lg text-xs bg-white" /></div>
          <div><label className="block text-stone-800 font-semibold mb-1">{language === 'ne' ? 'सदन राई — अन्तिम अनुसन्धान निष्कर्ष' : 'Sadan Rai — Final Research Conclusion'}</label><textarea rows={4} value={workflow.finalConclusion} onChange={e=>updateWorkflow('finalConclusion',e.target.value)} placeholder={language === 'ne' ? 'उपलब्ध स्रोत र प्रमाणको आधारमा अन्तिम निष्कर्ष; अझै अनिश्चित कुरा स्पष्ट रूपमा उल्लेख गर्नुहोस्…' : 'Final conclusion based on the available sources and evidence; state remaining uncertainty clearly…'} className="w-full p-2.5 border border-amber-300 rounded-lg text-xs bg-white" /></div>
        </div>
      </div>

      {/* 5. Original Research / Field Finding */}
      <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50/40 p-5 space-y-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-indigo-900 font-bold">
            <BookOpen className="w-4 h-4" />
            <span>{language === 'ne' ? '५. मौलिक अनुसन्धान / नयाँ खोज (Original Research & Field Finding)' : '5. Original Research & Field Finding'}</span>
          </div>
          <p className="mt-1 text-[11px] text-indigo-800">
            {language === 'ne' ? 'तपाईंले field research, स्थानीय भेटघाट, नयाँ दस्तावेज वा नयाँ सम्बन्धबाट भेट्टाएको कुरा यहाँ छुट्टै research trail का रूपमा सुरक्षित गर्नुहोस्। कुनै finding स्वतः ऐतिहासिक तथ्य मानिँदैन।' : 'Record something newly discovered through field research, local encounters, new documents, or a new connection as a traceable research trail. A finding is never automatically treated as established historical fact.'}
          </p>
        </div>

        {(() => {
          const finding = workflow.originalFinding || { findingId: `SR-ORF-${Date.now()}`, findingType: 'field_observation' as const, newFinding: '', findingStatus: 'new_observation' as const, evidenceAttachments: [] };
          return <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block font-semibold mb-1 text-stone-800">Finding ID</label><input value={finding.findingId} onChange={e=>updateOriginalFinding('findingId',e.target.value)} className="w-full p-2 border border-indigo-200 rounded bg-white" /></div>
              <div><label className="block font-semibold mb-1 text-stone-800">{language === 'ne' ? 'खोजको प्रकार' : 'Finding type'}</label><select value={finding.findingType} onChange={e=>updateOriginalFinding('findingType',e.target.value as ResearcherOriginalFinding['findingType'])} className="w-full p-2 border border-indigo-200 rounded bg-white"><option value="field_observation">Field observation</option><option value="new_document">New document</option><option value="new_connection">New research connection</option><option value="oral_lead">Oral research lead</option><option value="material_evidence">Material evidence</option><option value="other">Other</option></select></div>
              <div><label className="block font-semibold mb-1 text-stone-800">{language === 'ne' ? 'खोज स्थिति' : 'Finding status'}</label><select value={finding.findingStatus} onChange={e=>updateOriginalFinding('findingStatus',e.target.value as ResearcherOriginalFinding['findingStatus'])} className="w-full p-2 border border-indigo-200 rounded bg-white"><option value="new_observation">New observation</option><option value="oral_lead">Oral lead</option><option value="documentary_lead">Documentary lead</option><option value="partially_corroborated">Partially corroborated</option><option value="corroborated">Corroborated</option><option value="disputed">Disputed</option><option value="not_verified">Not verified</option><option value="further_research">Further research</option></select></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block font-semibold mb-1">{language === 'ne' ? 'खोज मिति' : 'Discovery date'}</label><input type="date" value={finding.discoveryDate || ''} onChange={e=>updateOriginalFinding('discoveryDate',e.target.value)} className="w-full p-2 border border-indigo-200 rounded bg-white" /></div>
              <div><label className="block font-semibold mb-1">{language === 'ne' ? 'खोज स्थान' : 'Discovery location'}</label><input value={finding.discoveryLocation || ''} onChange={e=>updateOriginalFinding('discoveryLocation',e.target.value)} placeholder={language === 'ne' ? 'स्थान / गाउँ / अभिलेख / field site' : 'Place / village / archive / field site'} className="w-full p-2 border border-indigo-200 rounded bg-white" /></div>
            </div>
            <div><label className="block font-semibold mb-1">{language === 'ne' ? 'नयाँ कुरा / मुख्य खोज *' : 'New finding / key discovery *'}</label><textarea required rows={4} value={finding.newFinding} onChange={e=>updateOriginalFinding('newFinding',e.target.value)} placeholder={language === 'ne' ? 'मैले के नयाँ कुरा भेटें/बुझें? स्पष्ट र प्रमाणमा आधारित रूपमा लेख्नुहोस्।' : 'What exactly is newly found or understood? Record it clearly and evidence-first.'} className="w-full p-2.5 border border-indigo-200 rounded bg-white" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block font-semibold mb-1">{language === 'ne' ? 'ठ्याक्कै अवलोकन / सुनेको विवरण' : 'Exact observation / account'}</label><textarea rows={4} value={finding.exactObservation || ''} onChange={e=>updateOriginalFinding('exactObservation',e.target.value)} className="w-full p-2.5 border border-indigo-200 rounded bg-white" /></div>
              <div><label className="block font-semibold mb-1">{language === 'ne' ? 'किन नयाँ/महत्त्वपूर्ण?' : 'Why is it new or significant?'}</label><textarea rows={4} value={finding.whyItIsNew || ''} onChange={e=>updateOriginalFinding('whyItIsNew',e.target.value)} className="w-full p-2.5 border border-indigo-200 rounded bg-white" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block font-semibold mb-1">{language === 'ne' ? 'सूचनादाता / सन्दर्भ' : 'Informant / context'}</label><textarea rows={3} value={finding.informantOrContext || ''} onChange={e=>updateOriginalFinding('informantOrContext',e.target.value)} className="w-full p-2.5 border border-indigo-200 rounded bg-white" /></div>
              <div><label className="block font-semibold mb-1">{language === 'ne' ? 'सम्बन्धित पुरानो दाबी / section' : 'Related prior claims / sections'}</label><textarea rows={3} value={finding.relatedClaimsOrSections || ''} onChange={e=>updateOriginalFinding('relatedClaimsOrSections',e.target.value)} className="w-full p-2.5 border border-indigo-200 rounded bg-white" /></div>
            </div>
            <div className="rounded-lg border border-indigo-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-semibold text-stone-900">{language === 'ne' ? 'मौलिक खोजको प्रमाण / Field Evidence' : 'Original Finding Evidence / Field Evidence'}</div><div className="text-[10px] text-stone-500 mt-1">PDF · photo · scan · audio · video · up to 50 MB each</div></div><label className="inline-flex items-center rounded-lg bg-indigo-900 px-3 py-2 text-xs font-semibold text-white cursor-pointer hover:bg-indigo-800">{uploadingSourceIndex === -2 ? (language === 'ne' ? 'अपलोड हुँदैछ…' : 'Uploading…') : (language === 'ne' ? '+ प्रमाण थप्नुहोस्' : '+ Add evidence')}<input type="file" multiple accept="application/pdf,image/jpeg,image/png,image/webp,audio/mpeg,audio/wav,audio/mp4,video/mp4,video/webm" className="sr-only" disabled={uploadingSourceIndex === -2} onChange={e=>{void handleOriginalFindingEvidenceUpload(e.target.files);e.currentTarget.value='';}} /></label></div>
              {(finding.evidenceAttachments || []).length > 0 && <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">{(finding.evidenceAttachments || []).map(file=><div key={file.id} className="flex items-center justify-between gap-2 rounded-lg border border-stone-200 px-3 py-2"><a href={file.url} target="_blank" rel="noreferrer" className="min-w-0 truncate text-[11px] font-medium text-indigo-900 hover:underline">{file.name}</a><button type="button" onClick={()=>removeOriginalFindingEvidence(file.id)} className="shrink-0 text-[10px] text-stone-500 hover:text-rose-700">{language === 'ne' ? 'हटाउनुहोस्' : 'Remove'}</button></div>)}</div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block font-semibold mb-1">{language === 'ne' ? 'Cross-check सार' : 'Cross-check summary'}</label><textarea rows={4} value={finding.crossCheckSummary || ''} onChange={e=>updateOriginalFinding('crossCheckSummary',e.target.value)} placeholder={language === 'ne' ? 'कुन स्रोत/व्यक्ति/प्रमाणसँग जाँच गरियो?' : 'Which sources, people, or evidence were checked?'} className="w-full p-2.5 border border-indigo-200 rounded bg-white" /></div>
              <div><label className="block font-semibold mb-1">{language === 'ne' ? 'मेरो अनुसन्धान विश्लेषण' : 'Researcher interpretation'}</label><textarea rows={4} value={finding.researcherInterpretation || ''} onChange={e=>updateOriginalFinding('researcherInterpretation',e.target.value)} className="w-full p-2.5 border border-indigo-200 rounded bg-white" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block font-semibold mb-1">{language === 'ne' ? 'मौलिक खोजको निष्कर्ष' : 'Finding conclusion'}</label><textarea rows={3} value={finding.conclusion || ''} onChange={e=>updateOriginalFinding('conclusion',e.target.value)} className="w-full p-2.5 border border-indigo-200 rounded bg-white" /></div>
              <div><label className="block font-semibold mb-1">{language === 'ne' ? 'थप अनुसन्धान' : 'Further research'}</label><textarea rows={3} value={finding.furtherResearch || ''} onChange={e=>updateOriginalFinding('furtherResearch',e.target.value)} className="w-full p-2.5 border border-indigo-200 rounded bg-white" /></div>
            </div>
            <div><label className="block font-semibold mb-1">{language === 'ne' ? 'प्रकाशन/सहमति टिप्पणी' : 'Publication / permission note'}</label><input value={finding.publicationPermission || ''} onChange={e=>updateOriginalFinding('publicationPermission',e.target.value)} placeholder={language === 'ne' ? 'सूचनादाता/फोटो/भिडियो सार्वजनिक गर्ने अनुमति वा सीमा' : 'Consent or limits for publishing informant, photo, audio, or video'} className="w-full p-2 border border-indigo-200 rounded bg-white" /></div>
          </div>;
        })()}
      </div>

      {/* 6. Research Synthesis */}
      <div className="p-5 bg-amber-50/60 rounded-lg border border-amber-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-900 font-bold">
          <Scale className="w-4 h-4 text-amber-800" />
          <span>{adminText(language, '५. उपलब्ध प्रमाणको आधारमा अनुसन्धान सार (Research Synthesis - Manually Reviewed)' )}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <label className="block text-stone-800 font-medium mb-1">{adminText(language, '१. स्थापित / दस्तावेजी तथ्य (Documented Info)' )}</label>
            <textarea
              rows={2}
              value={formData.synthesis?.documentedInfo || ''}
              onChange={e => updateSynthesis('documentedInfo', e.target.value)}
              placeholder={adminText(language, 'प्रमाणित स्रोतहरूमा भेटिएको ठोस तथ्य...')}
              className="w-full p-2 border border-stone-300 rounded bg-white text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-800 font-medium mb-1">{adminText(language, '२. प्राज्ञिक व्याख्या (Scholarly Interpretation)' )}</label>
            <textarea
              rows={2}
              value={formData.synthesis?.scholarlyInterpretation || ''}
              onChange={e => updateSynthesis('scholarlyInterpretation', e.target.value)}
              placeholder={adminText(language, 'इतिहासकार तथा भाषाशास्त्रीहरूको व्याख्या...')}
              className="w-full p-2 border border-stone-300 rounded bg-white text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-800 font-medium mb-1">{adminText(language, '३. मौखिक परम्परा (Oral Tradition)' )}</label>
            <textarea
              rows={2}
              value={formData.synthesis?.oralTradition || ''}
              onChange={e => updateSynthesis('oralTradition', e.target.value)}
              placeholder={adminText(language, 'मौखिक जनविश्वास तथा परम्परा...')}
              className="w-full p-2 border border-stone-300 rounded bg-white text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-800 font-medium mb-1">{adminText(language, '४. विवादित सूचना (Disputed Information)' )}</label>
            <textarea
              rows={2}
              value={formData.synthesis?.disputedInfo || ''}
              onChange={e => updateSynthesis('disputedInfo', e.target.value)}
              placeholder={adminText(language, 'थप स्पष्टता चाहिने विवादित विषय...')}
              className="w-full p-2 border border-stone-300 rounded bg-white text-xs"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-stone-800 font-medium mb-1">{adminText(language, '५. अझै अनुसन्धान आवश्यक क्षेत्र (Further Research Needed)' )}</label>
            <textarea
              rows={2}
              value={formData.synthesis?.furtherResearchNeeded || ''}
              onChange={e => updateSynthesis('furtherResearchNeeded', e.target.value)}
              placeholder={adminText(language, 'भविष्यमा अन्वेषण गरिनुपर्ने अभिलेख वा उत्खनन क्षेत्र...')}
              className="w-full p-2 border border-stone-300 rounded bg-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* 7. Statuses, Rights & Revision Tracking */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1">
          {adminText(language, '७. स्थिति, अधिकार तथा संस्करण अडिट (Status, Rights & Workflow)')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          
          {/* Research Status */}
          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'अनुसन्धान स्थिति (Research Status) *' )}</label>
            <select
              value={formData.researchStatus || 'further_research'}
              onChange={e => updateField('researchStatus', e.target.value as ResearchStatus)}
              className="w-full p-2 border border-stone-300 rounded text-xs font-semibold"
            >
              <option value="further_research">{adminText(language, '३. अझै अनुसन्धान आवश्यक (Further Research Needed)' )}</option>
              <option value="oral_history">{adminText(language, '२. स्थानीय मौखिक इतिहास (Local Oral History)' )}</option>
              <option value="verified">{adminText(language, '१. प्रमाणित स्रोत (Verified / Documented Source)' )}</option>
            </select>
            <p className="text-[10px] text-amber-800 mt-1">
              {adminText(language, '* नियम: कुनै पनि कुरालाई स्वतः "प्रमाणित" बनाइँदैन।')}
            </p>
          </div>

          {/* Workflow Status */}
          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रकाशन स्थिति (Workflow Status) *' )}</label>
            <select
              value={formData.workflowStatus || 'draft'}
              onChange={e => updateField('workflowStatus', e.target.value as WorkflowStatus)}
              className="w-full p-2 border border-stone-300 rounded text-xs font-semibold"
            >
              <option value="draft">{adminText(language, 'मस्यौदा (Draft)' )}</option>
              <option value="under_review">{adminText(language, 'पुनरावलोकनमा (Under Review)' )}</option>
              <option value="published">{adminText(language, 'प्रकाशित (Published - सार्वजनिक)' )}</option>
              <option value="archived">{adminText(language, 'अभिलेखबद्ध (Archived)' )}</option>
            </select>
          </div>

          {/* Rights Status */}
          <div>
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रतिलिपि अधिकार (Copyright / Rights) *' )}</label>
            <select
              value={formData.rightsStatus || 'original_sadan_rai'}
              onChange={e => updateField('rightsStatus', e.target.value as RightsStatus)}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            >
              <option value="original_sadan_rai">{adminText(language, '© Sadan Rai · All Rights Reserved (मौलिक सदन राई)' )}</option>
              <option value="third_party_source">{adminText(language, 'तेस्रो-पक्षीय स्रोत सामग्री (Third-party Source)' )}</option>
              <option value="public_domain">{adminText(language, 'सार्वजनिक अधिकार क्षेत्र (Public Domain Archive)' )}</option>
              <option value="licensed">{adminText(language, 'इजाजतपत्र प्राप्त सामग्री (Licensed Material)' )}</option>
              <option value="oral_history_permission">{adminText(language, 'सहमतिसहितको मौखिक इतिहास (With Permission)' )}</option>
            </select>
          </div>

          {/* Revision Notes */}
          <div className="md:col-span-3">
            <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'परिमार्जन टिप्पणी / Change Notes (Revision Audit)' )}</label>
            <input
              type="text"
              value={changeNotes}
              onChange={e => setChangeNotes(e.target.value)}
              placeholder={adminText(language, 'यस परिमार्जनमा के थपियो वा सच्याइयो? (उदा: १८१९ को पुस्तकबाट पृष्ठ संख्या प्रमाणीकरण)')}
              className="w-full p-2 border border-stone-300 rounded text-xs"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 rounded cursor-pointer"
        >
          {adminText(language, 'रद्द गर्नुहोस्')}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-amber-800 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm rounded transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? adminText(language, 'सुरक्षित गर्दै...') : adminText(language, 'अनुसन्धान सुरक्षित गर्नुहोस्')}</span>
        </button>
      </div>

    </form>
  );
};
