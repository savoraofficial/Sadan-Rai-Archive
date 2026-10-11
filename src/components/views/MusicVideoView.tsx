import React, { useState } from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { ArchiveEngagement } from '../common/ArchiveEngagement';
import { TRANSLATIONS } from '../../data/translations';
import { Music, Video, ShieldCheck, FileText, MapPin } from 'lucide-react';

export const MusicVideoView: React.FC = () => {
  const { media, language } = useArchive();
  const [selectedType, setSelectedType] = useState<'all' | 'audio' | 'video'>('all');

  const t = TRANSLATIONS[language];

  const filteredMedia = selectedType === 'all'
    ? media
    : media.filter(m => m.type === selectedType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800">
          <Music className="w-4 h-4" />
          <span>{language === 'ne' ? 'ध्वनि तथा दृश्य प्रमाण' : 'AUDIOVISUAL EVIDENCE'}</span>
        </div>
        <h1 className="font-serif-np text-3xl sm:text-4xl font-bold text-stone-900">
          {language === 'ne' ? 'ऐतिहासिक, सांस्कृतिक तथा दस्तावेजी भिडियो अभिलेख' : 'Historical, Cultural & Documentary Video Archive'}
        </h1>
        <p className="text-stone-600 text-sm max-w-3xl leading-relaxed font-sans">
          {language === 'ne' ? 'भिडियो तथा अडियोमा कहाँ, कहिले, कसले, कसको साक्षात्कार, स्रोत, अधिकार र लिखित प्रतिलिपिसम्बन्धी विवरण राखिन्छ।' : 'Video and audio records preserve location, date, creator, interview details, source, rights and transcript where applicable.'}
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
            selectedType === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          {language === 'ne' ? `सबै (${media.length})` : `All (${media.length})`}
        </button>
        <button
          onClick={() => setSelectedType('audio')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
            selectedType === 'audio'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          {language === 'ne' ? 'मौलिक गीत / अडियो' : 'Songs / Audio'}
        </button>
        <button
          onClick={() => setSelectedType('video')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
            selectedType === 'video'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          {language === 'ne' ? 'भिडियो / वृत्तचित्र' : 'Videos / Documentaries'}
        </button>
      </div>

      {/* Media grid or archival status */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-stone-200 p-6 space-y-4 shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-mono uppercase">{item.type}</span>
                <span>{item.duration}</span>
              </div>
              <h3 className="font-serif-np font-bold text-lg text-stone-900">
                {language === 'ne' ? item.nepaliTitle : (item.title || item.nepaliTitle)}
              </h3>
              <p className="text-xs text-stone-600">{item.description}</p>
              <ArchiveEngagement contentType="media" contentId={item.id} />
              {item.type === 'audio' && (
                <audio controls className="w-full h-8" preload="none">
                  <source src={item.mediaUrl} type="audio/mpeg" />
                </audio>
              )}
              {item.type === 'video' && (
                <video controls className="w-full rounded-xl bg-stone-950 aspect-video" preload="metadata">
                  <source src={item.mediaUrl} />
                </video>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="archive-empty-record">
          <Video className="mx-auto text-amber-800 mb-3" size={25} />
          <strong>{language === 'ne' ? 'श्रव्य–दृश्य अभिलेखका लागि संरचना तयार छ' : 'The audiovisual archive structure is ready'}</strong>
          <span>{language === 'ne' ? 'भिडियो वा अडियोसँग अभिलेख पहिचान नम्बर, स्थान, मिति, सिर्जनाकर्ता, अन्तर्वार्ताकार, स्रोत, प्रमाण, अधिकार/अनुमति र लिखित प्रतिलिपि/टिपोट सुरक्षित गरिनेछ।' : 'Each audio or video record supports Record ID, location, date, creator, interviewee, source, evidence, rights/permission and transcript/notes.'}</span>
          <div className="mt-5 grid sm:grid-cols-3 gap-2 text-left max-w-2xl mx-auto">
            {[language === 'ne' ? 'स्थान · मिति · सिर्जनाकर्ता' : 'Location · Date · Creator', language === 'ne' ? 'अन्तर्वार्ता · लिखित प्रतिलिपि · प्रमाण' : 'Interview · Transcript · Evidence', language === 'ne' ? 'अधिकार · अनुमति · निजी मूल प्रति' : 'Rights · Permission · Private master'].map((x, i) => <div key={x} className="rounded-xl bg-white/70 border border-stone-200 p-3 text-[11px]">{i === 0 ? <MapPin size={14} className="text-amber-800 mb-1" /> : <FileText size={14} className="text-amber-800 mb-1" />}{x}</div>)}
          </div>
        </div>
      )}

      {/* Copyright Notice */}
      <div className="p-5 rounded-lg bg-[#F5F2EB] border border-stone-300 text-xs text-stone-700 space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-stone-900">
          <ShieldCheck className="w-4 h-4 text-amber-800" />
          <span>{language === 'ne' ? 'ध्वनि तथा दृश्य सामग्री अधिकार' : 'Media Copyright Notice'}</span>
        </div>
        <p className="leading-relaxed font-sans">
          {language === 'ne'
            ? 'सदन राईका मौलिक साङ्गीतिक रचना तथा स्थानीय सांस्कृतिक रेकर्डिङहरू सर्वाधिकार सुरक्षित छन्। अनधिकृत प्रतिलिपि वा व्यावसायिक प्रयोग निषेध गरिएको छ।'
            : 'Original recordings, compositions, and documentary footage by Sadan Rai are protected under copyright. Unauthorized reproduction or commercial use is strictly prohibited.'}
        </p>
      </div>

    </div>
  );
};
