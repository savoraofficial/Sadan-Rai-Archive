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
  RIGHTS_STATUS_LABELS,
  MALBASE_SECTION_HEADINGS
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
import { KIRAT_FINAL_RESEARCH_SECTIONS, KIRAT_FINAL_RESEARCH_SOURCES } from '../../data/kiratFinalResearch';
import { KIRAT_VISITOR_CHAPTERS } from '../../data/kiratVisitorResearch';
import { ADMIN_RESEARCH_LIBRARY_DOCUMENTS } from '../../data/adminResearchLibrary';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { useBilingualAutoTranslate } from '../../hooks/useBilingualAutoTranslate';
import { useAdminTypingFocusGuard } from '../../hooks/useAdminTypingFocusGuard';
import type { ArchiveSectionContent } from '../../data/archiveSectionContent';

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
  FolderOpen,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Home,
  MapPin,
  MessageSquareQuote,
  Landmark
} from 'lucide-react';

type AdminTab = 
  | 'dashboard'
  | 'research'
  | 'original_research'
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
  | 'revisions'
  | 'public_archive'
  | 'places_village'
  | 'public_content'
  | 'additional_archive'
  | 'kirat_research'
  | 'home_content';

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
    deletePhoto,
    addMedia, 
    navigateTo,
    archiveSectionContent,
    saveArchiveSection
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
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [selectedPublicContentKey, setSelectedPublicContentKey] = useState<string>('history_civilization');
  const [publicContentDraft, setPublicContentDraft] = useState<ArchiveSectionContent | null>(null);
  const [showPublicContentPreview, setShowPublicContentPreview] = useState(false);
  const [focusOriginalResearchForm, setFocusOriginalResearchForm] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [editingResearchItem, setEditingResearchItem] = useState<ResearchRecordItem | null>(null);
  const [readingResearchItem, setReadingResearchItem] = useState<ResearchRecordItem | null>(null);
  const [libraryQuery, setLibraryQuery] = useState('');
  const [selectedLibraryPath, setSelectedLibraryPath] = useState<string>(ADMIN_RESEARCH_LIBRARY_DOCUMENTS[0]?.path || '');
  const [selectedAdminCategory, setSelectedAdminCategory] = useState<string | null>(null);
  const [selectedHomeContentKey, setSelectedHomeContentKey] = useState<string>('history_civilization');
  const [homeContentDraft, setHomeContentDraft] = useState<ArchiveSectionContent | null>(null);
  const [showHomeContentPreview, setShowHomeContentPreview] = useState(false);
  const [editingAuthorItem, setEditingAuthorItem] = useState<AuthorPerspectiveItem | null>(null);
  const [editingEvidenceItem, setEditingEvidenceItem] = useState<EvidenceRecordItem | null>(null);
  const [editingOralHistoryItem, setEditingOralHistoryItem] = useState<OralHistoryRecordItem | null>(null);
  const [oralHistoryList, setOralHistoryList] = useState<OralHistoryRecordItem[]>([]);

  // LOCK 1/2: Original Research must always open as its own first-class workspace.
  // Keep the action deterministic: select the dedicated tab, clear unrelated forms,
  // then explicitly focus the Original Research form/workspace after React commits.
  const openHomeContentWorkspace = (sectionKey = 'history_civilization') => {
    const item = archiveSectionContent.find(entry => entry.sectionKey === sectionKey || entry.id === sectionKey);
    setSelectedHomeContentKey(sectionKey);
    setHomeContentDraft(item ? { ...item } : null);
    setShowHomeContentPreview(false);
    setActiveTab('home_content');
    setActiveForm(null);
    window.setTimeout(() => {
      document.getElementById('admin-home-content-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const openOriginalResearchWorkspace = (createNew = false) => {
    setActiveTab('original_research');
    setEditingResearchItem(null);
    setActiveForm(createNew ? 'research' : null);
    setFocusOriginalResearchForm(createNew);
    window.setTimeout(() => {
      const target = document.getElementById('admin-original-research-section') || document.getElementById('original-research-workspace');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  // Live Records State
  const [researchList, setResearchList] = useState<ResearchRecordItem[]>([]);
  const [authorsList, setAuthorsList] = useState<AuthorPerspectiveItem[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecordItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [publishingPreparedResearch, setPublishingPreparedResearch] = useState(false);

  // Original Research is a first-class editorial workspace, while its durable record remains
  // inside the existing research_records schema so no Firebase collection/data is discarded.
  const originalResearchList = researchList.filter(item => {
    const finding = item.researchWorkflow?.originalFinding;
    return Boolean(finding && (finding.newFinding?.trim() || finding.exactObservation?.trim() || (finding.evidenceAttachments?.length || 0) > 0));
  });

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

  useEffect(() => {
    const handleCommandKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = Boolean(target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setShowCommandPalette(true);
      } else if (event.key === '/' && !isTyping) {
        event.preventDefault();
        setShowCommandPalette(true);
      } else if (event.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleCommandKey);
    return () => window.removeEventListener('keydown', handleCommandKey);
  }, []);

  const openAdminWorkspace = (tab: AdminTab, form: ActiveForm = null) => {
    setActiveTab(tab);
    setActiveForm(form);
    setEditingResearchItem(null);
    setFocusOriginalResearchForm(tab === 'original_research');
    setShowCommandPalette(false);
    setCommandQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryResearchMatches = (categoryKey: string) => {
    const category = RESEARCH_CATEGORIES.find(item => item.key === categoryKey);
    if (!category) return [];
    const normalized = `${category.key} ${category.english} ${category.nepali}`.toLowerCase();
    return researchList.filter(record => {
      if (record.category === category.key) return true;
      const context = `${record.community || ''} ${record.topic || ''} ${record.author || ''} ${record.publication || ''} ${record.researchWorkflow?.civilizationOrTradition || ''}`.toLowerCase();
      if (category.key === 'kirat_culture') return /kirat|kiranti|rai|limbu|mundhum/.test(context);
      if (category.key === 'buddhist_culture' || category.key === 'buddhist_civilization' || category.key === 'buddhist_history') return /buddh/.test(context);
      if (category.key === 'himalayan_history' || category.key === 'himalayan_civilizations') return /himalaya/.test(context);
      if (category.key === 'oral_history') return record.researchStatus === 'oral_history' || /oral history|oral tradition|informant|testimony/.test(context);
      if (category.key === 'ancient_authors') return /author|scholar|researcher|perspective/.test(context);
      return normalized.includes(record.category.toLowerCase()) || record.researchWorkflow?.subjectFamily?.toLowerCase() === category.key;
    });
  };

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

  // Build a CMS-ready representation of each of the 20 public Kirat research chapters.
  // The public reading layer remains the source-of-truth for the visitor prose; this adapter
  // only exposes the same existing content to the owner console without deleting/replacing it.
  const buildKiratSectionRecord = (sectionKey: string): ResearchRecordItem | null => {
    const section = KIRAT_FINAL_RESEARCH_SECTIONS.find(item => item.key === sectionKey);
    const chapter = KIRAT_VISITOR_CHAPTERS.find(item => item.key === sectionKey);
    if (!section || !chapter) return null;

    const selectedSources = section.sourceIds.includes('ALL')
      ? KIRAT_FINAL_RESEARCH_SOURCES
      : KIRAT_FINAL_RESEARCH_SOURCES.filter(source => section.sourceIds.includes(source.id));

    return {
      id: `kirat-final-${sectionKey}`,
      title: section.englishTitle,
      nepaliTitle: section.nepaliTitle,
      englishTitle: section.englishTitle,
      category: 'kirat_history',
      community: 'Kirat',
      topic: section.englishTitle,
      author: 'SADAN RAI',
      publication: 'Sadan Rai — History, Civilization & Culture Archive',
      publicationYear: '2026',
      nepaliExplanation: chapter.bodyNepali,
      englishExplanation: chapter.bodyEnglish,
      researchConclusion: section.summaryEnglish,
      researchStatus: 'further_research',
      rightsStatus: 'original_sadan_rai',
      workflowStatus: 'published',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      changeNotes: '20-section Kirat master research chapter — existing public research layer',
      researchWorkflow: {
        subjectFamily: 'kirat_history',
        civilizationOrTradition: 'Kirat',
        sourceEntries: selectedSources.slice(0, 20).map(source => ({
          id: `final-source-${source.id}`,
          sourceKind: 'foreign_scholar',
          authorOrInformant: source.author,
          workOrSource: source.work,
          whatItSays: source.evidence,
          reference: source.year,
          evidenceNote: source.evidence,
          assessment: source.status,
          evidenceAttachments: []
        })),
        crossCheckAgreements: 'See the existing 45-source master cross-check register in Research Library.',
        crossCheckDifferences: 'Source-level status is preserved; unresolved claims remain explicitly classified.',
        evidenceAssessment: 'Evidence-bounded synthesis. Page/folio-pending records are not treated as proven claims.',
        localVerification: '',
        verificationOutcome: 'corroborated',
        researcherAnalysis: '',
        finalConclusion: section.summaryEnglish
      }
    } as ResearchRecordItem;
  };

  const getAdminResearchRecords = (firestoreRecords: ResearchRecordItem[]): ResearchRecordItem[] => {
    const existingIds = new Set(firestoreRecords.map(item => item.id));
    const masterSections = KIRAT_FINAL_RESEARCH_SECTIONS
      .map(section => buildKiratSectionRecord(section.key))
      .filter((item): item is ResearchRecordItem => item !== null && !existingIds.has(item.id));
    return [...masterSections, ...firestoreRecords];
  };

  const openFinalResearchEditor = (sectionKey: string) => {
    const existing = researchList.find(item => item.id === `kirat-final-${sectionKey}`);
    const master = buildKiratSectionRecord(sectionKey);
    if (!master) return;
    setEditingResearchItem(existing || master);
    setActiveForm('research');
  };
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
      // Firebase is the authoritative live CMS for the Research counters and published/draft lists.
      // The prepared register remains available through the explicit import/publish action;
      // it is not silently merged into the live runtime counts.
      setResearchList(getAdminResearchRecords(resData));
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
      researchStatus: 'further_research',
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
          <button type="button" onClick={() => setActiveTab('dashboard')} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600 transition-colors">
            <LayoutDashboard className="w-3.5 h-3.5" />
            {language === 'ne' ? 'मुख्य कार्यक्षेत्र' : 'Workspace Home'}
          </button>
        </div>

        {feedbackMsg && (
          <div className="p-3 bg-amber-900/60 border border-amber-600/80 rounded text-xs text-amber-200 font-serif-np animate-fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Primary editorial workspace: Sadan Rai's own findings stay above the general CMS actions. */}
      <section className="archive-admin-primary-research" aria-label={language === 'ne' ? 'सदन राई मौलिक अनुसन्धान' : 'Sadan Rai Original Research'}>
        <div className="archive-admin-primary-research-copy">
          <div className="archive-admin-primary-badge"><Sparkles className="h-4 w-4" />{language === 'ne' ? 'मुख्य अनुसन्धान कार्यक्षेत्र' : 'Primary Research Workspace'}</div>
          <h2>{language === 'ne' ? 'सदन राई — नयाँ खोज' : 'Sadan Rai — Original Research & New Findings'}</h2>
          <p>{language === 'ne' ? 'आफ्नै क्षेत्रीय खोज, मौखिक संकेत, दस्तावेज वा भौतिक प्रमाण यहाँ दर्ता गर्नुहोस्। हरेक खोज स्रोत–उत्पत्ति, प्रमाण, स्वतन्त्र पुनःपरीक्षण, मूल्याङ्कन, विश्लेषण र संस्करण इतिहाससहित अघि बढ्छ।' : 'Register your own field findings, oral leads, documents, or material evidence here. Every finding moves through provenance, evidence, cross-checking, assessment, analysis, and version history.'}</p>
          <div className="archive-admin-primary-meta">
            <span>{originalResearchList.length} {language === 'ne' ? 'मौलिक खोज' : 'original findings'}</span>
            <span>{originalResearchList.filter(x => (x.researchWorkflow?.originalFinding?.evidenceAttachments?.length || 0) > 0).length} {language === 'ne' ? 'प्रमाणसहित' : 'with evidence'}</span>
            <span>{language === 'ne' ? 'तथ्य स्वतः मानिँदैन — प्रमाणको अवस्थाअनुसार अघि बढ्छ' : 'Not automatically fact — status follows evidence'}</span>
          </div>
        </div>
        <div className="archive-admin-primary-actions">
          <button type="button" onClick={() => openOriginalResearchWorkspace(true)} className="archive-admin-primary-cta"><Sparkles className="h-4 w-4" />{language === 'ne' ? 'नयाँ खोज दर्ता' : 'New Original Research'}</button>
          <button type="button" onClick={() => openOriginalResearchWorkspace(false)} className="archive-admin-primary-secondary">{language === 'ne' ? 'सबै मौलिक खोज हेर्नुहोस्' : 'Open Original Research'}<ChevronRight className="h-4 w-4" /></button>
        </div>
      </section>

      {/* Shared public/admin research workflow — same information architecture, different editorial presentation. */}
      <section className="archive-research-workflow-strip" aria-label={language === 'ne' ? 'सदन राई अनुसन्धान कार्यप्रवाह' : 'Sadan Rai Research Workflow'}>
        <div className="archive-research-workflow-head">
          <div>
            <span className="archive-research-workflow-kicker">{language === 'ne' ? 'साझा अनुसन्धान कार्यप्रवाह' : 'SHARED RESEARCH WORKFLOW'}</span>
            <h3>{language === 'ne' ? 'सदन राई — अनुसन्धान कार्यप्रवाह' : 'Sadan Rai — Research Workflow'}</h3>
          </div>
          <span className="archive-research-workflow-note">{language === 'ne' ? 'Public ↔ Admin एउटै संरचना' : 'Same structure across Public ↔ Admin'}</span>
        </div>
        <div className="archive-research-workflow-steps">
          {(language === 'ne'
            ? ['स्रोत / संकेत', 'मूल अवलोकन', 'प्रमाण', 'स्वतन्त्र Cross-check', 'प्रमाण मूल्याङ्कन', 'अनुसन्धान विश्लेषण', 'निष्कर्ष / थप अनुसन्धान', 'प्रकाशन → संस्करण इतिहास']
            : ['Source / Lead', 'Original Observation', 'Evidence', 'Independent Cross-check', 'Evidence Assessment', 'Researcher Analysis', 'Conclusion / Further Research', 'Publication → Version History']
          ).map((step, i, steps) => (
            <div key={step} className="archive-research-workflow-step">
              <span>{String(i + 1).padStart(2, '0')}</span><strong>{step}</strong>{i < steps.length - 1 && <ArrowRight className="archive-research-workflow-arrow" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </section>

      <section className="archive-admin-status-board rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm" aria-label={language === 'ne' ? 'अनुसन्धान स्थिति' : 'Research status'}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-[10px] uppercase tracking-[0.18em] text-amber-800 font-semibold">{language === 'ne' ? 'अनुसन्धान स्थिति' : 'RESEARCH STATUS'}</p><h3 className="mt-1 font-serif-np text-lg font-bold text-stone-900">{language === 'ne' ? 'आजको काम कहाँ पुगेको छ?' : 'Where the research work stands'}</h3></div>
          <button type="button" onClick={() => setActiveTab('research')} className="text-[11px] font-semibold text-amber-900 hover:underline">{language === 'ne' ? 'सबै अनुसन्धान खोल्नुहोस् →' : 'Open all research →'}</button>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            ['draft', language === 'ne' ? 'मस्यौदा' : 'Drafts', researchList.filter(item => item.workflowStatus === 'draft').length],
            ['needed', language === 'ne' ? 'थप अनुसन्धान' : 'Research needed', researchList.filter(item => item.researchStatus === 'further_research').length],
            ['evidence', language === 'ne' ? 'प्रमाण बाँकी' : 'Evidence pending', researchList.filter(item => !item.evidence?.trim() && !(item.researchWorkflow?.sourceEntries || []).some(entry => (entry.evidenceAttachments?.length || 0) > 0)).length],
            ['crosscheck', language === 'ne' ? 'Cross-check बाँकी' : 'Cross-check pending', researchList.filter(item => item.researchWorkflow?.verificationOutcome === 'not_checked').length],
            ['ready', language === 'ne' ? 'प्रकाशनका लागि तयार' : 'Ready to publish', researchList.filter(item => item.workflowStatus === 'under_review').length],
            ['published', language === 'ne' ? 'प्रकाशित' : 'Published', researchList.filter(item => item.workflowStatus === 'published').length],
          ].map(([key,label,count]) => {
            return <button key={String(key)} type="button" onClick={() => setActiveTab(key === 'published' ? 'published' : key === 'draft' ? 'drafts' : 'research')} className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-left hover:border-amber-300 hover:bg-white transition-all"><span className="block text-[10px] font-mono text-stone-500">{label}</span><strong className="mt-1 block text-xl text-stone-900">{count}</strong></button>;
          })}
        </div>
      </section>

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
            onClick={() => { setEditingResearchItem(null); setActiveTab('original_research'); setFocusOriginalResearchForm(true); setActiveForm('research'); }}
            className="p-2.5 bg-amber-800 hover:bg-amber-700 text-white rounded text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{language === 'ne' ? '+ नयाँ मौलिक अनुसन्धान' : '+ New Original Research'}</span>
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
          <button type="button" onClick={() => setActiveTab('original_research')} className="archive-admin-stat archive-admin-stat-original">
            <span className="archive-admin-stat-icon"><Sparkles className="w-4 h-4" /></span>
            <span><strong>{originalResearchList.length}</strong><small>{language === 'ne' ? 'मौलिक अनुसन्धान' : 'Original Research'}</small></span>
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
          focusOriginalFinding={focusOriginalResearchForm}
          onSuccess={() => {
            setActiveForm(null);
            setEditingResearchItem(null);
            setFocusOriginalResearchForm(false);
            reloadData();
            setFeedbackMsg(adminText(language, 'अनुसन्धान अभिलेख सफलतापूर्वक सुरक्षित भयो!'));
            setTimeout(() => setFeedbackMsg(null), 2500);
          }}
          onCancel={() => {
            setActiveForm(null);
            setEditingResearchItem(null);
            setFocusOriginalResearchForm(false);
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
          <button type="button" onClick={() => openHomeContentWorkspace()} className="archive-admin-workspace-card text-left rounded-xl border border-stone-200 bg-stone-50 p-4 hover:border-amber-300 transition-all">
            <div className="flex items-center gap-2 text-amber-900"><LayoutDashboard className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'गृहपृष्ठ CMS' : 'Home CMS'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'गृहपृष्ठका सबै खण्ड' : 'All Home Page Sections'}</div>
            <div className="mt-1 text-[11px] text-stone-500">{archiveSectionContent.length} {language === 'ne' ? 'editable sections · Draft → Preview → Publish → Revision' : 'editable sections · Draft → Preview → Publish → Revision'}</div>
          </button>
          <button type="button" onClick={() => setActiveTab('places_village')} className="archive-admin-workspace-card text-left rounded-xl border border-amber-200 bg-amber-50/60 p-4 hover:border-amber-400 transition-all">
            <div className="flex items-center gap-2 text-amber-900"><MapPin className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'सार्वजनिक खण्ड' : 'Public Section'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'स्थान तथा गाउँ अभिलेख' : 'Places & Village Archives'}</div>
            <div className="mt-1 text-[11px] text-stone-500">{language === 'ne' ? '११ उपखण्ड · स्थान/गाउँ कार्यक्षेत्र' : '11 subsections · place/village workspace'}</div>
          </button>
          <button type="button" onClick={() => setActiveTab('oral_history')} className="archive-admin-workspace-card text-left rounded-xl border border-stone-200 bg-stone-50 p-4 hover:border-amber-300 transition-all">
            <div className="flex items-center gap-2 text-amber-900"><MessageSquareQuote className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'सार्वजनिक खण्ड' : 'Public Section'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'मौखिक इतिहास' : 'Oral History'}</div>
            <div className="mt-1 text-[11px] text-stone-500">{language === 'ne' ? 'अन्तर्वार्ता · स्मृति · स्थानीय ज्ञान' : 'Interviews · memories · local knowledge'}</div>
          </button>
          <button type="button" onClick={() => setActiveTab('original_research')} className={`archive-admin-workspace-card archive-admin-workspace-card-primary text-left rounded-xl border p-4 transition-all ${activeTab === 'original_research' ? 'border-amber-700 bg-amber-50 shadow-sm' : 'border-stone-200 bg-stone-50 hover:border-amber-300'}`}>
            <div className="flex items-center gap-2 text-amber-900"><Sparkles className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'मौलिक अनुसन्धान' : 'Original Research'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'सदन राई — नयाँ खोज' : 'Sadan Rai — New Findings'}</div>
            <div className="mt-1 text-[11px] text-stone-500">{originalResearchList.length} {language === 'ne' ? 'मौलिक खोज' : 'original findings'} · {language === 'ne' ? 'प्रमाण → पुनःजाँच → निष्कर्ष' : 'Evidence → cross-check → conclusion'}</div>
          </button>
          <button type="button" onClick={() => setActiveTab('research')} className={`archive-admin-workspace-card text-left rounded-xl border p-4 transition-all ${activeTab === 'research' ? 'border-amber-700 bg-amber-50 shadow-sm' : 'border-stone-200 bg-stone-50 hover:border-amber-300'}`}>
            <div className="flex items-center gap-2 text-amber-900"><BookOpen className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'मुख्य अभिलेख' : 'Core Archive'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'अनुसन्धान तथा स्रोत' : 'Research & Sources'}</div>
            <div className="mt-1 text-[11px] text-stone-500">{researchList.length} {language === 'ne' ? 'प्रविष्टि' : 'records'} · {language === 'ne' ? 'स्रोत · प्रमाण · विश्लेषण · निष्कर्ष' : 'Sources · Evidence · Analysis · Conclusions'}</div>
          </button>
          <button type="button" onClick={() => setActiveTab('kirat_research')} className="archive-admin-workspace-card text-left rounded-xl border border-amber-200 bg-amber-50/60 p-4 hover:border-amber-400 transition-all">
            <div className="flex items-center gap-2 text-amber-900"><BookOpen className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'समर्पित अनुसन्धान' : 'Dedicated Research'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? '२० खण्डको किराँत अनुसन्धान' : '20-Section Kirat Research'}</div>
            <div className="mt-1 text-[11px] text-stone-500">20 sections · 45 {language === 'ne' ? 'स्रोत' : 'research-library sources'}</div>
          </button>
          <button type="button" onClick={() => setActiveTab('additional_archive')} className="archive-admin-workspace-card text-left rounded-xl border border-stone-200 bg-stone-50 p-4 hover:border-amber-300 transition-all">
            <div className="flex items-center gap-2 text-stone-800"><FolderOpen className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'सार्वजनिक खण्ड' : 'Public Section'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'थप अभिलेख' : 'Additional Archive'}</div>
            <div className="mt-1 text-[11px] text-stone-500">{language === 'ne' ? 'लेख · तस्बिर · भिडियो · स्रोत' : 'Articles · Photos · Videos · Sources'}</div>
          </button>
          <button type="button" onClick={() => setActiveTab('library')} className={`archive-admin-workspace-card text-left rounded-xl border p-4 transition-all ${activeTab === 'library' ? 'border-amber-700 bg-amber-50 shadow-sm' : 'border-stone-200 bg-stone-50 hover:border-amber-300'}`}>
            <div className="flex items-center gap-2 text-emerald-900"><FolderOpen className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'पढाइ' : 'Reader'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'पूर्ण अनुसन्धान पुस्तकालय' : 'Full Research Library'}</div>
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
          <button type="button" onClick={() => { setSelectedPublicContentKey('history_civilization'); setPublicContentDraft(null); setActiveTab('public_content'); }} className="archive-admin-workspace-card text-left rounded-xl border border-amber-200 bg-amber-50/50 p-4 hover:border-amber-400 transition-all">
            <div className="flex items-center gap-2 text-amber-800"><LayoutDashboard className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'Home ↔ Admin' : 'Home ↔ Admin'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'सार्वजनिक सामग्री व्यवस्थापन' : 'Public Content Management'}</div>
            <div className="mt-1 text-[11px] text-stone-500">{language === 'ne' ? 'Home का मुख्य section, About, Contact, Integrity र Accuracy यहीँबाट' : 'Manage Home sections, About, Contact, Integrity and Accuracy from one CMS'}</div>
          </button>
          <button type="button" onClick={() => setActiveTab('categories')} className="archive-admin-workspace-card text-left rounded-xl border border-stone-200 bg-stone-50 p-4 hover:border-amber-300 transition-all">
            <div className="flex items-center gap-2 text-violet-800"><FolderOpen className="w-4 h-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{language === 'ne' ? 'व्यवस्थापन' : 'Management'}</span></div>
            <div className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? 'मिडिया, लेख तथा व्यवस्थापन' : 'Media, Articles & Management'}</div>
            <div className="mt-1 text-[11px] text-stone-500">{language === 'ne' ? 'लेख · तस्बिर · भिडियो · वर्ग · अनुवाद' : 'Articles · Photos · Videos · Categories · Translations'}</div>
          </button>
        </div>
      </section>

      {activeTab === 'dashboard' && (
        <section className="rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-[10px] uppercase tracking-[0.18em] font-bold text-amber-800">{language === 'ne' ? 'Editor Navigation' : 'Editor Navigation'}</p><h3 className="mt-1 font-serif-np text-xl font-bold text-stone-900">{language === 'ne' ? 'कुनै पनि अभिलेख खण्ड छान्नुहोस्' : 'Choose an archive workspace'}</h3><p className="mt-1 text-xs leading-6 text-stone-500">{language === 'ne' ? 'भित्र गएपछि माथिको Back to workspace बाट सजिलै फर्कन सकिन्छ।' : 'Every workspace has a persistent Back to workspace control so you can move in and out without losing your place.'}</p></div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] font-semibold text-emerald-800">{language === 'ne' ? 'Safe additive CMS navigation' : 'Safe additive CMS navigation'}</div>
          </div>
        </section>
      )}

      {activeTab === 'dashboard' && (
        <section className="archive-admin-public-map rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm space-y-5" aria-label={language === 'ne' ? 'सार्वजनिक अभिलेख र प्रशासनिक कार्यक्षेत्र मिलान' : 'Public archive and admin workspace map'}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-amber-800 font-semibold">{language === 'ne' ? 'सार्वजनिक अभिलेख ↔ प्रशासन' : 'PUBLIC ARCHIVE ↔ ADMIN'}</p>
              <h2 className="mt-1 text-xl sm:text-2xl font-serif-np font-bold text-stone-900">{language === 'ne' ? 'Home मा जे छ, Admin मा त्यही कार्यक्षेत्र' : 'Every public section has a matching admin workspace'}</h2>
              <p className="mt-2 max-w-3xl text-xs sm:text-sm leading-6 text-stone-600">{language === 'ne' ? 'सार्वजनिक अभिलेखको नाम र Admin को काम गर्ने ठाउँ एउटै mental map मा राखिएको छ। प्रत्येक कार्डबाट सम्बन्धित व्यवस्थापन कार्यक्षेत्र वा सार्वजनिक preview मा जान सकिन्छ।' : 'The public archive and editorial console use the same mental model. Each card opens the corresponding management workspace or a public preview, so nothing feels disconnected.'}</p>
            </div>
            <button type="button" onClick={() => navigateTo('/')} className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100"><Eye className="h-3.5 w-3.5" />{language === 'ne' ? 'Home हेर्नुहोस्' : 'Preview Home'}</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { key: 'history', icon: BookOpen, ne: 'इतिहास तथा सभ्यता', en: 'History & Civilization', descNe: 'Home को इतिहास तथा सभ्यता content यही CMS बाट सम्पादन', descEn: 'Edit the Home History & Civilization content from this CMS', tab: 'public_content' as AdminTab, contentKey: 'history_civilization', route: '/history' },
              { key: 'culture', icon: Sparkles, ne: 'संस्कृति, धर्म तथा परम्परा', en: 'Culture, Religion & Traditions', descNe: 'संस्कृति, धर्म र परम्पराको public content management', descEn: 'Public content management for culture, religion and traditions', tab: 'public_content' as AdminTab, contentKey: 'culture_religion_traditions', route: '/culture' },
              { key: 'civilization', icon: Landmark, ne: 'सभ्यता', en: 'Civilization', descNe: 'विश्वव्यापी civilization content management', descEn: 'Universal civilization content management', tab: 'public_content' as AdminTab, contentKey: 'civilization', route: '/civilization' },
              { key: 'places', icon: MapPin, ne: 'स्थान तथा गाउँ अभिलेख', en: 'Places & Village Archives', descNe: 'स्थान, गाउँ र स्थानीय इतिहासको content + existing place workspace', descEn: 'Place content plus the existing place research workspace', tab: 'places_village' as AdminTab, contentKey: 'places_village', route: '/village' },
              { key: 'oral', icon: MessageSquareQuote, ne: 'मौखिक इतिहास', en: 'Oral History', descNe: 'मौखिक history records र public section content', descEn: 'Oral history records and public section content', tab: 'oral_history' as AdminTab, contentKey: 'oral_history', route: '/oral-history' },
              { key: 'research', icon: ShieldCheck, ne: 'अनुसन्धान तथा स्रोत', en: 'Research & Sources', descNe: 'स्रोत, प्रमाण, cross-check र निष्कर्ष', descEn: 'Sources, evidence, cross-checking and conclusions', tab: 'research' as AdminTab, contentKey: 'research', route: '/research' },
              { key: 'original', icon: Sparkles, ne: 'सदन राई — नयाँ खोज', en: 'Sadan Rai — Original Research & New Findings', descNe: 'मौलिक field findings को अलग first-class workspace', descEn: 'First-class workspace for original field findings', tab: 'original_research' as AdminTab, contentKey: 'original_research', route: '/original-research' },
              { key: 'additional', icon: FolderOpen, ne: 'थप अभिलेख', en: 'Additional Archive', descNe: 'तस्बिर, भिडियो, लेख, दस्तावेज र स्रोत', descEn: 'Photos, videos, articles, documents and sources', tab: 'additional_archive' as AdminTab, contentKey: 'additional_archive', route: '/archive' },
              { key: 'about', icon: UserCheck, ne: 'सदन राईको बारेमा', en: 'About Sadan Rai', descNe: 'About page को editable institutional content', descEn: 'Editable institutional content for the About page', tab: 'public_content' as AdminTab, contentKey: 'about_sadan_rai', route: '/about' },
              { key: 'contact', icon: MessageSquareQuote, ne: 'सम्पर्क तथा योगदान', en: 'Contact & Contribution', descNe: 'सम्पर्क, contribution र research lead information', descEn: 'Contact, contribution and research-lead information', tab: 'public_content' as AdminTab, contentKey: 'contact_contribution', route: '/contact' },
              { key: 'integrity', icon: ShieldCheck, ne: 'अनुसन्धान निष्पक्षता', en: 'Research Integrity', descNe: 'archive-wide research integrity standards', descEn: 'Archive-wide research integrity standards', tab: 'public_content' as AdminTab, contentKey: 'research_integrity', route: '/research-integrity' },
              { key: 'accuracy', icon: CheckCircle2, ne: 'तथ्य शुद्धताको नियम', en: 'Accuracy & Evidence Standards', descNe: 'दाबी, प्रमाण, exact reference र correction rules', descEn: 'Claim, evidence, exact-reference and correction rules', tab: 'public_content' as AdminTab, contentKey: 'accuracy_rules', route: '/accuracy' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.key} className={`group rounded-xl border p-4 hover:border-amber-300 hover:bg-white transition-all ${item.key === 'original' ? 'border-amber-200 bg-[#F7F2E8]' : 'border-stone-200 bg-stone-50'}`}>
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-stone-900 text-amber-300"><Icon className="h-4 w-4" /></span>
                    <div className="min-w-0"><h3 className="font-serif-np font-bold text-sm text-stone-900 leading-snug">{language === 'ne' ? item.ne : item.en}</h3><p className="mt-1.5 text-[11px] leading-5 text-stone-500">{language === 'ne' ? item.descNe : item.descEn}</p></div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => { setActiveTab(item.tab); setActiveForm(null); if ('category' in item && item.category) setSelectedAdminCategory(item.category); if ('contentKey' in item && item.contentKey) { setSelectedPublicContentKey(item.contentKey); setPublicContentDraft(null); } }} className="inline-flex items-center gap-1 rounded-md bg-stone-900 px-2.5 py-1.5 text-[10px] font-semibold text-white hover:bg-stone-800"><LayoutDashboard className="h-3 w-3" />{language === 'ne' ? 'कार्यस्थान खोल्नुहोस्' : 'Open workspace'}</button>
                    <button type="button" onClick={() => navigateTo(item.route)} className="inline-flex items-center gap-1 rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-stone-700 hover:bg-stone-50"><Eye className="h-3 w-3" />{language === 'ne' ? 'सार्वजनिक हेर्नुहोस्' : 'Public preview'}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'additional_archive' && (
        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-amber-800 font-semibold">{language === 'ne' ? 'थप अभिलेख' : 'Additional Archive'}</p>
              <h2 className="mt-1 text-xl sm:text-2xl font-serif-np font-bold text-stone-900">{language === 'ne' ? 'मिडिया, लेख, स्रोत र अतिरिक्त सामग्री कार्यक्षेत्र' : 'Articles, Media, Sources & Additional Archive Workspace'}</h2>
              <p className="mt-2 max-w-3xl text-xs sm:text-sm leading-6 text-stone-600">{language === 'ne' ? 'गृहपृष्ठको थप अभिलेख खण्डको corresponding editorial workspace। हरेक content type आफ्नै Create → Edit → Save → Preview/Publish → Revision workflow मा खोल्न सकिन्छ।' : 'The matching editorial workspace for the public Additional Archive section. Each content type opens its own Create → Edit → Save → Preview/Publish → Revision workflow.'}</p>
            </div>
            <button type="button" onClick={() => navigateTo('/archive')} className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-800"><Eye className="h-3.5 w-3.5" />{language === 'ne' ? 'सार्वजनिक हेर्नुहोस्' : 'Open public archive'}</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ['articles', FileEdit, language === 'ne' ? 'लेखहरू' : 'Articles', articles.length],
              ['photos', Camera, language === 'ne' ? 'तस्बिर अभिलेख' : 'Photo Archive', photos.length],
              ['videos', Video, language === 'ne' ? 'भिडियो अभिलेख' : 'Video Archive', media.length],
              ['sources', BookOpen, language === 'ne' ? 'स्रोत तथा सन्दर्भ' : 'Sources & References', sources.length],
            ].map(([tab, Icon, label, count]) => {
              const WorkspaceIcon = Icon as React.ComponentType<{className?: string}>;
              return <button key={String(tab)} type="button" onClick={() => setActiveTab(tab as AdminTab)} className="text-left rounded-xl border border-stone-200 bg-stone-50 p-4 hover:border-amber-300 hover:bg-white transition-all"><div className="flex items-center gap-2 text-amber-900"><WorkspaceIcon className="h-4 w-4" /><span className="text-[10px] uppercase tracking-wider font-semibold">{count} {language === 'ne' ? 'रेकर्ड' : 'records'}</span></div><div className="mt-2 font-serif-np font-bold text-stone-900">{label}</div><div className="mt-1 text-[11px] text-stone-500">{language === 'ne' ? 'सम्पादन कार्यक्षेत्र खोल्नुहोस्' : 'Open editorial workspace'}</div></button>;
            })}
          </div>
        </section>
      )}

      {activeTab === 'places_village' && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-amber-800 font-semibold">{language === 'ne' ? 'स्थान तथा गाउँ अभिलेख' : 'Places & Village Archives'}</p>
              <h2 className="mt-1 text-xl sm:text-2xl font-serif-np font-bold text-stone-900">{language === 'ne' ? 'स्थान / गाउँ अनुसन्धान कार्यक्षेत्र' : 'Place & Village Editorial Workspace'}</h2>
              <p className="mt-2 max-w-3xl text-xs sm:text-sm leading-6 text-stone-600">{language === 'ne' ? 'गृहपृष्ठको स्थान तथा गाउँ अभिलेख यही कार्यप्रवाहसँग जोडिन्छ। हालको माल्बासे–१, पात्लेपानी संरचनाका ११ उपखण्डलाई अनुसन्धान, मौखिक इतिहास, प्रमाण, तस्बिर, भिडियो र लेखका अभिलेखसँग जोडेर काम गर्न सकिन्छ।' : 'The public Places & Village Archives section is connected to this workflow. The current Malbase–1, Patlepani structure has 11 subsections that can be documented through research, oral history, evidence, photo/video and article records.'}</p>
            </div>
            <button type="button" onClick={() => navigateTo('/village')} className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-800"><Eye className="h-3.5 w-3.5" />{language === 'ne' ? 'सार्वजनिक अभिलेख हेर्नुहोस्' : 'Open public archive'}</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MALBASE_SECTION_HEADINGS.map((section, index) => (
              <div key={section.key} className="rounded-xl border border-stone-200 bg-white p-4">
                <div className="text-[10px] font-mono text-amber-800">{String(index + 1).padStart(2, '0')}</div>
                <h3 className="mt-1 font-serif-np font-bold text-sm text-stone-900">{language === 'ne' ? section.nepaliTitle : section.englishTitle}</h3>
                <p className="mt-1.5 text-[11px] leading-5 text-stone-500">{section.summary}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 border-t border-amber-200 pt-4">
            <button type="button" onClick={() => { setEditingResearchItem(null); setActiveTab('research'); setActiveForm('research'); }} className="inline-flex items-center gap-2 rounded-lg bg-amber-800 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700"><PlusCircle className="h-3.5 w-3.5" />{language === 'ne' ? 'स्थानसम्बन्धी अनुसन्धान' : 'New place research'}</button>
            <button type="button" onClick={() => { setEditingOralHistoryItem(null); setActiveTab('oral_history'); setActiveForm('oral_history'); }} className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"><MessageSquareQuote className="h-3.5 w-3.5" />{language === 'ne' ? 'मौखिक इतिहास' : 'New oral history'}</button>
            <button type="button" onClick={() => { setEditingEvidenceItem(null); setActiveTab('evidence'); setActiveForm('evidence'); }} className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"><Database className="h-3.5 w-3.5" />{language === 'ne' ? 'प्रमाण थप्नुहोस्' : 'Add evidence'}</button>
            <button type="button" onClick={() => { setActiveTab('photos'); setActiveForm('photo'); }} className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"><Camera className="h-3.5 w-3.5" />{language === 'ne' ? 'तस्बिर थप्नुहोस्' : 'Add photo'}</button>
            <button type="button" onClick={() => { setActiveTab('videos'); setActiveForm('video'); }} className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"><Video className="h-3.5 w-3.5" />{language === 'ne' ? 'भिडियो थप्नुहोस्' : 'Add video'}</button>
          </div>
        </section>
      )}

      {activeTab === 'kirat_research' && (
      <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-amber-800 font-semibold">{language === 'ne' ? 'मुख्य अनुसन्धान' : 'Master Research'}</p>
            <h2 className="text-lg font-serif-np font-bold text-stone-900">{language === 'ne' ? '२० खण्डको मुख्य किराँत अनुसन्धान' : '20-Section Kirat Master Research'}</h2>
            <p className="mt-1 text-xs text-stone-600 leading-relaxed">
              {language === 'ne'
                ? 'Public मा रहेका २० वटै किराँत अनुसन्धान खण्ड यहीँबाट पढ्न, सम्पादन, सुरक्षित र प्रकाशित गर्न सकिन्छ। ४५ स्रोतको evidence status कायम राखेर मात्र निष्कर्ष प्रकाशित गर्नुहोस्।'
                : 'Read, edit, save, preview and publish all 20 public Kirat research sections here. Publish conclusions only within the evidence boundary of the 45-source audit.'}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-amber-300 bg-white px-2.5 py-1 text-[10px] font-semibold text-amber-900">45 {language === 'ne' ? 'स्रोत' : 'sources'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {KIRAT_FINAL_RESEARCH_SECTIONS.map(section => {
            const exists = researchList.some(item => item.id === `kirat-final-${section.key}`);
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => openFinalResearchEditor(section.key)}
                className="text-left rounded-lg border border-stone-200 bg-white p-3 hover:border-amber-400 hover:bg-amber-50 transition-colors"
              >
                <div className="text-xs font-semibold text-stone-900">{language === 'ne' ? section.nepaliTitle : section.englishTitle}</div>
                <div className="mt-1 text-[10px] text-stone-500">{exists ? (language === 'ne' ? 'प्रकाशित/सम्पादनयोग्य record' : 'Published/editable record') : (language === 'ne' ? 'Master draft तयार' : 'Master draft ready')}</div>
              </button>
            );
          })}
        </div>
      </section>
      )}

      {activeTab === 'dashboard' && (
      <div className="archive-admin-sections border-b border-stone-200">
        <div className="flex items-center justify-between gap-3 py-2">
          <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-semibold">{language === 'ne' ? 'सबै अभिलेख खण्ड' : 'All archive sections'}</span>
          <span className="text-[10px] text-stone-400">{language === 'ne' ? 'सबै पुराना विकल्प यथावत् छन्' : 'All existing sections remain available'}</span>
        </div>
        <div className="archive-admin-tabs flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin text-xs font-medium">
          
          <button
            onClick={() => openHomeContentWorkspace()}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'home_content' ? 'bg-amber-800 text-white' : 'text-stone-600 hover:bg-amber-50 hover:text-amber-900'
            }`}
          >
            <LayoutDashboard className="inline-block mr-1.5 h-3.5 w-3.5" />{language === 'ne' ? 'गृहपृष्ठ CMS' : 'Home CMS'} ({archiveSectionContent.length})
          </button>

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
            onClick={() => setActiveTab('original_research')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'original_research'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-indigo-50 hover:text-amber-900'
            }`}
          >
            <Sparkles className="inline-block mr-1.5 h-3.5 w-3.5" />{language === 'ne' ? 'मौलिक अनुसन्धान' : 'Original Research'} ({originalResearchList.length})
          </button>

          <button
            onClick={() => setActiveTab('places_village')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'places_village'
                ? 'bg-amber-800 text-white'
                : 'text-stone-600 hover:bg-amber-50 hover:text-amber-900'
            }`}
          >
            <MapPin className="inline-block mr-1.5 h-3.5 w-3.5" />{language === 'ne' ? 'स्थान तथा गाउँ अभिलेख' : 'Places & Village Archives'}
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'library'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {language === 'ne' ? 'पूर्ण अनुसन्धान पुस्तकालय' : 'Full Research Library'} ({ADMIN_RESEARCH_LIBRARY_DOCUMENTS.length})
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
            onClick={() => setActiveTab('public_content')}
            className={`px-3 py-2 rounded whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'public_content' ? 'bg-amber-800 text-white' : 'text-stone-600 hover:bg-amber-50 hover:text-amber-900'
            }`}
          >
            {language === 'ne' ? 'Public Content CMS' : 'Public Content CMS'}
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
      )}

      {/* 5. Main Content Dispatcher per Tab */}
      {activeTab !== 'dashboard' && (
        <div className="archive-admin-context-bar sticky top-2 z-30 rounded-xl border border-stone-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5 text-[11px]">
              <button type="button" onClick={() => setActiveTab('dashboard')} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-semibold text-stone-600 hover:bg-stone-100 hover:text-stone-900">
                <Home className="h-3.5 w-3.5" /> {language === 'ne' ? 'कार्य क्षेत्र' : 'Workspace'}
              </button>
              <ChevronRight className="h-3.5 w-3.5 text-stone-300" />
              <span className="truncate rounded-lg bg-stone-100 px-2.5 py-1.5 font-semibold text-stone-800">
                {activeTab === 'home_content' ? (language === 'ne' ? 'गृहपृष्ठ CMS' : 'Home Content CMS') : activeTab === 'original_research' ? (language === 'ne' ? 'सदन राई — मौलिक अनुसन्धान तथा नयाँ खोज' : 'Sadan Rai — Original Research & New Findings') : activeTab === 'library' ? (language === 'ne' ? 'अनुसन्धान पुस्तकालय' : 'Research Library') : activeTab === 'research' ? (language === 'ne' ? 'अनुसन्धान अभिलेख' : 'Research Archive') : activeTab === 'places_village' ? (language === 'ne' ? 'स्थान तथा गाउँ अभिलेख' : 'Places & Village Archives') : activeTab === 'public_archive' ? (language === 'ne' ? 'सार्वजनिक अभिलेख नक्सा' : 'Public Archive Map') : activeTab === 'public_content' ? (language === 'ne' ? 'सार्वजनिक सामग्री व्यवस्थापन' : 'Public Content Management') : activeTab === 'additional_archive' ? (language === 'ne' ? 'थप अभिलेख' : 'Additional Archive') : activeTab === 'kirat_research' ? (language === 'ne' ? '२० खण्डको किराँत अनुसन्धान' : '20-Section Kirat Research') : activeTab.replace('_', ' ')}
              </span>
            </div>
            <button type="button" onClick={() => setActiveTab('dashboard')} className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-stone-700 hover:bg-stone-50">
              <ArrowLeft className="h-3.5 w-3.5" /> {language === 'ne' ? 'मुख्य कार्यक्षेत्रमा फर्कनुहोस्' : 'Back to workspace'}
            </button>
          </div>
        </div>
      )}

      {/* TAB: ORIGINAL RESEARCH — first-class Sadan Rai finding workspace */}
      {activeTab === 'home_content' && (
        <section id="admin-home-content-workspace" className="rounded-2xl border border-amber-200 bg-white p-4 sm:p-6 shadow-sm space-y-5 scroll-mt-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-amber-800 font-semibold">{language === 'ne' ? 'Public Home ↔ Admin CMS' : 'Public Home ↔ Admin CMS'}</p>
              <h2 className="mt-1 font-serif-np text-xl sm:text-2xl font-bold text-stone-900">{language === 'ne' ? 'गृहपृष्ठका सबै प्रमुख खण्ड व्यवस्थापन' : 'Manage Every Major Home Page Section'}</h2>
              <p className="mt-2 max-w-3xl text-xs leading-6 text-stone-600">{language === 'ne' ? 'Home मा देखिने major content यहीँबाट सम्पादन, मस्यौदा, preview, publish र version history सहित व्यवस्थापन हुन्छ। About, Contact, Integrity, Accuracy र archive sections कुनै पनि orphan हुँदैनन्।' : 'Every major Home section is managed here with edit, draft, preview, publish and version history. About, Contact, Integrity, Accuracy and archive sections are all represented.'}</p>
            </div>
            <button type="button" onClick={() => { setActiveTab('dashboard'); setHomeContentDraft(null); }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50"><ArrowLeft className="h-3.5 w-3.5" />{language === 'ne' ? 'Workspace मा फर्कनुहोस्' : 'Back to workspace'}</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-4">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-2 space-y-1">
              {archiveSectionContent.map((item, index) => (
                <button key={item.id} type="button" onClick={() => { setSelectedHomeContentKey(item.sectionKey); setHomeContentDraft({ ...item }); setShowHomeContentPreview(false); }} className={`w-full rounded-lg p-3 text-left transition-all ${selectedHomeContentKey === item.sectionKey ? 'bg-stone-900 text-white shadow-sm' : 'bg-transparent text-stone-700 hover:bg-white'}`}>
                  <span className={`block text-[9px] font-mono ${selectedHomeContentKey === item.sectionKey ? 'text-amber-300' : 'text-amber-800'}`}>{String(index + 1).padStart(2, '0')}</span>
                  <strong className="mt-0.5 block text-xs">{language === 'ne' ? item.nepaliTitle : item.englishTitle}</strong>
                  <span className={`mt-1 block text-[9px] ${selectedHomeContentKey === item.sectionKey ? 'text-stone-300' : 'text-stone-500'}`}>{item.workflowStatus === 'published' ? (language === 'ne' ? 'प्रकाशित' : 'Published') : (language === 'ne' ? 'मस्यौदा' : 'Draft')} · v{item.version}</span>
                </button>
              ))}
            </div>

            <div className="min-w-0 rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
              {!homeContentDraft ? (
                <div className="py-12 text-center text-xs text-stone-500">{language === 'ne' ? 'बायाँबाट गृहपृष्ठको खण्ड छान्नुहोस्।' : 'Choose a Home section from the left.'}</div>
              ) : (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-900">{homeContentDraft.sectionKey}</span><h3 className="mt-2 font-serif-np text-xl font-bold text-stone-900">{language === 'ne' ? homeContentDraft.nepaliTitle : homeContentDraft.englishTitle}</h3><p className="mt-1 text-[10px] text-stone-500">{language === 'ne' ? 'Home content record · CMS workflow' : 'Home content record · CMS workflow'}</p></div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => setShowHomeContentPreview(v => !v)} className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-[11px] font-bold text-stone-700 hover:bg-stone-50"><Eye className="h-3.5 w-3.5" />{showHomeContentPreview ? (language === 'ne' ? 'सम्पादन' : 'Edit') : (language === 'ne' ? 'Preview' : 'Preview')}</button>
                      <button type="button" onClick={async () => { try { await saveArchiveSection({ ...homeContentDraft, workflowStatus: 'draft' }); setFeedbackMsg(language === 'ne' ? 'मस्यौदा सुरक्षित भयो।' : 'Draft saved.'); setTimeout(() => setFeedbackMsg(null), 1600); } catch { setFeedbackMsg(language === 'ne' ? 'मस्यौदा सुरक्षित गर्न असफल भयो।' : 'Draft save failed.'); } }} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-[11px] font-bold text-stone-700 hover:bg-stone-50">{language === 'ne' ? 'मस्यौदा सुरक्षित' : 'Save Draft'}</button>
                      <button type="button" onClick={async () => { try { await saveArchiveSection({ ...homeContentDraft, workflowStatus: 'published' }); setHomeContentDraft(prev => prev ? { ...prev, workflowStatus: 'published', version: prev.version + 1 } : prev); setFeedbackMsg(language === 'ne' ? 'गृहपृष्ठ सामग्री प्रकाशित भयो।' : 'Home content published.'); setTimeout(() => setFeedbackMsg(null), 1600); } catch { setFeedbackMsg(language === 'ne' ? 'प्रकाशन असफल भयो।' : 'Publish failed.'); } }} className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3 py-2 text-[11px] font-bold text-white hover:bg-stone-800"><CheckCircle2 className="h-3.5 w-3.5" />{language === 'ne' ? 'प्रकाशित गर्नुहोस्' : 'Publish'}</button>
                    </div>
                  </div>

                  {showHomeContentPreview ? (
                    <article className="rounded-2xl border border-stone-200 bg-stone-50 p-5 space-y-3">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-amber-800 font-mono">{language === 'ne' ? 'गृहपृष्ठ Preview' : 'Home Preview'}</p>
                      <h4 className="font-serif-np text-2xl font-bold text-stone-900">{language === 'ne' ? homeContentDraft.nepaliTitle : homeContentDraft.englishTitle}</h4>
                      <p className="text-sm leading-6 text-stone-600">{language === 'ne' ? homeContentDraft.nepaliDescription : homeContentDraft.englishDescription}</p>
                      <div className="border-t border-stone-200 pt-4 whitespace-pre-line text-sm leading-7 text-stone-700">{language === 'ne' ? homeContentDraft.nepaliBody : homeContentDraft.englishBody}</div>
                    </article>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <label className="block text-xs font-semibold text-stone-700">नेपाली शीर्षक<input value={homeContentDraft.nepaliTitle} onChange={e => setHomeContentDraft({ ...homeContentDraft, nepaliTitle: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm" /></label>
                        <label className="block text-xs font-semibold text-stone-700">English title<input value={homeContentDraft.englishTitle} onChange={e => setHomeContentDraft({ ...homeContentDraft, englishTitle: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm" /></label>
                        <label className="block text-xs font-semibold text-stone-700">नेपाली विवरण<textarea value={homeContentDraft.nepaliDescription} onChange={e => setHomeContentDraft({ ...homeContentDraft, nepaliDescription: e.target.value })} rows={4} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm" /></label>
                        <label className="block text-xs font-semibold text-stone-700">English description<textarea value={homeContentDraft.englishDescription} onChange={e => setHomeContentDraft({ ...homeContentDraft, englishDescription: e.target.value })} rows={4} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm" /></label>
                        <label className="block text-xs font-semibold text-stone-700">नेपाली मुख्य सामग्री<textarea value={homeContentDraft.nepaliBody} onChange={e => setHomeContentDraft({ ...homeContentDraft, nepaliBody: e.target.value })} rows={8} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm leading-6" /></label>
                        <label className="block text-xs font-semibold text-stone-700">English body<textarea value={homeContentDraft.englishBody} onChange={e => setHomeContentDraft({ ...homeContentDraft, englishBody: e.target.value })} rows={8} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm leading-6" /></label>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-4">
                        <span className="text-[10px] font-mono text-stone-500">{language === 'ne' ? 'Revision history स्वचालित रूपमा record हुन्छ' : 'Revision history is recorded automatically'} · v{homeContentDraft.version}</span>
                        <button type="button" onClick={() => { setActiveTab('revisions'); }} className="text-[11px] font-bold text-amber-900 hover:underline">{language === 'ne' ? 'संस्करण इतिहास हेर्नुहोस् →' : 'Open version history →'}</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'original_research' && (
        <div id="original-research-workspace" className="space-y-4 scroll-mt-6">
          <section className="archive-research-workflow-strip" aria-label={language === 'ne' ? 'मौलिक अनुसन्धान workflow' : 'Original Research workflow'}>
            <div className="archive-research-workflow-head"><div><span className="archive-research-workflow-kicker">{language === 'ne' ? 'समान Master Workflow' : 'SHARED MASTER WORKFLOW'}</span><h3>{language === 'ne' ? 'सदन राई — मौलिक अनुसन्धान तथा नयाँ खोज' : 'Sadan Rai — Original Research & New Findings'}</h3></div><span className="archive-research-workflow-note">{language === 'ne' ? 'Field Finding बाट Version History सम्म' : 'Field Finding through Version History'}</span></div>
            <div className="archive-research-workflow-steps">{(language === 'ne' ? ['Field Finding','मूल अवलोकन','Original Evidence','Existing Research Link','स्वतन्त्र Cross-check','प्रमाण मूल्याङ्कन','विश्लेषण / निष्कर्ष','प्रकाशन → संस्करण इतिहास'] : ['Field Finding','Original Observation','Original Evidence','Existing Research Link','Independent Cross-check','Evidence Assessment','Analysis / Conclusion','Publication → Version History']).map((step,i,steps)=><div key={step} className="archive-research-workflow-step"><span>{String(i+1).padStart(2,'0')}</span><strong>{step}</strong>{i<steps.length-1&&<ArrowRight className="archive-research-workflow-arrow" aria-hidden="true"/>}</div>)}</div>
          </section>
          <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-stone-50 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-amber-900"><Sparkles className="h-5 w-5" /><span className="text-[10px] uppercase tracking-[0.18em] font-bold">{language === 'ne' ? 'सदन राई — मौलिक अनुसन्धान' : 'Sadan Rai — Original Research'}</span></div>
                <h3 className="mt-2 font-serif-np text-2xl font-bold text-stone-900">{language === 'ne' ? 'मौलिक अनुसन्धान तथा नयाँ खोजहरू' : 'Original Research & New Findings'}</h3>
                <p className="mt-2 max-w-3xl text-xs leading-6 text-stone-600">{language === 'ne' ? 'तपाईंले field, धामी, स्थानीय जानकार, ज्येष्ठ व्यक्ति, नयाँ document वा material evidence बाट भेटेको नयाँ कुरा यहीँ दर्ता गर्नुहोस्। यो finding स्वतः ऐतिहासिक तथ्य मानिँदैन; evidence, provenance, cross-check, assessment र version trail सँगै अघि बढ्छ।' : 'Record a new finding from fieldwork, dhami/local informants, elders, documents, or material evidence. A finding is never automatically treated as historical fact; it moves through evidence, provenance, cross-check, assessment, review, and version history.'}</p>
              </div>
              <button type="button" onClick={() => { setEditingResearchItem(null); setFocusOriginalResearchForm(true); setActiveForm('research'); }} className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-stone-800"><Sparkles className="h-4 w-4" />{language === 'ne' ? 'नयाँ मौलिक अनुसन्धान' : 'New Original Research'}</button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                [language === 'ne' ? 'कुल खोज' : 'Findings', String(originalResearchList.length)],
                [language === 'ne' ? 'पुष्टि भएको' : 'Corroborated', String(originalResearchList.filter(x => x.researchWorkflow?.originalFinding?.findingStatus === 'corroborated').length)],
                [language === 'ne' ? 'थप अनुसन्धान' : 'Further research', String(originalResearchList.filter(x => x.researchWorkflow?.originalFinding?.findingStatus === 'further_research').length)],
                [language === 'ne' ? 'प्रमाणसहित' : 'With evidence', String(originalResearchList.filter(x => (x.researchWorkflow?.originalFinding?.evidenceAttachments?.length || 0) > 0).length)]
              ].map(([label,value]) => <div key={label} className="rounded-xl border border-amber-100 bg-white p-3"><div className="text-[10px] uppercase tracking-wider text-stone-500">{label}</div><div className="mt-1 text-xl font-bold text-stone-900">{value}</div></div>)}
            </div>
          </section>

          {originalResearchList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/40 p-10 text-center">
              <Sparkles className="mx-auto h-9 w-9 text-amber-500" />
              <h4 className="mt-3 font-serif-np text-lg font-bold text-stone-900">{language === 'ne' ? 'अहिलेसम्म मौलिक खोज दर्ता गरिएको छैन' : 'No original findings registered yet'}</h4>
              <p className="mx-auto mt-2 max-w-xl text-xs leading-6 text-stone-500">{language === 'ne' ? 'पहिलो finding दर्ता गर्दा Finding ID, field context, exact observation, original evidence, cross-check, evidence assessment, researcher analysis, conclusion र version trail सुरक्षित हुनेछ।' : 'Register the first finding with a stable Finding ID, field context, exact observation, original evidence, cross-check, evidence assessment, researcher analysis, conclusion, and version trail.'}</p>
              <button type="button" onClick={() => { setEditingResearchItem(null); setFocusOriginalResearchForm(true); setActiveForm('research'); }} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-800"><PlusCircle className="h-4 w-4" />{language === 'ne' ? 'पहिलो खोज दर्ता गर्नुहोस्' : 'Register first finding'}</button>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {originalResearchList.map(item => {
                const finding = item.researchWorkflow!.originalFinding!;
                const evidenceCount = finding.evidenceAttachments?.length || 0;
                return <article key={item.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><div className="flex flex-wrap gap-1.5"><span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-bold text-amber-900">{finding.findingId}</span><span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] text-stone-700">{finding.findingStatus}</span></div><h4 className="mt-2 font-serif-np text-lg font-bold text-stone-900">{language === 'ne' ? (item.nepaliTitle || item.title) : (item.englishTitle || item.title)}</h4></div>
                    <Sparkles className="h-5 w-5 shrink-0 text-amber-600" />
                  </div>
                  <p className="mt-3 line-clamp-4 text-xs leading-6 text-stone-600">{finding.newFinding || finding.exactObservation || '—'}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]"><div className="rounded-lg bg-stone-50 p-2"><span className="block text-stone-400">{language === 'ne' ? 'स्थान' : 'Location'}</span><strong className="text-stone-700">{finding.discoveryLocation || item.location || '—'}</strong></div><div className="rounded-lg bg-stone-50 p-2"><span className="block text-stone-400">{language === 'ne' ? 'प्रमाण' : 'Evidence'}</span><strong className="text-stone-700">{evidenceCount} {language === 'ne' ? 'फाइल' : 'file(s)'}</strong></div></div>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-100 pt-3"><button type="button" onClick={() => setReadingResearchItem(item)} className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3 py-2 text-[11px] font-bold text-white hover:bg-stone-800"><Eye className="h-3.5 w-3.5" />{language === 'ne' ? 'पूरा हेर्नुहोस्' : 'Open finding'}</button><button type="button" onClick={() => { setEditingResearchItem(item); setFocusOriginalResearchForm(true); setActiveForm('research'); }} className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-[11px] font-bold text-stone-700 hover:bg-stone-50"><Edit3 className="h-3.5 w-3.5" />{language === 'ne' ? 'सम्पादन' : 'Edit'}</button></div>
                </article>
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: FULL RESEARCH LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-emerald-900">
              <FolderOpen className="w-5 h-5" />
              <h3 className="font-serif-np text-xl font-bold">{language === 'ne' ? 'पूर्ण अनुसन्धान पुस्तकालय — प्रशासक पाठक' : 'Full Research Library — Admin Reader'}</h3>
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
                  id="admin-library-search"
                  data-admin-typing-key="admin-library-search"
                  value={libraryQuery}
                  onChange={e => setLibraryQuery(e.target.value)}
                  placeholder={language === 'ne' ? 'अनुसन्धान फाइल खोज्नुहोस्...' : 'Search research files...'}
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
          <section className="archive-research-workflow-strip" aria-label={language === 'ne' ? 'अनुसन्धान अभिलेख workflow' : 'Research archive workflow'}>
            <div className="archive-research-workflow-head"><div><span className="archive-research-workflow-kicker">{language === 'ne' ? 'समान Master Workflow' : 'SHARED MASTER WORKFLOW'}</span><h3>{language === 'ne' ? 'सदन राई — अनुसन्धान तथा स्रोत' : 'Sadan Rai — Research & Sources'}</h3></div><span className="archive-research-workflow-note">{language === 'ne' ? 'Original Research सहित एउटै standard' : 'Same standard as Original Research'}</span></div>
            <div className="archive-research-workflow-steps">{(language === 'ne' ? ['स्रोत / संकेत','मूल अवलोकन','प्रमाण','स्वतन्त्र Cross-check','प्रमाण मूल्याङ्कन','अनुसन्धान विश्लेषण','निष्कर्ष / थप अनुसन्धान','प्रकाशन → संस्करण इतिहास'] : ['Source / Lead','Original Observation','Evidence','Independent Cross-check','Evidence Assessment','Researcher Analysis','Conclusion / Further Research','Publication → Version History']).map((step,i,steps)=><div key={step} className="archive-research-workflow-step"><span>{String(i+1).padStart(2,'0')}</span><strong>{step}</strong>{i<steps.length-1&&<ArrowRight className="archive-research-workflow-arrow" aria-hidden="true"/>}</div>)}</div>
          </section>
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
                id="admin-research-search"
                data-admin-typing-key="admin-research-search"
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

          {!loading && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2 text-[11px] text-stone-700">
              {language === 'ne'
                ? `२० वटै सार्वजनिक किराँत master research sections Admin मा सधैँ उपलब्ध छन्। Firebase मा save गरिएको record भए त्यसलाई प्राथमिकता दिइन्छ; नयाँ master section edit/save गर्दा सोही ID मा CMS record सुरक्षित हुन्छ।`
                : `All 20 public Kirat master research sections remain available in Admin. A saved Firebase record takes precedence; editing and saving a master section stores the CMS record under the same stable ID.`}
            </div>
          )}
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

      {/* TAB: PUBLIC CONTENT CMS */}
      {activeTab === 'public_content' && (() => {
        const publicKeys = [
          ['history_civilization','इतिहास तथा सभ्यता','History & Civilization'],
          ['culture_religion_traditions','संस्कृति, धर्म तथा परम्परा','Culture, Religion & Traditions'],
          ['civilization','सभ्यता','Civilization'],
          ['places_village','स्थान तथा गाउँ अभिलेख','Places & Village Archives'],
          ['oral_history','मौखिक इतिहास','Oral History'],
          ['research','अनुसन्धान तथा स्रोत','Research & Sources'],
          ['original_research','सदन राई — नयाँ खोज','Sadan Rai — Original Research & New Findings'],
          ['additional_archive','थप अभिलेख','Additional Archive'],
          ['about_sadan_rai','सदन राईको बारेमा','About Sadan Rai'],
          ['contact_contribution','सम्पर्क तथा योगदान','Contact & Contribution'],
          ['research_integrity','अनुसन्धान निष्पक्षता','Research Integrity'],
          ['accuracy_rules','तथ्य शुद्धताको नियम','Accuracy & Evidence Standards'],
        ] as const;
        const selected = archiveSectionContent.find(item => item.sectionKey === selectedPublicContentKey) || archiveSectionContent[0];
        if (!selected) return null;
        const draft = publicContentDraft && publicContentDraft.id === selected.id ? publicContentDraft : selected;
        const setField = (key: keyof ArchiveSectionContent, value: string) => setPublicContentDraft({ ...draft, [key]: value });
        const openPublicPreview = () => {
          setShowPublicContentPreview(true);
          window.setTimeout(() => {
            document.getElementById('public-content-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 40);
        };
        const save = async (status: 'draft' | 'published') => {
          await saveArchiveSection({ ...draft, workflowStatus: status });
          setPublicContentDraft(null);
        };
        return <section className="space-y-5">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><p className="text-[10px] uppercase tracking-[0.18em] text-amber-800 font-semibold">{language === 'ne' ? 'HOME ↔ ADMIN PARITY' : 'HOME ↔ ADMIN PARITY'}</p><h2 className="mt-1 text-xl sm:text-2xl font-serif-np font-bold text-stone-900">{language === 'ne' ? 'Home मा देखिने सामग्री यहीँबाट सम्पादन गर्नुहोस्' : 'Edit the public-facing sections from the matching admin workspace'}</h2><p className="mt-2 text-xs sm:text-sm leading-6 text-stone-600">{language === 'ne' ? 'हरेक प्रमुख public section को नेपाली/English title, description, body, status र version एउटै CMS workflow मा राखिएको छ।' : 'Each major public section has bilingual title, description, body, status and version controls in one CMS workflow.'}</p></div>
              <button type="button" onClick={() => navigateTo('/')} className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"><Eye className="h-3.5 w-3.5" />{language === 'ne' ? 'Home preview' : 'Home preview'}</button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {publicKeys.map(([key, neTitle, enTitle]) => {
              const item = archiveSectionContent.find(x => x.sectionKey === key);
              return <button key={key} type="button" onClick={() => { setSelectedPublicContentKey(key); setPublicContentDraft(null); setShowPublicContentPreview(false); }} className={`text-left rounded-xl border p-4 transition-all ${selectedPublicContentKey === key ? 'border-amber-700 bg-amber-50 shadow-sm' : 'border-stone-200 bg-white hover:border-amber-300'}`}>
                <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-mono text-amber-800">{String(publicKeys.findIndex(x => x[0] === key)+1).padStart(2,'0')}</span><span className={`text-[9px] font-semibold rounded-full px-2 py-1 ${item?.workflowStatus === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>{item?.workflowStatus || 'draft'}</span></div>
                <h3 className="mt-2 font-serif-np font-bold text-stone-900">{language === 'ne' ? neTitle : enTitle}</h3>
              </button>;
            })}
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-semibold">{language === 'ne' ? 'सम्पादन क्षेत्र' : 'Editorial fields'}</p><h3 className="mt-1 font-serif-np text-xl font-bold text-stone-900">{language === 'ne' ? draft.nepaliTitle : draft.englishTitle}</h3><p className="text-[11px] text-stone-500 mt-1">ID: {draft.id} · v{draft.version}</p></div><span className="rounded-lg bg-stone-100 px-3 py-2 text-[10px] font-semibold text-stone-600">{draft.workflowStatus}</span></div>
            <div className="grid md:grid-cols-2 gap-4">
              {([['nepaliTitle','नेपाली शीर्षक'],['englishTitle','English Title'],['nepaliDescription','नेपाली संक्षिप्त विवरण'],['englishDescription','English Description']] as const).map(([key,label]) => <label key={key} className="text-xs font-semibold text-stone-700">{label}<input className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm font-normal" value={String(draft[key])} onChange={e=>setField(key,e.target.value)} /></label>)}
              {([['nepaliBody','नेपाली मुख्य सामग्री'],['englishBody','English Main Content']] as const).map(([key,label]) => <label key={key} className="text-xs font-semibold text-stone-700 md:col-span-2">{label}<textarea className="mt-2 w-full min-h-36 rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm font-normal leading-6" value={String(draft[key])} onChange={e=>setField(key,e.target.value)} /></label>)}
            </div>
            <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-stone-100"><button type="button" onClick={()=>save('draft')} className="rounded-lg bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white">{language === 'ne' ? 'मस्यौदा सुरक्षित गर्नुहोस्' : 'Save Draft'}</button><button type="button" onClick={openPublicPreview} aria-expanded={showPublicContentPreview} className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"><Eye className="inline h-3.5 w-3.5 mr-1" />{showPublicContentPreview ? (language === 'ne' ? 'पूर्वावलोकन खुला' : 'Preview Open') : (language === 'ne' ? 'पूर्वावलोकन' : 'Preview')}</button><button type="button" onClick={()=>save('published')} className="rounded-lg bg-amber-800 px-4 py-2.5 text-xs font-semibold text-white">{language === 'ne' ? 'प्रकाशित गर्नुहोस्' : 'Publish'}</button></div>
          </div>
          {showPublicContentPreview && <div id="public-content-preview" className="scroll-mt-24 rounded-2xl border border-amber-200 bg-[#F7F2E8] p-5 sm:p-7 shadow-sm"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.18em] text-amber-800 font-semibold">{language === 'ne' ? 'PUBLIC PREVIEW' : 'PUBLIC PREVIEW'}</p><h3 className="mt-1 font-serif-np text-2xl font-bold text-stone-900">{language === 'ne' ? draft.nepaliTitle : draft.englishTitle}</h3></div><button type="button" onClick={()=>setShowPublicContentPreview(false)} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold">{language === 'ne' ? 'बन्द' : 'Close'}</button></div><p className="mt-3 text-sm font-semibold text-stone-700">{language === 'ne' ? draft.nepaliDescription : draft.englishDescription}</p><div className="mt-4 text-sm text-stone-700 leading-7 whitespace-pre-line">{language === 'ne' ? draft.nepaliBody : draft.englishBody}</div></div>}
        </section>;
      })()}

      {/* TAB: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="font-serif-np font-bold text-stone-900 text-lg">{adminText(language, 'विस्तारयोग्य विषयगत वर्गहरू (Expandable Categories)' )}</h3>
            <p className="text-xs text-stone-500 font-sans">
              {language === 'ne'
                ? 'वर्ग छानेपछि त्यससँग सम्बन्धित अनुसन्धान अभिलेख यहीँबाट खोल्न, पूरा पढ्न र सम्पादन गर्न सकिन्छ।'
                : 'Select a category to open its related research records, read the full record, and edit it.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RESEARCH_CATEGORIES.map((cat, idx) => {
              const count = categoryResearchMatches(cat.key).length;
              const selected = selectedAdminCategory === cat.key;
              return (
                <button key={cat.key} type="button" onClick={() => setSelectedAdminCategory(selected ? null : cat.key)} className={`text-left p-4 bg-white rounded-lg border space-y-1 text-xs transition-all ${selected ? 'border-amber-700 bg-amber-50 shadow-sm' : 'border-stone-200 hover:border-amber-300 hover:shadow-sm'}`}>
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-400"><span>#{idx + 1}</span><span>{count} {language === 'ne' ? 'अनुसन्धान' : 'research'}</span></div>
                  <h4 className="font-serif-np font-bold text-stone-900 text-sm">{language === 'ne' ? cat.nepali : cat.english}</h4>
                  <p className="text-stone-600 text-[11px] leading-relaxed">{language === 'ne' ? cat.descriptionNepali : (cat.descriptionEnglish || cat.descriptionNepali)}</p>
                </button>
              );
            })}
          </div>

          {selectedAdminCategory && (() => {
            const category = RESEARCH_CATEGORIES.find(item => item.key === selectedAdminCategory);
            const records = categoryResearchMatches(selectedAdminCategory);
            if (!category) return null;
            return (
              <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><div className="text-[10px] font-mono uppercase tracking-wider text-amber-800">{language === 'ne' ? 'वर्गभित्रका अनुसन्धान' : 'Research in this category'}</div><h4 className="mt-1 font-serif-np text-xl font-bold text-stone-900">{language === 'ne' ? category.nepali : category.english}</h4></div>
                  <button type="button" onClick={() => setSelectedAdminCategory(null)} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50">{language === 'ne' ? 'बन्द' : 'Close'}</button>
                </div>
                {records.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-stone-300 bg-white p-6 text-center text-sm text-stone-500">{language === 'ne' ? 'यस वर्गमा अहिले सम्बन्धित अनुसन्धान अभिलेख छैन। नयाँ अनुसन्धान थप्दा यही वर्ग छान्न सकिन्छ।' : 'There are no matching research records in this category yet. New research can be assigned to this category.'}</div>
                ) : (
                  <div className="space-y-3">
                    {records.map(item => (
                      <article key={item.id} className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0"><h5 className="font-serif-np text-base font-bold text-stone-900">{language === 'ne' ? (item.nepaliTitle || item.title) : (item.englishTitle || item.title)}</h5><p className="mt-1 text-[11px] text-stone-500">{item.topic} · {item.researchStatus} · v{item.version}</p></div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setReadingResearchItem(item)} className="inline-flex items-center gap-1 rounded-lg bg-stone-900 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-800"><Eye className="w-3.5 h-3.5" />{language === 'ne' ? 'पूरा पढ्नुहोस्' : 'Read full research'}</button>
                            <button type="button" onClick={() => { setEditingResearchItem(item); setActiveForm('research'); }} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50">{language === 'ne' ? 'सम्पादन' : 'Edit'}</button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            );
          })()}
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
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setReadingResearchItem(item)} className="inline-flex items-center gap-1 rounded bg-stone-900 px-3 py-1 text-xs font-semibold text-white hover:bg-stone-800"><Eye className="w-3.5 h-3.5" />{language === 'ne' ? 'पढ्नुहोस्' : 'Read'}</button>
                  <button onClick={() => { setEditingResearchItem(item); setActiveForm('research'); }} className="px-3 py-1 border rounded hover:bg-stone-50">{adminText(language, 'सम्पादन')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: REVISIONS */}
      {activeTab === 'revisions' && (
        <AdminRevisionHistoryView />
      )}

      {showCommandPalette && (
        <div className="fixed inset-0 z-[120] bg-stone-950/55 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={language === 'ne' ? 'द्रुत कार्य खोज' : 'Command palette'} onMouseDown={() => setShowCommandPalette(false)}>
          <div className="mx-auto mt-[8vh] max-w-2xl overflow-hidden rounded-2xl border border-stone-200 bg-[#FBF9F5] shadow-2xl" onMouseDown={event => event.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-stone-200 px-4 py-3">
              <Search className="h-4 w-4 text-amber-800" />
              <input autoFocus data-admin-typing-key="admin-command-palette" value={commandQuery} onChange={event => setCommandQuery(event.target.value)} placeholder={language === 'ne' ? 'अनुसन्धान, स्रोत, प्रमाण वा कार्यक्षेत्र खोज्नुहोस्…' : 'Search research, sources, evidence or workspace…'} className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none" onKeyDown={event => { if (event.key === 'Escape') setShowCommandPalette(false); }} />
              <kbd className="rounded-md border border-stone-200 bg-white px-2 py-1 text-[10px] text-stone-500">ESC</kbd>
            </div>
            <div className="grid gap-1 p-2 sm:grid-cols-2">
              {[
                ['dashboard', LayoutDashboard, language === 'ne' ? 'मुख्य कार्यक्षेत्र' : 'Workspace Home'],
                ['research', BookOpen, language === 'ne' ? 'अनुसन्धान तथा स्रोत' : 'Research & Sources'],
                ['original_research', Sparkles, language === 'ne' ? 'सदन राई — नयाँ खोज' : 'Sadan Rai — Original Research'],
                ['kirat_research', Landmark, language === 'ne' ? '२० खण्डको किराँत अनुसन्धान' : '20-Section Kirat Research'],
                ['places_village', MapPin, language === 'ne' ? 'स्थान तथा गाउँ अभिलेख' : 'Places & Village Archives'],
                ['oral_history', MessageSquareQuote, language === 'ne' ? 'मौखिक इतिहास' : 'Oral History'],
                ['library', FolderOpen, language === 'ne' ? 'पूर्ण अनुसन्धान पुस्तकालय' : 'Research Library'],
                ['evidence', Database, language === 'ne' ? 'प्रमाण' : 'Evidence'],
                ['sources', BookOpen, language === 'ne' ? 'स्रोत तथा सन्दर्भ' : 'Sources & References'],
                ['additional_archive', FolderOpen, language === 'ne' ? 'थप अभिलेख' : 'Additional Archive'],
              ].filter(([, , label]) => String(label).toLowerCase().includes(commandQuery.trim().toLowerCase())).map(([tab, Icon, label]) => {
                const PaletteIcon = Icon as React.ComponentType<{className?: string}>;
                return <button key={String(tab)} type="button" onClick={() => openAdminWorkspace(tab as AdminTab)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-amber-50"><span className="grid h-8 w-8 place-items-center rounded-lg bg-stone-900 text-amber-300"><PaletteIcon className="h-4 w-4" /></span><span className="text-xs font-semibold text-stone-800">{label}</span></button>;
              })}
            </div>
            <div className="border-t border-stone-200 px-4 py-3 text-[10px] text-stone-500">{language === 'ne' ? 'छिटो खोल्न Ctrl/⌘ + K वा / प्रयोग गर्नुहोस्।' : 'Press Ctrl/⌘ + K or / anytime to open this palette.'}</div>
          </div>
        </div>
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
