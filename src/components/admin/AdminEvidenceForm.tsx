import React, { useState } from 'react';
import { adminText } from '../../data/adminTranslations';
import { useBilingualAutoTranslate } from '../../hooks/useBilingualAutoTranslate';
import { useArchive } from '../../context/ArchiveContext';
import { EvidenceRecordItem, EvidenceType, ResearchStatus, WorkflowStatus, RightsStatus } from '../../types';
import { saveEvidenceRecord } from '../../services/dbService';
import { Save, Database, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface AdminEvidenceFormProps {
  initialItem?: EvidenceRecordItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminEvidenceForm: React.FC<AdminEvidenceFormProps> = ({
  initialItem,
  onSuccess,
  onCancel
}) => {
  const { language } = useArchive();
  const [formData, setFormData] = useState<Partial<EvidenceRecordItem>>(() => {
    if (initialItem) return { ...initialItem };
    return {
      id: `evi-${Date.now()}`,
      title: '',
      nepaliTitle: '',
      type: 'archaeological_evidence',
      datePeriod: '',
      location: 'माल्बासे–१, पात्लेपानी / भोजपुर',
      description: '',
      originalSource: '',
      reference: '',
      mediaUrl: '',
      rights: 'original_sadan_rai',
      verificationStatus: 'further_research',
      workflowStatus: 'draft',
      createdAt: new Date().toISOString()
    };
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() && !formData.nepaliTitle?.trim()) {
      setErrorMsg(adminText(language, 'कृपया प्रमाणको शीर्षक अनिवार्य भर्नुहोस्।'));
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      const itemToSave: EvidenceRecordItem = {
        ...formData,
        id: formData.id || `evi-${Date.now()}`,
        title: formData.title || formData.nepaliTitle || adminText(language, 'प्रमाण'),
        nepaliTitle: formData.nepaliTitle || formData.title,
        type: formData.type || 'archaeological_evidence',
        description: formData.description || '',
        rights: formData.rights || 'original_sadan_rai',
        verificationStatus: formData.verificationStatus || 'further_research',
        workflowStatus: formData.workflowStatus || 'draft',
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as EvidenceRecordItem;

      await saveEvidenceRecord(itemToSave);
      setSubmitting(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg(adminText(language, 'प्रमाण सुरक्षित गर्दा समस्या भयो।'));
      setSubmitting(false);
    }
  };

  const { setPrimary: setEvidenceTitle, setSecondary: setEvidenceNepaliTitle } = useBilingualAutoTranslate(formData, setFormData, 'title', 'nepaliTitle');

  const updateField = (field: keyof EvidenceRecordItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-stone-300 p-6 sm:p-8 space-y-6 shadow-xs">
      
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="font-serif-np text-xl sm:text-2xl font-bold text-stone-900">
            {initialItem ? adminText(language, 'प्रमाण अभिलेख सम्पादन') : adminText(language, 'नयाँ प्रमाण दर्ता (New Evidence Record)')}
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            {adminText(language, 'पुरातात्विक अवशेष, शिलालेख, ऐतिहासिक लिखत तथा भौतिक प्रमाणहरूको अभिलेख')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 rounded cursor-pointer"
          >
            {adminText(language, 'रद्द गर्नुहोस्')}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 bg-amber-800 hover:bg-amber-700 text-white font-medium text-xs rounded cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
        
        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रमाणको नाम / Title *' )}</label>
          <input
            type="text"
            required
            value={formData.title || ''}
            onChange={e => setEvidenceTitle(e.target.value)}
            placeholder={adminText(language, 'उदा: हतुवागढीका ढुङ्गे गढी अवशेष')}
            className="w-full p-2 border border-stone-300 rounded font-serif-np"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'नेपाली शीर्षक (Nepali Title)' )}</label>
          <input
            type="text"
            value={formData.nepaliTitle || ''}
            onChange={e => setEvidenceNepaliTitle(e.target.value)}
            placeholder={adminText(language, 'उदा: हतुवागढीको ऐतिहासिक गढी भग्नावशेष')}
            className="w-full p-2 border border-stone-300 rounded font-serif-np"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रमाणको प्रकार (Evidence Type) *' )}</label>
          <select
            value={formData.type || 'archaeological_evidence'}
            onChange={e => updateField('type', e.target.value as EvidenceType)}
            className="w-full p-2 border border-stone-300 rounded text-xs"
          >
            <option value="archaeological_evidence">{adminText(language, 'पुरातात्विक प्रमाण (Archaeological Evidence)' )}</option>
            <option value="book">{adminText(language, 'पुस्तक (Book)' )}</option>
            <option value="academic_paper">{adminText(language, 'शोधपत्र (Academic Paper)' )}</option>
            <option value="government_doc">{adminText(language, 'सरकारी दस्तावेज (Government Document)' )}</option>
            <option value="archive">{adminText(language, 'अभिलेखालय लिखत (Archive)' )}</option>
            <option value="museum_record">{adminText(language, 'संग्रहालय अभिलेख (Museum Record)' )}</option>
            <option value="inscription">{adminText(language, 'शिलालेख / अभिलेख (Inscription)' )}</option>
            <option value="manuscript">{adminText(language, 'हस्तलिखित ग्रन्थ (Manuscript)' )}</option>
            <option value="photograph">{adminText(language, 'तस्बिर प्रमाण (Photograph)' )}</option>
            <option value="map">{adminText(language, 'नक्सा (Map)' )}</option>
            <option value="interview">{adminText(language, 'अन्तर्वार्ता (Interview)' )}</option>
            <option value="oral_history">{adminText(language, 'मौखिक इतिहास (Oral History)' )}</option>
            <option value="other">{adminText(language, 'अन्य दस्तावेजी प्रमाण (Other)' )}</option>
          </select>
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'मिति / काल (Date / Period)' )}</label>
          <input
            type="text"
            value={formData.datePeriod || ''}
            onChange={e => updateField('datePeriod', e.target.value)}
            placeholder={adminText(language, 'उदा: किराँत काल / १८औँ शताब्दी')}
            className="w-full p-2 border border-stone-300 rounded"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'स्थान (Location)' )}</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={e => updateField('location', e.target.value)}
            placeholder={adminText(language, 'माल्बासे–१, पात्लेपानी / हतुवागढी, भोजपुर')}
            className="w-full p-2 border border-stone-300 rounded"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'मूल स्रोत (Original Source)' )}</label>
          <input
            type="text"
            value={formData.originalSource || ''}
            onChange={e => updateField('originalSource', e.target.value)}
            placeholder={adminText(language, 'स्थलगत अनुसन्धान / पुरातत्व विभाग')}
            className="w-full p-2 border border-stone-300 rounded"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'विस्तृत विवरण (Description) *' )}</label>
          <textarea
            rows={3}
            required
            value={formData.description || ''}
            onChange={e => updateField('description', e.target.value)}
            placeholder={adminText(language, 'प्रमाणको भौतिक अवस्था, बनावट, ऐतिहासिक सम्बन्ध तथा महत्व...')}
            className="w-full p-2.5 border border-stone-300 rounded font-serif-np text-xs"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'सन्दर्भ / Reference Link' )}</label>
          <input
            type="url"
            value={formData.reference || ''}
            onChange={e => updateField('reference', e.target.value)}
            placeholder="https://..."
            className="w-full p-2 border border-stone-300 rounded"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रमाणीकरण स्थिति (Verification Status) *' )}</label>
          <select
            value={formData.verificationStatus || 'further_research'}
            onChange={e => updateField('verificationStatus', e.target.value as ResearchStatus)}
            className="w-full p-2 border border-stone-300 rounded font-semibold text-xs"
          >
            <option value="further_research">{adminText(language, '३. अझै अनुसन्धान आवश्यक (Further Research Needed)' )}</option>
            <option value="oral_history">{adminText(language, '२. स्थानीय मौखिक इतिहास (Oral History)' )}</option>
            <option value="verified">{adminText(language, '१. प्रमाणित स्रोत (Verified Source)' )}</option>
          </select>
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रकाशन स्थिति (Workflow Status) *' )}</label>
          <select
            value={formData.workflowStatus || 'draft'}
            onChange={e => updateField('workflowStatus', e.target.value as WorkflowStatus)}
            className="w-full p-2 border border-stone-300 rounded font-semibold text-xs"
          >
            <option value="draft">{adminText(language, 'मस्यौदा (Draft)' )}</option>
            <option value="under_review">{adminText(language, 'पुनरावलोकनमा (Under Review)' )}</option>
            <option value="published">{adminText(language, 'प्रकाशित (Published)' )}</option>
            <option value="archived">{adminText(language, 'अभिलेखबद्ध (Archived)' )}</option>
          </select>
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रतिलिपि अधिकार (Rights)' )}</label>
          <select
            value={formData.rights || 'original_sadan_rai'}
            onChange={e => updateField('rights', e.target.value as RightsStatus)}
            className="w-full p-2 border border-stone-300 rounded text-xs"
          >
            <option value="original_sadan_rai">{adminText(language, '© Sadan Rai · All Rights Reserved')}</option>
            <option value="third_party_source">{adminText(language, 'तेस्रो-पक्षीय स्रोत सामग्री' )}</option>
            <option value="public_domain">{adminText(language, 'सार्वजनिक अधिकार क्षेत्र (Public Domain)' )}</option>
            <option value="licensed">{adminText(language, 'इजाजतपत्र प्राप्त सामग्री' )}</option>
            <option value="oral_history_permission">{adminText(language, 'सहमतिसहितको मौखिक इतिहास' )}</option>
          </select>
        </div>

      </div>

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
          className="px-6 py-2 bg-amber-800 hover:bg-amber-700 text-white font-medium text-xs rounded transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? adminText(language, 'सुरक्षित गर्दै...') : adminText(language, 'प्रमाण सुरक्षित गर्नुहोस्')}</span>
        </button>
      </div>

    </form>
  );
};
