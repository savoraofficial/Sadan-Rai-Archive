import React, { useState } from 'react';
import { adminText } from '../../data/adminTranslations';
import { useBilingualAutoTranslate } from '../../hooks/useBilingualAutoTranslate';
import { useArchive } from '../../context/ArchiveContext';
import { AuthorPerspectiveItem, ResearchStatus, WorkflowStatus, RightsStatus } from '../../types';
import { saveAuthorPerspective } from '../../services/dbService';
import { Save, Users, BookOpen, Scale, FileText } from 'lucide-react';

interface AdminAuthorFormProps {
  initialItem?: AuthorPerspectiveItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminAuthorForm: React.FC<AdminAuthorFormProps> = ({
  initialItem,
  onSuccess,
  onCancel
}) => {
  const { language } = useArchive();
  const [formData, setFormData] = useState<Partial<AuthorPerspectiveItem>>(() => {
    if (initialItem) return { ...initialItem };
    return {
      id: `auth-${Date.now()}`,
      topic: adminText(language, 'इतिहास तथा सभ्यता'),
      topicNepali: 'इतिहास तथा सभ्यता',
      authorName: '',
      authorNameNepali: '',
      bookTitle: '',
      publicationYear: '',
      page: '',
      whatAuthorWrote: '',
      originalQuotation: '',
      nepaliTranslation: '',
      englishTranslation: '',
      sourceUrl: '',
      evidenceUsed: adminText(language, 'ऐतिहासिक पुस्तक तथा स्थानीय सूचनादाता'),
      localInformants: '',
      isDirectObservation: false,
      otherAuthorsViews: '',
      differences: '',
      researchStatus: 'further_research',
      workflowStatus: 'draft',
      rightsStatus: 'public_domain',
      createdAt: new Date().toISOString()
    };
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { setPrimary: setAuthorName, setSecondary: setAuthorNameNepali } = useBilingualAutoTranslate(formData, setFormData, 'authorName', 'authorNameNepali');
  const { setPrimary: setTopic, setSecondary: setTopicNepali } = useBilingualAutoTranslate(formData, setFormData, 'topic', 'topicNepali');
  const { setPrimary: setEnglishTranslation, setSecondary: setNepaliTranslation } = useBilingualAutoTranslate(formData, setFormData, 'englishTranslation', 'nepaliTranslation');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorName?.trim() || !formData.bookTitle?.trim()) {
      setErrorMsg(adminText(language, 'कृपया लेखकको नाम र पुस्तक/दस्तावेजको नाम अनिवार्य भर्नुहोस्।'));
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      const itemToSave: AuthorPerspectiveItem = {
        ...formData,
        id: formData.id || `auth-${Date.now()}`,
        topic: formData.topic || adminText(language, 'इतिहास तथा सभ्यता'),
        authorName: formData.authorName || '',
        bookTitle: formData.bookTitle || '',
        publicationYear: formData.publicationYear || '',
        whatAuthorWrote: formData.whatAuthorWrote || '',
        researchStatus: formData.researchStatus || 'further_research',
        workflowStatus: formData.workflowStatus || 'draft',
        rightsStatus: formData.rightsStatus || 'public_domain',
        isDirectObservation: formData.isDirectObservation || false,
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as AuthorPerspectiveItem;

      await saveAuthorPerspective(itemToSave);
      setSubmitting(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg(adminText(language, 'सुरक्षित गर्दा त्रुटि भयो।'));
      setSubmitting(false);
    }
  };

  const updateField = (field: keyof AuthorPerspectiveItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-stone-300 p-6 sm:p-8 space-y-6 shadow-xs">
      
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="font-serif-np text-xl sm:text-2xl font-bold text-stone-900">
            {initialItem ? adminText(language, 'लेखक दृष्टिकोण सम्पादन') : adminText(language, 'नयाँ लेखक दृष्टिकोण ("ऐतिहासिक ग्रन्थ तथा विद्वत् दृष्टिकोण") प्रविष्टि')}
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            {adminText(language, 'विभिन्न इतिहासकार, अन्वेषक र प्राज्ञहरूको विचार तुलना गर्ने संरचना')}
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

      {/* Grid of Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
        
        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'सम्बन्धित विषय (Topic) *' )}</label>
          <input
            type="text"
            required
            value={formData.topic || ''}
            onChange={e => setTopic(e.target.value)}
            placeholder={adminText(language, 'e.g. Buddhist History / Kirat History / Local History')}
            className="w-full p-2 border border-stone-300 rounded"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'सम्बन्धित विषयको नेपाली नाम (Auto / Editable)' )}</label>
          <input
            type="text"
            value={formData.topicNepali || ''}
            onChange={e => setTopicNepali(e.target.value)}
            placeholder="नेपाली विषय..."
            className="w-full p-2 border border-stone-300 rounded font-serif-np"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'लेखक / शोधकर्ताको नाम *' )}</label>
          <input
            type="text"
            required
            value={formData.authorName || ''}
            onChange={e => setAuthorName(e.target.value)}
            placeholder={adminText(language, 'उदा: Francis Buchanan Hamilton / William Kirkpatrick')}
            className="w-full p-2 border border-stone-300 rounded font-serif-np"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'लेखकको नेपाली नाम' )}</label>
          <input
            type="text"
            value={formData.authorNameNepali || ''}
            onChange={e => setAuthorNameNepali(e.target.value)}
            placeholder={adminText(language, 'उदा: फ्रान्सिस बुकानन ह्यामिल्टन')}
            className="w-full p-2 border border-stone-300 rounded font-serif-np"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'पुस्तक / दस्तावेज (Book / Document) *' )}</label>
          <input
            type="text"
            required
            value={formData.bookTitle || ''}
            onChange={e => updateField('bookTitle', e.target.value)}
            placeholder={adminText(language, 'उदा: An Account of the Kingdom of Nepal...')}
            className="w-full p-2 border border-stone-300 rounded font-serif italic"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रकाशन वर्ष (Publication Year) *' )}</label>
          <input
            type="text"
            required
            value={formData.publicationYear || ''}
            onChange={e => updateField('publicationYear', e.target.value)}
            placeholder={adminText(language, 'उदा: 1819')}
            className="w-full p-2 border border-stone-300 rounded font-mono"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'पृष्ठ नम्बर (Page Number)' )}</label>
          <input
            type="text"
            value={formData.page || ''}
            onChange={e => updateField('page', e.target.value)}
            placeholder={adminText(language, 'उदा: pp. 132–134 (अपुष्ट भए खाली छाड्नुहोस्)')}
            className="w-full p-2 border border-stone-300 rounded text-xs"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'मूल स्रोतको डिजिटल URL' )}</label>
          <input
            type="url"
            value={formData.sourceUrl || ''}
            onChange={e => updateField('sourceUrl', e.target.value)}
            placeholder="https://archive.org/details/..."
            className="w-full p-2 border border-stone-300 rounded text-xs"
          />
        </div>

        {/* What author wrote */}
        <div className="md:col-span-3">
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'लेखकले के लेखेका छन्? (What the Author Wrote) *' )}</label>
          <textarea
            rows={3}
            required
            value={formData.whatAuthorWrote || ''}
            onChange={e => updateField('whatAuthorWrote', e.target.value)}
            placeholder={adminText(language, 'लेखकले किराँतहरू वा उक्त विषयबारे गरेको मूल चर्चाको संक्षेप...')}
            className="w-full p-2.5 border border-stone-300 rounded font-serif-np text-xs"
          />
        </div>

        {/* Original quotation */}
        <div className="md:col-span-3">
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'मूल ग्रन्थको उद्धरण (Original Quotation)' )}</label>
          <textarea
            rows={2}
            value={formData.originalQuotation || ''}
            onChange={e => updateField('originalQuotation', e.target.value)}
            placeholder={adminText(language, 'प्रमाणीकृत मूल अंग्रेजी/संस्कृत/अन्य भाषाको हरफ...')}
            className="w-full p-2.5 border border-stone-300 rounded font-serif italic text-xs"
          />
        </div>

        {/* Translations */}
        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'नेपाली अनुवाद (Nepali Translation)' )}</label>
          <textarea
            rows={2}
            value={formData.nepaliTranslation || ''}
            onChange={e => setNepaliTranslation(e.target.value)}
            placeholder={adminText(language, 'नेपाली भावार्थ...')}
            className="w-full p-2 border border-stone-300 rounded font-serif-np text-xs"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'English Translation')}</label>
          <textarea
            rows={2}
            value={formData.englishTranslation || ''}
            onChange={e => setEnglishTranslation(e.target.value)}
            placeholder={adminText(language, 'English translation...')}
            className="w-full p-2 border border-stone-300 rounded text-xs"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'स्थानीय सूचनादाता (Local Informants)' )}</label>
          <textarea
            rows={2}
            value={formData.localInformants || ''}
            onChange={e => updateField('localInformants', e.target.value)}
            placeholder={adminText(language, 'उदा: अगम सिंह (किराँत चौतारिया), पूर्व धर्माधिकारी...')}
            className="w-full p-2 border border-stone-300 rounded text-xs"
          />
        </div>

        {/* Observation & Evidence */}
        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रत्यक्ष अवलोकन हो?' )}</label>
          <select
            value={formData.isDirectObservation ? 'yes' : 'no'}
            onChange={e => updateField('isDirectObservation', e.target.value === 'yes')}
            className="w-full p-2 border border-stone-300 rounded text-xs"
          >
            <option value="no">{adminText(language, 'होइन (स्थानीय सूचनादाताबाट संकलित कथन)' )}</option>
            <option value="yes">{adminText(language, 'हो (लेखकको प्रत्यक्ष व्यक्तिगत अवलोकन)' )}</option>
          </select>
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'अन्य लेखकहरूसँगको भिन्नता (Differences)' )}</label>
          <input
            type="text"
            value={formData.differences || ''}
            onChange={e => updateField('differences', e.target.value)}
            placeholder={adminText(language, 'Kirkpatrick वा अन्य लेखकभन्दा फरक परेको बुँदा...')}
            className="w-full p-2 border border-stone-300 rounded text-xs"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'अनुसन्धान स्थिति (Research Status) *' )}</label>
          <select
            value={formData.researchStatus || 'further_research'}
            onChange={e => updateField('researchStatus', e.target.value as ResearchStatus)}
            className="w-full p-2 border border-stone-300 rounded text-xs font-semibold"
          >
            <option value="further_research">{adminText(language, '३. अझै अनुसन्धान आवश्यक' )}</option>
            <option value="oral_history">{adminText(language, '२. स्थानीय मौखिक इतिहास' )}</option>
            <option value="verified">{adminText(language, '१. प्रमाणित स्रोत' )}</option>
          </select>
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रकाशन स्थिति (Workflow Status) *' )}</label>
          <select
            value={formData.workflowStatus || 'draft'}
            onChange={e => updateField('workflowStatus', e.target.value as WorkflowStatus)}
            className="w-full p-2 border border-stone-300 rounded text-xs font-semibold"
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
            value={formData.rightsStatus || 'public_domain'}
            onChange={e => updateField('rightsStatus', e.target.value as RightsStatus)}
            className="w-full p-2 border border-stone-300 rounded text-xs"
          >
            <option value="public_domain">{adminText(language, 'सार्वजनिक अधिकार क्षेत्र (Public Domain Archive)' )}</option>
            <option value="third_party_source">{adminText(language, 'तेस्रो-पक्षीय स्रोत सामग्री' )}</option>
            <option value="original_sadan_rai">{adminText(language, '© Sadan Rai · All Rights Reserved')}</option>
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
          <span>{submitting ? adminText(language, 'सुरक्षित गर्दै...') : adminText(language, 'लेखक दृष्टिकोण सुरक्षित गर्नुहोस्')}</span>
        </button>
      </div>

    </form>
  );
};
