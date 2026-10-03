import React, { useEffect, useState } from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { ShieldCheck, MapPin } from 'lucide-react';
import { OfficialVerifiedBadge } from '../common/OfficialVerifiedBadge';
import { TRANSLATIONS } from '../../data/translations';
import { auth } from '../../firebase';
import { BRAND_INFO } from '../../data/archiveData';
import { onAuthStateChanged } from 'firebase/auth';

export const Footer: React.FC = () => {
  const { navigateTo, language } = useArchive();
  const [isOwner, setIsOwner] = useState(auth.currentUser?.email?.toLowerCase() === BRAND_INFO.contactEmail.toLowerCase());

  useEffect(() => onAuthStateChanged(auth, user => setIsOwner(user?.email?.toLowerCase() === BRAND_INFO.contactEmail.toLowerCase())), []);
  const t = TRANSLATIONS[language];

  const handleNav = (route: string) => {
    navigateTo(route);
  };

  return (
    <footer className="bg-[#1C1917] text-stone-300 pt-12 pb-9 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-9 border-b border-stone-800">
          
          {/* Col 1: Identity & Motto */}
          <div className="space-y-3">
            <div>
              <h2 className="brand-lock font-display-brand text-white font-bold tracking-wider inline-flex items-center gap-1.5">
                <span>{t.brandName}</span>
                <OfficialVerifiedBadge size="sm" />
                {language === 'ne' && (
                  <span className="brand-lock font-serif-np font-normal text-stone-400 ml-1">· {t.brandNameSub}</span>
                )}
              </h2>
              <p className="text-xs text-amber-400 font-mono tracking-wider mt-0.5">
                {t.institutionalName}
              </p>
            </div>
            
            <p className="font-serif-np text-sm text-stone-300 font-medium leading-relaxed">
              {t.subtitle}
            </p>
            
            <p className="text-xs text-stone-300 italic border-l-2 border-amber-600/70 pl-3 py-0.5 leading-relaxed">
              “{t.tagline}”
            </p>
            
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              {t.topics}
            </p>
            
            <div className="flex items-start gap-1.5 text-xs text-stone-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>{t.location}</span>
            </div>
          </div>

          {/* Col 2: Research & Core Sections */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-stone-400 font-mono">
              {t.footer.sectionsTitle}
            </h3>
            <ul className="space-y-2 text-sm text-stone-300 font-sans">
              <li>
                <button
                  onClick={() => handleNav('/history')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.sections.historyTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/culture')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.sections.cultureTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/civilization')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.sections.civilizationTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/village/malbase-patlepani')}
                  className="hover:text-white transition-colors cursor-pointer font-medium text-amber-300/90 text-left"
                >
                  {t.nav.village}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/oral-history')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.sections.oralHistoryTitle}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Archives, Media & Verification */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-stone-400 font-mono">
              {t.footer.archivesTitle}
            </h3>
            <ul className="space-y-2 text-sm text-stone-300 font-sans">
              <li>
                <button
                  onClick={() => handleNav('/articles')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.sections.articlesTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/photos')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.sections.photosTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/media')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.sections.mediaTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/sources')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.sections.sourcesTitle}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Ethics & Legal / Author */}
          <div className="space-y-3 text-xs text-stone-400">
            <h3 className="text-xs uppercase tracking-widest text-stone-400 font-mono">
              {t.footer.integrityTitle}
            </h3>
            <div className="p-3 bg-stone-900/90 rounded border border-stone-800 space-y-2">
              <div className="flex items-center gap-1.5 text-stone-200 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t.footer.factRuleTitle}</span>
              </div>
              <p className="leading-relaxed font-sans">
                {t.footer.factRuleText}
              </p>
            </div>
            
            <div className="archive-legal-notice">
              {language === 'ne'
                ? 'प्रतिलिपि अधिकार तथा अधिकार सूचना: © 2026 सदन राई। सदन राईद्वारा सिर्जना गरिएका मौलिक अनुसन्धान, लेखन, तस्बिर, ध्वनि–दृश्य अभिलेख, डिजाइन, मेटाडेटा तथा अन्य मौलिक सामग्री लागू प्रतिलिपि अधिकार तथा बौद्धिक सम्पत्ति कानूनद्वारा संरक्षित छन्। अनुमति बिना प्रतिलिपि, पुनःप्रकाशन, परिमार्जन, वितरण वा व्यावसायिक प्रयोग निषेधित छ। उल्लङ्घन भएमा लागू कानूनबमोजिम उपयुक्त कानूनी उपचार खोज्ने अधिकार सुरक्षित रहनेछ। तेस्रो-पक्षीय सामग्री सम्बन्धित अधिकारधनीको अधिकारअन्तर्गत रहनेछ.'
                : 'Copyright & Rights Notice: © 2026 Sadan Rai. Original research, writing, photographs, audiovisual records, designs, metadata and other original archive content created by Sadan Rai are protected by applicable copyright and intellectual-property law. Unauthorized copying, republication, modification, distribution or commercial use is prohibited. Rights are reserved to seek appropriate remedies under applicable law where infringement occurs. Third-party materials remain subject to their respective rights.'}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => handleNav('/about')}
                className="hover:text-stone-200 transition-colors cursor-pointer"
              >
                {t.footer.aboutLink} →
              </button>
              <button
                onClick={() => handleNav('/contact')}
                className="hover:text-stone-200 transition-colors cursor-pointer"
              >
                {t.footer.contactLink} →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            {t.footer.copyright}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('/contact')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              {t.footer.rightsLink}
            </button>
            {isOwner && <>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => handleNav('/sadan-rai-editorial-console')}
                className="hover:text-stone-300 transition-colors cursor-pointer"
              >
                {t.footer.adminLink}
              </button>
            </>}
          </div>
        </div>
      </div>
    </footer>
  );
};
