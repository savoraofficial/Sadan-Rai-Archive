import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_ARTICLES, INITIAL_MEDIA, INITIAL_PHOTOS, INITIAL_SOURCES } from '../data/archiveData';
import { Article, MediaItem, PhotoItem, Source } from '../types';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchArchiveCollection, saveArchiveRecord, deleteArchiveRecord, isUserAdmin } from '../services/dbService';

interface ArchiveContextType {
  language: 'ne' | 'en';
  setLanguage: (lang: 'ne' | 'en') => void;
  currentRoute: string;
  navigateTo: (route: string) => void;
  articles: Article[];
  sources: Source[];
  photos: PhotoItem[];
  media: MediaItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  readingFontSize: 'normal' | 'large' | 'larger';
  setReadingFontSize: (size: 'normal' | 'large' | 'larger') => void;
  addArticle: (newArticle: Article) => Promise<void>;
  updateArticle: (updatedArticle: Article) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  addPhoto: (photo: PhotoItem) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  addSource: (source: Source) => Promise<void>;
  deleteSource: (id: string) => Promise<void>;
  addMedia: (item: MediaItem) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  getArticleBySlug: (slug: string) => Article | undefined;
  getSourceById: (id: string) => Source | undefined;
  getSourcesForArticle: (article: Article) => Source[];
}

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

export const ArchiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ne' | 'en'>(() => {
    try {
      const savedLang = localStorage.getItem('sadan_rai_language');
      if (savedLang === 'en' || savedLang === 'ne') return savedLang;
    } catch {
      // Ignore
    }
    return 'ne';
  });

  const handleSetLanguage = (lang: 'ne' | 'en') => {
    setLanguage(lang);
    try {
      localStorage.setItem('sadan_rai_language', lang);
    } catch {
      // Ignore
    }
  };

  // Keep the document language synchronized with the app language and
  // explicitly opt out of browser auto-translation. The archive's own
  // language switcher is authoritative.
  useEffect(() => {
    document.documentElement.lang = language === 'ne' ? 'ne' : 'en';
    document.documentElement.dir = 'ltr';
    document.documentElement.classList.add('notranslate');
    document.body.classList.add('notranslate');
  }, [language]);
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [readingFontSize, setReadingFontSize] = useState<'normal' | 'large' | 'larger'>('normal');

  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [sources, setSources] = useState<Source[]>(INITIAL_SOURCES);
  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);

  // Firestore is the authoritative archive store. LocalStorage is never used for archive records.
  useEffect(() => {
    let active = true;
    const loadArchive = async () => {
      const [remoteArticles, remoteSources, remotePhotos, remoteMedia] = await Promise.all([
        fetchArchiveCollection<Article>('articles'),
        fetchArchiveCollection<Source>('sources'),
        fetchArchiveCollection<PhotoItem>('photos'),
        fetchArchiveCollection<MediaItem>('media'),
      ]);
      if (!active) return;
      if (remoteArticles.length) setArticles(remoteArticles);
      // Retire the legacy seeded demo source from the live archive. Owner-only deletion
      // removes the old demo record from Firestore when it is encountered.
      const legacyHamiltonSources = remoteSources.filter((source) => source.id === 'hamilton-1819');
      if (legacyHamiltonSources.length && isUserAdmin()) {
        await Promise.allSettled(legacyHamiltonSources.map((source) => deleteArchiveRecord('sources', source.id)));
      }
      const activeSources = remoteSources.filter((source) => source.id !== 'hamilton-1819');
      setSources(activeSources);
      if (remotePhotos.length) setPhotos(remotePhotos);
      if (remoteMedia.length) setMedia(remoteMedia);
    };

    // Firebase Auth establishes the visitor/owner state first. Loading once from
    // that callback prevents the initial anonymous read + auth-state read race.
    const unsubscribe = onAuthStateChanged(auth, () => { void loadArchive(); });
    return () => { active = false; unsubscribe(); };
  }, []);

  // Route Synchronization with Hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        setCurrentRoute(hash.startsWith('/') ? hash : '/' + hash);
      } else {
        setCurrentRoute('/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    const cleanRoute = route.startsWith('/') ? route : '/' + route;
    window.location.hash = cleanRoute;
    setCurrentRoute(cleanRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const requireOwner = () => {
    if (!isUserAdmin()) throw new Error('Owner authentication required.');
  };

  const addArticle = async (newArticle: Article) => {
    requireOwner();
    await saveArchiveRecord('articles', newArticle);
    setArticles((prev) => [newArticle, ...prev.filter((item) => item.id !== newArticle.id)]);
  };

  const updateArticle = async (updatedArticle: Article) => {
    requireOwner();
    await saveArchiveRecord('articles', updatedArticle);
    setArticles((prev) => prev.map((item) => item.id === updatedArticle.id ? updatedArticle : item));
  };

  const deleteArticle = async (id: string) => {
    requireOwner();
    await deleteArchiveRecord('articles', id);
    setArticles((prev) => prev.filter((item) => item.id !== id));
  };

  const addPhoto = async (photo: PhotoItem) => {
    requireOwner();
    await saveArchiveRecord('photos', photo);
    setPhotos((prev) => [photo, ...prev.filter((item) => item.id !== photo.id)]);
  };

  const deletePhoto = async (id: string) => { requireOwner(); await deleteArchiveRecord('photos', id); setPhotos(prev => prev.filter(item => item.id !== id)); };

  const addSource = async (source: Source) => {
    requireOwner();
    await saveArchiveRecord('sources', source);
    setSources((prev) => [source, ...prev.filter((item) => item.id !== source.id)]);
  };

  const deleteSource = async (id: string) => {
    requireOwner();
    await deleteArchiveRecord('sources', id);
    setSources((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteMedia = async (id: string) => { requireOwner(); await deleteArchiveRecord('media', id); setMedia(prev => prev.filter(item => item.id !== id)); };

  const addMedia = async (item: MediaItem) => {
    requireOwner();
    await saveArchiveRecord('media', item);
    setMedia((prev) => [item, ...prev.filter((entry) => entry.id !== item.id)]);
  };

  const getArticleBySlug = (slug: string) => {
    return articles.find((art) => art.slug === slug);
  };

  const getSourceById = (id: string) => {
    return sources.find((src) => src.id === id);
  };

  const getSourcesForArticle = (article: Article) => {
    return article.sourceIds
      .map((id) => sources.find((s) => s.id === id))
      .filter((s): s is Source => Boolean(s));
  };

  return (
    <ArchiveContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        currentRoute,
        navigateTo,
        articles,
        sources,
        photos,
        media,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        readingFontSize,
        setReadingFontSize,
        addArticle,
        updateArticle,
        deleteArticle,
        addPhoto,
        deletePhoto,
        addSource,
        deleteSource,
        addMedia,
        deleteMedia,
        getArticleBySlug,
        getSourceById,
        getSourcesForArticle,
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};

export const useArchive = () => {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error('useArchive must be used within an ArchiveProvider');
  }
  return context;
};
