import React from 'react';
import { ArrowRight, MapPin, ShieldCheck } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';
import { OfficialVerifiedBadge } from '../common/OfficialVerifiedBadge';

export const AboutView: React.FC = () => {
  const { navigateTo, language } = useArchive();
  const ne = language === 'ne';

  return (
    <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16 space-y-7">
      <section className="bg-stone-950 text-white rounded-3xl p-8 sm:p-12">
        <p className="text-[11px] uppercase tracking-[0.22em] text-amber-400 font-mono">{ne ? 'अभिलेखकर्ता परिचय' : 'ARCHIVIST PROFILE'}</p>
        <h1 className="font-display-brand text-4xl sm:text-6xl font-bold mt-3 inline-flex items-center gap-2">SADAN RAI <OfficialVerifiedBadge size="lg" /></h1>
        <p className="font-serif-np text-2xl sm:text-3xl text-stone-200 mt-4">{ne ? 'सदन राई' : 'Sadan Rai'}</p>
        <p className="font-serif-np text-xl sm:text-2xl text-stone-300 mt-6">{ne ? 'इतिहास, सभ्यता तथा संस्कृति अभिलेखालय' : 'History, Civilization & Culture Archive'}</p>
        <p className="text-sm text-stone-400 mt-2">{ne ? 'इतिहास · संस्कृति · सभ्यता · मौखिक परम्परा' : 'History · Culture · Civilization · Oral Traditions'}</p>
        <div className="mt-7 border-y border-stone-800 py-5 font-serif-np text-base sm:text-xl text-amber-200 italic">“हाम्रो पहिचान: इतिहास, सभ्यता र संस्कृतिको साझा संरक्षण।”</div>
      </section>

      <section className="bg-white border border-stone-200 rounded-3xl p-7 sm:p-9">
        <p className="text-[11px] uppercase tracking-[0.2em] text-amber-800 font-mono">{ne ? 'उद्देश्य' : 'MISSION'}</p>
        <h2 className="font-serif-np text-2xl sm:text-3xl font-bold text-stone-900 mt-2">{ne ? 'प्रमाणमा आधारित जिम्मेवार अभिलेखीकरण' : 'Responsible documentation through evidence'}</h2>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed mt-4">{ne ? 'यस अभिलेखालयको उद्देश्य इतिहास, सभ्यता, संस्कृति, धर्म, परम्परा, स्थान, समुदाय र मौखिक इतिहासलाई स्रोत, प्रमाण र सन्दर्भसहित व्यवस्थित रूपमा सुरक्षित गर्नु हो।' : 'The archive documents history, civilization, culture, religion, traditions, places, communities and oral history through sources, evidence and context.'}</p>
      </section>

      <section className="bg-[#F7F2E8] border border-stone-200 rounded-3xl p-7 sm:p-9">
        <div className="flex items-start gap-3"><ShieldCheck className="text-emerald-700 mt-1" size={21}/><div><p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-mono">{ne ? 'अनुसन्धान मापदण्ड' : 'RESEARCH STANDARD'}</p><h2 className="font-serif-np text-2xl font-bold text-stone-900 mt-2">{ne ? 'स्रोत, प्रमाण र निष्कर्ष स्पष्ट रूपमा छुट्याइन्छ' : 'Sources, evidence and conclusions remain distinct'}</h2></div></div>
        <div className="grid sm:grid-cols-2 gap-3 mt-6 text-sm text-stone-700">
          {(ne ? ['स्रोत स्पष्ट रूपमा उल्लेख गर्ने','दस्तावेजी र मौखिक प्रमाण छुट्ट्याउने','विरोधाभास र अनिश्चितता लुकाउन नहुने','प्रमाण → विश्लेषण → निष्कर्ष स्पष्ट राख्ने'] : ['Identify sources clearly','Distinguish documentary and oral evidence','Record contradictions and uncertainty','Keep evidence → analysis → conclusion transparent']).map(x => <div key={x} className="bg-white border border-stone-200 rounded-xl p-4">{x}</div>)}
        </div>
      </section>

      <section className="bg-white border border-stone-200 rounded-3xl p-7 sm:p-9">
        <p className="text-[11px] uppercase tracking-[0.2em] text-amber-800 font-mono">{ne ? 'स्थानीय अनुसन्धान आधार' : 'LOCAL RESEARCH FOUNDATION'}</p>
        <div className="flex items-start gap-3 mt-3"><MapPin className="text-amber-800 mt-1" size={20}/><div><h2 className="font-serif-np text-2xl font-bold text-stone-900">माल्बासे–१, पात्लेपानी</h2><p className="text-sm text-stone-500 mt-1">हतुवागढी, भोजपुर, नेपाल</p></div></div>
        <p className="text-sm text-stone-600 leading-relaxed mt-5">{ne ? 'यो स्थान सदन राईको स्थानीय अनुसन्धान तथा मौखिक इतिहासको आधार क्षेत्र हो। यहाँको सामग्रीलाई सम्पूर्ण अभिलेखको सीमाको रूपमा होइन, स्थानीय field research foundation का रूपमा राखिएको छ।' : 'This location is a local field-research foundation for Sadan Rai, particularly for place-based research and oral history. It does not limit the wider archive, which is designed for histories and cultures from multiple communities and places.'}</p>
      </section>

      <section className="bg-stone-950 text-white rounded-3xl p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div><p className="text-[11px] uppercase tracking-[0.2em] text-amber-400 font-mono">{ne ? 'अनुसन्धान निष्कर्ष' : 'RESEARCH CONCLUSION'}</p><h2 className="font-serif-np text-2xl font-bold mt-2">{ne ? 'सदन राई अनुसन्धान निष्कर्ष' : 'Sadan Rai Research Conclusion'}</h2><p className="text-sm text-stone-400 mt-2">{ne ? 'स्रोत र प्रमाणको तुलनात्मक अध्ययनपछि अनुसन्धानकर्ताको आफ्नै निष्कर्ष छुट्टै प्रस्तुत गरिनेछ।' : 'The researcher’s own conclusion will be presented separately after comparative examination of sources and evidence.'}</p></div>
        <button onClick={() => navigateTo('/contact')} className="shrink-0 px-5 py-3 bg-white text-stone-950 rounded-xl text-sm font-semibold flex items-center gap-2">{ne ? 'सम्पर्क' : 'Contact'} <ArrowRight size={16}/></button>
      </section>
    </main>
  );
};
