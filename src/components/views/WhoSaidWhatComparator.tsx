import React, { useState } from 'react';
import { AuthorPerspectiveItem } from '../../types';
import { RESEARCH_STATUS_LABELS } from '../../data/archiveData';
import { 
  Users, 
  ExternalLink, 
  Scale
} from 'lucide-react';

interface WhoSaidWhatComparatorProps {
  perspectives: AuthorPerspectiveItem[];
  topicTitle?: string;
  language?: 'ne' | 'en';
}

export const WhoSaidWhatComparator: React.FC<WhoSaidWhatComparatorProps> = ({
  perspectives,
  topicTitle = 'किराँत इतिहास',
  language = 'ne'
}) => {
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>(
    perspectives.length > 0 ? perspectives[0].id : ''
  );
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareAuthorId, setCompareAuthorId] = useState<string>(
    perspectives.length > 1 ? perspectives[1].id : ''
  );

  if (perspectives.length === 0) {
    return (
      <div className="p-8 text-center bg-stone-50 rounded-lg border border-dashed border-stone-300 space-y-2">
        <Users className="w-8 h-8 text-stone-400 mx-auto" />
        <h4 className="font-serif-np font-bold text-stone-800">
          {language === 'ne' ? 'कुनै लेखक प्रविष्टि फेला परेन' : 'No author entries found'}
        </h4>
        <p className="text-xs text-stone-500 font-sans">
          {language === 'ne'
            ? 'प्रशासक कन्सोलबाट “+ नयाँ लेखक” मार्फत लेखक दृष्टिकोण थप्न सकिन्छ।'
            : 'Author perspectives can be registered from the Editorial Console.'}
        </p>
      </div>
    );
  }

  const primaryItem = perspectives.find(p => p.id === selectedAuthorId) || perspectives[0];
  const secondaryItem = perspectives.find(p => p.id === compareAuthorId) || (perspectives.length > 1 ? perspectives[1] : null);

  const renderAuthorCard = (item: AuthorPerspectiveItem, isSecondary = false) => {
    const statusDef = RESEARCH_STATUS_LABELS[item.researchStatus] || RESEARCH_STATUS_LABELS.further_research;

    return (
      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-2xs divide-y divide-stone-100 space-y-0">
        
        {/* Header */}
        <div className="p-5 bg-stone-900 text-white space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
              {item.publicationYear} · {isSecondary ? (language === 'ne' ? 'तुलनात्मक लेखक #२' : 'Comparative Author #2') : (language === 'ne' ? 'मुख्य लेखक #१' : 'Primary Author #1')}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${statusDef.color}`}>
              {language === 'ne' ? statusDef.nepali : statusDef.english}
            </span>
          </div>

          <h3 className="font-serif-np text-xl font-bold text-white">
            {item.authorName} {language === 'ne' && item.authorNameNepali && `(${item.authorNameNepali})`}
          </h3>

          <p className="text-xs font-serif italic text-amber-100/90 leading-snug">
            "{item.bookTitle}" {item.page && `· ${language === 'ne' ? `पृष्ठ: ${item.page}` : `p. ${item.page}`}`}
          </p>
        </div>

        {/* 1. What the author wrote */}
        <div className="p-5 space-y-2 bg-stone-50/50">
          <span className="text-[11px] font-mono uppercase text-stone-500 block">
            {language === 'ne' ? '१. लेखकले के लेखेका छन्?:' : '1. What the Author Wrote:'}
          </span>
          <p className="font-serif-np text-stone-800 text-sm leading-relaxed">
            {item.whatAuthorWrote}
          </p>
        </div>

        {/* 2. Original Quotation */}
        {item.originalQuotation && (
          <div className="p-5 space-y-2 bg-white">
            <span className="text-[11px] font-mono uppercase text-stone-500 block">
              {language === 'ne' ? '२. मूल ग्रन्थको हरफ:' : '2. Original Source Quotation:'}
            </span>
            <blockquote className="font-serif italic text-stone-900 text-xs sm:text-sm border-l-2 border-amber-700 pl-3 py-1">
              "{item.originalQuotation}"
            </blockquote>
          </div>
        )}

        {/* 3. Nepali / English Translation */}
        <div className="p-5 space-y-2 bg-stone-50/30">
          <span className="text-[11px] font-mono uppercase text-stone-500 block">
            {language === 'ne' ? '३. अनुवाद तथा भावार्थ:' : '3. Translation & Meaning:'}
          </span>
          {language === 'ne' ? (
            <p className="font-serif-np text-stone-800 text-xs sm:text-sm leading-relaxed">
              {item.nepaliTranslation || 'नेपाली संस्करण चाँडै थपिँदैछ।'}
            </p>
          ) : (
            <p className="font-sans text-stone-800 text-xs sm:text-sm leading-relaxed">
              {item.englishTranslation || 'English translation coming soon.'}
            </p>
          )}
        </div>

        {/* 4. Evidence Used & Local Informants */}
        <div className="p-5 space-y-2 bg-white">
          <span className="text-[11px] font-mono uppercase text-stone-500 block">
            {language === 'ne' ? '४. प्रयोग गरिएको प्रमाण / सूचनादाता:' : '4. Evidence Used & Informants:'}
          </span>
          <div className="text-xs text-stone-700 font-sans space-y-1">
            <p>
              <strong>{language === 'ne' ? 'प्रमाण:' : 'Evidence:'}</strong> {item.evidenceUsed || (language === 'ne' ? 'लिखित ऐतिहासिक पुस्तक / मौखिक संकलन' : 'Historical publication / Oral collection')}
            </p>
            {item.localInformants && (
              <p>
                <strong>{language === 'ne' ? 'स्थानीय सूचनादाता:' : 'Local Informants:'}</strong> {item.localInformants}
              </p>
            )}
            <p className="text-[11px] text-stone-500">
              {language === 'ne'
                ? `प्रत्यक्ष अवलोकन: ${item.isDirectObservation ? 'हो' : 'होइन (स्थानीय सूचनादाताको कथनमा आधारित)'}`
                : `Direct Observation: ${item.isDirectObservation ? 'Yes' : 'No (Based on local informants)'}`}
            </p>
          </div>
        </div>

        {/* 5. External Link */}
        {item.sourceUrl && (
          <div className="p-4 bg-stone-50 flex items-center justify-between">
            <span className="text-[11px] text-stone-500 font-mono">
              {language === 'ne' ? 'मूल स्रोत अभिलेख' : 'Primary Source Archive'}
            </span>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 underline"
            >
              <span>{language === 'ne' ? 'डिजिटल प्रति हेर्नुहोस्' : 'View Archive Copy'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Control Bar: Author Selector & Side-by-side compare toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-stone-100 rounded-lg border border-stone-200">
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block">
            {language === 'ne'
              ? `विषय: ${topicTitle} (${perspectives.length} लेखकहरू उपलब्ध)`
              : `Topic: ${topicTitle} (${perspectives.length} authors available)`}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {perspectives.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedAuthorId(p.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  selectedAuthorId === p.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                {p.authorName} ({p.publicationYear})
              </button>
            ))}
          </div>
        </div>

        {perspectives.length > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                compareMode
                  ? 'bg-amber-800 text-white border-amber-900'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-300'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{compareMode ? (language === 'ne' ? 'तुलना बन्द गर्नुहोस्' : 'Close Comparison') : (language === 'ne' ? 'अर्को लेखकसँग तुलना गर्नुहोस्' : 'Compare with another author')}</span>
            </button>

            {compareMode && (
              <select
                value={compareAuthorId}
                onChange={e => setCompareAuthorId(e.target.value)}
                className="text-xs bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800"
              >
                {perspectives.filter(p => p.id !== selectedAuthorId).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.authorName} ({p.publicationYear})
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Main Author View: Single or Side-by-Side Comparison */}
      <div className={`grid gap-6 ${compareMode && secondaryItem ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {renderAuthorCard(primaryItem, false)}
        {compareMode && secondaryItem && renderAuthorCard(secondaryItem, true)}
      </div>

      {/* Comparative Differences Box if in compare mode */}
      {compareMode && secondaryItem && (
        <div className="p-5 bg-amber-50 rounded-lg border border-amber-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-900 font-bold">
            <Scale className="w-4 h-4 text-amber-800" />
            <span>
              {language === 'ne'
                ? 'लेखकहरू बीचको दृष्टिकोणगत भिन्नता'
                : 'Comparative Differences & Analysis'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-3 bg-white rounded border border-amber-200">
              <span className="font-semibold text-stone-900 block font-serif-np">
                {primaryItem.authorName} {language === 'ne' ? 'को मुख्य तर्क:' : 'Key Argument:'}
              </span>
              <p className="text-stone-600 mt-1 leading-relaxed">
                {primaryItem.differences || primaryItem.whatAuthorWrote.slice(0, 150) + '...'}
              </p>
            </div>
            <div className="p-3 bg-white rounded border border-amber-200">
              <span className="font-semibold text-stone-900 block font-serif-np">
                {secondaryItem.authorName} {language === 'ne' ? 'को मुख्य तर्क:' : 'Key Argument:'}
              </span>
              <p className="text-stone-600 mt-1 leading-relaxed">
                {secondaryItem.differences || secondaryItem.whatAuthorWrote.slice(0, 150) + '...'}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-amber-950/80 font-sans italic">
            {language === 'ne'
              ? '* अनुसन्धान आचारसंहिता: प्रणालीले कुनै एक लेखकको दाबीलाई स्वतः "अन्तिम सत्य" घोषणा गर्दैन। दुवैको प्रमाण, सूचनादाता र ऐतिहासिक परिप्रेक्ष्यलाई निष्पक्ष रूपमा अभिलेख गरिन्छ।'
              : '* Research Ethics: The archive does not automatically adopt any author claim as established truth. Primary evidence, informants, and historical context are neutrally recorded.'}
          </p>
        </div>
      )}

    </div>
  );
};
