import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Send, ShieldCheck } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useArchive } from '../../context/ArchiveContext';
import { db } from '../../firebase';

export const ContactView: React.FC = () => {
  const { language, getArchiveSection } = useArchive();
  const section = getArchiveSection('contact_contribution');
  const ne = language === 'ne';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    setSending(true); setError('');
    try {
      await addDoc(collection(db, 'contact_messages'), {
        name: name.trim().slice(0, 100),
        email: email.trim().slice(0, 160),
        purpose: 'support',
        message: message.trim().slice(0, 5000),
        language,
        status: 'new',
        createdAt: serverTimestamp(),
      });
      setSent(true); setName(''); setEmail(''); setMessage('');
    } catch {
      setError(ne ? 'सन्देश पठाउन सकिएन। फेरि प्रयास गर्नुहोस्।' : 'The message could not be sent. Please try again.');
    } finally { setSending(false); }
  };

  if (sent) return <main className="max-w-2xl mx-auto px-5 sm:px-8 py-20"><div className="bg-white border border-stone-200 rounded-3xl p-10 text-center shadow-xl"><CheckCircle2 className="mx-auto text-emerald-700" size={34}/><h1 className="font-serif-np text-3xl font-bold text-stone-900 mt-5">{ne ? 'सन्देश प्राप्त भयो' : 'Message received'}</h1><p className="text-sm text-stone-600 mt-3">{ne ? 'तपाईंको सन्देश अभिलेखमा सुरक्षित रूपमा पठाइएको छ।' : 'Your message has been securely sent to the archive.'}</p></div></main>;

  return (
    <main className="max-w-2xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
      <div className="bg-white border border-stone-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-stone-950 text-white p-7 sm:p-9">
          <div className="flex items-center gap-2 text-amber-400"><MessageCircle size={20}/><span className="text-[11px] tracking-[0.2em] uppercase font-mono">{ne ? 'सम्पर्क' : 'CONTACT'}</span></div>
          <h1 className="font-serif-np text-3xl sm:text-4xl font-bold mt-3">{ne ? (section?.nepaliTitle || 'सहयोगका लागि सम्पर्क गर्नुहोस्') : (section?.englishTitle || 'Contact the Archive')}</h1>
          <p className="text-sm text-stone-300 mt-3 leading-relaxed">{ne ? 'तपाईंको सन्देश यही chat box बाट पठाउनुहोस्।' : 'Send your message directly through this secure contact box.'}</p>
        </div>
        <form onSubmit={submit} className="p-6 sm:p-9 space-y-4">
          <input value={name} onChange={e => setName(e.target.value)} maxLength={100} placeholder={ne ? 'नाम (ऐच्छिक)' : 'Name (optional)'} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm" />
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" maxLength={160} placeholder={ne ? 'इमेल (ऐच्छिक)' : 'Email (optional)'} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm" />
          <textarea required value={message} onChange={e => setMessage(e.target.value)} maxLength={5000} rows={7} placeholder={ne ? 'तपाईंको सन्देश यहाँ लेख्नुहोस्…' : 'Write your message here…'} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm resize-y" />
          <button disabled={sending} className="w-full rounded-xl bg-stone-950 text-white px-5 py-3.5 text-sm font-semibold hover:bg-stone-800 disabled:opacity-60 flex items-center justify-center gap-2"><Send size={16}/>{sending ? '...' : (ne ? 'सन्देश पठाउनुहोस्' : 'Send Message')}</button>
          {error && <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-xl p-3">{error}</p>}
          <div className="flex items-start gap-2 text-[11px] text-stone-500 leading-relaxed"><ShieldCheck size={15} className="text-emerald-700 shrink-0 mt-0.5"/>{ne ? 'सन्देश अभिलेखको owner-only inbox मा सुरक्षित गरिन्छ।' : 'Messages are stored in an owner-only archive inbox.'}</div>
        </form>
      </div>
    </main>
  );
};
