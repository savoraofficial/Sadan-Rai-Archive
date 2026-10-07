import React, { useState } from 'react';
import { EvidenceRecordItem, EvidenceType } from '../../types';
import { RESEARCH_STATUS_LABELS, RIGHTS_STATUS_LABELS } from '../../data/archiveData';
import { matchBilingualQuery } from '../../data/searchHelper';
import { 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Search, 
  Database
} from 'lucide-react';

interface EvidenceArchiveListProps {
  items: EvidenceRecordItem[];
  language?: 'ne' | 'en';
}

export const EvidenceArchiveList: React.FC<EvidenceArchiveListProps> = ({
  items,
  language = 'ne'
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const evidenceTypeLabels: Record<EvidenceType, { nepali: string; english: string }> = {
    book: { nepali: 'पुस्तक (Book)', english: 'Book' },
    academic_paper: { nepali: 'शोधपत्र (Academic Paper)', english: 'Academic Paper' },
    government_doc: { nepali: 'सरकारी दस्तावेज (Gov Document)', english: 'Government Document' },
    archive: { nepali: 'अभिलेखालय (Archive)', english: 'Archive' },
    museum_record: { nepali: 'संग्रहालय अभिलेख (Museum Record)', english: 'Museum Record' },
    archaeological_evidence: { nepali: 'पुरातात्विक प्रमाण (Archaeological)', english: 'Archaeological Evidence' },
    inscription: { nepali: 'शिलालेख / अभिलेख (Inscription)', english: 'Inscription' },
    manuscript: { nepali: 'हस्तलिखित ग्रन्थ (Manuscript)', english: 'Manuscript' },
    photograph: { nepali: 'ऐतिहासिक तस्बिर (Photograph)', english: 'Photograph' },
    map: { nepali: 'प्राचीन नक्सा (Map)', english: 'Map' },
    interview: { nepali: 'अन्तर्वार्ता (Interview)', english: 'Interview' },
    oral_history: { nepali: 'मौखिक इतिहास (Oral History)', english: 'Oral History' },
    other: { nepali: 'अन्य दस्तावेजी प्रमाण (Other)', english: 'Other Documented Source' }
  };

  const filteredItems = items.filter(item => {
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      const matchT = matchBilingualQuery(item.title, q);
      const matchNep = item.nepaliTitle ? matchBilingualQuery(item.nepaliTitle, q) : false;
      const matchDesc = matchBilingualQuery(item.description, q);
      return matchT || matchNep || matchDesc;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Search and Type Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'ne' ? 'प्रमाण अभिलेख खोज्नुहोस्...' : 'Search evidence archive...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-amber-800"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedType === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
            }`}
          >
            {language === 'ne' ? `सबै (${items.length})` : `All (${items.length})`}
          </button>
          {Object.entries(evidenceTypeLabels).map(([key, val]) => {
            const count = items.filter(i => i.type === key).length;
            if (count === 0 && selectedType !== key) return null;
            return (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedType === key
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                {language === 'ne' ? val.nepali : val.english} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Evidence Records */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(item => {
            const statusDef = RESEARCH_STATUS_LABELS[item.verificationStatus] || RESEARCH_STATUS_LABELS.further_research;
            const rightsDef = RIGHTS_STATUS_LABELS[item.rights] || RIGHTS_STATUS_LABELS.original_sadan_rai;
            const typeLabel = language === 'ne' 
              ? (evidenceTypeLabels[item.type]?.nepali || item.type)
              : (evidenceTypeLabels[item.type]?.english || item.type);

            return (
              <div 
                key={item.id}
                className="p-5 bg-white rounded-lg border border-stone-200 space-y-3 shadow-2xs hover:border-amber-700 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {typeLabel}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusDef.color}`}>
                    {language === 'ne' ? statusDef.nepali : statusDef.english}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif-np text-base font-bold text-stone-900">
                    {language === 'ne' ? item.nepaliTitle || item.title : item.title}
                  </h4>
                  {language === 'ne' && item.nepaliTitle && item.title !== item.nepaliTitle && (
                    <span className="text-xs text-stone-500 font-sans italic block">
                      {item.title}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-700 font-serif-np leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-500 font-sans">
                  {item.datePeriod && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-700 shrink-0" />
                      <span>{item.datePeriod}</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  {item.originalSource && (
                    <div className="col-span-2 text-stone-600">
                      <strong>{language === 'ne' ? 'स्रोत:' : 'Source:'}</strong> {item.originalSource}
                    </div>
                  )}
                  <div className="col-span-2 text-[10px] font-mono text-stone-400">
                    {language === 'ne' ? rightsDef.notice : rightsDef.english}
                  </div>
                </div>

                {item.reference && (
                  <div className="pt-1">
                    <a
                      href={item.reference}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 underline"
                    >
                      <span>{language === 'ne' ? 'प्रमाण अभिलेख लिङ्क' : 'Evidence Archive Link'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-stone-50 rounded-lg border border-dashed border-stone-300 space-y-2">
          <Database className="w-8 h-8 text-stone-400 mx-auto" />
          <h4 className="font-serif-np font-bold text-stone-800">
            {language === 'ne' ? 'कुनै प्रमाण अभिलेख फेला परेन' : 'No evidence records found'}
          </h4>
          <p className="text-xs text-stone-500 font-sans">
            {language === 'ne'
              ? 'प्रशासक कन्सोलबाट “+ नयाँ प्रमाण” मार्फत पुरातात्विक तथा दस्तावेजी प्रमाणहरू दर्ता गर्न सकिन्छ।'
              : 'New documentary and archaeological evidence records can be registered through the Editorial Console.'}
          </p>
        </div>
      )}

    </div>
  );
};
