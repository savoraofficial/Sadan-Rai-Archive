import React, { useEffect, useState } from 'react';
import { Bookmark, ArrowRight, BookOpen, Camera, Video } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';
import { getSavedItems, toggleSaved, type SavedArchiveItem } from '../../services/communityService';

export const SavedView: React.FC = () => {
  const { articles, photos, media, language, navigateTo } = useArchive();
  const [savedItems, setSavedItems] = useState<SavedArchiveItem[]>([]);

  useEffect(() => {
    setSavedItems(getSavedItems());
  }, []);

  const records = savedItems.map((saved) => {
    if (saved.contentType === 'article') {
      const item = articles.find((record) => record.id === saved.contentId);
      return item ? { ...saved, title: item.title, subtitle: item.excerpt, route: `/article/${item.slug}`, icon: BookOpen } : null;
    }
    if (saved.contentType === 'photo') {
      const item = photos.find((record) => record.id === saved.contentId);
      return item ? { ...saved, title: language === 'ne' ? item.nepaliTitle : (item.title || item.nepaliTitle), subtitle: item.caption, route: '/photos', icon: Camera } : null;
    }
    const item = media.find((record) => record.id === saved.contentId);
    return item ? { ...saved, title: language === 'ne' ? item.nepaliTitle : (item.title || item.nepaliTitle), subtitle: item.description, route: '/media', icon: Video } : null;
  }).filter(Boolean) as Array<SavedArchiveItem & { title: string; subtitle: string; route: string; icon: React.ElementType }>;

  const refresh = () => setSavedItems(getSavedItems());

  const remove = (contentType: SavedArchiveItem['contentType'], contentId: string) => {
    toggleSaved(contentType, contentId);
    refresh();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <header className="space-y-3 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800">
          <Bookmark className="w-4 h-4" />
          <span>{language === 'ne' ? 'व्यक्तिगत सूची' : 'Personal list'}</span>
        </div>
        <h1 className="font-serif-np text-3xl sm:text-4xl font-bold text-stone-900">
          {language === 'ne' ? 'सुरक्षित अभिलेख' : 'Saved Archive'}
        </h1>
        <p className="text-stone-600 text-sm max-w-3xl leading-relaxed">
          {language === 'ne' ? 'तपाईंले यो browser/device मा सुरक्षित राखेका अभिलेखहरू यहाँ देखिन्छन्।' : 'Records you saved on this browser/device appear here.'}
        </p>
      </header>

      {records.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {records.map((item) => {
            const Icon = item.icon;
            return (
              <article key={`${item.contentType}:${item.contentId}`} className="bg-white rounded-lg border border-stone-200 p-5 space-y-4 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-md bg-amber-50 p-2 text-amber-900"><Icon size={18} /></div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif-np text-lg font-bold text-stone-900">{item.title}</h2>
                    <p className="mt-1 text-xs text-stone-600 line-clamp-3">{item.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-stone-100 pt-3">
                  <button type="button" onClick={() => remove(item.contentType, item.contentId)} className="text-xs font-medium text-stone-600 hover:text-stone-950 cursor-pointer">
                    {language === 'ne' ? 'सुरक्षित सूचीबाट हटाउनुहोस्' : 'Remove from saved'}
                  </button>
                  <button type="button" onClick={() => navigateTo(item.route)} className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 cursor-pointer">
                    {language === 'ne' ? 'खोल्नुहोस्' : 'Open'} <ArrowRight size={13} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center space-y-3">
          <Bookmark className="mx-auto text-amber-800" size={28} />
          <strong className="block text-stone-900">{language === 'ne' ? 'अहिलेसम्म केही सुरक्षित गरिएको छैन।' : 'Nothing has been saved yet.'}</strong>
          <span className="block text-sm text-stone-600">{language === 'ne' ? 'कुनै अभिलेखमा 🔖 Save थिच्नुहोस्।' : 'Use 🔖 Save on any archive record.'}</span>
        </div>
      )}
    </div>
  );
};
