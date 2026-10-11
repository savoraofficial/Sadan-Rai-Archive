import React from 'react';
import { ResearchSynthesis } from '../../types';
import { 
  Scale, 
  FileCheck, 
  GraduationCap, 
  MessageSquare, 
  AlertCircle, 
  HelpCircle 
} from 'lucide-react';

interface ResearchSynthesisCardProps {
  synthesis?: ResearchSynthesis;
  language?: 'ne' | 'en';
  className?: string;
}

export const ResearchSynthesisCard: React.FC<ResearchSynthesisCardProps> = ({
  synthesis,
  language = 'ne',
  className = ''
}) => {
  if (!synthesis) return null;

  return (
    <div className={`p-6 sm:p-7 bg-[#FBF9F5] rounded-lg border border-amber-200/90 space-y-6 shadow-2xs ${className}`}>
      
      {/* Header */}
      <div className="border-b border-amber-200/80 pb-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-900">
          <Scale className="w-4 h-4 text-amber-800" />
          <span>{language === 'ne' ? 'उपलब्ध प्रमाणको आधारमा अनुसन्धान सार' : 'Research Summary Based on Available Evidence'}</span>
          <span aria-hidden="true">·</span>
          <span>{language === 'ne' ? 'अनुसन्धान संश्लेषण' : 'Research Synthesis'}</span>
        </div>
        <h3 className="font-serif-np text-xl sm:text-2xl font-bold text-stone-900">
          {language === 'ne' ? 'प्रमाण-आधारित प्राज्ञिक संश्लेषण' : 'Evidence-Based Academic Synthesis'}
        </h3>
        <p className="text-xs text-stone-500 font-sans">
          {language === 'ne'
            ? 'यो खण्ड स्वचालित तथ्य होइन; प्रमाण तथा ऐतिहासिक पाठहरूको सम्पादकीय मूल्याङ्कनमा आधारित संश्लेषित सार हो।'
            : 'This synthesis is manually reviewed by the archivist and is not an automated fact generation.'}
        </p>
      </div>

      {/* 5 Distinct Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
        
        {/* 1. Established / Documented Information */}
        <div className="p-4 bg-white rounded border border-stone-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold font-serif-np">
            <FileCheck className="w-4 h-4 shrink-0" />
            <span>
              {language === 'ne'
                ? '१. स्थापित / दस्तावेजी तथ्य'
                : '1. Established / Documented Information'}
            </span>
          </div>
          <p className="text-stone-700 leading-relaxed font-serif-np text-sm">
            {synthesis.documentedInfo || (language === 'ne' ? 'थप प्रमाणीकरण भइरहेको छ।' : 'Under documentation.')}
          </p>
        </div>

        {/* 2. Scholarly Interpretation */}
        <div className="p-4 bg-white rounded border border-stone-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-indigo-900 font-bold font-serif-np">
            <GraduationCap className="w-4 h-4 shrink-0 text-indigo-700" />
            <span>
              {language === 'ne'
                ? '२. प्राज्ञिक व्याख्या'
                : '2. Scholarly Interpretation'}
            </span>
          </div>
          <p className="text-stone-700 leading-relaxed font-serif-np text-sm">
            {synthesis.scholarlyInterpretation || (language === 'ne' ? 'शोधकर्ताहरूको दृष्टिकोण तुलना गरिँदैछ।' : 'Scholarly comparison underway.')}
          </p>
        </div>

        {/* 3. Oral Tradition */}
        <div className="p-4 bg-white rounded border border-stone-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-amber-800 font-bold font-serif-np">
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>
              {language === 'ne'
                ? '३. मौखिक परम्परा तथा स्मृति'
                : '3. Oral Tradition & Living Memories'}
            </span>
          </div>
          <p className="text-stone-700 leading-relaxed font-serif-np text-sm">
            {synthesis.oralTradition || (language === 'ne' ? 'स्थानीय अग्रजहरूसँग संकलन गरिँदैछ।' : 'Oral collection in progress.')}
          </p>
        </div>

        {/* 4. Disputed Information */}
        <div className="p-4 bg-white rounded border border-stone-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-rose-800 font-bold font-serif-np">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {language === 'ne'
                ? '४. विवादित तथा फरक दृष्टिकोण'
                : '4. Disputed / Alternative Perspectives'}
            </span>
          </div>
          <p className="text-stone-700 leading-relaxed font-serif-np text-sm">
            {synthesis.disputedInfo || (language === 'ne' ? 'कुनै प्रत्यक्ष विवाद नदेखिएको वा थप अध्ययन आवश्यक।' : 'No direct conflict noted.')}
          </p>
        </div>

        {/* 5. Further Research Needed */}
        <div className="p-4 bg-stone-100 rounded border border-stone-300 space-y-1.5 md:col-span-2">
          <div className="flex items-center gap-1.5 text-stone-900 font-bold font-serif-np">
            <HelpCircle className="w-4 h-4 shrink-0 text-amber-700" />
            <span>
              {language === 'ne'
                ? '५. अझै थप अनुसन्धान आवश्यक क्षेत्र'
                : '5. Further Research Needed'}
            </span>
          </div>
          <p className="text-stone-700 leading-relaxed font-serif-np text-sm">
            {synthesis.furtherResearchNeeded || (language === 'ne' ? 'पुरातात्विक र भाषिक प्रमाणहरूको थप अन्वेषण जारी।' : 'Exploration ongoing.')}
          </p>
        </div>

      </div>

    </div>
  );
};
