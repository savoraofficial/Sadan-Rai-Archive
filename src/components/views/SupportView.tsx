import React from 'react';
import { HeartHandshake, MessageCircle, ShieldCheck } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';

export const SupportView: React.FC = () => {
  const { language, navigateTo } = useArchive();
  const ne = language === 'ne';
  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
      <section className="rounded-3xl bg-stone-950 text-white p-8 sm:p-12 text-center shadow-2xl">
        <HeartHandshake className="mx-auto text-amber-400" size={28} />
        <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-stone-400 font-mono">{ne ? 'सम्पर्क तथा सहयोग' : 'CONTACT & SUPPORT'}</p>
        <h1 className="font-serif-np text-3xl sm:text-5xl font-bold mt-3">{ne ? 'अभिलेखलाई सहयोग गर्न चाहनुहुन्छ?' : 'Would you like to support the archive?'}</h1>
        <p className="max-w-xl mx-auto mt-5 text-sm sm:text-base text-stone-300 leading-relaxed">{ne ? 'यहाँ कुनै भुक्तानी विवरण मागिँदैन—सहयोग, सामग्री, सुझाव वा अनुसन्धानसम्बन्धी कुराकानीका लागि सिधै chat box खोल्नुहोस्।' : 'No payment details are requested here—open the secure contact chat for support, archival material, suggestions or research conversation.'}</p>
        <button onClick={() => navigateTo('/contact')} className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-950 rounded-xl text-sm font-semibold hover:bg-stone-200">
          <MessageCircle size={17} /> {ne ? 'सम्पर्क chat खोल्नुहोस्' : 'Open Contact Chat'}
        </button>
      </section>
      <div className="mt-5 flex items-center gap-2 justify-center text-xs text-stone-500"><ShieldCheck size={15} className="text-emerald-700" />{ne ? 'सन्देश owner-only inbox मा सुरक्षित गरिन्छ' : 'Messages are stored in an owner-only archive inbox'}</div>
    </main>
  );
};
