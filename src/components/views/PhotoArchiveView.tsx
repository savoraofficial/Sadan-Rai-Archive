import React, { useState } from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { PhotoItem } from '../../types';
import { ArchiveEngagement } from '../common/ArchiveEngagement';
import { TRANSLATIONS } from '../../data/translations';
import { Camera, MapPin, X, ZoomIn, ShieldCheck, FileText } from 'lucide-react';

export const PhotoArchiveView: React.FC = () => {
  const { photos, language } = useArchive();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  const t = TRANSLATIONS[language];

  const categories = [
    { key: 'all', ne: 'सबै', en: 'All' },
    { key: 'monuments', ne: 'पुरातात्त्विक तथा ऐतिहासिक स्थल', en: 'Archaeology & Historic Sites' },
    { key: 'archives', ne: 'पुराना दस्तावेज तथा लिपि', en: 'Documents & Manuscripts' },
    { key: 'rituals', ne: 'संस्कृति तथा परम्परा', en: 'Culture & Traditions' },
    { key: 'places', ne: 'स्थान तथा भू-दृश्य', en: 'Places & Landscapes' },
    { key: 'people', ne: 'व्यक्ति तथा field documentation', en: 'People & Field Documentation' },
  ];

  const filteredPhotos = selectedCategory === 'all'
    ? photos
    : photos.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800">
          <Camera className="w-4 h-4" />
          <span>{language === 'ne' ? 'पुरातात्त्विक तथा ऐतिहासिक दृश्य प्रमाण' : 'ARCHAEOLOGICAL & HISTORICAL VISUAL EVIDENCE'}</span>
        </div>
        <h1 className="font-serif-np text-3xl sm:text-4xl font-bold text-stone-900">
          {language === 'ne' ? 'पुरातात्त्विक तथा ऐतिहासिक तस्बिर अभिलेख' : 'Archaeological & Historical Photographic Archive'}
        </h1>
        <p className="text-stone-600 text-sm max-w-3xl leading-relaxed font-sans">
          {language === 'ne' ? 'हरेक तस्बिरसँग कहाँको, कहिलेको, कसले खिचेको, स्रोत, अधिकार र प्रमाणसम्बन्धी विवरण राखिन्छ।' : 'Each image record can preserve location, date, photographer, source, rights and evidence context.'}
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {language === 'ne' ? cat.ne : cat.en}
          </button>
        ))}
      </div>

      {/* Photos Grid or archival status */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="bg-white rounded-lg border border-stone-200 overflow-hidden hover:border-amber-800 transition-colors cursor-pointer flex flex-col justify-between shadow-2xs"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={photo.imageUrl}
                  alt={language === 'ne' ? photo.nepaliTitle : (photo.title || photo.nepaliTitle)}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-serif-np font-bold text-base text-stone-900">
                  {language === 'ne' ? photo.nepaliTitle : (photo.title || photo.nepaliTitle)}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2">{photo.caption}</p>
                <p className="text-[11px] text-stone-400 font-mono">{photo.location}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="archive-empty-record">
          <Camera className="mx-auto text-amber-800 mb-3" size={25} />
          <strong>{language === 'ne' ? 'यस सङ्ग्रहमा अभिलेख थपिँदै जानेछ' : 'This collection is ready for archival records'}</strong>
          <span>{language === 'ne' ? 'प्रत्येक तस्बिरमा अभिलेख पहिचान नम्बर, शीर्षक, स्थान, मिति/कालखण्ड, फोटोग्राफर, स्रोत, प्रमाण, अधिकार/अनुमति र सम्बन्धित अभिलेख राखिनेछ।' : 'Each record is designed to preserve Record ID, title, location, date/period, photographer, source, evidence, rights/permission and related records.'}</span>
          <div className="mt-5 grid sm:grid-cols-3 gap-2 text-left max-w-2xl mx-auto">
            {[language === 'ne' ? 'स्थान · मिति · फोटोग्राफर' : 'Location · Date · Photographer', language === 'ne' ? 'स्रोत · प्रमाण · सम्बन्धित अभिलेख' : 'Source · Evidence · Related record', language === 'ne' ? 'अधिकार · अनुमति · निजी मूल प्रति' : 'Rights · Permission · Private master'].map(x => <div key={x} className="rounded-xl bg-white/70 border border-stone-200 p-3 text-[11px]"><FileText size={14} className="text-amber-800 mb-1" />{x}</div>)}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif-np font-bold text-lg text-stone-900">
                {language === 'ne' ? activePhoto.nepaliTitle : (activePhoto.title || activePhoto.nepaliTitle)}
              </h3>
              <button
                onClick={() => setActivePhoto(null)}
                className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-hidden rounded bg-stone-100">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.nepaliTitle}
                className="w-full h-auto object-contain max-h-[60vh] mx-auto"
              />
            </div>
            <div className="space-y-1 text-xs text-stone-600">
              <p>{activePhoto.caption}</p>
              <p className="font-mono text-stone-400">{activePhoto.location} {activePhoto.dateKnown && `· ${activePhoto.dateKnown}`}</p>
              <ArchiveEngagement contentType="photo" contentId={activePhoto.id} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
