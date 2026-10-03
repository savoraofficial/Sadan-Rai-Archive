import React, { useState, useEffect } from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { 
  ResearchRecordItem, 
  AuthorPerspectiveItem, 
  EvidenceRecordItem, 
  OralHistoryRecordItem,
  Source, 
  Article, 
  PhotoItem, 
  MediaItem,
  WorkflowStatus,
  ResearchStatus 
} from '../../types';
import { 
  BRAND_INFO, 
  RESEARCH_CATEGORIES, 
  RESEARCH_STATUS_LABELS, 
  WORKFLOW_STATUS_LABELS, 
  RIGHTS_STATUS_LABELS 
} from '../../data/archiveData';
import { 
  fetchResearchRecords, 
  saveResearchRecord,
  deleteResearchRecord,
  fetchAuthorsPerspectives,
  fetchEvidenceRecords,
  fetchOralHistoryRecords,
  deleteOralHistoryRecord,
  isUserAdmin
} from '../../services/dbService';
import { auth, storage } from '../../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { adminText } from '../../data/adminTranslations';
import { PREPARED_PUBLISHED_RESEARCH } from '../../data/preparedPublishedResearch';
import { ADMIN_RESEARCH_LIBRARY_DOCUMENTS } from '../../data/adminResearchLibrary';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { useBilingualAutoTranslate } from '../../hooks/useBilingualAutoTranslate';
import { useAdminTypingFocusGuard } from '../../hooks/useAdminTypingFocusGuard';

import { AdminResearchForm } from '../admin/AdminResearchForm';
import { AdminAuthorForm } from '../admin/AdminAuthorForm';
import { AdminEvidenceForm } from '../admin/AdminEvidenceForm';
import { AdminOralHistoryForm } from '../admin/AdminOralHistoryForm';
import { AdminSourceForm } from '../admin/AdminSourceForm';
import { AdminRevisionHistoryView } from '../admin/AdminRevisionHistoryView';
import { AdminLoginView } from './AdminLoginView';

import { 
  ShieldCheck, 
  ShieldAlert,
  PlusCircle, 
  Database, 
  Users, 
  BookOpen, 
  FileText, 
  Camera, 
  Video, 
  Layers, 
  Languages, 
  FileEdit, 
  Globe, 
  History, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter,
  Lock,
  LogIn,
  LogOut,
  UserCheck,
  Eye,
  ArrowLeft,
  LayoutDashboard,
  FolderOpen
} from 'lucide-react';

type AdminTab = 
  | 'research'
  | 'library'
  | 'sources'
  | 'authors'
  | 'evidence'
  | 'oral_history'
  | 'articles'
  | 'photos'
  | 'videos'
  | 'categories'
  | 'translations'
  | 'drafts'
  | 'published'
  | 'revisions';

type ActiveForm = 
  | null 
  | 'research' 
  | 'source' 
  | 'author' 
  | 'evidence' 
  | 'oral_history' 
  | 'photo' 
  | 'video' 
  | 'article';

export const AdminPortalView: React.FC = () => {
  const { 
    language,
    setLanguage,
    sources, 
    articles, 
    photos, 
    media, 
    addArticle, 
    deleteArticle, 
    addPhoto, 
    deleteSource,
    addMedia, 
    navigateTo 
  } = useArchive();

  // Dedicated admin language control: keep the console language state, local preference,
  // and document language synchronized from the button itself. This is intentionally
  // separate from the public header so the editorial console is always self-contained.
  const changeAdminLanguage = (nextLanguage: 'ne' | 'en') => {
    setLanguage(nextLanguage);
    try {
      window.localStorage.setItem('sadan_rai_language', nextLanguage);
      document.documentElement.lang = nextLanguage;
      document.documentElement.dir = 'ltr';
    } catch {
      // Storage/document sync is best-effort; React state remains authoritative.
    }
  };

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);

  // CMS Navigation Tabs
  const [activeTab, setActiveTab] = useState<AdminTab>('research');
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [editingResearchItem, setEditingResearchItem] = useState<ResearchRecordItem | null>(null);
  const [readingResearchItem, setReadingResearchItem] = useState<ResearchRecordItem | null>(null);
  const [libraryQuery, setLibraryQuery] = useState('');
  const [selectedLibraryPath, setSelectedLibraryPath] = useState<string>(ADMIN_RESEARCH_LIBRARY_DOCUMENTS[0]?.path || '');
  const [editingAuthorItem, setEditingAuthorItem] = useState<AuthorPerspectiveItem | null>(null);
  const [editingEvidenceItem, setEditingEvidenceItem] = useState<EvidenceRecordItem | null>(null);
  const [editingOralHistoryItem, setEditingOralHistoryItem] = useState<OralHistoryRecordItem | null>(null);
  const [oralHistoryList, setOralHistoryList] = useState<OralHistoryRecordItem[]>([]);

  // Live Records State
  const [researchList, setResearchList] = useState<ResearchRecordItem[]>([]);
  const [authorsList, setAuthorsList] = useState<AuthorPerspectiveItem[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecordItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [publishingPreparedResearch, setPublishingPreparedResearch] = useState(false);

  // New Article inline fields
  const [newArtTitle, setNewArtTitle] = useState('');
  const [newArtNepaliTitle, setNewArtNepaliTitle] = useState('');
  const [newArtContent, setNewArtContent] = useState('');
  const [newArtCategory, setNewArtCategory] = useState<any>('history_civilization');
  const [newArtCustomCategory, setNewArtCustomCategory] = useState('');
  const [showNewArtCustomCategory, setShowNewArtCustomCategory] = useState(false);

  // New Photo inline fields
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoNepaliTitle, setNewPhotoNepaliTitle] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState('');
  const [newPhotoLocation, setNewPhotoLocation] = useState('');
  const [newPhotoDate, setNewPhotoDate] = useState('');
  const [newPhotoPhotographer, setNewPhotoPhotographer] = useState('');
  const [newPhotoSource, setNewPhotoSource] = useState('');
  const [newPhotoEvidence, setNewPhotoEvidence] = useState('');
  const [newPhotoRights, setNewPhotoRights] = useState('');

  // New Video inline fields
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoNepaliTitle, setNewVideoNepaliTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [newVideoDuration, setNewVideoDuration] = useState('');
  const [newVideoLocation, setNewVideoLocation] = useState('');
  const [newVideoDate, setNewVideoDate] = useState('');
  const [newVideoCreator, setNewVideoCreator] = useState('');
  const [newVideoSource, setNewVideoSource] = useState('');
  const [newVideoEvidence, setNewVideoEvidence] = useState('');
  const [newVideoRights, setNewVideoRights] = useState('');

  // Track Firebase auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      if (!user || user.email?.toLowerCase() !== BRAND_INFO.contactEmail.toLowerCase()) window.location.hash = '/sadan-rai-editorial-login';
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = currentUser?.email?.toLowerCase() === BRAND_INFO.contactEmail.toLowerCase();
  useAdminTypingFocusGuard(isAdmin);

  const articleBilingual = useBilingualAutoTranslate(
    { title: newArtTitle, nepaliTitle: newArtNepaliTitle },
    updater => {
      const next = typeof updater === 'function' ? updater({ title: newArtTitle, nepaliTitle: newArtNepaliTitle }) : updater;
      setNewArtTitle(next.title || '');
      setNewArtNepaliTitle(next.nepaliTitle || '');
    },
    'title', 'nepaliTitle'
  );
  const photoBilingual = useBilingualAutoTranslate(
    { title: newPhotoTitle, nepaliTitle: newPhotoNepaliTitle },
    updater => {
      const next = typeof updater === 'function' ? updater({ title: newPhotoTitle, nepaliTitle: newPhotoNepaliTitle }) : updater;
      setNewPhotoTitle(next.title || '');
      setNewPhotoNepaliTitle(next.nepaliTitle || '');
    },
    'title', 'nepaliTitle'
  );
  const videoBilingual = useBilingualAutoTranslate(
    { title: newVideoTitle, nepaliTitle: newVideoNepaliTitle },
    updater => {
      const next = typeof updater === 'function' ? updater({ title: newVideoTitle, nepaliTitle: newVideoNepaliTitle }) : updater;
      setNewVideoTitle(next.title || '');
      setNewVideoNepaliTitle(next.nepaliTitle || '');
    },
    'title', 'nepaliTitle'
  );

  // Reload records only after the authorized owner is authenticated.
  const reloadData = async () => {
    const oral = await fetchOralHistoryRecords(true);
    setOralHistoryList(oral);
    setLoading(true);
    try {
      const [resData, authData, eviData] = await Promise.all([
        fetchResearchRecords(true),
        fetchAuthorsPerspectives(true),
        fetchEvidenceRecords(true)
      ]);
      // Admin reader always exposes the prepared research register, while Firebase
      // remains authoritative for records that have already been imported/published.
      // This lets the owner read the complete prepared register before/while importing it.
      const byId = new Map<string, ResearchRecordItem>();
      PREPARED_PUBLISHED_RESEARCH.forEach(record => byId.set(record.id, record));
      resData.forEach(record => byId.set(record.id, record));
      setResearchList(Array.from(byId.values()));
      setAuthorsList(authData);
      setEvidenceList(eviData);
    } catch (e) {
      console.warn('Error loading admin records:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setResearchList([]);
      setAuthorsList([]);
      setEvidenceList([]);
      setLoading(false);
      return;
    }
    void reloadData();
  }, [isAdmin]);

  if (currentUser === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-5 text-sm text-stone-600 shadow-lg">
          {language === 'ne' ? 'प्रमाणीकरण जाँच हुँदैछ…' : 'Checking authentication…'}
        </div>
      </div>
    );
  }

  // Hard security boundary: unauthenticated visitors must never receive the admin UI.
  // The route itself remains available so the dedicated login screen can handle authentication.
  if (!isAdmin) {
    return <AdminLoginView />;
  }

  const handleSignOut = async () => {
    await signOut(auth);
    setFeedbackMsg(adminText(language, 'सत्र समाप्त भयो।'));
    setTimeout(() => setFeedbackMsg(null), 2000);
  };

  const handleDeleteResearch = async (id: string) => {
    if (!window.confirm(adminText(language, 'के तपाईं यो अनुसन्धान प्रविष्टि हटाउन निश्चित हुनुहुन्छ?'))) return;
    await deleteResearchRecord(id);
    setFeedbackMsg(adminText(language, 'अनुसन्धान हटाइयो!'));
    reloadData();
    setTimeout(() => setFeedbackMsg(null), 1500);
  };

  const handleCreateArticleQuick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtTitle.trim() || !newArtContent.trim()) return;
    if (showNewArtCustomCategory && !newArtCustomCategory.trim()) return;

    const newArt: Article = {
      id: `art-${Date.now()}`,
      slug: `article-${Date.now()}`,
      title: newArtTitle,
      nepaliTitle: newArtNepaliTitle || newArtTitle,
      category: showNewArtCustomCategory ? newArtCustomCategory.trim() : newArtCategory,
      researchStatus: 'verified',
      excerpt: newArtContent.slice(0, 140) + '...',
      content: newArtContent,
      author: 'सदन राई (Sadan Rai)',
      publicationDate: new Date().toISOString().slice(0, 10),
      location: 'माल्बासे–१, पात्लेपानी',
      sourceIds: [],
      relatedSlugs: [],
      published: true
    };
    try {
      await addArticle(newArt);
    } catch (error) {
      setFeedbackMsg(adminText(language, 'लेख सुरक्षित गर्न असफल भयो। Firebase/प्रशासक प्रमाणीकरण जाँच गर्नुहोस्।'));
      return;
    }
    setNewArtTitle('');
    setNewArtNepaliTitle('');
    setNewArtCustomCategory(''); setShowNewArtCustomCategory(false); setNewArtCategory('history_civilization');
    setNewArtContent('');
    setActiveForm(null);
    setFeedbackMsg(adminText(language, 'लेख सुरक्षित गरियो!'));
    setTimeout(() => setFeedbackMsg(null), 1500);
  };

  const handleCreatePhotoQuick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoFile && !editingPhotoId) return;
    let uploadedPhotoUrl = newPhotoUrl;
    if (newPhotoFile) { const uploaded = await uploadBytes(storageRef(storage, `archive/photos/${Date.now()}-${newPhotoFile.name}`), newPhotoFile); uploadedPhotoUrl = await getDownloadURL(uploaded.ref); }
    if (!newPhotoTitle.trim() || !uploadedPhotoUrl || !newPhotoLocation.trim() || !newPhotoPhotographer.trim() || !newPhotoEvidence.trim() || !newPhotoRights.trim()) return;

    const item: PhotoItem = {
      id: editingPhotoId || `pho-${Date.now()}`,
      title: newPhotoTitle,
      nepaliTitle: newPhotoNepaliTitle || newPhotoTitle,
      category: 'village',
      caption: newPhotoTitle,
      photographer: newPhotoPhotographer,
      rightsHolder: newPhotoRights,
      license: 'All Rights Reserved / Rights to be verified',
      imageUrl: uploadedPhotoUrl,
      tags: ['archival'],
      recordId: `PHOTO-${Date.now()}`,
      location: newPhotoLocation || adminText(language, 'पुष्टि हुन बाँकी'),
      dateKnown: newPhotoDate || adminText(language, 'पुष्टि हुन बाँकी'),
      source: newPhotoSource,
      evidence: newPhotoEvidence,
      permission: newPhotoRights
    };
    try {
      await addPhoto(item);
    } catch (error) {
      setFeedbackMsg(adminText(language, 'फोटो दर्ता गर्न असफल भयो।'));
      return;
    }
    setNewPhotoTitle('');
    setNewPhotoNepaliTitle('');
    setEditingPhotoId(null);
    setNewPhotoFile(null); setNewPhotoPreview(''); setNewPhotoUrl('');
    setNewPhotoUrl('');
    setNewPhotoLocation('');
    setNewPhotoDate('');
    setNewPhotoPhotographer('');
    setNewPhotoSource('');
    setNewPhotoEvidence('');
    setNewPhotoRights('');
    setActiveForm(null);
    setFeedbackMsg(adminText(language, 'फोटो दर्ता गरियो!'));
    setTimeout(() => setFeedbackMsg(null), 1500);
  };

  const handleCreateVideoQuick = async (e: React.FormEvent) => {
    e.preventDefault();
    const durationMatch = newVideoDuration.trim().match(/^(\d+):(\d{2})$/);
    const durationSeconds = durationMatch ? Number(durationMatch[1]) * 60 + Number(durationMatch[2]) : Number(newVideoDuration);
    if (!Number.isFinite(durationSeconds) || durationSeconds < 15 || durationSeconds > 300) { alert(adminText(language,'भिडियो अवधि 15 सेकेन्डदेखि 5 मिनेटभित्र हुनुपर्छ।')); return; }
    if (!newVideoFile && !editingMediaId) return;
    let uploadedVideoUrl = newVideoUrl;
    if (newVideoFile) { const uploaded = await uploadBytes(storageRef(storage, `archive/videos/${Date.now()}-${newVideoFile.name}`), newVideoFile); uploadedVideoUrl = await getDownloadURL(uploaded.ref); }
    if (!newVideoTitle.trim() || !uploadedVideoUrl || !newVideoCreator.trim() || !newVideoEvidence.trim() || !newVideoRights.trim()) return;

    const item: MediaItem = {
      id: editingMediaId || `med-${Date.now()}`,
      title: newVideoTitle,
      nepaliTitle: newVideoNepaliTitle || newVideoTitle,
      type: 'video',
      category: 'cultural_recording',
      duration: newVideoDuration || '3:45',
      year: '2024',
      description: newVideoTitle,
      credits: newVideoCreator,
      rightsInfo: newVideoRights,
      mediaUrl: uploadedVideoUrl,
      recordId: `VIDEO-${Date.now()}`,
      location: newVideoLocation,
      recordingDate: newVideoDate,
      source: newVideoSource,
      evidence: newVideoEvidence,
      permission: newVideoRights
    };
    try {
      await addMedia(item);
    } catch (error) {
      setFeedbackMsg(adminText(language, 'मिडिया दर्ता गर्न असफल भयो।'));
      return;
    }
    setNewVideoTitle('');
    setNewVideoNepaliTitle('');
    setEditingMediaId(null);
    setNewVideoFile(null); setNewVideoUrl('');
    setNewVideoUrl('');
    setNewVideoLocation('');
    setNewVideoDate('');
    setNewVideoCreator('');
    setNewVideoSource('');
    setNewVideoEvidence('');
    setNewVideoRights('');
    setActiveForm(null);
    setFeedbackMsg(adminText(language, 'भिडियो/अडियो दर्ता गरियो!'));
    setTimeout(() => setFeedbackMsg(null), 1500);
  };

  return (
    <div className="archive-admin-shell max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* 1. Header & Security Banner */}
      <div className="archive-admin-hero bg-stone-900 text-white p-6 sm:p-8 rounded-lg border border-stone-800 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'ne' ? 'स्थायी अनुसन्धान कन्टेन्ट म्यानेजमेन्ट सिस्टम' : 'Permanent Research Content Management System'}</span>
            </div>
            <h1 className="font-serif-np text-2xl sm:text-3xl font-bold">
              {language === 'ne' ? 'सदन राई: अनुसन्धान तथा अभिलेख कन्सोल' : 'Sadan Rai: Research & Archive Console'}
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm font-sans max-w-2xl leading-relaxed">
              {adminText(language, 'यहाँबाट नयाँ अनुसन्धान, लेखक दृष्टिकोण ("ऐतिहासिक ग्रन्थ तथा विद्वत् दृष्टिकोण"), प्रमाण, मौखिक इतिहास तथा स्रोतहरू फाराममार्फत प्रत्यक्ष सुरक्षित, परिमार्जन र प्रकाशन गर्न सकिन्छ।')}
            </p>
          </div>

          {/* Authentication Badge & Session Control */}
          <div className="flex flex-col sm:items-end gap-2 text-xs">
            {isAdmin ? (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <div className="flex items-center gap-2 p-2 bg-stone-800 rounded border border-stone-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-stone-200">
                  {adminText(language, 'प्रमाणित प्रशासक:')} {currentUser?.email || BRAND_INFO.contactEmail}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-2.5 py-1 bg-stone-700 hover:bg-stone-600 rounded text-stone-300 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{adminText(language, 'लगआउट' )}</span>
                </button>
                </div>
                <div className="admin-language-switcher relative z-50 inline-flex items-center gap-0.5 rounded-xl border border-white/15 bg-white/5 p-1 shadow-inner" role="group" aria-label={language === 'ne' ? 'भाषा चयन' : 'Language selection'}>
                  <Globe className="mx-1.5 h-4 w-4 text-stone-300" aria-hidden="true" />
                  <button type="button" onClick={() => changeAdminLanguage('ne')} onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); changeAdminLanguage('ne'); } }} aria-pressed={language === 'ne'} className={`admin-language-button rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${language === 'ne' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-300 hover:bg-white/10'}`}>नेपाली</button>
                  <button type="button" onClick={() => changeAdminLanguage('en')} onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); changeAdminLanguage('en'); } }} aria-pressed={language === 'en'} className={`admin-language-button rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${language === 'en' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-300 hover:bg-white/10'}`}>English</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo('/sadan-rai-editorial-login')}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded font-medium flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{adminText(language, 'प्रशासक लगइन (Admin Access)' )}</span>
                </button>
              </div>
            )}
            <span className="text-[11px] text-stone-400 font-mono">
              {language === 'ne' ? 'डाटाबेस: Firebase Firestore · मालिकका लागि मात्र लेख्ने अधिकार' : 'Database: Firebase Firestore · Owner-only writes'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button type="button" onClick={() => navigateTo('/')} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15 hover:border-amber-400/60 transition-colors" title={language === 'ne' ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Return to Home'}>
            <ArrowLeft className="w-3.5 h-3.5" />
            {language === 'ne' ? 'गृहपृष्ठ / सार्वजनिक अभिलेख' : 'Home / Public Archive'}
          </button>
          <button type="button" onClick={() => setActiveTab('research')} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600 transition-colors">
            <LayoutDashboard className="w-3.5 h-3.5" />
            {language === 'ne' ? 'अनुसन्धान कार्यक्षेत्र' : 'Research Workspace'}
          </button>
        </div>

        {feedbackMsg && (
          <div className="p-3 bg-amber-900/60 border border-amber-600/80 rounded text-xs text-amber-200 font-serif-np animate-fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* 2. Main Action Buttons Bar (Requested 8 Buttons) */}
      <div className="archive-admin-quick space-y-2">
        <span className="text-xs uppercase tracking-widest text-stone-500 font-mono">
          {language === 'ne' ? 'द्रुत प्रविष्टि कार्यहरू' : 'Quick Action Buttons'}
        </span>
        <div className="archive-admin-quick-grid grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          
          <button
            onClick={() => { setEditingResearchItem(null); setActiveForm('research'); }}
            className="p-2.5 bg-amber-800 hover:bg-amber-700 text-white rounded text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{adminText(language, '+ नयाँ अनुसन्धान' )}</span>
          </button>

          <button
            onClick={() => setActiveForm('source')}
            className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{adminText(language, '+ नयाँ स्रोत' )}</span>
          </button>

          <button
            onClick={() => { setEditingAuthorItem(null); setActiveForm('author'); }}
            className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <Users className="w-4 h-4 text-sky-400" />
            <span>{adminText(language, '+ नयाँ लेखक' )}</span>
          </button>

          <button
            onClick={() => { setEditingEvidenceItem(null); setActiveForm('evidence'); }}
            className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>{adminText(language, '+ नयाँ प्रमाण' )}</span>
          </button>

          <button
            onClick={() => { setEditingOralHistoryItem(null); setActiveForm('oral_history'); }}
            className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>{adminText(language, '+ नयाँ मौखिक इतिहास' )}</span>
          </button>

          <button
            onClick={() => { setEditingPhotoId(null); setActiveForm('photo'); }}
            className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <Camera className="w-4 h-4 text-stone-300" />
            <span>{adminText(language, '+ नयाँ फोटो' )}</span>
          </button>

          <button
            onClick={() => { setEditingMediaId(null); setActiveForm('video'); }}
            className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <Video className="w-4 h-4 text-stone-300" />
            <span>{adminText(language, '+ नयाँ भिडियो' )}</span>
          </button>

          <button
            onClick={() => setActiveForm('article')}
            className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <FileEdit className="w-4 h-4 text-stone-300" />
            <span>{adminText(language, '+ नयाँ लेख' )}</span>
          </button>

        </div>
      </div>

      {/* 2B. Archive overview: additive dashboard intelligence; no existing controls removed. */}
      <section className="archive-admin-overview" aria-label={language === 'ne' ? 'अभिलेख अवलोकन' : 'Archive overview'}>
        <div className="archive-admin-overview-head">
          <div>
            <p className="archive-admin-kicker">{language === 'ne' ? 'अभिलेख अवस्था' : 'Archive status'}</p>
            <h2>{language === 'ne' ? 'एक नजरमा अभिलेख' : 'Archive at a glance'}</h2>
          </div>
          <span className="archive-admin-live"><span />{language === 'ne' ? 'मालिक सत्र सक्रिय' : 'Owner session active'}</span>
        </div>
        <div className="archive-admin-stat-grid">
          <button type="button" onClick={() => setActiveTab('research')} className="archive-admin-stat">
            <span className="archive-admin-stat-icon"><BookOpen className="w-4 h-4" /></span>
            <span><strong>{researchList.length}</strong><small>{language === 'ne' ? 'अनुसन्धान' : 'Research'}</small></span>
          </button>
          <button type="button" onClick={() => setActiveTab('sources')} className="archive-admin-stat">
            <span className="archive-admin-stat-icon"><BookOpen className="w-4 h-4" /></span>
            <span><strong>{sources.length}</strong><small>{language === 'ne' ? 'स्रोत' : 'Sources'}</small></span>
          </button>
          <button type="button" onClick={() => setActiveTab('evidence')} className="archive-admin-stat">
            <span className="archive-admin-stat-icon"><Database className="w-4 h-4" /></span>
            <span><strong>{evidenceList.length}</strong><small>{language === 'ne' ? 'प्रमाण' : 'Evidence'}</small></span>
          </button>
          <button type="button" onClick={() => setActiveTab('oral_history')} className="archive-admin-stat">
            <span className="archive-admin-stat-icon"><FileText className="w-4 h-4" /></span>
            <span><strong>{researchList.filter(r => r.category === 'oral_history' || r.researchStatus === 'oral_history').length}</strong><small>{language === 'ne' ? 'मौखिक इतिहास' : 'Oral History'}</small></span>
          </button>
          <button type="button" onClick={() => setActiveTab('articles')} className="archive-admin-stat">
            <span className="archive-admin-stat-icon"><FileEdit className="w-4 h-4" /></span>
            <span><strong>{articles.length}</strong><small>{language === 'ne' ? 'लेख' : 'Articles'}</small></span>
          </button>
          <button type="button" onClick={() => setActiveTab('photos')} className="archive-admin-stat">
            <span className="archive-admin-stat-icon"><Camera className="w-4 h-4" /></span>
            <span><strong>{photos.length}</strong><small>{language === 'ne' ? 'तस्बिर' : 'Photos'}</small></span>
          </button>
          <button type="button" onClick={() => setActiveTab('videos')} className="archive-admin-stat">
            <span className="archive-admin-stat-icon"><Video className="w-4 h-4" /></span>
            <span><strong>{media.length}</strong><small>{language === 'ne' ? 'भिडियो' : 'Videos'}</small></span>
          </button>
          <button type="button" onClick={() => setActiveTab('categories')} className="archive-admin-stat">
            <span className="archive-admin-stat-icon"><FolderOpen className="w-4 h-4" /></span>
            <span><strong>{RESEARCH_CATEGORIES.length}</strong><small>{language === 'ne' ? 'वर्ग' : 'Categories'}</small></span>
          </button>
        </div>
      </section>

      {/* 3. Modal / Active Form Render Area */}
      {activeForm === 'research' && (
        <AdminResearchForm
          initialRecord={editingResearchItem}
          onSuccess={() => {
            setActiveForm(null);
            setEditingResearchItem(null);
            reloadData();
            setFeedbackMsg(adminText(language, 'अनुसन्धान अभिलेख सफलतापूर्वक सुरक्षित भयो!'));
            setTimeout(() => setFeedbackMsg(null), 2500);
          }}
          onCancel={() => {
            setActiveForm(null);
            setEditingResearchItem(null);
          }}
        />
      )}

      {activeForm === 'author' && (
        <AdminAuthorForm
          initialItem={editingAuthorItem}
          onSuccess={() => {
            setActiveForm(null);
            setEditingAuthorItem(null);
            reloadData();
            setFeedbackMsg(adminText(language, 'लेखक दृष्टिकोण सफलतापूर्वक सुरक्षित भयो!'));
            setTimeout(() => setFeedbackMsg(null), 2500);
          }}
          onCancel={() => {
            setActiveForm(null);
            setEditingAuthorItem(null);
          }}
        />
      )}

      {activeForm === 'evidence' && (
        <AdminEvidenceForm
          initialItem={editingEvidenceItem}
          onSuccess={() => {
            setActiveForm(null);
            setEditingEvidenceItem(null);
            reloadData();
            setFeedbackMsg(adminText(language, 'प्रमाण अभिलेख सुरक्षित भयो!'));
            setTimeout(() => setFeedbackMsg(null), 2500);
          }}
          onCancel={() => {
            setActiveForm(null);
            setEditingEvidenceItem(null);
          }}
        />
      )}

      {activeForm === 'source' && (
        <AdminSourceForm
          onSuccess={() => {
            setActiveForm(null);
            setFeedbackMsg(adminText(language, 'सन्दर्भ स्रोत दर्ता भयो!'));
            setTimeout(() => setFeedbackMsg(null), 2500);
          }}
          onCancel={() => setActiveForm(null)}
        />
      )}

      {activeForm === 'oral_history' && (
        <AdminOralHistoryForm
          initialItem={editingOralHistoryItem}
          onSuccess={() => {
            setActiveForm(null);
            setEditingOralHistoryItem(null);
            reloadData();
            setFeedbackMsg(adminText(language, 'मौखिक इतिहास सफलतापूर्वक सुरक्षित भयो!'));
            setTimeout(() => setFeedbackMsg(null), 2500);
          }}
          onCancel={() => { setActiveForm(null); setEditingOralHistoryItem(null); }}
        />
      )}

      {activeForm === 'article' && (
        <form onSubmit={handleCreateArticleQuick} className="p-6 bg-white rounded-lg border border-stone-300 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-serif-np font-bold text-lg">{adminText(language, 'नयाँ अनुसन्धान लेख थप्नुहोस्' )}</h3>
            <button type="button" onClick={() => setActiveForm(null)} className="text-stone-400">✕</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block mb-1 font-semibold">{adminText(language, 'लेखको शीर्षक *' )}</label>
              <input
                type="text"
                required
                value={newArtTitle}
                onChange={e => articleBilingual.setPrimary(e.target.value)}
                placeholder={adminText(language, 'English title...')}
                className="w-full p-2 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">{adminText(language, 'नेपाली शीर्षक (Auto / Editable)' )}</label>
              <input type="text" value={newArtNepaliTitle} onChange={e => articleBilingual.setSecondary(e.target.value)} placeholder="नेपाली शीर्षक..." className="w-full p-2 border border-stone-300 rounded font-serif-np" />
            </div>
            <div>
              <label className="block mb-1 font-semibold">{adminText(language, 'वर्ग (Category)' )}</label>
              <select
                value={newArtCategory}
                onChange={e => setNewArtCategory(e.target.value)}
                className="w-full p-2 border border-stone-300 rounded"
              >
                {RESEARCH_CATEGORIES.map(category => (
                  <option key={category.key} value={category.key}>{language === 'ne' ? category.nepali : category.english}</option>
                ))}
                <option value="village">{adminText(language, 'मेरो गाउँ (माल्बासे)' )}</option>
                <option value="oral-history">{adminText(language, 'मौखिक इतिहास' )}</option>
                <option value="research">{adminText(language, 'अनुसन्धान' )}</option>
              </select>
              <button type="button" onClick={() => { setShowNewArtCustomCategory(true); setNewArtCustomCategory(''); }} className="mt-2 inline-flex items-center rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">{language === 'ne' ? '+ कस्टम' : '+ Custom'}</button>
              {showNewArtCustomCategory && <input autoFocus value={newArtCustomCategory} onChange={e=>setNewArtCustomCategory(e.target.value)} required className="mt-2 w-full rounded border border-amber-300 bg-amber-50/40 p-2" placeholder={adminText(language,'नयाँ Category नाम लेख्नुहोस्')} />}
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">{adminText(language, 'लेखको विषयवस्तु / सामग्री *' )}</label>
              <textarea
                rows={4}
                required
                value={newArtContent}
                onChange={e => setNewArtContent(e.target.value)}
                placeholder={adminText(language, 'लेखको विस्तृत व्यहोरा...')}
                className="w-full p-2 border border-stone-300 rounded font-serif-np"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-1.5 border rounded text-xs">{adminText(language, 'रद्द' )}</button>
            <button type="submit" className="px-4 py-1.5 bg-amber-800 text-white rounded text-xs">{adminText(language, 'सुरक्षित गर्नुहोस्' )}</button>
          </div>
        </form>
      )}

      {activeForm === 'photo' && (
        <form onSubmit={handleCreatePhotoQuick} className="p-6 bg-white rounded-lg border border-stone-300 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-serif-np font-bold text-lg">{adminText(language, 'नयाँ फोटो दर्ता गर्नुहोस्' )}</h3>
            <button type="button" onClick={() => setActiveForm(null)} className="text-stone-400">✕</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block mb-1 font-semibold">{adminText(language, 'फोटो शीर्षक *' )}</label>
              <input
                type="text"
                required
                value={newPhotoTitle}
                onChange={e => photoBilingual.setPrimary(e.target.value)}
                placeholder={adminText(language, 'English photo title...')}
                className="w-full p-2 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">{adminText(language, 'नेपाली शीर्षक (Auto / Editable)' )}</label>
              <input type="text" value={newPhotoNepaliTitle} onChange={e => photoBilingual.setSecondary(e.target.value)} placeholder="नेपाली फोटो शीर्षक..." className="w-full p-2 border border-stone-300 rounded font-serif-np" />
            </div>
            <div>
              <label className="block mb-1 font-semibold">{adminText(language, 'फोटो फाइल * (PNG/JPG/JPEG/WebP)' )}</label>
              <input type="file" accept="image/png,image/jpeg,image/webp" required={!editingPhotoId} onChange={e => { const f=e.target.files?.[0]||null; if(f && f.size>10*1024*1024){alert(adminText(language,'फोटो अधिकतम 10 MB हुनुपर्छ।')); return;} setNewPhotoFile(f); setNewPhotoUrl(''); if(f) setNewPhotoPreview(URL.createObjectURL(f)); }} className="w-full rounded-lg border border-stone-300 bg-white p-2 text-xs" />
              {newPhotoPreview && <img src={newPhotoPreview} alt="Preview" className="mt-2 h-20 w-28 rounded-lg border object-cover" />}
            </div>
            <div>
              <label className="block mb-1 font-semibold">{adminText(language, 'कहाँको? (स्थान) *' )}</label>
              <input type="text" required value={newPhotoLocation} onChange={e => setNewPhotoLocation(e.target.value)} placeholder={adminText(language, 'स्थान / गाउँ / स्थल')} className="w-full p-2 border border-stone-300 rounded" />
            </div>
            <div><label className="block mb-1 font-semibold">{adminText(language, 'कहिलेको?' )}</label><input type="text" value={newPhotoDate} onChange={e => setNewPhotoDate(e.target.value)} placeholder={adminText(language, 'मिति / कालखण्ड')} className="w-full p-2 border border-stone-300 rounded" /></div>
            <div><label className="block mb-1 font-semibold">{adminText(language, 'कसले खिचेको?' )}</label><input type="text" required value={newPhotoPhotographer} onChange={e => setNewPhotoPhotographer(e.target.value)} placeholder={adminText(language, 'फोटोग्राफर / सिर्जनाकर्ता')} className="w-full p-2 border border-stone-300 rounded" /></div>
            <div><label className="block mb-1 font-semibold">{adminText(language, 'स्रोत' )}</label><input type="text" value={newPhotoSource} onChange={e => setNewPhotoSource(e.target.value)} placeholder={adminText(language, 'स्रोत / प्राप्तकर्ता')} className="w-full p-2 border border-stone-300 rounded" /></div>
            <div><label className="block mb-1 font-semibold">{adminText(language, 'प्रमाण विवरण' )}</label><input type="text" required value={newPhotoEvidence} onChange={e => setNewPhotoEvidence(e.target.value)} placeholder={adminText(language, 'प्रमाण / सम्बन्धित दस्तावेज')} className="w-full p-2 border border-stone-300 rounded" /></div>
            <div><label className="block mb-1 font-semibold">{adminText(language, 'अधिकार / अनुमति' )}</label><input type="text" required value={newPhotoRights} onChange={e => setNewPhotoRights(e.target.value)} placeholder={adminText(language, 'Rights holder / permission')} className="w-full p-2 border border-stone-300 rounded" /></div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-1.5 border rounded text-xs">{adminText(language, 'रद्द' )}</button>
            <button type="submit" className="px-4 py-1.5 bg-amber-800 text-white rounded text-xs">{adminText(language, 'फोटो सुरक्षित गर्नुहोस्' )}</button>
          </div>
        </form>
      )}

      {activeForm === 'video' && (
        <form onSubmit={handleCreateVideoQuick} className="p-6 bg-white rounded-lg border border-stone-300 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-serif-np font-bold text-lg">{adminText(language, 'नयाँ भिडियो / अडियो दर्ता' )}</h3>
            <button type="button" onClick={() => setActiveForm(null)} className="text-stone-400">✕</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block mb-1 font-semibold">{adminText(language, 'शीर्षक *' )}</label>
              <input
                type="text"
                required
                value={newVideoTitle}
                onChange={e => videoBilingual.setPrimary(e.target.value)}
                placeholder={adminText(language, 'English video title...')}
                className="w-full p-2 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">{adminText(language, 'नेपाली शीर्षक (Auto / Editable)' )}</label>
              <input type="text" value={newVideoNepaliTitle} onChange={e => videoBilingual.setSecondary(e.target.value)} placeholder="नेपाली भिडियो शीर्षक..." className="w-full p-2 border border-stone-300 rounded font-serif-np" />
            </div>
            <div>
              <label className="block mb-1 font-semibold">{adminText(language, 'भिडियो फाइल * (MP4/WebM)' )}</label>
              <input type="file" accept="video/mp4,video/webm,video/quicktime" required={!editingMediaId} onChange={e => { const f=e.target.files?.[0]||null; if(f && f.size>100*1024*1024){alert(adminText(language,'भिडियो अधिकतम 100 MB हुनुपर्छ।')); return;} setNewVideoFile(f); setNewVideoUrl(''); }} className="w-full rounded-lg border border-stone-300 bg-white p-2 text-xs" />
            </div>
            <div><label className="block mb-1 font-semibold">{adminText(language, 'समयावधि 15 sec–5 min *' )}</label><input type="text" required value={newVideoDuration} onChange={e => setNewVideoDuration(e.target.value)} placeholder="04:15" className="w-full p-2 border border-stone-300 rounded" /></div>
            <div><label className="block mb-1 font-semibold">{adminText(language, 'कहाँको?' )}</label><input type="text" value={newVideoLocation} onChange={e => setNewVideoLocation(e.target.value)} placeholder={adminText(language, 'स्थान / गाउँ / स्थल')} className="w-full p-2 border border-stone-300 rounded" /></div>
            <div><label className="block mb-1 font-semibold">{adminText(language, 'कहिलेको?' )}</label><input type="text" value={newVideoDate} onChange={e => setNewVideoDate(e.target.value)} placeholder={adminText(language, 'Recording date / period')} className="w-full p-2 border border-stone-300 rounded" /></div>
            <div><label className="block mb-1 font-semibold">{adminText(language, 'कसले बनाएको?' )}</label><input type="text" required value={newVideoCreator} onChange={e => setNewVideoCreator(e.target.value)} placeholder={adminText(language, 'Creator / videographer')} className="w-full p-2 border border-stone-300 rounded" /></div>
            <div><label className="block mb-1 font-semibold">{adminText(language, 'स्रोत' )}</label><input type="text" value={newVideoSource} onChange={e => setNewVideoSource(e.target.value)} placeholder={adminText(language, 'Source / donor / archive')} className="w-full p-2 border border-stone-300 rounded" /></div>
            <div><label className="block mb-1 font-semibold">{adminText(language, 'प्रमाण विवरण' )}</label><input type="text" required value={newVideoEvidence} onChange={e => setNewVideoEvidence(e.target.value)} placeholder={adminText(language, 'Evidence / related document')} className="w-full p-2 border border-stone-300 rounded" /></div>
            <div><label className="block mb-1 font-semibold">{adminText(language, 'अधिकार / अनुमति' )}</label><input type="text" required value={newVideoRights} onChange={e => setNewVideoRights(e.target.value)} placeholder={adminText(language, 'Rights holder / permission')} className="w-full p-2 border border-stone-300 rounded" /></div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-1.5 border rounded text-xs">{adminText(language, 'रद्द' )}</button>
            <button type="submit" className="px-4 py-1.5 bg-amber-800 text-white rounded text-xs">{adminText(language, 'भिडियो सुरक्षित गर्नुहोस्' )}</button>
          </div>
        </form>
      )}

      {/* 4. International workspace navigation: grouped for faster daily work. */}
      <section className="archive-admin-workspace rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-amber-800 font-semibold">{language === 'ne' ? 'कार्य क्षेत्र' : 'Workspace'}</p>
            <h2 className="text-lg font-serif-np font-bold text-stone-900">{language === 'ne' ? 'अभिलेख व्यवस्थापन' : 'Archive workspace'}</h2>
          </div>
          <button type="button" onClick={() => setActiveForm('research')} className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-800"><PlusCircle className="w-3.5 h-3.5" /> {language === 'ne' ? 'नयाँ अनुसन्धान' : 'New Research'}</button>
        </div>
        <div className="archive-admin-workspace-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button type="button" onClick={() => setActiveTab('research')} className={`archive-admin-workspace-card text-left rounded-xl border p-4 transition-all ${activeTab === 'research' ? 'border-amber-700 bg-amber-50 shadow-sm' : 'border-stone-200 bg-stone-50 hover:border-amber-300'}`}>
            <div className="flex items-center gap-2 text-amber-900"><BookOpen className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'मुख्य' : 'Primary'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'अनुसन्धान अभिलेख' : 'Research Archive'}</div>
            <div className="mt-1 text-[11px] text-stone-500">{researchList.length} {language === 'ne' ? 'प्रविष्टि' : 'records'} · {language === 'ne' ? '+ नयाँ अनुसन्धान' : '+ New Research'}</div>
          </button>
          <button type="button" onClick={() => setActiveTab('library')} className={`archive-admin-workspace-card text-left rounded-xl border p-4 transition-all ${activeTab === 'library' ? 'border-amber-700 bg-amber-50 shadow-sm' : 'border-stone-200 bg-stone-50 hover:border-amber-300'}`}>
            <div className="flex items-center gap-2 text-emerald-900"><FolderOpen className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'पढाइ' : 'Reader'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'पूर्ण Research Library' : 'Full Research Library'}</div>
            <div className="mt-1 text-[11px] text-stone-500">{ADMIN_RESEARCH_LIBRARY_DOCUMENTS.length} {language === 'ne' ? 'फाइल पढ्न मिल्ने' : 'research files readable'}</div>
          </button>
          <button type="button" onClick={() => setActiveTab('sources')} className="archive-admin-workspace-card text-left rounded-xl border border-stone-200 bg-stone-50 p-4 hover:border-amber-300 transition-all">
            <div className="flex items-center gap-2 text-sky-800"><BookOpen className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'स्रोत' : 'Sources'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'स्रोत तथा विद्वत् सामग्री' : 'Sources & Scholarly Material'}</div>
            <div className="mt-1 text-[11px] text-stone-500">{language === 'ne' ? 'स्रोत · लेखक · विद्वत् दृष्टिकोण' : 'Sources · Authors · Scholarly views'}</div>
          </button>
          <button type="button" onClick={() => setActiveTab('evidence')} className="archive-admin-workspace-card text-left rounded-xl border border-stone-200 bg-stone-50 p-4 hover:border-amber-300 transition-all">
            <div className="flex items-center gap-2 text-emerald-800"><Database className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'प्रमाण' : 'Evidence'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'प्रमाण तथा मौखिक अभिलेख' : 'Evidence & Oral Archive'}</div>
            <div className="mt-1 text-[11px] text-stone-500">{language === 'ne' ? 'प्रमाण · मौखिक इतिहास' : 'Evidence · Oral history'}</div>
          </button>
          <button type="button" onClick={() => setActiveTab('categories')} className="archive-admin-workspace-card text-left rounded-xl border border-stone-200 bg-stone-50 p-4 hover:border-amber-300 transition-all">
            <div className="flex items-center gap-2 text-violet-800"><FolderOpen className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'व्यवस्थापन' : 'Management'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'मिडिया, लेख तथा व्यवस्थापन' : 'Media, Articles & Management'}</div>
            <div className="mt-1 text-[11px] text-stone-500">{language === 'ne' ? 'लेख · तस्बिर · भिडियो · वर्ग · अनुवाद' : 'Articles · Photos · Videos · Categories · Translations'}</div>
          </button>
        </div>
      </section>

      {/* 5. Dashboard Sections Navigation (all existing sections retained) */}
      <div className="archive-admin-sections border-b border-stone-200">
        <div className="flex items-center justify-between gap-3 py-2">
          <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-semibold">{language === 'ne' ? 'सबै अभिलेख खण्ड' : 'All archive sections'}</span>
          <span className="text-[10px] text-stone-400">{language === 'ne' ? 'सबै पुराना विकल्प यथावत् छन्' : 'All existing sections remain available'}</span>
        </div>
        <div className="archive-admin-tabs flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin text-xs font-medium">
          
          <button
            onClick={() => setActiveTab('research')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'research'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {adminText(language, 'अनुसन्धान (Research)')} ({researchList.length})
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'library'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {language === 'ne' ? 'पूर्ण Research Library' : 'Full Research Library'} ({ADMIN_RESEARCH_LIBRARY_DOCUMENTS.length})
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'sources'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {adminText(language, 'स्रोत (Sources)')} ({sources.length})
          </button>

          <button
            onClick={() => setActiveTab('authors')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'authors'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {adminText(language, 'ऐतिहासिक ग्रन्थ तथा विद्वत् दृष्टिकोण (Authors)')} ({authorsList.length})
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'evidence'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {adminText(language, 'प्रमाण (Evidence)')} ({evidenceList.length})
          </button>

          <button
            onClick={() => setActiveTab('oral_history')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'oral_history'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {adminText(language, 'मौखिक इतिहास (Oral History)')} ({researchList.filter(r => r.category === 'oral_history' || r.researchStatus === 'oral_history').length})
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'articles'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {adminText(language, 'लेखहरू (Articles)')} ({articles.length})
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'photos'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {adminText(language, 'तस्बिर (Photos)')} ({photos.length})
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'videos'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {adminText(language, 'भिडियो (Videos)')} ({media.length})
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'categories'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {adminText(language, 'वर्गहरू (Categories)')} ({RESEARCH_CATEGORIES.length})
          </button>

          <button
            onClick={() => setActiveTab('translations')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'translations'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {adminText(language, 'द्विभाषिक अनुवाद (Translations)')}
          </button>

          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'drafts'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {adminText(language, 'मस्यौदा (Drafts)')} ({researchList.filter(r => r.workflowStatus === 'draft').length})
          </button>

          <button
            onClick={() => setActiveTab('published')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'published'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {adminText(language, 'प्रकाशित (Published)')} ({researchList.filter(r => r.workflowStatus === 'published').length})
          </button>

          <button
            onClick={() => setActiveTab('revisions')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'revisions'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {adminText(language, 'संस्करण इतिहास (Revision History)')}
          </button>

        </div>
      </div>

      {/* 5. Main Content Dispatcher per Tab */}

      {/* TAB: FULL RESEARCH LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-emerald-900">
              <FolderOpen className="w-5 h-5" />
              <h3 className="font-serif-np text-xl font-bold">{language === 'ne' ? 'पूर्ण Research Library — Admin Reader' : 'Full Research Library — Admin Reader'}</h3>
            </div>
            <p className="mt-2 text-xs leading-6 text-stone-700">
              {language === 'ne'
                ? 'ZIP मा सुरक्षित गरिएको Research Library का पाठ्य अनुसन्धान अभिलेखहरू यहीँबाट पढ्न सकिन्छ। यो खण्ड प्रशासकका लागि मात्र हो। मूल file/folder structure हटाइएको छैन।'
                : 'Read the preserved Research Library text records directly from the Editorial Console. This reader is admin-only and does not replace or delete the original file/folder structure.'}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-4">
            <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
              <div className="p-3 border-b border-stone-200">
                <input
                  value={libraryQuery}
                  onChange={e => setLibraryQuery(e.target.value)}
                  placeholder={language === 'ne' ? 'Research file खोज्नुहोस्...' : 'Search research files...'}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs bg-stone-50"
                />
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-2 space-y-1">
                {ADMIN_RESEARCH_LIBRARY_DOCUMENTS
                  .filter(doc => {
                    const q = libraryQuery.trim().toLowerCase();
                    return !q || doc.title.toLowerCase().includes(q) || doc.path.toLowerCase().includes(q);
                  })
                  .map(doc => (
                    <button
                      key={doc.path}
                      type="button"
                      onClick={() => setSelectedLibraryPath(doc.path)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${selectedLibraryPath === doc.path ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'}`}
                    >
                      <span className="block font-semibold">{doc.title}</span>
                      <span className={`mt-1 block break-all text-[10px] ${selectedLibraryPath === doc.path ? 'text-stone-300' : 'text-stone-400'}`}>{doc.path}</span>
                    </button>
                  ))}
              </div>
            </div>
            <div className="min-w-0 rounded-xl border border-stone-200 bg-white">
              {(() => {
                const doc = ADMIN_RESEARCH_LIBRARY_DOCUMENTS.find(item => item.path === selectedLibraryPath) || ADMIN_RESEARCH_LIBRARY_DOCUMENTS[0];
                if (!doc) return <div className="p-8 text-sm text-stone-500">No research library documents.</div>;
                return (
                  <div>
                    <div className="border-b border-stone-200 p-4 sm:p-5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-800">{doc.type}</div>
                      <h4 className="mt-1 font-serif-np text-xl font-bold text-stone-900">{doc.title}</h4>
                      <p className="mt-1 break-all text-[11px] text-stone-500">{doc.path}</p>
                    </div>
                    <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap break-words p-4 sm:p-6 text-xs leading-6 text-stone-800 font-mono">{doc.content}</pre>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TAB: RESEARCH */}
      {activeTab === 'research' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {PREPARED_PUBLISHED_RESEARCH.length > 0 && (
              <button
                type="button"
                disabled={publishingPreparedResearch}
                onClick={async () => {
                  try {
                    setPublishingPreparedResearch(true);
                    setFeedbackMsg(null);
                    for (const record of PREPARED_PUBLISHED_RESEARCH) {
                      await saveResearchRecord(record, 'Initial publication of prepared cross-checked research register');
                    }
                    setFeedbackMsg(language === 'ne' ? `${PREPARED_PUBLISHED_RESEARCH.length} अनुसन्धान अभिलेख Firebase मा प्रकाशित गरियो।` : `${PREPARED_PUBLISHED_RESEARCH.length} prepared research records published to Firebase.`);
                    await reloadData();
                  } catch (error) {
                    console.error(error);
                    setFeedbackMsg(language === 'ne' ? 'प्रकाशन असफल भयो। कृपया प्रशासक प्रमाणीकरण जाँच गर्नुहोस्।' : 'Publication failed. Please check administrator authentication.');
                  } finally {
                    setPublishingPreparedResearch(false);
                  }
                }}
                className="px-3 py-2 rounded bg-emerald-800 text-white text-xs font-semibold disabled:opacity-50"
              >
                {publishingPreparedResearch
                  ? (language === 'ne' ? 'प्रकाशित हुँदैछ…' : 'Publishing…')
                  : (language === 'ne' ? `तयार अनुसन्धान Firebase मा प्रकाशित गर्नुहोस् (${PREPARED_PUBLISHED_RESEARCH.length})` : `Publish prepared research to Firebase (${PREPARED_PUBLISHED_RESEARCH.length})`)}
              </button>
            )}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={adminText(language, 'अनुसन्धान प्रविष्टि खोज्नुहोस्...')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded text-xs bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="p-2 border border-stone-300 rounded text-xs bg-white"
            >
              <option value="all">{adminText(language, 'सबै स्थिति (All Status)' )}</option>
              <option value="published">{adminText(language, 'प्रकाशित (Published)' )}</option>
              <option value="draft">{adminText(language, 'मस्यौदा (Draft)' )}</option>
              <option value="under_review">{adminText(language, 'पुनरावलोकनमा (Under Review)' )}</option>
            </select>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-stone-500 font-mono">{adminText(language, 'अभिलेख लोड हुँदैछ...' )}</div>
          ) : researchList.length > 0 ? (
            <div className="space-y-3">
              {researchList
                .filter(r => {
                  if (statusFilter !== 'all' && r.workflowStatus !== statusFilter) return false;
                  if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    return r.title.toLowerCase().includes(q) || r.nepaliTitle.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map(item => {
                  const statusDef = RESEARCH_STATUS_LABELS[item.researchStatus] || RESEARCH_STATUS_LABELS.further_research;
                  const workflowDef = WORKFLOW_STATUS_LABELS[item.workflowStatus] || WORKFLOW_STATUS_LABELS.draft;
                  const rightsDef = RIGHTS_STATUS_LABELS[item.rightsStatus] || RIGHTS_STATUS_LABELS.original_sadan_rai;

                  return (
                    <div
                      key={item.id}
                      className="p-5 bg-white rounded-lg border border-stone-200 hover:border-amber-700 transition-colors shadow-2xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                            {item.category}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusDef.color}`}>
                            {language === 'ne' ? statusDef.nepali : statusDef.english}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                            {language === 'ne' ? workflowDef.nepali : workflowDef.english}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-stone-400">v{item.version}</span>
                          <button
                            onClick={() => setReadingResearchItem(item)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 border border-emerald-200 rounded hover:bg-emerald-50 cursor-pointer"
                            title={adminText(language, 'पूरा अनुसन्धान पढ्नुहोस्')}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingResearchItem(item);
                              setActiveForm('research');
                            }}
                            className="p-1.5 text-stone-600 hover:text-stone-900 border rounded hover:bg-stone-50 cursor-pointer"
                            title={adminText(language, 'सम्पादन गर्नुहोस्')}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteResearch(item.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-900 border border-rose-200 rounded hover:bg-rose-50 cursor-pointer"
                            title={adminText(language, 'हटाउनुहोस्')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif-np text-lg font-bold text-stone-900">
                          {language === 'ne' ? (item.nepaliTitle || item.title) : (item.englishTitle || item.title)}
                        </h4>
                        {item.englishTitle && (
                          <span className="text-xs text-stone-500 italic block">
                            EN: {item.englishTitle}
                          </span>
                        )}
                      </div>

                      {item.author && (
                        <p className="text-xs text-stone-600 font-sans">
                          <strong>{adminText(language, 'लेखक/स्रोत:' )}</strong> {item.author} ({item.publicationYear || adminText(language, 'मिति अज्ञात')}) · {item.publication}
                        </p>
                      )}

                      <div className="text-[11px] font-mono text-stone-400 pt-1 border-t border-stone-100 flex items-center justify-between">
                        <span>{adminText(language, 'अधिकार:')} {language === 'ne' ? rightsDef.nepali : rightsDef.english}</span>
                        <span>{adminText(language, 'अद्यावधिक:')} {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="p-10 text-center bg-stone-50 rounded-lg border border-dashed border-stone-300 space-y-2">
              <Database className="w-8 h-8 text-stone-400 mx-auto" />
              <h4 className="font-bold text-stone-800">{adminText(language, 'अनुसन्धान अभिलेख खाली छ' )}</h4>
              <p className="text-xs text-stone-500">
                {adminText(language, '“+ नयाँ अनुसन्धान” बटन थिचेर पहिलो अनुसन्धान प्रविष्टि फाराममार्फत दर्ता गर्नुहोस्।')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB: SOURCES */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif-np font-bold text-stone-900">{adminText(language, 'सन्दर्भ ग्रन्थ तथा स्रोतहरू')} ({sources.length})</h3>
            <button
              onClick={() => setActiveForm('source')}
              className="px-3 py-1.5 bg-amber-800 text-white rounded text-xs flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{adminText(language, '+ नयाँ स्रोत' )}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map(src => (
              <div key={src.id} className="p-4 bg-white rounded-lg border border-stone-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-serif italic font-bold text-stone-900">{src.title}</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-stone-100">{src.category}</span>
                </div>
                <p className="text-stone-600">{src.author} ({src.year}) · {src.publicationOrArchive}</p>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400">{adminText(language, 'Archive Source')}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm(adminText(language, 'यो स्रोत अभिलेखबाट हटाउने हो?'))) return;
                      try { await deleteSource(src.id); } catch { window.alert(adminText(language, 'स्रोत हटाउन असफल भयो।')); }
                    }}
                    className="text-[11px] text-rose-700 hover:text-rose-900 font-semibold cursor-pointer"
                  >
                    {adminText(language, 'हटाउनुहोस् / Delete')}
                  </button>
                </div>
                {src.url && (
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-amber-800 underline block">
                    {adminText(language, 'डिजिटल लिङ्क हेर्नुहोस्')}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

            {/* TAB: AUTHORS ("ऐतिहासिक ग्रन्थ तथा विद्वत् दृष्टिकोण") */}
      {activeTab === 'authors' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif-np font-bold text-stone-900 text-lg">
                {adminText(language, 'ऐतिहासिक ग्रन्थ तथा विद्वत् दृष्टिकोण (Authors & Researchers Perspectives)')} ({authorsList.length})
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                {adminText(language, 'एकै विषयमा विभिन्न लेखक तथा इतिहासकारहरूको भनाइ र दृष्टिकोणहरूको तुलनात्मक अभिलेख')}
              </p>
            </div>
            <button
              onClick={() => { setEditingAuthorItem(null); setActiveForm('author'); }}
              className="px-3 py-1.5 bg-amber-800 text-white rounded text-xs flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{adminText(language, '+ नयाँ लेखक' )}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {authorsList.map(item => (
              <div key={item.id} className="p-5 bg-white rounded-lg border border-stone-200 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 font-serif-np text-base">{item.authorName}</span>
                  <span className="font-mono text-xs text-amber-800">{item.publicationYear}</span>
                </div>
                <p className="font-serif italic text-xs text-stone-700">{item.bookTitle} {item.page && `· p. ${item.page}`}</p>
                <p className="text-xs text-stone-600 font-serif-np line-clamp-3 leading-relaxed">{item.whatAuthorWrote}</p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>{adminText(language, 'विषय:')} {item.topic}</span>
                  <button
                    onClick={() => { setEditingAuthorItem(item); setActiveForm('author'); }}
                    className="text-amber-800 underline font-semibold cursor-pointer"
                  >
                    {adminText(language, 'सम्पादन')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif-np font-bold text-stone-900 text-lg">{adminText(language, 'प्रमाण अभिलेख (Evidence Archive)')} ({evidenceList.length})</h3>
            <button
              onClick={() => { setEditingEvidenceItem(null); setActiveForm('evidence'); }}
              className="px-3 py-1.5 bg-amber-800 text-white rounded text-xs flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{adminText(language, '+ नयाँ प्रमाण' )}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidenceList.map(item => (
              <div key={item.id} className="p-4 bg-white rounded-lg border border-stone-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 font-serif-np text-sm">{language === 'ne' ? (item.nepaliTitle || item.title) : item.title}</h4>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-stone-100">{item.type}</span>
                </div>
                <p className="text-stone-600 font-serif-np leading-relaxed">{item.description}</p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>{adminText(language, 'स्थान:')} {item.location || adminText(language, 'नेपाल')}</span>
                  <button
                    onClick={() => { setEditingEvidenceItem(item); setActiveForm('evidence'); }}
                    className="text-amber-800 underline font-semibold cursor-pointer"
                  >
                    {adminText(language, 'सम्पादन')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: ORAL HISTORY */}
      {activeTab === 'oral_history' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h3 className="font-serif-np text-lg font-bold text-stone-900">{adminText(language, 'मौखिक इतिहास अभिलेख')} ({oralHistoryList.length})</h3><p className="text-xs text-stone-500">{adminText(language, 'सूचनादाता, अन्तर्वार्ता, साक्ष्य, सहमति र अनुसन्धान audit सहित।')}</p></div>
            <button onClick={() => { setEditingOralHistoryItem(null); setActiveForm('oral_history'); }} className="rounded-xl bg-amber-800 px-4 py-2 text-xs font-semibold text-white">+ {adminText(language, 'नयाँ मौखिक इतिहास')}</button>
          </div>
          {oralHistoryList.length === 0 ? <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center text-sm text-stone-500">{adminText(language, 'अहिलेसम्म मौखिक इतिहास अभिलेख छैन।')}</div> : <div className="grid gap-4 md:grid-cols-2">{oralHistoryList.map(item => <article key={item.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h4 className="font-serif-np font-bold text-stone-900">{item.title}</h4><p className="mt-1 text-xs text-stone-500">{item.informantName} · {item.interviewer}</p></div><span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] uppercase">{item.verificationStatus}</span></div><p className="mt-3 line-clamp-3 text-xs leading-relaxed text-stone-600">{item.testimony}</p><div className="mt-4 flex gap-4 border-t border-stone-100 pt-3 text-xs"><button className="font-semibold text-amber-800" onClick={() => { setEditingOralHistoryItem(item); setActiveForm('oral_history'); }}>{adminText(language,'सम्पादन')}</button><button className="font-semibold text-rose-700" onClick={async()=>{if(confirm(adminText(language,'यो अभिलेख हटाउने हो?'))){await deleteOralHistoryRecord(item.id); reloadData();}}}>{adminText(language,'हटाउनुहोस्')}</button></div></article>)}</div>}
        </div>
      )}

      {/* TAB: ARTICLES */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif-np font-bold text-stone-900">{adminText(language, 'प्रकाशित लेखहरू')} ({articles.length})</h3>
            <button
              onClick={() => setActiveForm('article')}
              className="px-3 py-1.5 bg-amber-800 text-white rounded text-xs flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{adminText(language, '+ नयाँ लेख' )}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map(art => (
              <div key={art.id} className="p-4 bg-white rounded-lg border border-stone-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 font-serif-np text-sm">{art.title}</h4>
                  <button onClick={() => deleteArticle(art.id)} className="text-rose-600 hover:text-rose-900">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-stone-600 line-clamp-2">{art.excerpt}</p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>{art.publicationDate}</span>
                  <span className="font-mono text-amber-800">{art.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PHOTOS */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif-np font-bold text-stone-900">{adminText(language, 'तस्बिर सङ्ग्रह')} ({photos.length})</h3>
            <button
              onClick={() => { setEditingPhotoId(null); setActiveForm('photo'); }}
              className="px-3 py-1.5 bg-amber-800 text-white rounded text-xs flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{adminText(language, '+ नयाँ फोटो' )}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map(p => (
              <div key={p.id} className="p-3 bg-white rounded-lg border border-stone-200 space-y-2 text-xs">
                <img src={p.imageUrl} alt={p.title} className="w-full h-32 object-cover rounded bg-stone-100" />
                <h5 className="font-bold text-stone-900 truncate">{language === 'ne' ? (p.nepaliTitle || p.title) : (p.title || p.nepaliTitle)}</h5>
                <p className="text-[11px] text-stone-500">{p.location}</p>
                <div className="flex gap-3 border-t border-stone-100 pt-2">
                  <button type="button" className="text-[11px] font-semibold text-amber-800" onClick={() => { setEditingPhotoId(p.id); setNewPhotoTitle(p.title); setNewPhotoNepaliTitle(p.nepaliTitle || p.title); setNewPhotoLocation(p.location); setNewPhotoDate(p.dateKnown || ''); setNewPhotoPhotographer(p.photographer); setNewPhotoSource(p.source || ''); setNewPhotoEvidence(p.evidence || ''); setNewPhotoRights(p.permission || p.rightsHolder); setNewPhotoUrl(p.imageUrl); setNewPhotoFile(null); setNewPhotoPreview(p.imageUrl); setActiveForm('photo'); }}>{adminText(language,'प्रतिस्थापन / Edit')}</button>
                  <button type="button" className="text-[11px] font-semibold text-rose-700" onClick={async()=>{if(confirm(adminText(language,'यो फोटो हटाउने हो?'))) await deletePhoto(p.id);}}>{adminText(language,'हटाउनुहोस्')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: VIDEOS */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif-np font-bold text-stone-900">{adminText(language, 'भिडियो तथा अडियो सामग्री')} ({media.length})</h3>
            <button
              onClick={() => { setEditingMediaId(null); setActiveForm('video'); }}
              className="px-3 py-1.5 bg-amber-800 text-white rounded text-xs flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{adminText(language, '+ नयाँ भिडियो' )}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {media.map(m => (
              <div key={m.id} className="p-4 bg-white rounded-lg border border-stone-200 space-y-2 text-xs">
                <h5 className="font-bold text-stone-900 text-sm">{language === 'ne' ? (m.nepaliTitle || m.title) : (m.title || m.nepaliTitle)}</h5>
                <p className="text-stone-600">{m.description}</p>
                <div className="pt-2 border-t flex justify-between text-[11px] text-stone-400">
                  <span>{adminText(language, 'अवधि:')} {m.duration}</span>
                  <span className="font-mono uppercase">{m.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif-np font-bold text-stone-900 text-lg">{adminText(language, 'विस्तारयोग्य विषयगत वर्गहरू (Expandable Categories)' )}</h3>
            <p className="text-xs text-stone-500 font-sans">
              {adminText(language, 'वेबसाइटको संरचना परिवर्तन नगरी नयाँ वर्ग तथा उप-वर्गहरू थप्न सकिने संरचना')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RESEARCH_CATEGORIES.map((cat, idx) => (
              <div key={cat.key} className="p-4 bg-white rounded-lg border border-stone-200 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span>#{idx + 1}</span>
                  <span>{language === 'ne' ? cat.nepali : cat.english}</span>
                </div>
                <h4 className="font-serif-np font-bold text-stone-900 text-sm">{language === 'ne' ? cat.nepali : cat.english}</h4>
                <p className="text-stone-600 text-[11px] leading-relaxed">{language === 'ne' ? cat.descriptionNepali : (cat.descriptionEnglish || cat.descriptionNepali)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: TRANSLATIONS */}
      {activeTab === 'translations' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif-np font-bold text-stone-900 text-lg">{adminText(language, 'द्विभाषिक अनुवाद स्थिति (Bilingual Translations)' )}</h3>
            <p className="text-xs text-stone-500 font-sans">
              {adminText(language, 'प्रत्येक अभिलेखमा नेपाली र अंग्रेजी दुवै संस्करणको व्यवस्थापन। अनुवाद नभएका खण्डमा स्वतः सुरक्षित सूचना देखा पर्नेछ।')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
              <span className="font-bold text-amber-900 block font-serif-np">{adminText(language, 'अंग्रेजी अनुवाद बाँकी रहेका सामग्री:' )}</span>
              <p className="text-stone-700">{adminText(language, 'प्रदर्शन: "English version coming soon."' )}</p>
              <span className="text-[11px] text-stone-500">
                {adminText(language, 'बाँकी संख्या:')} {researchList.filter(r => !r.englishTitle && !r.englishTranslation).length}
              </span>
            </div>

            <div className="p-4 bg-sky-50 rounded-lg border border-sky-200 space-y-2">
              <span className="font-bold text-sky-900 block font-serif-np">{adminText(language, 'नेपाली अनुवाद बाँकी रहेका सामग्री:' )}</span>
              <p className="text-stone-700">{adminText(language, 'प्रदर्शन: "नेपाली संस्करण चाँडै थपिँदैछ।"' )}</p>
              <span className="text-[11px] text-stone-500">
                {adminText(language, 'बाँकी संख्या:')} {researchList.filter(r => !r.nepaliTitle && !r.nepaliTranslation).length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DRAFTS */}
      {activeTab === 'drafts' && (
        <div className="space-y-4">
          <h3 className="font-serif-np font-bold text-stone-900 text-lg">{adminText(language, 'मस्यौदा अभिलेखहरू (Drafts)' )}</h3>
          <p className="text-xs text-stone-500">
            {adminText(language, 'सार्वजनिक आगन्तुकहरूले मस्यौदा देख्न सक्दैनन्; प्रशासकले स्वीकृत गरेपछि मात्र प्रकाशित हुनेछ।')}
          </p>
          <div className="space-y-3">
            {researchList.filter(r => r.workflowStatus === 'draft').map(item => (
              <div key={item.id} className="p-4 bg-white rounded border border-amber-300 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold font-serif-np">{language === 'ne' ? (item.nepaliTitle || item.title) : (item.englishTitle || item.title)}</h4>
                  <span className="text-stone-500 text-[11px]">{item.category} · v{item.version}</span>
                </div>
                <button
                  onClick={() => { setEditingResearchItem(item); setActiveForm('research'); }}
                  className="px-3 py-1 bg-amber-800 text-white rounded"
                >
                  {adminText(language, 'पुनरावलोकन / सम्पादन')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PUBLISHED */}
      {activeTab === 'published' && (
        <div className="space-y-4">
          <h3 className="font-serif-np font-bold text-stone-900 text-lg">{adminText(language, 'सार्वजनिक प्रकाशित अभिलेखहरू (Published)' )}</h3>
          <p className="text-xs text-stone-500">
            {adminText(language, 'यी सामग्रीहरू वेबसाइटका आगन्तुकहरूले पढ्न सक्ने आधिकारिक शोध अभिलेख हुन्।')}
          </p>
          <div className="space-y-3">
            {researchList.filter(r => r.workflowStatus === 'published').map(item => (
              <div key={item.id} className="p-4 bg-white rounded border border-emerald-300 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold font-serif-np text-emerald-950">{language === 'ne' ? (item.nepaliTitle || item.title) : (item.englishTitle || item.title)}</h4>
                  <span className="text-stone-500 text-[11px]">{adminText(language, 'स्थिति:')} {item.researchStatus} · {adminText(language, 'अद्यावधिक:')} {item.updatedAt?.slice(0, 10)}</span>
                </div>
                <button
                  onClick={() => { setEditingResearchItem(item); setActiveForm('research'); }}
                  className="px-3 py-1 border rounded hover:bg-stone-50"
                >
                  {adminText(language, 'विवरण')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: REVISIONS */}
      {activeTab === 'revisions' && (
        <AdminRevisionHistoryView />
      )}

      {/* ADMIN-ONLY FULL RESEARCH READER */}
      {readingResearchItem && (
        <div
          className="fixed inset-0 z-[100] bg-stone-950/70 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={language === 'ne' ? 'पूर्ण अनुसन्धान पाठक' : 'Full Research Reader'}
          onClick={() => setReadingResearchItem(null)}
        >
          <div
            className="mx-auto h-full max-w-5xl overflow-y-auto rounded-2xl bg-[#FBF9F5] shadow-2xl"
            onClick={event => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-stone-200 bg-[#FBF9F5]/95 px-4 py-4 backdrop-blur sm:px-6">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-800">
                  {language === 'ne' ? 'प्रशासक-मात्र अनुसन्धान पाठक' : 'Admin-only Research Reader'}
                </div>
                <h2 className="mt-1 font-serif-np text-xl font-bold text-stone-900">
                  {language === 'ne' ? (readingResearchItem.nepaliTitle || readingResearchItem.title) : (readingResearchItem.englishTitle || readingResearchItem.title)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setReadingResearchItem(null)}
                className="shrink-0 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                {language === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
              </button>
            </div>

            <div className="space-y-6 p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  [language === 'ne' ? 'श्रेणी' : 'Category', readingResearchItem.category],
                  [language === 'ne' ? 'विषय' : 'Topic', readingResearchItem.topic],
                  [language === 'ne' ? 'अनुसन्धान स्थिति' : 'Research status', readingResearchItem.researchStatus],
                  [language === 'ne' ? 'प्रकाशन अवस्था' : 'Workflow', readingResearchItem.workflowStatus],
                  [language === 'ne' ? 'संस्करण' : 'Version', `v${readingResearchItem.version}`],
                  [language === 'ne' ? 'मिति' : 'Date', readingResearchItem.date || readingResearchItem.createdAt?.slice(0,10)],
                  [language === 'ne' ? 'अधिकार' : 'Rights', readingResearchItem.rightsStatus],
                  [language === 'ne' ? 'अनुसन्धानकर्ता' : 'Researcher', readingResearchItem.createdBy || 'SADAN RAI']
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-stone-200 bg-white p-3">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">{label}</div>
                    <div className="mt-1 break-words text-sm font-medium text-stone-900">{value || '—'}</div>
                  </div>
                ))}
              </div>

              <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
                <h3 className="mb-3 font-serif-np text-lg font-bold text-stone-900">{language === 'ne' ? 'स्रोत तथा प्रत्यक्ष विवरण' : 'Source & Direct Evidence Details'}</h3>
                <div className="space-y-3 text-sm leading-7 text-stone-700">
                  <p><strong>{language === 'ne' ? 'लेखक/सूचक:' : 'Author/Informant:'}</strong> {readingResearchItem.author || '—'}</p>
                  <p><strong>{language === 'ne' ? 'ग्रन्थ/प्रकाशन:' : 'Work/Publication:'}</strong> {readingResearchItem.publication || '—'}</p>
                  <p><strong>{language === 'ne' ? 'प्रकाशन वर्ष:' : 'Publication year:'}</strong> {readingResearchItem.publicationYear || '—'}</p>
                  <p><strong>{language === 'ne' ? 'अध्याय/खण्ड:' : 'Chapter/Section:'}</strong> {readingResearchItem.chapterSection || '—'}</p>
                  <p><strong>{language === 'ne' ? 'पृष्ठ/फोलियो:' : 'Page/Folio:'}</strong> {readingResearchItem.pageNumber || '—'}</p>
                  <p><strong>{language === 'ne' ? 'मूल उद्धरण:' : 'Original quotation:'}</strong><br />{readingResearchItem.originalQuotation || '—'}</p>
                  <p><strong>{language === 'ne' ? 'प्रमाण विवरण:' : 'Evidence description:'}</strong><br />{readingResearchItem.evidence || '—'}</p>
                  {readingResearchItem.sourceUrl && (
                    <p><strong>{language === 'ne' ? 'स्रोत URL:' : 'Source URL:'}</strong> <a href={readingResearchItem.sourceUrl} target="_blank" rel="noreferrer" className="break-all text-amber-800 underline">{readingResearchItem.sourceUrl}</a></p>
                  )}
                </div>
              </section>

              {readingResearchItem.nepaliExplanation || readingResearchItem.englishExplanation || readingResearchItem.nepaliTranslation || readingResearchItem.englishTranslation ? (
                <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
                  <h3 className="mb-3 font-serif-np text-lg font-bold text-stone-900">{language === 'ne' ? 'व्याख्या तथा अनुवाद' : 'Explanation & Translation'}</h3>
                  <div className="space-y-4 text-sm leading-7 text-stone-700">
                    {readingResearchItem.nepaliExplanation && <p><strong>नेपाली व्याख्या:</strong><br />{readingResearchItem.nepaliExplanation}</p>}
                    {readingResearchItem.englishExplanation && <p><strong>English explanation:</strong><br />{readingResearchItem.englishExplanation}</p>}
                    {readingResearchItem.nepaliTranslation && <p><strong>नेपाली अनुवाद:</strong><br />{readingResearchItem.nepaliTranslation}</p>}
                    {readingResearchItem.englishTranslation && <p><strong>English translation:</strong><br />{readingResearchItem.englishTranslation}</p>}
                  </div>
                </section>
              ) : null}

              {readingResearchItem.synthesis && (
                <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
                  <h3 className="mb-3 font-serif-np text-lg font-bold text-stone-900">{language === 'ne' ? 'अनुसन्धान संश्लेषण' : 'Research Synthesis'}</h3>
                  <div className="space-y-4 text-sm leading-7 text-stone-700">
                    <p><strong>Documented information:</strong><br />{readingResearchItem.synthesis.documentedInfo || '—'}</p>
                    <p><strong>Scholarly interpretation:</strong><br />{readingResearchItem.synthesis.scholarlyInterpretation || '—'}</p>
                    <p><strong>Oral tradition:</strong><br />{readingResearchItem.synthesis.oralTradition || '—'}</p>
                    <p><strong>Disputed information:</strong><br />{readingResearchItem.synthesis.disputedInfo || '—'}</p>
                    <p><strong>Further research needed:</strong><br />{readingResearchItem.synthesis.furtherResearchNeeded || '—'}</p>
                  </div>
                </section>
              )}

              {readingResearchItem.researchWorkflow && (
                <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-amber-800" />
                    <h3 className="font-serif-np text-lg font-bold text-stone-900">{language === 'ne' ? 'आन्तरिक अनुसन्धान / Cross-check Workspace' : 'Internal Research / Cross-check Workspace'}</h3>
                  </div>
                  <div className="space-y-5 text-sm leading-7 text-stone-700">
                    {(readingResearchItem.researchWorkflow.sourceEntries || []).map((source, index) => (
                      <div key={source.id || index} className="rounded-lg border border-amber-200 bg-white p-4">
                        <div className="mb-2 font-semibold text-stone-900">{language === 'ne' ? `स्रोत ${index + 1}` : `Source ${index + 1}`}</div>
                        <p><strong>{language === 'ne' ? 'स्रोत प्रकार:' : 'Source kind:'}</strong> {source.sourceKind || '—'}</p>
                        <p><strong>{language === 'ne' ? 'लेखक/सूचक:' : 'Author/Informant:'}</strong> {source.authorOrInformant || '—'}</p>
                        <p><strong>{language === 'ne' ? 'काम/स्रोत:' : 'Work/Source:'}</strong> {source.workOrSource || '—'}</p>
                        <p><strong>{language === 'ne' ? 'स्रोतले के भन्छ:' : 'What it says:'}</strong> {source.whatItSays || '—'}</p>
                        <p><strong>{language === 'ne' ? 'सन्दर्भ:' : 'Reference:'}</strong> {source.reference || '—'}</p>
                        <p><strong>{language === 'ne' ? 'प्रमाण टिप्पणी:' : 'Evidence note:'}</strong> {source.evidenceNote || '—'}</p>
                        <p><strong>{language === 'ne' ? 'Assessment:' : 'Assessment:'}</strong> {source.assessment || '—'}</p>
                        {source.evidenceAttachments?.length ? (
                          <div className="mt-3 space-y-1">
                            <strong>{language === 'ne' ? 'प्रमाण फाइल:' : 'Evidence files:'}</strong>
                            {source.evidenceAttachments.map(file => (
                              <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="block break-all text-amber-800 underline">{file.name}</a>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                    <p><strong>{language === 'ne' ? 'Cross-check agreements:' : 'Cross-check agreements:'}</strong><br />{readingResearchItem.researchWorkflow.crossCheckAgreements || '—'}</p>
                    <p><strong>{language === 'ne' ? 'Differences / contradictions:' : 'Differences / contradictions:'}</strong><br />{readingResearchItem.researchWorkflow.crossCheckDifferences || '—'}</p>
                    <p><strong>{language === 'ne' ? 'Evidence assessment:' : 'Evidence assessment:'}</strong><br />{readingResearchItem.researchWorkflow.evidenceAssessment || '—'}</p>
                    <p><strong>{language === 'ne' ? 'Researcher analysis:' : 'Researcher analysis:'}</strong><br />{readingResearchItem.researchWorkflow.researcherAnalysis || '—'}</p>
                    <p><strong>{language === 'ne' ? 'Final research conclusion:' : 'Final research conclusion:'}</strong><br />{readingResearchItem.researchWorkflow.finalConclusion || readingResearchItem.researchConclusion || '—'}</p>
                  </div>
                </section>
              )}

              <div className="flex flex-wrap gap-2 border-t border-stone-200 pt-5">
                <button
                  type="button"
                  onClick={() => { setEditingResearchItem(readingResearchItem); setReadingResearchItem(null); setActiveForm('research'); }}
                  className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800"
                >
                  {language === 'ne' ? 'सम्पादन खोल्नुहोस्' : 'Open editor'}
                </button>
                <button
                  type="button"
                  onClick={() => setReadingResearchItem(null)}
                  className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  {language === 'ne' ? 'पाठक बन्द गर्नुहोस्' : 'Close reader'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
