import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck, Globe } from 'lucide-react';
import { auth, googleProvider } from '../../firebase';
import { useArchive } from '../../context/ArchiveContext';
import { BRAND_INFO } from '../../data/archiveData';

const ADMIN_EMAIL = BRAND_INFO.contactEmail.toLowerCase();

export const AdminLoginView: React.FC = () => {
  const { language, setLanguage, navigateTo } = useArchive();
  const ne = language === 'ne';
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!active || !user) return;
      if (user.email?.toLowerCase() === ADMIN_EMAIL) {
        navigateTo('/sadan-rai-editorial-console');
      } else {
        setMessage(ne ? 'यो Google account लाई Admin access छैन।' : 'This Google account is not authorized for Admin access.');
        void signOut(auth);
      }
      setLoading(false);
    });
    return () => { active = false; unsubscribe(); };
  }, [ne, navigateTo]);

  const handleLogin = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase();
      if (email === ADMIN_EMAIL) {
        navigateTo('/sadan-rai-editorial-console');
      } else {
        await signOut(auth);
        setMessage(ne ? 'यो Google account लाई Admin access छैन।' : 'This Google account is not authorized for Admin access.');
      }
    } catch (error) {
      console.warn('Admin popup authentication failed:', error);
      const code = error instanceof Error && 'code' in error ? String((error as { code?: string }).code) : '';
      const englishMessage = code === 'auth/unauthorized-domain'
        ? 'This site is not authorized in Firebase Authentication. Add sadan-rai-archive.pages.dev under Firebase Authentication → Settings → Authorized domains.'
        : code === 'auth/popup-blocked'
          ? 'The Google sign-in popup was blocked. Allow popups for this site and try again.'
          : 'Google Login could not start. Please try again.';
      setMessage(ne ? 'Google Login सुरु हुन सकेन। Firebase domain र browser popup setting जाँच गर्नुहोस्।' : englishMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-12 sm:py-16 bg-[radial-gradient(circle_at_top,rgba(180,83,9,.12),transparent_42%),linear-gradient(135deg,#faf8f3,#f1ede5)]">
      <section className="w-full max-w-md rounded-3xl border border-stone-200/90 bg-white/95 p-6 sm:p-8 shadow-[0_24px_70px_rgba(28,25,23,.14)] backdrop-blur">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-amber-400 shadow-lg">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5" /> {ne ? 'सुरक्षित पहुँच' : 'Secure Access'}
          </span>
        </div>
        <div className="mb-5 flex justify-end">
          <div className="inline-flex items-center gap-0.5 rounded-lg border border-stone-200 bg-stone-50 p-0.5" role="group" aria-label={ne ? 'भाषा चयन' : 'Language selection'}>
            <Globe className="mx-1.5 h-3.5 w-3.5 text-stone-500" aria-hidden="true" />
            <button type="button" onClick={() => setLanguage('ne')} aria-pressed={ne} className={`rounded-md px-2 py-1 text-[11px] font-semibold ${ne ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-white'}`}>नेपाली</button>
            <button type="button" onClick={() => setLanguage('en')} aria-pressed={!ne} className={`rounded-md px-2 py-1 text-[11px] font-semibold ${!ne ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-white'}`}>English</button>
          </div>
        </div>
        <p className="text-[10px] font-mono uppercase tracking-[.2em] text-stone-400">SADAN RAI ARCHIVE</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          {ne ? 'प्रशासक लगइन' : 'Administrator Login'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          {ne ? 'अभिलेखको सुरक्षित व्यवस्थापनका लागि अधिकृत Google account बाट प्रवेश गर्नुहोस्।' : 'Sign in with the authorized Google account to access the secure archive management console.'}
        </p>

        <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <div className="text-[10px] uppercase tracking-[.16em] text-stone-400">{ne ? 'अधिकृत खाता' : 'Authorized account'}</div>
          <div className="mt-1 font-mono text-sm font-semibold text-stone-800 break-all">{BRAND_INFO.contactEmail}</div>
        </div>

        {message && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-xl active:translate-y-0 disabled:cursor-wait disabled:opacity-70"
        >
          <span>{loading ? (ne ? 'प्रमाणीकरण हुँदैछ…' : 'Signing in…') : (ne ? 'Google बाट Admin Login' : 'Continue with Google')}</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('/')}
          className="mt-3 w-full rounded-2xl px-4 py-2.5 text-xs font-semibold text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
        >
          {ne ? 'अभिलेखमा फर्कनुहोस्' : 'Return to Archive'}
        </button>
      </section>
    </main>
  );
};
