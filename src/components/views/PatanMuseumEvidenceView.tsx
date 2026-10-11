import React from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { Camera, FileText, ExternalLink, ShieldCheck, Landmark, CalendarDays } from 'lucide-react';

const photos = [
  {
    src: '/patan-museum-evidence/01_Shilalekh_Closeup.jpg',
    ne: 'ढुङ्गे अभिलेखको नजिकबाट लिइएको तस्बिर',
    en: 'Close view of an inscribed stone slab',
    captionNe: 'संग्रहालयमा प्रदर्शित शिलापत्रको दृश्य अभिलेख। तस्बिरले सतह र लिपि देखाउँछ; यसको पाठ छुट्टै प्रमाणित प्रतिलिपि वा प्रकाशित अनुवादसँग मिलाउनुपर्छ।',
    captionEn: 'A visual record of a displayed inscribed slab. The photograph documents the surface and script; its reading should be checked against a verified transcription or published translation.'
  },
  {
    src: '/patan-museum-evidence/02_Shilalekh_Samuh.jpg',
    ne: 'शिलापत्रहरूको समूह',
    en: 'Group of inscribed stone slabs',
    captionNe: 'संग्रहालयमा सँगै प्रदर्शित शिलापत्रहरू। प्रत्येक अभिलेखको मिति र आशय एउटै हो भनेर यस समूहबाट मात्र निष्कर्ष निकाल्न मिल्दैन।',
    captionEn: 'Several slabs displayed together. The group photograph alone does not establish that all inscriptions share the same date or subject.'
  },
  {
    src: '/patan-museum-evidence/03_Shilalekh_Parichaya_Panel.jpg',
    ne: 'संग्रहालयको “Historical Records on Stone Slabs” परिचय-पाटी',
    en: 'Museum interpretation panel: “Historical Records on Stone Slabs”',
    captionNe: 'तपाईंले उपलब्ध गराउनुभएको संग्रहालयको परिचय-पाटी। यसमा शिलापत्रलाई नेपालका राजनीतिक तथा सांस्कृतिक इतिहासका प्राथमिक अभिलेखका रूपमा व्याख्या गरिएको छ। पाटीमा उल्लेख भएका मिति र विवरणलाई मूल अभिलेख वा आधिकारिक संग्रहालय स्रोतसँगै पढ्नुपर्छ।',
    captionEn: 'The museum panel supplied for this archive describes inscribed slabs as primary records of Nepal’s political and cultural history. Dates and descriptions on the panel should be read alongside the original inscription or official museum references.'
  }
];

export const PatanMuseumEvidenceView: React.FC = () => {
  const { language } = useArchive();
  const ne = language === 'ne';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      <header className="relative overflow-hidden rounded-2xl border border-stone-300 bg-[#201D19] text-[#FBF9F5]">
        <div className="absolute inset-0 opacity-15" aria-hidden="true">
          <div className="absolute -right-12 -top-20 h-72 w-72 rounded-full border-[36px] border-amber-400" />
          <div className="absolute right-20 -bottom-32 h-80 w-80 rounded-full border border-amber-300" />
        </div>
        <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-amber-100/10 px-3 py-1.5 text-[11px] uppercase tracking-[.16em] text-amber-200">
              <ShieldCheck size={14} /> {ne ? 'प्राथमिक दृश्य अभिलेख' : 'Primary visual record'}
            </div>
            <h1 className="font-serif-np text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {ne ? 'पाटन संग्रहालय: शिलालेख तथा ऐतिहासिक प्रमाण' : 'Patan Museum: Inscriptions & Historical Evidence'}
            </h1>
            <p className="max-w-2xl text-sm sm:text-base leading-7 text-stone-200">
              {ne
                ? 'संग्रहालयमा प्रदर्शित शिलापत्रका उपलब्ध तस्बिर, संग्रहालयको व्याख्या र आधिकारिक स्रोतलाई एउटै अनुसन्धान अभिलेखमा जोडिएको छ।'
                : 'A research record bringing together supplied photographs of displayed stone inscriptions, the museum’s interpretation, and official references.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs text-stone-200">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-2"><Landmark size={14}/>{ne ? 'केशव नारायण चोक, पाटन' : 'Keshav Narayan Chowk, Patan'}</span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-2"><Camera size={14}/>{ne ? 'प्रयोगकर्ताले उपलब्ध गराएका फोटो' : 'User-supplied photographs'}</span>
            </div>
          </div>
          <div className="rounded-xl border border-amber-200/20 bg-white/5 p-5">
            <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold uppercase tracking-wider"><CalendarDays size={15}/>{ne ? 'स्रोतबाट पुष्टि भएका मिति' : 'Dates stated by sources'}</div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div><div className="text-2xl sm:text-3xl font-semibold text-white">643 CE</div><p className="mt-1 text-xs leading-5 text-stone-300">{ne ? 'संग्रहालयको मुख्य चोकमा रहेको शिलालेखबारे आधिकारिक संग्रहालय पृष्ठको उल्लेख' : 'Inscription in the museum’s main courtyard, as described by the official museum page'}</p></div>
              <div><div className="text-2xl sm:text-3xl font-semibold text-white">1734 CE</div><p className="mt-1 text-xs leading-5 text-stone-300">{ne ? 'केशव नारायण चोकको हालको दरबार परिसरको मिति' : 'Date given for the palace compound at Keshav Narayan Chowk'}</p></div>
            </div>
            <p className="mt-4 border-t border-white/15 pt-3 text-[11px] leading-5 text-stone-300">
              {ne ? 'यी दुई मिति फरक वस्तु/ऐतिहासिक तहसँग सम्बन्धित हुन्; दरबार परिसरको मितिलाई शिलालेखको मिति नमान्नुहोस्।' : 'These dates refer to different historical layers; the palace compound date must not be treated as the inscription date.'}
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { n: '01', title: ne ? 'प्रत्यक्ष दृश्य अभिलेख' : 'Visual documentation', text: ne ? 'तस्बिरले देखिने वस्तु र यसको प्रदर्शनी सन्दर्भ अभिलेख गर्छ; अपठित अक्षरको अनुमानित पाठलाई प्रमाणित पाठ भनेर प्रस्तुत गर्दैन।' : 'Photographs document the visible object and display context; uncertain readings are not presented as verified transcriptions.' },
          { n: '02', title: ne ? 'संग्रहालयको व्याख्या' : 'Museum interpretation', text: ne ? 'परिचय-पाटीमा दिइएको विवरणलाई संग्रहालयको व्याख्याका रूपमा उद्धृत गरिन्छ, मूल शिलालेखको स्वतन्त्र पढाइका रूपमा होइन।' : 'The display panel is cited as the museum’s interpretation, not as an independent reading of the stone itself.' },
          { n: '03', title: ne ? 'स्रोतसँग तुलना' : 'Source comparison', text: ne ? 'मिति र ऐतिहासिक दाबीलाई आधिकारिक संग्रहालय र नेपाल पर्यटन बोर्डका विवरणसँग तुलना गरिएको छ।' : 'Dates and historical claims are compared with official museum information and the Nepal Tourism Board.' }
        ].map(item => (
          <article key={item.n} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-mono text-amber-800">{item.n} / {ne ? 'अनुसन्धान विधि' : 'METHOD'}</div>
            <h2 className="mt-3 font-serif-np text-lg font-bold text-stone-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[.18em] font-semibold text-amber-800">{ne ? 'तस्बिर अभिलेख' : 'PHOTO RECORD'}</p>
            <h2 className="mt-1 font-serif-np text-2xl sm:text-3xl font-bold text-stone-900">{ne ? 'शिलापत्रका दृश्य प्रमाणहरू' : 'Visual evidence of stone inscriptions'}</h2>
          </div>
          <p className="max-w-lg text-xs sm:text-sm leading-6 text-stone-500">{ne ? 'तस्बिरहरू संग्रहालय भ्रमणका क्रममा उपलब्ध गराइएका हुन्। तस्बिरको स्रोत/अधिकारको अन्तिम metadata थप्न सकिने गरी राखिएको छ।' : 'These photographs were supplied from a museum visit. Record metadata can be expanded to include photographer, date, and rights details.'}</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {photos.map((photo, i) => (
            <article key={photo.src} className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img src={photo.src} alt={ne ? photo.ne : photo.en} loading={i === 0 ? 'eager' : 'lazy'} className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.025]" />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-start gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-stone-900 text-xs font-mono text-amber-200">0{i + 1}</span>
                  <h3 className="font-serif-np text-base font-bold leading-6 text-stone-900">{ne ? photo.ne : photo.en}</h3>
                </div>
                <p className="text-sm leading-6 text-stone-600">{ne ? photo.captionNe : photo.captionEn}</p>
                <div className="flex items-center gap-2 border-t border-stone-100 pt-3 text-[11px] text-stone-500"><FileText size={13}/>{ne ? 'अभिलेख प्रकार: स्थलमा खिचिएको फोटो' : 'Record type: on-site photograph'}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <article className="rounded-xl border border-stone-200 bg-white p-5 sm:p-7">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-800 font-semibold"><FileText size={15}/>{ne ? 'ऐतिहासिक सन्दर्भ' : 'Historical context'}</div>
          <h2 className="mt-3 font-serif-np text-xl sm:text-2xl font-bold text-stone-900">{ne ? 'के कुरा सुरक्षित रूपमा भन्न सकिन्छ?' : 'What can safely be stated?'}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700 list-disc pl-5">
            <li>{ne ? 'पाटन संग्रहालयको आधिकारिक विवरणले केशव नारायण चोकको दरबार परिसर सन् 1734 को भएको बताउँछ; संग्रहालय सन् 1997 मा सार्वजनिक रूपमा खुल्यो।' : 'The official museum account dates the Keshav Narayan Chowk palace compound to 1734 and says the museum opened to the public in 1997.'}</li>
            <li>{ne ? 'संग्रहालयको इतिहास पृष्ठले मुख्य चोकमा सन् 643 को शिलालेख र नजिकै मणिधारामा सन् 560 को अर्को शिलालेख उल्लेख गर्छ।' : 'The museum history page mentions an inscription dated 643 CE in the main courtyard and another dated 560 CE at nearby Manidhara.'}</li>
            <li>{ne ? 'संग्रहालयले दरबार र विहारका पुराना आधारहरू लिच्छविकालीन हुन सक्ने सम्भावना उल्लेख गर्छ; यो सम्भावना हो, निश्चित प्रमाणित मिति होइन।' : 'The museum notes that older foundations beneath the palace and monastery may date to the Licchavi period; this is a possibility, not a conclusively established date.'}</li>
            <li>{ne ? 'तस्बिरमा देखिएका सबै शिलापत्रलाई एउटै मितिको भन्न मिल्दैन। प्रत्येक शिलालेखको छुट्टै पढाइ, सूची नम्बर र प्रकाशित सन्दर्भ आवश्यक हुन्छ।' : 'The photographed slabs should not all be assigned one date. Each inscription requires its own reading, catalogue identifier, and published reference.'}</li>
          </ul>
        </article>
        <aside className="rounded-xl border border-amber-200 bg-[#F7F2E8] p-5 sm:p-7">
          <div className="text-xs uppercase tracking-wider text-amber-900 font-semibold">{ne ? 'आधिकारिक स्रोतहरू' : 'Official references'}</div>
          <h2 className="mt-3 font-serif-np text-xl font-bold text-stone-900">{ne ? 'स्रोत र थप अध्ययन' : 'Sources & further reading'}</h2>
          <div className="mt-4 space-y-3">
            <a className="flex items-start justify-between gap-3 rounded-lg border border-stone-200 bg-white p-3 text-sm text-stone-800 hover:border-amber-700" href="https://patanmuseum.gov.np/content/22/2020/45547759/" target="_blank" rel="noreferrer">
              <span><strong className="block">{ne ? 'पाटन संग्रहालय — दरबारको इतिहास' : 'Patan Museum — Palace history'}</strong><span className="mt-1 block text-xs leading-5 text-stone-500">{ne ? '643 CE र 560 CE का शिलालेख तथा 1734 CE को दरबारबारे विवरण' : 'History page discussing inscriptions dated 643 CE and 560 CE and the 1734 palace'}</span></span><ExternalLink size={15} className="mt-1 shrink-0"/>
            </a>
            <a className="flex items-start justify-between gap-3 rounded-lg border border-stone-200 bg-white p-3 text-sm text-stone-800 hover:border-amber-700" href="https://www.patanmuseum.gov.np/content/33/2020/57271171/" target="_blank" rel="noreferrer">
              <span><strong className="block">{ne ? 'पाटन संग्रहालय — केशव नारायण चोक' : 'Patan Museum — Keshav Narayan Chowk'}</strong><span className="mt-1 block text-xs leading-5 text-stone-500">{ne ? 'दरबार परिसरको मिति र पुराना आधारबारे आधिकारिक विवरण' : 'Official account of the palace compound and older foundations'}</span></span><ExternalLink size={15} className="mt-1 shrink-0"/>
            </a>
            <a className="flex items-start justify-between gap-3 rounded-lg border border-stone-200 bg-white p-3 text-sm text-stone-800 hover:border-amber-700" href="https://ntb.gov.np/patan-museum" target="_blank" rel="noreferrer">
              <span><strong className="block">{ne ? 'नेपाल पर्यटन बोर्ड — पाटन संग्रहालय' : 'Nepal Tourism Board — Patan Museum'}</strong><span className="mt-1 block text-xs leading-5 text-stone-500">{ne ? '1734 CE को परिसर र 1997 CE मा संग्रहालय खुलेको विवरण' : 'Overview confirming the 1734 compound and 1997 museum opening'}</span></span><ExternalLink size={15} className="mt-1 shrink-0"/>
            </a>
            <a className="flex items-start justify-between gap-3 rounded-lg border border-stone-200 bg-white p-3 text-sm text-stone-800 hover:border-amber-700" href="https://patanmuseum.gov.np/" target="_blank" rel="noreferrer">
              <span><strong className="block">{ne ? 'पाटन संग्रहालय — आधिकारिक वेबसाइट' : 'Patan Museum — Official website'}</strong><span className="mt-1 block text-xs leading-5 text-stone-500">{ne ? 'प्रदर्शनी, संग्रह र थप आधिकारिक प्रकाशन' : 'Exhibitions, collections, and further official publications'}</span></span><ExternalLink size={15} className="mt-1 shrink-0"/>
            </a>
          </div>
          <p className="mt-4 border-t border-amber-300/60 pt-3 text-[11px] leading-5 text-stone-600">{ne ? 'अभिलेख नीति: संग्रहालयको व्याख्या र स्वतन्त्र अनुसन्धान निष्कर्षलाई अलग राखिन्छ। नयाँ प्रमाण भेटिएमा स्रोत, मिति र संशोधन इतिहाससहित अद्यावधिक गर्नुपर्छ।' : 'Archive policy: museum interpretation is kept distinct from independent research conclusions. New evidence should be added with source, date, and revision history.'}</p>
        </aside>
      </section>

      <footer className="rounded-xl border border-stone-200 bg-stone-50 p-4 sm:p-5 text-xs leading-6 text-stone-600">
        <strong className="text-stone-800">{ne ? 'फोटो अधिकार र अभिलेख टिप्पणी:' : 'Image rights & archival note:'}</strong>{' '}
        {ne ? 'यी फोटोहरू प्रयोगकर्ताले उपलब्ध गराएका हुन्। फोटोग्राफर, खिचिएको मिति र प्रकाशन-अनुमतिको विस्तृत जानकारी पुष्टि भएपछि थप्नुपर्छ। सार्वजनिक रूपमा राखिएको फोटो आफैँमा मूल शिलालेखको पूर्ण पाठ वा स्वतन्त्र ऐतिहासिक प्रमाणीकरण होइन।' : 'These photographs were supplied by the user. Photographer, capture date, and publication permission should be added once confirmed. A public photograph is not by itself a full transcription or independent historical authentication of an inscription.'}
      </footer>
    </div>
  );
};
