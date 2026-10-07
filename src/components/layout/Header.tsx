import React, { useState } from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { Menu, X, Search, ChevronDown, Globe, ShieldCheck, BookOpen, Camera, MapPinned, ScrollText, ExternalLink } from 'lucide-react';
import { OfficialVerifiedBadge } from '../common/OfficialVerifiedBadge';
import { TRANSLATIONS } from '../../data/translations';
import { ADDON_TRANSLATIONS } from '../../data/archiveAddonTranslations';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { BRAND_INFO } from '../../data/archiveData';

export const Header: React.FC = () => {
  const { currentRoute, navigateTo, language, setLanguage, searchQuery, setSearchQuery } = useArchive();
  const ADMIN_ROUTE = '/sadan-rai-editorial-console';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [isOwnerSignedIn, setIsOwnerSignedIn] = useState(false);

  // Keep the page itself from scrolling behind the mobile drawer.
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsOwnerSignedIn(user?.email?.toLowerCase() === BRAND_INFO.contactEmail.toLowerCase());
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mobileMenuOpen]);

  const t = TRANSLATIONS[language];
  const addonT = ADDON_TRANSLATIONS[language];

  const primaryNavItems = [
    { label: t.nav.history, route: '/history' },
    { label: t.nav.culture, route: '/culture' },
    { label: t.nav.civilization, route: '/civilization' },
    { label: t.nav.village, route: '/village/malbase-patlepani' },
    { label: t.nav.oralHistory, route: '/oral-history' },
    { label: t.nav.research, route: '/research' },
  ];

  const secondaryNavItems = [
    { label: t.nav.articles, route: '/articles' },
    { label: t.nav.photos, route: '/photos' },
    { label: t.nav.media, route: '/media' },
    { label: t.nav.sources, route: '/sources' },
    { label: t.nav.about, route: '/about' },
    { label: t.nav.contact, route: '/contact' },
    { label: addonT.nav.support, route: '/support' },
    { route: '/saved', label: language === 'ne' ? 'सुरक्षित अभिलेख' : 'Saved Archive' },
  ];

  const allNavItems = [
    { label: t.nav.home, route: '/' },
    ...primaryNavItems,
    ...secondaryNavItems
  ];

  const handleNavClick = (route: string) => {
    navigateTo(route);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  const isCurrent = (route: string) => {
    if (route === '/' && currentRoute === '/') return true;
    if (route !== '/' && currentRoute.startsWith(route)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-Zone Top Bar Contract */}
        <div className="flex items-center justify-between min-h-16 py-2 gap-2 xl:gap-3">
          
          {/* Zone 1: Wordmark with explicit dot separator */}
          <div className="shrink-0 min-w-0 flex items-center lg:w-[230px] xl:w-[250px] 2xl:w-[285px]">
            <button
              onClick={() => handleNavClick('/')}
              className="text-left group cursor-pointer focus:outline-hidden"
              aria-label={language === 'ne' ? 'सदन राई गृहपृष्ठ' : 'Sadan Rai Home'}
            >
              <div className="flex items-center gap-2">
                <span className="brand-lock font-display-brand font-bold tracking-wider text-stone-900 group-hover:text-amber-900 transition-colors inline-flex items-center gap-1.5 shrink-0">
                  <span className={language === 'ne' ? 'font-serif-np' : 'font-display-brand'}>{language === 'ne' ? 'सदन राई' : 'SADAN RAI'}</span>
                  <OfficialVerifiedBadge size="sm" />
                </span>
                <span className="hidden sm:block h-5 w-px bg-stone-300" aria-hidden="true" />
                <span className="hidden 2xl:block text-xs font-sans text-stone-600 font-medium tracking-normal line-clamp-1 max-w-[220px] min-w-0">
                  {t.institutionalName}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4–6 clean text navigation links */}
          <nav className="hidden xl:flex flex-1 min-w-0 items-center justify-center gap-2 xl:gap-3 2xl:gap-4 text-[12px] 2xl:text-sm font-medium text-stone-700 overflow-x-auto no-scrollbar">
            {primaryNavItems.map((item) => (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
                className={`shrink-0 transition-colors whitespace-nowrap cursor-pointer hover:text-stone-950 pb-0.5 border-b-2 ${
                  isCurrent(item.route)
                    ? 'border-amber-800 text-stone-950 font-semibold'
                    : 'border-transparent text-stone-600'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Clean Dropdown for Remaining Archive Categories */}
            <div className="relative shrink-0">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="flex items-center gap-1 hover:text-stone-950 text-stone-600 transition-colors py-1 cursor-pointer"
                aria-expanded={moreDropdownOpen}
              >
                <span>{t.nav.more}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMoreDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-stone-200 py-1.5 z-20">
                    {secondaryNavItems.map((item) => (
                      <button
                        key={item.route}
                        onClick={() => handleNavClick(item.route)}
                        className={`w-full text-left px-4 py-2 text-xs font-medium cursor-pointer transition-colors hover:bg-stone-50 ${
                          isCurrent(item.route) ? 'text-amber-900 font-semibold bg-amber-50/50' : 'text-stone-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}

                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="shrink-0 flex items-center gap-1 sm:gap-1.5">
            {isOwnerSignedIn && currentRoute !== ADMIN_ROUTE && (
              <button onClick={() => handleNavClick(ADMIN_ROUTE)} className="inline-flex items-center gap-1.5 rounded-md border border-amber-800/30 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer" title={language === 'ne' ? 'सम्पादकीय कन्सोल खोल्नुहोस्' : 'Open Admin Console'}>
                <ShieldCheck className="w-3.5 h-3.5" /> {language === 'ne' ? 'कन्सोल' : 'Admin Console'}
              </button>
            )}
            {/* Search Affordance */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 rounded-md transition-colors cursor-pointer"
              title={language === 'ne' ? 'अभिलेख खोज्नुहोस्' : 'Search Archive'}
              aria-label={language === 'ne' ? 'खोज' : 'Search'}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Architecture Selector — explicit, persistent, bilingual */}
            <div
              className="hidden sm:flex items-center gap-0.5 rounded-lg border border-stone-300 bg-white p-0.5 shadow-sm"
              role="group"
              aria-label={language === 'ne' ? 'भाषा चयन' : 'Language selection'}
            >
              <Globe className="w-3.5 h-3.5 text-stone-500 mx-1.5" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setLanguage('ne')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${language === 'ne' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100'}`}
                aria-pressed={language === 'ne'}
                title="नेपाली"
              >
                नेपाली
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${language === 'en' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100'}`}
                aria-pressed={language === 'en'}
                title="English"
              >
                English
              </button>
            </div>

            {/* Mobile Language Switcher — always visible on small screens */}
            <div
              className="flex sm:hidden items-center gap-0.5 rounded-lg border border-stone-300 bg-white p-0.5 shadow-sm"
              role="group"
              aria-label={language === 'ne' ? 'भाषा चयन' : 'Language selection'}
            >
              <button
                type="button"
                onClick={() => setLanguage('ne')}
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors ${language === 'ne' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100'}`}
                aria-pressed={language === 'ne'}
                title="नेपाली"
              >
                ने
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors ${language === 'en' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100'}`}
                aria-pressed={language === 'en'}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              aria-label={language === 'ne' ? 'मेनु खोल्नुहोस्' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="py-2.5 px-1 border-t border-stone-200/60 flex items-center gap-2">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentRoute !== '/articles' && e.target.value.trim().length > 0) {
                  navigateTo('/articles');
                }
              }}
              placeholder={t.actions.searchPlaceholder}
              className="w-full bg-transparent text-sm focus:outline-hidden text-stone-900 placeholder:text-stone-400"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-stone-400 hover:text-stone-700 px-1.5 py-0.5 cursor-pointer"
              >
                {t.actions.clear}
              </button>
            )}
            <button
              onClick={() => setSearchOpen(false)}
              className="text-xs text-stone-500 hover:text-stone-800 font-medium px-2 py-1 cursor-pointer"
            >
              {t.actions.close}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu — full-height, scroll-safe professional navigation */}
      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label={language === 'ne' ? 'मेनु बन्द गर्नुहोस्' : 'Close menu'}
            onClick={() => setMobileMenuOpen(false)}
            className="xl:hidden fixed inset-0 top-16 z-[55] bg-stone-950/35 backdrop-blur-[1px] cursor-default"
          />

          <aside
            className="xl:hidden fixed right-0 top-16 bottom-0 z-[60] w-[min(92vw,420px)] bg-[#FBF9F5] border-l border-stone-300 shadow-2xl overflow-y-auto overscroll-contain"
            aria-label={language === 'ne' ? 'मुख्य मेनु' : 'Main menu'}
          >
            <div className="min-h-full p-4 sm:p-5 space-y-5 pb-8">
              {/* Drawer header */}
              <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-mono">
                    {language === 'ne' ? 'SADAN RAI ARCHIVE' : 'SADAN RAI ARCHIVE'}
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-stone-900">
                    {language === 'ne' ? 'मुख्य मेनु तथा सर्टकट' : 'Menu & Shortcuts'}
                  </h2>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
                  aria-label={language === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Professional quick shortcuts */}
              <section>
                <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-mono px-1 mb-2">
                  {language === 'ne' ? 'छिटो पहुँच' : 'Quick Access'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleNavClick('/history')} className="group rounded-lg border border-stone-200 bg-white p-3 text-left hover:border-amber-300 hover:bg-amber-50/50 transition-colors">
                    <BookOpen className="w-4 h-4 text-amber-800 mb-2" />
                    <span className="block text-xs font-semibold text-stone-800">{t.nav.history}</span>
                  </button>
                  <button onClick={() => handleNavClick('/culture')} className="group rounded-lg border border-stone-200 bg-white p-3 text-left hover:border-amber-300 hover:bg-amber-50/50 transition-colors">
                    <ScrollText className="w-4 h-4 text-amber-800 mb-2" />
                    <span className="block text-xs font-semibold text-stone-800">{t.nav.culture}</span>
                  </button>
                  <button onClick={() => handleNavClick('/village/malbase-patlepani')} className="group rounded-lg border border-stone-200 bg-white p-3 text-left hover:border-amber-300 hover:bg-amber-50/50 transition-colors">
                    <MapPinned className="w-4 h-4 text-amber-800 mb-2" />
                    <span className="block text-xs font-semibold text-stone-800">{t.nav.village}</span>
                  </button>
                  <button onClick={() => handleNavClick('/photos')} className="group rounded-lg border border-stone-200 bg-white p-3 text-left hover:border-amber-300 hover:bg-amber-50/50 transition-colors">
                    <Camera className="w-4 h-4 text-amber-800 mb-2" />
                    <span className="block text-xs font-semibold text-stone-800">{t.nav.photos}</span>
                  </button>
                </div>
              </section>

              {/* Owner-only admin shortcut. Public visitors never see an admin entry point. */}
              {isOwnerSignedIn && (
                <button
                  onClick={() => handleNavClick(ADMIN_ROUTE)}
                  className="w-full rounded-lg border border-amber-300 bg-stone-900 text-white p-3.5 text-left shadow-sm hover:bg-stone-800 transition-colors flex items-center gap-3"
                >
                  <span className="w-9 h-9 rounded-md bg-amber-700/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-amber-300" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{language === 'ne' ? 'सम्पादकीय कन्सोल' : 'Admin Console'}</span>
                    <span className="block text-[11px] text-stone-300 mt-0.5">{language === 'ne' ? 'अनुसन्धान तथा अभिलेख व्यवस्थापन खोल्नुहोस्' : 'Open research and archive management'}</span>
                  </span>
                  <ExternalLink className="w-4 h-4 ml-auto text-stone-400 shrink-0" />
                </button>
              )}

              {/* Full navigation */}
              <section className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-mono px-1 py-1">
                  {t.nav.menuTitle}
                </p>
                {allNavItems.map((item) => (
                  <button
                    key={item.route}
                    onClick={() => handleNavClick(item.route)}
                    className={`w-full text-left px-3.5 py-3 text-sm font-medium rounded-md transition-colors flex items-center justify-between ${
                      isCurrent(item.route)
                        ? 'bg-amber-100/70 text-amber-950 font-semibold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-stone-400">→</span>
                  </button>
                ))}
              </section>

              {/* Language */}
              <section className="p-3 bg-stone-100 rounded-lg border border-stone-200">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <Globe className="w-4 h-4 text-stone-500" />
                    <span>{language === 'ne' ? 'भाषा' : 'Language'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setLanguage('ne')} className={`px-2.5 py-1.5 text-xs rounded ${language === 'ne' ? 'bg-stone-900 text-white font-bold' : 'bg-white text-stone-700 border border-stone-300'}`}>नेपाली</button>
                    <button onClick={() => setLanguage('en')} className={`px-2.5 py-1.5 text-xs rounded ${language === 'en' ? 'bg-stone-900 text-white font-bold' : 'bg-white text-stone-700 border border-stone-300'}`}>English</button>
                  </div>
                </div>
              </section>

              <div className="p-3 bg-stone-100/70 rounded-lg text-xs text-stone-600 space-y-1 border border-stone-200">
                <p className="font-semibold text-stone-800">{t.subtitle}</p>
                <p className="italic">“{t.tagline}”</p>
              </div>
            </div>
          </aside>
        </>
      )}
    </header>
  );
};
