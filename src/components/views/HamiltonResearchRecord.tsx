import React from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { FileSearch } from 'lucide-react';

/**
 * Legacy route-safe research view.
 * The former hard-coded Hamilton demonstration record has intentionally been removed.
 * Research is now created and maintained through the universal research workflow.
 */
export const HamiltonResearchRecord: React.FC = () => {
  const { language, navigateTo } = useArchive();
  const isEnglish = language === 'en';

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm space-y-4">
        <FileSearch className="mx-auto h-10 w-10 text-amber-700" />
        <h1 className="font-serif-np text-2xl font-bold text-stone-900">
          {isEnglish ? 'Research records are managed through the Universal Research Workflow' : 'अनुसन्धान अभिलेख सार्वभौमिक अनुसन्धान कार्यप्रवाहबाट व्यवस्थापन गरिन्छ'}
        </h1>
        <p className="text-sm leading-relaxed text-stone-600">
          {isEnglish
            ? 'No demonstration source is embedded here. Add each source, its bibliographic details, quotation, and actual evidence attachment in the Editorial Console.'
            : 'यहाँ कुनै प्रदर्शनात्मक स्रोत समावेश गरिएको छैन। प्रत्येक स्रोत, यसको सन्दर्भ विवरण, उद्धरण तथा वास्तविक प्रमाण फाइल Editorial Console बाट थप्नुहोस्।'}
        </p>
        <button
          type="button"
          onClick={() => navigateTo('/sadan-rai-editorial-console')}
          className="inline-flex items-center rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800"
        >
          {isEnglish ? 'Open Editorial Console' : 'Editorial Console खोल्नुहोस्'}
        </button>
      </div>
    </div>
  );
};
