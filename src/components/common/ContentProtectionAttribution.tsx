import React from 'react';
import { Copyright, Mail } from 'lucide-react';
import { BRAND_INFO, RIGHTS_STATUS_LABELS } from '../../data/archiveData';
import { RightsStatus } from '../../types';
import { useArchive } from '../../context/ArchiveContext';

interface ContentProtectionProps {
  rightsStatus?: RightsStatus;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  canonicalUrl?: string;
  title?: string;
  className?: string;
}

export const ContentProtectionAttribution: React.FC<ContentProtectionProps> = ({
  rightsStatus = 'original_sadan_rai',
  author,
  createdAt,
  updatedAt,
  canonicalUrl,
  title,
  className = ''
}) => {
  const { language } = useArchive();
  const isEnglish = language === 'en';
  const displayAuthor = author || (isEnglish ? 'Sadan Rai' : 'सदन राई');
  const rightsDef = RIGHTS_STATUS_LABELS[rightsStatus] || RIGHTS_STATUS_LABELS.original_sadan_rai;

  // Public copying is controlled by PublicContentProtection.
  // Owner sessions retain normal browser copy/paste without modifying clipboard contents.

  return (
    <div className={`p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs font-sans space-y-3 ${className}`}>
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-700">
          <Copyright className="w-3.5 h-3.5 text-amber-800" />
          <span className="font-semibold">{isEnglish ? rightsDef.english : rightsDef.notice}</span>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-mono">
          {isEnglish ? rightsDef.english : rightsDef.nepali}
        </span>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-stone-600 text-[11px]">
        <div>
          <span className="text-stone-400 block font-mono">
            {isEnglish ? 'Archivist / Author:' : 'अभिलेख कर्ता / लेखक:'}
          </span>
          <span className="font-medium text-stone-800">{displayAuthor}</span>
        </div>
        {createdAt && (
          <div>
            <span className="text-stone-400 block font-mono">
              {isEnglish ? 'Registration Date:' : 'दर्ता मिति:'}
            </span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        )}
        {updatedAt && (
          <div>
            <span className="text-stone-400 block font-mono">
              {isEnglish ? 'Last Modified:' : 'अन्तिम परिमार्जन:'}
            </span>
            <span>{new Date(updatedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Attribution & Reporting Policy */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-stone-500">
        <p className="max-w-xl leading-relaxed">
          {isEnglish
            ? 'This record is based on original research and documented archival sources. Citations for scholarly inquiry are welcomed with proper attribution.'
            : 'यो अभिलेख मौलिक अनुसन्धान तथा संकलित स्रोतमा आधारित छ। प्राज्ञिक अध्ययनको लागि स्रोत उल्लेख गरी उद्धरण गर्न सकिनेछ।'}
        </p>

        <a
          href={`mailto:${BRAND_INFO.contactEmail}?subject=${isEnglish ? 'Archival Rights & Inquiry' : 'प्रतिलिपि अधिकार तथा अभिलेख जिज्ञासा'}: ${encodeURIComponent(title || '')}`}
          className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 font-semibold"
        >
          <Mail className="w-3 h-3" />
          <span>{isEnglish ? 'Rights & Inquiries Contact' : 'प्रतिलिपि / सहकार्य सम्पर्क'}</span>
        </a>
      </div>
    </div>
  );
};
