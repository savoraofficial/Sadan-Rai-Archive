import React from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { OfficialVerifiedBadge } from '../common/OfficialVerifiedBadge';
import {
  ArrowRight, BookOpen, Camera, FileText, HeartHandshake, Landmark,
  MapPin, MessageSquareQuote, Music, ShieldCheck, Sparkles, Video
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { articles, sources, photos, media, navigateTo, language } = useArchive();
  const ne = language === 'ne';

  const core = [
    {
      no: '01', icon: Landmark, route: '/history',
      neTitle: 'इतिहास तथा सभ्यता', enTitle: 'History & Civilization',
      neText: 'काल, स्थान, स्रोत, प्रमाण र ऐतिहासिक परिवर्तनको व्यवस्थित अभिलेख।', enText: 'Time, place, sources, evidence and historical change.'
    },
    {
      no: '02', icon: Sparkles, route: '/culture',
      neTitle: 'संस्कृति, धर्म तथा परम्परा', enTitle: 'Culture, Religion & Traditions',
      neText: 'जीवित संस्कृति, धर्म, अभ्यास, भाषा र सामुदायिक परम्पराको अभिलेख।', enText: 'Living culture, religion, practices, language and community traditions.'
    },
    {
      no: '03', icon: MapPin, route: '/village',
      neTitle: 'स्थान तथा गाउँ अभिलेख', enTitle: 'Places & Village Archives',
      neText: 'स्थान, भूगोल, बस्ती, ऐतिहासिक स्थल र स्थानीय इतिहासका अभिलेख।', enText: 'Places, landscapes, settlements, historic sites and local records.'
    },
    {
      no: '04', icon: MessageSquareQuote, route: '/oral-history',
      neTitle: 'मौखिक इतिहास', enTitle: 'Oral History',
      neText: 'अन्तर्वार्ता, स्मृति, साक्ष्य र स्थानीय ज्ञानलाई स्रोतको रूपमा सुरक्षित गर्ने संरचना।', enText: 'Interviews, memories, testimony and local knowledge preserved as sources.'
    }
  ];

  return (
    <div className="archive-home pb-20">
      <section className="relative overflow-hidden bg-stone-950 text-white border-b border-stone-800">
        <div className="absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full border border-amber-700/20" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[440px] h-[440px] rounded-full border border-amber-500/10" />
        </div>
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 text-center">
          <div className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-amber-400 font-mono mb-6">
            {ne ? 'हाम्रो पुर्खा · हाम्रो पहिचान' : 'OUR ANCESTORS · OUR IDENTITY'}
          </div>
          <div className="inline-flex items-center gap-3 flex-wrap justify-center">
            <span className={`brand-lock brand-lock-hero ${ne ? 'font-serif-np' : 'font-display-brand'} font-bold tracking-[0.06em]`}>{ne ? 'सदन राई' : 'SADAN RAI'}</span>
            <OfficialVerifiedBadge size="lg" />
          </div>
          <h1 className="font-serif-np text-2xl sm:text-4xl font-semibold text-stone-100 mt-7">
            {ne ? 'इतिहास, सभ्यता तथा संस्कृति अभिलेखालय' : 'History, Civilization & Culture Archive'}
          </h1>
          <p className="mt-3 text-[10px] sm:text-xs tracking-[0.22em] uppercase text-stone-400">
            {ne ? 'इतिहास · संस्कृति · सभ्यता · मौखिक परम्परा' : 'History · Culture · Civilization · Oral Traditions'}
          </p>
          <p className="max-w-3xl mx-auto mt-7 text-sm sm:text-base text-stone-300 leading-relaxed">
            {ne ? 'इतिहास, सभ्यता, संस्कृति र मौखिक परम्पराका स्रोत, प्रमाण र सन्दर्भलाई व्यवस्थित रूपमा सुरक्षित गर्ने डिजिटल अभिलेख।' : 'A digital archive for documenting history, civilization, culture and oral traditions through sources, evidence and context.'}
          </p>
          <div className="max-w-3xl mx-auto mt-7 py-5 border-y border-stone-800">
            <p className="font-serif-np text-base sm:text-xl text-amber-200 font-medium">{ne ? '“इतिहास · सभ्यता · सम्पदाका प्रमाण — हामीसँग”' : 'Evidence of History · Civilization · Heritage — With Us'}</p>
            <p className="mt-2 text-xs sm:text-sm text-stone-400">{ne ? 'हाम्रो पहिचान: इतिहास, सभ्यता र संस्कृतिको साझा संरक्षण।' : 'Our identity: preserving history, civilization and culture together.'}</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => navigateTo('/articles')} className="archive-hero-button archive-hero-button-primary">
              <BookOpen size={16} /> {ne ? 'अभिलेखमा प्रवेश गर्नुहोस्' : 'Enter the Archive'}
            </button>
          </div>
        </div>
        <div className="relative border-t border-stone-800 bg-stone-950/90">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-300">
            <div className="flex items-center justify-center gap-2"><ShieldCheck size={15} className="text-emerald-400" />{ne ? 'स्रोत स्पष्ट र वर्गीकृत' : 'Sources clearly classified'}</div>
            <div className="flex items-center justify-center gap-2"><FileText size={15} className="text-amber-400" />{ne ? 'प्रमाण र सन्दर्भ सुरक्षित' : 'Evidence and references preserved'}</div>
            <div className="flex items-center justify-center gap-2"><MessageSquareQuote size={15} />{ne ? 'मौखिक र दस्तावेजी प्रमाण छुट्टाछुट्टै' : 'Oral and documentary evidence distinguished'}</div>
          </div>
        </div>
      </section>

      <section className="archive-dashboard max-w-6xl mx-auto px-5 sm:px-8">
        <div className="archive-dashboard-shell">
          <div className="archive-dashboard-head">
            <div>
              <div className="archive-kicker">{ne ? 'अभिलेख ड्यासबोर्ड' : 'ARCHIVE DASHBOARD'}</div>
              <h2>{ne ? 'प्रमाणसहितको व्यवस्थित अभिलेख' : 'A structured archive built around evidence'}</h2>
              <p>{ne ? 'इतिहास, सभ्यता, संस्कृति, स्थान र मौखिक परम्पराका सामग्री एउटै स्पष्ट अभिलेख संरचनाभित्र।' : 'History, civilization, culture, places and oral traditions organized within one consistent archival structure.'}</p>
            </div>
          </div>
          <div className="archive-stat-grid">
            {[
              [BookOpen, articles.length, ne ? 'प्रकाशित अभिलेख' : 'Published records', '/articles'],
              [Camera, photos.length, ne ? 'दृश्य अभिलेख' : 'Visual archive', '/photos'],
              [Video, media.length, ne ? 'ध्वनि तथा भिडियो' : 'Audio & video', '/media'],
              [FileText, sources.length, ne ? 'स्रोत तथा सन्दर्भ' : 'Sources & references', '/sources']
            ].map(([Icon, count, label, route]) => {
              const I = Icon as React.ElementType;
              return <button key={String(route)} onClick={() => navigateTo(String(route))} className="archive-stat">
                <span className="archive-stat-icon"><I size={17} /></span>
                <span><strong>{count as number}</strong><small>{label as string}</small></span>
                <ArrowRight size={15} />
              </button>;
            })}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-amber-800 font-mono">{ne ? 'मुख्य अभिलेख संरचना' : 'CORE ARCHIVE STRUCTURE'}</p>
          <h2 className="font-serif-np text-3xl sm:text-4xl font-bold text-stone-900 mt-2">{ne ? 'हरेक इतिहास र सभ्यताका लागि एउटै संरचना' : 'One consistent structure for every history & civilization'}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {core.map(item => {
            const I = item.icon;
            return <button key={item.no} onClick={() => navigateTo(item.route)} className="text-left bg-stone-900 text-stone-100 rounded-2xl p-6 hover:bg-stone-800 transition-all hover:-translate-y-0.5 flex gap-4 items-start shadow-sm">
              <span className="text-[10px] font-mono text-amber-400 pt-1">{item.no}</span>
              <I size={21} className="text-amber-400 shrink-0 mt-0.5" />
              <span className="flex-1"><strong className="font-serif-np text-xl block">{ne ? item.neTitle : item.enTitle}</strong><small className="block text-stone-400 mt-2 leading-relaxed">{ne ? item.neText : item.enText}</small></span>
              <ArrowRight size={18} className="text-stone-500 mt-1" />
            </button>;
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-16">
        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-9 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 grid place-items-center shrink-0"><ShieldCheck size={21} /></span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500 font-mono">{ne ? 'अभिलेखीय विश्वसनीयता' : 'ARCHIVAL CREDIBILITY'}</p>
              <h2 className="font-serif-np text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{ne ? 'हरेक इतिहासका लागि प्रमाणको स्पष्ट संरचना' : 'A clear evidence framework for every history'}</h2>
              <p className="text-sm text-stone-600 mt-3 leading-relaxed max-w-3xl">{ne ? 'कुनै पनि इतिहास, सभ्यता, संस्कृति, धर्म, समुदाय वा स्थानका सामग्रीमा स्रोत, वर्गीकरण, सन्दर्भ र प्रमाणको अवस्था स्पष्ट रूपमा छुट्याइन्छ।' : 'For every history, civilization, culture, religion, community or place, the archive distinguishes source, classification, context and evidence status.'}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-4 gap-3 mt-7 text-sm">
            {(ne ? ['स्रोत', 'वर्गीकरण', 'स्थान / सन्दर्भ', 'मौखिक र दस्तावेजी प्रमाण'] : ['Source', 'Classification', 'Context / location', 'Oral vs documentary evidence']).map((x, i) => <div key={x} className="rounded-2xl bg-[#F7F2E8] border border-stone-200 p-4"><span className="text-[10px] font-mono text-amber-800">0{i + 1}</span><strong className="block mt-2 text-stone-900 leading-snug">{x}</strong></div>)}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-16">
        <div className="mb-7"><p className="text-[10px] uppercase tracking-[0.24em] text-amber-800 font-mono">{ne ? 'अनुसन्धान पद्धति' : 'RESEARCH METHOD'}</p><h2 className="font-serif-np text-2xl sm:text-3xl font-bold text-stone-900 mt-2">{ne ? 'प्रमाण → विश्लेषण → निष्कर्ष' : 'Evidence → Analysis → Conclusion'}</h2></div>
        <div className="grid sm:grid-cols-3 gap-4">
          {(ne ? ['स्रोत र प्रमाण', 'तुलनात्मक विश्लेषण', 'सदन राई अनुसन्धान निष्कर्ष'] : ['Sources & evidence', 'Comparative analysis', 'Sadan Rai Research Conclusion']).map((x, i) => <div key={x} className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm"><span className="text-[10px] font-mono text-amber-800">0{i + 1}</span><strong className="block mt-3 text-stone-900 text-lg font-serif-np">{x}</strong><p className="text-xs text-stone-500 mt-2 leading-relaxed">{ne ? ['कसले के भन्यो, कुन प्रमाण उपलब्ध छ र स्रोत कहाँबाट आएको हो।','मिल्ने र नमिल्ने विवरण, विरोधाभास तथा बाँकी प्रश्नको तुलना।','सबै उपलब्ध प्रमाणको आधारमा अनुसन्धानकर्ताको आफ्नै निष्कर्ष छुट्टै।'][i] : ['Who said what, what evidence exists and where each source came from.','Agreements, contradictions and remaining questions compared transparently.','The researcher’s own conclusion separated from source statements.'][i]}</p></div>)}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-16 grid md:grid-cols-2 gap-5">
        <button onClick={() => navigateTo('/photos')} className="text-left bg-stone-950 text-white rounded-3xl p-7 sm:p-8 hover:bg-stone-900 transition-all hover:-translate-y-0.5">
          <Camera className="text-amber-400" size={22} /><p className="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-mono mt-5">{ne ? 'दृश्य प्रमाण' : 'VISUAL EVIDENCE'}</p><h2 className="font-serif-np text-2xl font-bold mt-2">{ne ? 'पुरातात्त्विक तथा ऐतिहासिक तस्बिर अभिलेख' : 'Archaeological & Historical Photographic Archive'}</h2><p className="text-sm text-stone-400 mt-2 leading-relaxed">{ne ? 'कहाँको, कहिलेको, कसले खिचेको, स्रोत, अधिकार र प्रमाणसहितको संरचित फोटो अभिलेख।' : 'Structured image records with location, date, photographer, source, rights and evidence.'}</p>
        </button>
        <button onClick={() => navigateTo('/media')} className="text-left bg-[#F7F2E8] text-stone-900 rounded-3xl p-7 sm:p-8 border border-stone-200 hover:border-amber-700 transition-all hover:-translate-y-0.5">
          <Music className="text-amber-800" size={22} /><p className="text-[10px] uppercase tracking-[0.22em] text-stone-500 font-mono mt-5">{ne ? 'श्रव्य–दृश्य प्रमाण' : 'AUDIOVISUAL EVIDENCE'}</p><h2 className="font-serif-np text-2xl font-bold mt-2">{ne ? 'ऐतिहासिक, सांस्कृतिक तथा दस्तावेजी भिडियो अभिलेख' : 'Historical, Cultural & Documentary Video Archive'}</h2><p className="text-sm text-stone-600 mt-2 leading-relaxed">{ne ? 'स्थान, मिति, सिर्जनाकर्ता, अन्तर्वार्ताकार, स्रोत, अधिकार र transcript/notes सहित।' : 'Location, date, creator, interview details, source, rights and transcript/notes where applicable.'}</p>
        </button>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-16 grid md:grid-cols-2 gap-5">
        <button onClick={() => navigateTo('/sources')} className="text-left bg-white border border-stone-200 rounded-3xl p-7 hover:border-amber-700 transition-all hover:-translate-y-0.5"><FileText className="text-amber-800" size={21} /><h2 className="font-serif-np text-2xl font-bold mt-3">{ne ? 'स्रोत तथा सन्दर्भ' : 'Sources & References'}</h2><p className="text-sm text-stone-600 mt-2 leading-relaxed">{ne ? 'लिखित, प्राज्ञिक, अभिलेखीय, मौखिक र दृश्य स्रोतहरूको व्यवस्थित सन्दर्भ।' : 'Structured references for written, academic, archival, oral and visual sources.'}</p><ArrowRight size={17} className="mt-5 text-stone-400" /></button>
        <button onClick={() => navigateTo('/about')} className="text-left bg-white border border-stone-200 rounded-3xl p-7 hover:border-amber-700 transition-all hover:-translate-y-0.5"><Landmark className="text-amber-800" size={21} /><h2 className="font-serif-np text-2xl font-bold mt-3">{ne ? 'सदन राईको बारेमा' : 'About Sadan Rai'}</h2><p className="text-sm text-stone-600 mt-2 leading-relaxed">{ne ? 'अभिलेखको उद्देश्य, अनुसन्धान मापदण्ड र स्थानीय अनुसन्धान आधार।' : 'Archive mission, research standards and local research foundation.'}</p><ArrowRight size={17} className="mt-5 text-stone-400" /></button>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-16">
        <div className="rounded-3xl bg-stone-950 text-white p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div><HeartHandshake className="text-amber-400" size={23} /><p className="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-mono mt-4">{ne ? 'सम्पर्क तथा सहयोग' : 'CONTACT & SUPPORT'}</p><h2 className="archive-share-title font-serif-np text-2xl sm:text-3xl font-bold mt-2">{ne ? <>अभिलेख संरक्षणमा साथ दिन चाहनुहुन्छ?<br />तपाईंसँग पनि यस्तै ऐतिहासिक सामग्री वा अभिलेख छ?</> : <>Would you like to support the archive?<br />Do you have historical records or materials to share?</>}</h2><p className="max-w-2xl text-sm text-stone-400 mt-2 leading-relaxed">{ne ? 'ऐतिहासिक सामग्री, तस्बिर, दस्तावेज, मौखिक इतिहास वा सुझावका लागि chat box मार्फत सम्पर्क गर्नुहोस्।' : 'Share historical material, photographs, documents, oral history or suggestions through the contact chat.'}</p></div>
          <button onClick={() => navigateTo('/contact')} className="shrink-0 px-6 py-3 bg-white text-stone-950 rounded-xl text-sm font-semibold hover:bg-stone-200 flex items-center gap-2"><MessageSquareQuote size={16} />{ne ? 'अभिलेखसँग साझा गर्नुहोस्' : 'Share with the Archive'}</button>
        </div>
      </section>
    </div>
  );
};
