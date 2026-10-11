import React, { useState } from 'react';
import { ResearchStatus } from '../../types';
import { useArchive } from '../../context/ArchiveContext';
import { ShieldCheck, MessageSquareQuote, HelpCircle, Info } from 'lucide-react';

interface ResearchBadgeProps {
  status: ResearchStatus;
  disclaimer?: string;
  showDetails?: boolean;
}

export const ResearchBadge: React.FC<ResearchBadgeProps> = ({ status, disclaimer, showDetails = false }) => {
  const { language } = useArchive();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isEnglish = language === 'en';

  const config = {
    verified: {
      label: isEnglish ? 'Verified Documentary Source' : 'प्रमाणित स्रोत',
      enLabel: 'Verified Documentary Source',
      icon: ShieldCheck,
      textColor: 'text-stone-800',
      bgColor: 'bg-emerald-50/80',
      borderColor: 'border-emerald-700/30',
      indicatorColor: 'bg-emerald-700',
      description: isEnglish
        ? 'This record is corroborated by historical documents, archives, archaeological surveys, or peer-reviewed scholarship.'
        : 'यो आलेख लिखित ऐतिहासिक दस्तावेज, वंशावली, पुरातत्व विभाग वा प्राज्ञिक शोधपत्रहरूद्वारा पुष्टि गरिएको छ।'
    },
    oral_history: {
      label: isEnglish ? 'Local Oral History' : 'स्थानीय मौखिक इतिहास',
      enLabel: 'Local Oral Tradition & Testimony',
      icon: MessageSquareQuote,
      textColor: 'text-stone-800',
      bgColor: 'bg-amber-50/80',
      borderColor: 'border-amber-700/30',
      indicatorColor: 'bg-amber-600',
      description: isEnglish
        ? 'Based on oral testimonies from village elders and knowledge-bearers. Requires further documentary corroboration.'
        : 'यो विवरण गाउँका अग्रज, ज्येष्ठ नागरिक तथा मुन्धुमी नाक्सोसँगको मौखिक अन्तर्वार्तामा आधारित छ। यसलाई थप लिखित वा पुरातात्विक प्रमाण आवश्यक छ।'
    },
    further_research: {
      label: isEnglish ? 'Further Research Needed' : 'अझै अनुसन्धान आवश्यक',
      enLabel: 'Preliminary / Needs Further Research',
      icon: HelpCircle,
      textColor: 'text-stone-800',
      bgColor: 'bg-stone-100',
      borderColor: 'border-stone-400/40',
      indicatorColor: 'bg-stone-600',
      description: isEnglish
        ? 'Preliminary study or hypothesis. Further archaeological investigation or documentary findings are underway.'
        : 'यो प्रारम्भिक अध्ययन वा परिकल्पना हो। यसमा उल्लेखित मिति तथा विवरणहरूको पूर्ण पुरातात्विक अन्वेषण जारी छ।'
    }
  }[status];

  const Icon = config.icon;

  return (
    <>
      <div className="inline-flex items-center gap-2">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border ${config.bgColor} ${config.borderColor} ${config.textColor}`}
          title={config.description}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${config.indicatorColor}`} />
          <Icon className="w-3.5 h-3.5 opacity-80" />
          <span>{config.label}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="hover:opacity-75 transition-opacity ml-0.5 text-stone-500"
            aria-label={isEnglish ? "View research standard details" : "अनुसन्धान मापदण्ड विवरण हेर्नुहोस्"}
          >
            <Info className="w-3 h-3" />
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded border border-stone-200/60 flex items-start gap-2">
          <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-stone-700">{config.description}</p>
            {disclaimer && <p className="mt-1 italic text-stone-600">“{disclaimer}”</p>}
          </div>
        </div>
      )}

      {/* Verification Standard Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${config.indicatorColor}`} />
                <h3 className="font-serif-np font-bold text-lg text-stone-900">{config.label}</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-medium p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm text-stone-700">
              <p className="text-xs uppercase tracking-wider text-stone-500">{config.enLabel}</p>
              <p>{config.description}</p>
              
              <div className="p-3 bg-[#FBF9F5] rounded border border-stone-200 text-xs space-y-1">
                <p className="font-semibold text-stone-800">
                  {isEnglish ? 'Research Ethics Protocol:' : 'हाम्रो अनुसन्धान आचारसंहिता (Research Ethics):'}
                </p>
                <p className="italic text-stone-600">
                  {isEnglish
                    ? '“We never present unverified historical claims as established fact. Written documents and oral traditions are always strictly distinguished.”'
                    : '“हामी कुनै पनि अप्रमाणित ऐतिहासिक दाबीलाई स्थापित तथ्यको रूपमा प्रस्तुत गर्दैनौँ। लिखित दस्तावेज र मौखिक परम्परालाई सधैं स्पष्ट छुट्ट्याइन्छ।”'}
                </p>
              </div>

              {disclaimer && (
                <p className="text-xs text-stone-600 bg-amber-50/60 p-2 rounded border border-amber-200/50">
                  <strong>{isEnglish ? 'Article Note:' : 'यस आलेखको टिप्पणी:'}</strong> {disclaimer}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 text-xs font-medium bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors cursor-pointer"
              >
                {isEnglish ? 'Close' : 'बुझें (Close)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
