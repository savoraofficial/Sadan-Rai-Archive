import React, { useState } from 'react';
import { adminText } from '../../data/adminTranslations';
import { Source, SourceCategory } from '../../types';
import { useArchive } from '../../context/ArchiveContext';
import { Save, BookOpen } from 'lucide-react';

interface AdminSourceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminSourceForm: React.FC<AdminSourceFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const { language } = useArchive();
  const { addSource } = useArchive();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [publicationOrArchive, setPublicationOrArchive] = useState('');
  const [category, setCategory] = useState<SourceCategory>('book');
  const [isDocumentaryEvidence, setIsDocumentaryEvidence] = useState(true);
  const [url, setUrl] = useState('');
  const [quotationOrNote, setQuotationOrNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !author.trim()) return;

    const newSrc: Source = {
      id: `src-${Date.now()}`,
      title,
      author,
      year,
      publicationOrArchive: publicationOrArchive || adminText(language, 'अभिलेखालय'),
      category,
      isDocumentaryEvidence,
      url: url || undefined,
      quotationOrNote: quotationOrNote || undefined
    };

    try {
      await addSource(newSrc);
    } catch {
      setError(adminText(language, 'स्रोत सुरक्षित गर्न असफल भयो। प्रशासक प्रमाणीकरण जाँच गर्नुहोस्।'));
      return;
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-stone-300 p-6 sm:p-8 space-y-6 shadow-xs">
      {error && <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">{error}</div>}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h2 className="font-serif-np text-xl sm:text-2xl font-bold text-stone-900">
            {adminText(language, 'नयाँ सन्दर्भ स्रोत दर्ता (New Source / Reference)')}
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            {adminText(language, 'ऐतिहासिक ग्रन्थ, शोधपत्र, अभिलेखालय लिखत तथा मौखिक अन्तर्वार्ताको सन्दर्भ सूची')}
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
            className="px-5 py-1.5 bg-amber-800 hover:bg-amber-700 text-white font-medium text-xs rounded cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{adminText(language, 'स्रोत सुरक्षित गर्नुहोस्' )}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
        <div className="md:col-span-2">
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'ग्रन्थ वा स्रोतको शीर्षक (Source Title) *' )}</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={adminText(language, 'उदा: An Account of the Kingdom of Nepal...')}
            className="w-full p-2 border border-stone-300 rounded font-serif italic text-sm"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'लेखक / अनुसन्धाता (Author) *' )}</label>
          <input
            type="text"
            required
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder={adminText(language, 'उदा: Francis Buchanan Hamilton')}
            className="w-full p-2 border border-stone-300 rounded font-serif-np"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रकाशन वर्ष (Year)' )}</label>
          <input
            type="text"
            value={year}
            onChange={e => setYear(e.target.value)}
            placeholder={adminText(language, 'उदा: 1819')}
            className="w-full p-2 border border-stone-300 rounded font-mono"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रकाशन / अभिलेखालय (Publication / Archive)' )}</label>
          <input
            type="text"
            value={publicationOrArchive}
            onChange={e => setPublicationOrArchive(e.target.value)}
            placeholder={adminText(language, 'उदा: Archibald Constable & Company, Edinburgh')}
            className="w-full p-2 border border-stone-300 rounded"
          />
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'स्रोत वर्गीकरण (Category)' )}</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as SourceCategory)}
            className="w-full p-2 border border-stone-300 rounded text-xs"
          >
            <option value="book">{adminText(language, 'पुस्तक (Book)' )}</option>
            <option value="academic_paper">{adminText(language, 'शोधपत्र (Academic Paper)' )}</option>
            <option value="government_doc">{adminText(language, 'सरकारी दस्तावेज (Government Document)' )}</option>
            <option value="museum_archive">{adminText(language, 'संग्रहालय / अभिलेखालय (Museum/Archive)' )}</option>
            <option value="credible_web">{adminText(language, 'डिजिटल पुस्तकालय (Digitized Archive)' )}</option>
            <option value="oral_history">{adminText(language, 'मौखिक इतिहास (Oral History)' )}</option>
            <option value="interview">{adminText(language, 'अन्तर्वार्ता (Interview)' )}</option>
          </select>
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'प्रमाणको रूप' )}</label>
          <select
            value={isDocumentaryEvidence ? 'doc' : 'oral'}
            onChange={e => setIsDocumentaryEvidence(e.target.value === 'doc')}
            className="w-full p-2 border border-stone-300 rounded text-xs"
          >
            <option value="doc">{adminText(language, 'लिखित / दस्तावेजी प्रमाण (Documentary Evidence)' )}</option>
            <option value="oral">{adminText(language, 'स्थानीय मौखिक इतिहास (Oral History)' )}</option>
          </select>
        </div>

        <div>
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'मूल डिजिटल लिङ्क (URL)' )}</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://archive.org/..."
            className="w-full p-2 border border-stone-300 rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-stone-700 font-medium mb-1">{adminText(language, 'छोटो टिप्पणी / नोट (Quotation or Note)' )}</label>
          <textarea
            rows={2}
            value={quotationOrNote}
            onChange={e => setQuotationOrNote(e.target.value)}
            placeholder={adminText(language, 'सम्बन्धित पृष्ठ, विषय वा संक्षिप्त सन्दर्भ...')}
            className="w-full p-2.5 border border-stone-300 rounded text-xs font-serif-np"
          />
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
          className="px-6 py-2 bg-amber-800 hover:bg-amber-700 text-white font-medium text-xs rounded transition-colors cursor-pointer flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{adminText(language, 'स्रोत दर्ता गर्नुहोस्' )}</span>
        </button>
      </div>
    </form>
  );
};
