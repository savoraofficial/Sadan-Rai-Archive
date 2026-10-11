/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ArchiveProvider, useArchive } from './context/ArchiveContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/views/HomeView';
import { VillageView } from './components/views/VillageView';
import { HistoryView, HistoryCollectionView, KiratHistoryView } from './components/views/HistoryView';
import { CultureView } from './components/views/CultureView';
import { CivilizationView } from './components/views/CivilizationView';
import { OralHistoryView } from './components/views/OralHistoryView';
import { ResearchView } from './components/views/ResearchView';
import { OriginalResearchView } from './components/views/OriginalResearchView';
import { ArticlesView } from './components/views/ArticlesView';
import { ArticleDetailView } from './components/views/ArticleDetailView';
import { PhotoArchiveView } from './components/views/PhotoArchiveView';
import { PatanMuseumEvidenceView } from './components/views/PatanMuseumEvidenceView';
import { MusicVideoView } from './components/views/MusicVideoView';
import { SourcesView } from './components/views/SourcesView';
import { AboutView } from './components/views/AboutView';
import { ContactView } from './components/views/ContactView';
import { AdminPortalView } from './components/views/AdminPortalView';
import { AdminLoginView } from './components/views/AdminLoginView';
import { SupportView } from './components/views/SupportView';
import { CommunityAdminView } from './components/views/CommunityAdminView';
import { SubmitArchiveView } from './components/views/SubmitArchiveView';
import { ArchiveStandardsView } from './components/views/ArchiveStandardsView';
import { AdditionalArchiveView } from './components/views/AdditionalArchiveView';
import { SavedView } from './components/views/SavedView';
import { PublicContentProtection } from './components/common/PublicContentProtection';

const ADMIN_BASE_ROUTE = '/sadan-rai-editorial-console';
const ADMIN_LOGIN_ROUTE = '/sadan-rai-editorial-login';
// Professional public aliases. The original editorial routes remain unchanged.
const ADMIN_ALIAS_ROUTE = '/admin';
const ADMIN_ALIAS_LOGIN_ROUTE = '/admin/login';
const isAdminRoute = (route: string) =>
  route === ADMIN_BASE_ROUTE ||
  route === ADMIN_LOGIN_ROUTE ||
  route === ADMIN_ALIAS_ROUTE ||
  route === ADMIN_ALIAS_LOGIN_ROUTE ||
  route.startsWith(`${ADMIN_BASE_ROUTE}/`);

function ArchiveApp() {
  const { currentRoute, getArticleBySlug, language } = useArchive();

  // Dynamic Document Title Sync for SEO & Screen Readers
  useEffect(() => {
    let title = language === 'ne'
      ? 'सदन राई — हाम्रो पुर्खा • हाम्रो पहिचान | इतिहास, सभ्यता तथा संस्कृति अभिलेखालय'
      : 'SADAN RAI — Our Ancestors • Our Identity | History, Civilization & Culture Archive';
    
    if (currentRoute === '/') {
      title = language === 'ne'
        ? 'सदन राई — हाम्रो पुर्खा • हाम्रो पहिचान | इतिहास, सभ्यता तथा संस्कृति अभिलेखालय'
        : 'SADAN RAI — Our Ancestors • Our Identity | History, Civilization & Culture Archive';
    } else if (currentRoute.startsWith('/village')) {
      title = language === 'ne'
        ? 'स्थान तथा गाउँ अभिलेख | सदन राई'
        : 'Places & Local History | SADAN RAI';
    } else if (currentRoute === '/history') {
      title = language === 'ne' ? 'इतिहास तथा सभ्यता | सदन राई' : 'History & Civilization | SADAN RAI';
    } else if (currentRoute === '/history/kirat') {
      title = language === 'ne' ? 'किरात इतिहास तथा सभ्यता | सदन राई' : 'Kirat History & Civilization | SADAN RAI';
    } else if (currentRoute === '/culture') {
      title = language === 'ne' ? 'संस्कृति, धर्म तथा परम्परा | सदन राई' : 'Culture, Religion & Traditions | SADAN RAI';
    } else if (currentRoute === '/civilization') {
      title = language === 'ne' ? 'सभ्यता | सदन राई' : 'Civilization | SADAN RAI';
    } else if (currentRoute === '/oral-history') {
      title = language === 'ne' ? 'मौखिक इतिहास | सदन राई' : 'Oral History | SADAN RAI';
    } else if (currentRoute === '/research') {
      title = language === 'ne' ? 'अनुसन्धान तथा स्रोत | सदन राई' : 'Research & Sources | SADAN RAI';
    } else if (currentRoute === '/original-research') {
      title = language === 'ne' ? 'सदन राई — मौलिक अनुसन्धान तथा नयाँ खोज | सदन राई' : 'Sadan Rai — Original Research & New Findings | SADAN RAI';
    } else if (currentRoute === '/articles') {
      title = language === 'ne' ? 'प्रकाशित लेखहरू | सदन राई' : 'Published Articles | SADAN RAI';
    } else if (currentRoute.startsWith('/article/')) {
      const slug = currentRoute.replace('/article/', '');
      const art = getArticleBySlug(slug);
      if (art) {
        title = `${art.title} | SADAN RAI`;
      }
    } else if (currentRoute === '/patan-museum-evidence') {
      title = language === 'ne' ? 'पाटन संग्रहालय — शिलालेख तथा ऐतिहासिक प्रमाण | सदन राई' : 'Patan Museum — Inscriptions & Historical Evidence | SADAN RAI';
    } else if (currentRoute === '/photos') {
      title = language === 'ne' ? 'तस्बिर सङ्ग्रह | सदन राई' : 'Photo Archive | SADAN RAI';
    } else if (currentRoute === '/media') {
      title = language === 'ne' ? 'मौलिक सङ्गीत तथा भिडियो | सदन राई' : 'Music & Video | SADAN RAI';
    } else if (currentRoute === '/sources') {
      title = language === 'ne' ? 'स्रोत तथा सन्दर्भ ग्रन्थ | सदन राई' : 'Sources & References | SADAN RAI';
    } else if (currentRoute === '/about') {
      title = language === 'ne' ? 'सदन राईको बारेमा | सदन राई' : 'About Sadan Rai | SADAN RAI';
    } else if (currentRoute === '/contact') {
      title = language === 'ne' ? 'सम्पर्क | सदन राई' : 'Contact | SADAN RAI';
    } else if (currentRoute === '/support') {
      title = language === 'ne' ? 'अभिलेखमा सहयोग | सदन राई' : 'Support the Archive | SADAN RAI';
    } else if (currentRoute === '/saved') {
      title = language === 'ne' ? 'सुरक्षित अभिलेख | सदन राई' : 'Saved Archive | SADAN RAI';
    } else if (currentRoute === '/archive') {
      title = language === 'ne' ? 'थप अभिलेख | सदन राई' : 'Additional Archive | SADAN RAI';
    } else if (currentRoute === '/research-integrity') {
      title = language === 'ne' ? 'अनुसन्धान निष्पक्षता | सदन राई' : 'Research Integrity | SADAN RAI';
    } else if (currentRoute === '/accuracy') {
      title = language === 'ne' ? 'तथ्य शुद्धताको नियम | सदन राई' : 'Accuracy & Evidence Standards | SADAN RAI';
    } else if (currentRoute === '/submit') {
      title = language === 'ne' ? 'इतिहास तथा अनुसन्धान पठाउनुहोस् | सदन राई' : 'Submit History & Research | SADAN RAI';
    } else if (currentRoute === ADMIN_BASE_ROUTE + '/community') {
      title = language === 'ne' ? 'समुदाय तथा आम्दानी कन्सोल | सदन राई' : 'Community & Earnings Console | SADAN RAI';
    } else if (currentRoute === ADMIN_LOGIN_ROUTE || currentRoute === ADMIN_ALIAS_ROUTE || currentRoute === ADMIN_ALIAS_LOGIN_ROUTE) {
      title = language === 'ne' ? 'प्रशासक लगइन | सदन राई' : 'Administrator Login | SADAN RAI';
    } else if (currentRoute === ADMIN_BASE_ROUTE) {
      title = language === 'ne' ? 'सम्पादकीय कन्सोल | सदन राई' : 'Editorial Console | SADAN RAI';
    }

    document.title = title;
  }, [currentRoute, getArticleBySlug, language]);

  // Route Dispatcher
  const renderCurrentView = () => {
    // Article Detail Router: /article/:slug
    if (currentRoute.startsWith('/article/')) {
      const slug = currentRoute.replace('/article/', '');
      return <ArticleDetailView slug={slug} />;
    }

    // Direct section routers
    switch (currentRoute) {
      case '/':
        return <HomeView />;
      case '/history':
        return <HistoryView />;
      case '/history/kirat':
        return <KiratHistoryView />;
      case '/history/buddhist':
      case '/history/hindu':
      case '/history/limbu':
      case '/history/rai':
      case '/history/tamang':
      case '/history/kiranti':
      case '/history/archaeology':
      case '/history/ancient-medieval':
      case '/history/comparative-world':
      case '/history/other':
        return <HistoryCollectionView slug={currentRoute.replace('/history/', '')} />;
      case '/culture':
        return <CultureView />;
      case '/civilization':
        return <CivilizationView />;
      case '/village':
      case '/village/malbase-patlepani':
        return <VillageView />;
      case '/oral-history':
        return <OralHistoryView />;
      case '/research':
        return <ResearchView />;
      case '/original-research':
        return <OriginalResearchView />;
      case '/articles':
        return <ArticlesView />;
      case '/photos':
        return <PhotoArchiveView />;
      case '/patan-museum-evidence':
        return <PatanMuseumEvidenceView />;
      case '/media':
        return <MusicVideoView />;
      case '/sources':
        return <SourcesView />;
      case '/about':
        return <AboutView />;
      case '/contact':
        return <ContactView />;
      case '/support':
        return <SupportView />;
      case '/submit':
        return <SubmitArchiveView />;
      case '/saved':
        return <SavedView />;
      case '/archive':
        return <AdditionalArchiveView />;
      case '/research-integrity':
        return <ArchiveStandardsView kind="integrity" />;
      case '/accuracy':
        return <ArchiveStandardsView kind="accuracy" />;
      case ADMIN_LOGIN_ROUTE:
      case ADMIN_ALIAS_ROUTE:
      case ADMIN_ALIAS_LOGIN_ROUTE:
        return <AdminLoginView />;
      case ADMIN_BASE_ROUTE:
        return <AdminPortalView />;
      case ADMIN_BASE_ROUTE + '/community':
        return <CommunityAdminView />;
      default:
        return <HomeView />;
    }
  };

  const adminSurface = isAdminRoute(currentRoute);

  return (
    <>
      <PublicContentProtection />
      {adminSurface ? (
        <main className="min-h-screen bg-[#FBF9F5] text-[#1C1917]">
          {renderCurrentView()}
        </main>
      ) : (
        <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917] selection:bg-[#EBE3D5] selection:text-[#78350F]">
          <Header />
          <main className="flex-1">{renderCurrentView()}</main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <ArchiveProvider>
      <ArchiveApp />
    </ArchiveProvider>
  );
}
