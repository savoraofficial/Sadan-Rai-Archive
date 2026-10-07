export type KiratEvidenceLevel = 'direct' | 'chronicle' | 'scholarship' | 'identity';

export interface KiratEvidenceCard {
  id: string;
  level: KiratEvidenceLevel;
  titleNe: string;
  titleEn: string;
  institutionNe: string;
  institutionEn: string;
  countryNe: string;
  countryEn: string;
  date: string;
  targetNe: string;
  targetEn: string;
  findingNe: string;
  findingEn: string;
  limitationNe: string;
  limitationEn: string;
  url?: string;
}

export interface KiratTimelineItem {
  periodNe: string;
  periodEn: string;
  titleNe: string;
  titleEn: string;
  bodyNe: string;
  bodyEn: string;
  level: KiratEvidenceLevel;
}

export const KIRAT_CIVILIZATION_INTRO = {
  ne: 'किरात/किराँत भन्नाले एउटै समय, एउटै राज्य वा एउटै आधुनिक जातीय समूह मात्र जनाउँछ भनेर सरल रूपमा निष्कर्ष निकाल्न मिल्दैन। उपलब्ध प्रमाणमा “Kirāta” प्राचीन संस्कृत साहित्यमा प्रयोग भएको व्यापक नाम, नेपालका वंशावलीमा सुरक्षित किरात राजकीय परम्परा, पूर्वी नेपालका ऐतिहासिक Kirat/Kiranti समुदाय, र आधुनिक Kiranti पहिचान—यी फरक तहहरू देखिन्छन्। यस पृष्ठले ती तहलाई प्रमाणअनुसार छुट्याएर जोड्छ।',
  en: 'Kirat/Kiranti should not be reduced to a single period, kingdom, or modern ethnic group. The evidence points to several distinct layers: the ancient Sanskrit term “Kirāta,” the Kirata dynastic tradition preserved in Nepalese chronicles, historically documented Kirat/Kiranti communities in eastern Nepal, and modern Kiranti identities. This page connects those layers without treating them as automatically identical.'
};

export const KIRAT_NAME_ANALYSIS = {
  ne: {
    heading: '“किरात” नाम कहाँबाट आयो?',
    body: '“Kirāta” संस्कृत साहित्यमा प्राचीन पहाडी/हिमाली समुदायलाई जनाउने नामका रूपमा भेटिन्छ र Kiranti शब्दलाई त्यसैसँग सम्बन्धित मानिन्छ। तर शब्दको मूल व्युत्पत्ति—ठ्याक्कै कुन पुरानो भाषाबाट र कुन अर्थबाट बनेको हो—बारे एउटै निर्णायक scholarly consensus छैन। त्यसैले “यो शब्द फलानो ठाउँबाट नै बनेको हो” भनेर प्रमाणबिना अन्तिम दाबी गरिँदैन।',
    evidence: 'Gerber & Grollmann (2018) ले Kiranti नाम Sanskrit kirāta सँग सम्बन्धित र Vedic texts सम्म पुग्ने बताउँछन्; उनीहरूले आधुनिक Kiranti समूहको भाषिक एकता पनि स्वतः प्रमाणित भएको मान्दैनन्।'
  },
  en: {
    heading: 'Where did the name “Kirat” come from?',
    body: '“Kirāta” appears in ancient Sanskrit literature as a name applied to mountain/Himalayan peoples, and the modern term Kiranti is connected to it in scholarship. The deeper etymology of kirāta itself is not settled by a single universally accepted derivation. The archive therefore does not present one speculative origin as established fact.',
    evidence: 'Gerber & Grollmann (2018) connect Kiranti with Sanskrit kirāta and trace the term to Vedic textual usage, while also warning that the coherence of the modern Kiranti language grouping is not automatically proven.'
  }
};

export const KIRAT_AGE_STATEMENT = {
  ne: 'किरात सभ्यताको “ठ्याक्कै यति वर्ष पुरानो” भन्ने एउटा संख्या अहिले उपलब्ध प्रमाणले सुरक्षित रूपमा प्रमाणित गर्दैन। “Kirāta” शब्दको प्राचीन साहित्यिक प्रयोग धेरै पुरानो हो; नेपालका किरात राजवंशसम्बन्धी मुख्य वंशावलीहरू धेरै पछिका लिखित संकलन हुन्; र प्रत्यक्ष अभिलेखीय वस्तुका रूपमा कम्तीमा 16औँ शताब्दीको Kiranta manuscript catalogue records तथा 18औँ–19औँ शताब्दीका Pallo Kirāta/Limbuvān प्रशासनिक कागजातहरू सुरक्षित रूपमा पहिचान भएका छन्। त्यसैले ‘प्राचीन नाम’, ‘क्रोनिकल परम्परा’ र ‘प्रत्यक्ष सुरक्षित दस्तावेज’ लाई एउटै age-number मा मिसाउनु हुँदैन।',
  en: 'The present evidence does not justify a single exact number of years for the “age of Kirat civilization.” The term “Kirāta” is much older in literary usage; the main written Nepalese chronicles preserving a Kirata dynastic tradition are much later compilations; and securely identified archival objects include Kiranta manuscripts catalogued to the 16th century and Pallo Kirāta/Limbuvān administrative documents from the 18th–19th centuries. These are different evidence layers and should not be collapsed into one age-number.'
};

export const KIRAT_TIMELINE: KiratTimelineItem[] = [
  {
    periodNe: 'प्राचीन साहित्यिक तह',
    periodEn: 'Ancient textual layer',
    titleNe: '“Kirāta” नामको प्रारम्भिक साहित्यिक प्रयोग',
    titleEn: 'Early textual use of “Kirāta”',
    bodyNe: 'प्राचीन संस्कृत/वैदिक साहित्यमा Kirāta नाम पहाडी समुदायका लागि प्रयोग भएको देखिन्छ। यसले नामको प्राचीनता देखाउँछ; तर त्यही नामलाई आजका सबै Kiranti समुदाय वा निरन्तर एउटै सभ्यतासँग सीधा बराबर प्रमाणित गर्दैन।',
    bodyEn: 'Ancient Sanskrit/Vedic literature uses Kirāta as a designation associated with mountain peoples. This establishes an old textual name, but does not by itself prove that every modern Kiranti community or a single continuous civilization is identical with every ancient use of the term.',
    level: 'scholarship'
  },
  {
    periodNe: 'मध्यकालीन क्रोनिकल तह',
    periodEn: 'Medieval chronicle layer',
    titleNe: 'नेपालका वंशावलीमा किरात राजकीय परम्परा',
    titleEn: 'Kirata dynastic tradition in Nepalese chronicles',
    bodyNe: 'Gopālarājavamsāvali जस्ता पछिल्ला वंशावलीहरूले काठमाडौं उपत्यकामा किरात शासकहरूको लामो परम्परा प्रस्तुत गर्छन्। परम्परा ऐतिहासिक महत्त्वको छ, तर वंशावलीको कुल वर्ष वा प्रत्येक शासकको समयलाई समकालीन पुरातात्त्विक प्रमाणसरह प्रस्तुत गर्न मिल्दैन।',
    bodyEn: 'Later chronicles such as the Gopālarājavamsāvali preserve a long Kirata ruling tradition in the Kathmandu Valley. The tradition is historically important, but its regnal totals and individual ruler dates cannot be presented as if they were contemporary archaeological measurements.',
    level: 'chronicle'
  },
  {
    periodNe: '16औँ शताब्दी',
    periodEn: '16th century catalogue horizon',
    titleNe: 'Kiranta धार्मिक/पाठ्य पाण्डुलिपि अभिलेख',
    titleEn: 'Kiranta religious and textual manuscripts',
    bodyNe: 'British Library का EAP1023 catalogue मा Kiranta भाषा/लिम्बू लिपिसम्बन्धी धार्मिक तथा प्रार्थना पाण्डुलिपिहरू 16औँ शताब्दीको catalogue date सहित सुरक्षित छन्। यी प्रत्यक्ष archival objects हुन्; तर प्रत्येक पाण्डुलिपिको भित्री पाठबाट कुन ऐतिहासिक दाबी प्रमाणित हुन्छ भन्ने छुट्टै folio-level reading चाहिन्छ।',
    bodyEn: 'British Library EAP1023 catalogue records include Kiranta religious and prayer manuscripts with 16th-century catalogue dates. These are direct archival objects; what each manuscript proves historically still requires folio-level reading rather than inference from the catalogue title alone.',
    level: 'direct'
  },
  {
    periodNe: '18औँ–19औँ शताब्दी',
    periodEn: '18th–19th centuries',
    titleNe: 'Pallo Kirāta / Limbuvān प्रशासनिक दस्तावेज',
    titleEn: 'Pallo Kirāta / Limbuvān administrative documents',
    bodyNe: 'Documenta Nepalica मा Pallo Kirāta तथा Limbuvān सम्बन्धी प्राथमिक प्रशासनिक दस्तावेजहरू 18औँ–19औँ शताब्दीमा व्यवस्थित रूपमा अभिलेखित छन्। यस्ता कागजातले ऐतिहासिक भू-क्षेत्र, प्रशासन, भूमि/राजस्व र राजनीतिक सम्बन्धबारे प्रत्यक्ष documentary layer दिन्छन्।',
    bodyEn: 'Documenta Nepalica preserves primary administrative documents indexed under Pallo Kirāta and Limbuvān from the 18th–19th centuries. These records provide a direct documentary layer for historical territory, administration, land/revenue and political relations.',
    level: 'direct'
  },
  {
    periodNe: '1819',
    periodEn: '1819',
    titleNe: 'Hamilton को स्वतन्त्र लिखित विवरण',
    titleEn: 'Hamilton’s independent written account',
    bodyNe: 'Francis Buchanan Hamilton ले पूर्वी नेपालतर्फका पहाडमा Kirat/Kichak समुदाय रहेको लेखेका छन् र Agam Singha लाई Kirats का hereditary chief/informant का रूपमा उल्लेख गरेका छन्। यो आधुनिक कालअघिको पूर्वी नेपालसम्बन्धी बलियो early documentary cross-check हो।',
    bodyEn: 'Francis Buchanan Hamilton records a Kirat/Kichak population in the eastern mountains and identifies Agam Singha as a hereditary chief/informant of the Kirats. This is a strong early documentary cross-check for Kirat communities in eastern Nepal.',
    level: 'direct'
  },
  {
    periodNe: '19औँ शताब्दी–आज',
    periodEn: '19th century–present',
    titleNe: 'भाषा, समुदाय, धर्म र आधुनिक पहिचानको अध्ययन',
    titleEn: 'Language, community, religion and modern identity research',
    bodyNe: 'Hodgson देखि आधुनिक भाषाविज्ञान, मानवशास्त्र र धार्मिक अध्ययनसम्मको scholarship ले विभिन्न Kiranti भाषाहरू, समुदाय र परम्परालाई दस्तावेज गर्छ। तर आधुनिक Kiranti identity लाई प्राचीन Kirāta का सबै प्रयोगसँग स्वतः एउटै ठान्ने निष्कर्ष scholarly caution बिना स्वीकारिँदैन।',
    bodyEn: 'From Hodgson to modern linguistics, anthropology and religious studies, scholarship documents multiple Kiranti languages, communities and traditions. Scholarly caution is still required before equating modern Kiranti identity automatically with every ancient use of Kirāta.',
    level: 'scholarship'
  }
];

export const KIRAT_MAIN_EVIDENCE: KiratEvidenceCard[] = [
  {
    id: 'hamilton-1819', level: 'direct', titleNe: 'Francis Buchanan Hamilton — Nepal सम्बन्धी विवरण', titleEn: 'Francis Buchanan Hamilton — Account of Nepal',
    institutionNe: 'Library of Congress', institutionEn: 'Library of Congress', countryNe: 'संयुक्त राज्य अमेरिका', countryEn: 'United States', date: '1819',
    targetNe: 'मुद्रित पृष्ठ 2–3, 7–8, 133–134, 148–149; stored extract मा pp. 7–8 को Kirat/Kichak passage',
    targetEn: 'Printed pp. 2–3, 7–8, 133–134, 148–149; stored extract includes the Kirat/Kichak passage on pp. 7–8',
    findingNe: 'पूर्वी नेपालतर्फका पहाडमा Kirat/Kichak समुदायको वर्णन र Agam Singha सम्बन्धी सूचना।',
    findingEn: 'Documents a Kirat/Kichak population in the eastern mountains and records information associated with Agam Singha.',
    limitationNe: 'यसले प्राचीन निरन्तर राजवंश वा आधुनिक सबै Kiranti समुदायको एउटै ancestry प्रमाणित गर्दैन।',
    limitationEn: 'It does not by itself prove an uninterrupted ancient dynasty or a single ancestry for all modern Kiranti communities.',
    url: 'https://www.loc.gov/item/43032470/'
  },
  {
    id: 'bl-eap-22-17', level: 'direct', titleNe: 'British Library EAP1023/22/17 — किराँत धर्म', titleEn: 'British Library EAP1023/22/17 — Kiranta Book of Religion',
    institutionNe: 'British Library Endangered Archives Programme', institutionEn: 'British Library Endangered Archives Programme', countryNe: 'बेलायत', countryEn: 'United Kingdom', date: '16औँ शताब्दी catalogue date',
    targetNe: '25 paper folios; 27 TIFF images; research access / not public record', targetEn: '25 paper folios; 27 TIFF images; research access / not public record',
    findingNe: 'Kiranta भाषामा धार्मिक पाण्डुलिपिको प्रत्यक्ष archival object catalogue मा सुरक्षित छ।', findingEn: 'A Kiranta-language religious manuscript is directly identified as an archival object.',
    limitationNe: 'Catalogue record मात्रले भित्री पाठका सबै ऐतिहासिक दाबी प्रमाणित गर्दैन; folio reading र अधिकार जाँच आवश्यक छ।', limitationEn: 'The catalogue record does not prove every historical proposition in the manuscript; folio reading and rights review are required.',
    url: 'https://searcharchives.bl.uk/catalog/040-003666019'
  },
  {
    id: 'documenta-pallo', level: 'direct', titleNe: 'Documenta Nepalica — Pallo Kirāta / Limbuvān documents', titleEn: 'Documenta Nepalica — Pallo Kirāta / Limbuvān documents',
    institutionNe: 'Heidelberg Academy / Documenta Nepalica', institutionEn: 'Heidelberg Academy / Documenta Nepalica', countryNe: 'जर्मनी', countryEn: 'Germany', date: '1780–1851 and related records',
    targetNe: 'E_3345_0008, E_3420_0007, E_3420_0008, E_3420_0013, E_3420_0016 लगायत', targetEn: 'E_3345_0008, E_3420_0007, E_3420_0008, E_3420_0013, E_3420_0016 and related records',
    findingNe: 'Pallo Kirāta/Limbuvān नामले catalogued प्राथमिक प्रशासनिक अभिलेखहरूको corpus।', findingEn: 'A corpus of primary administrative records catalogued under Pallo Kirāta/Limbuvān.',
    limitationNe: 'प्रत्येक claim का लागि सम्बन्धित folio/edition पढेर मात्र निष्कर्ष बढाइन्छ।', limitationEn: 'Claim-level conclusions require reading the relevant folio or diplomatic edition for each document.',
    url: 'https://nepalica.hadw-bw.de/nepal/ontologies/viewitem/2259'
  },
  {
    id: 'hodgson-ras', level: 'direct', titleNe: 'Brian Houghton Hodgson — Comparative Vocabulary of the Kiranti', titleEn: 'Brian Houghton Hodgson — Comparative Vocabulary of the Kiranti',
    institutionNe: 'Royal Asiatic Society Archives', institutionEn: 'Royal Asiatic Society Archives', countryNe: 'बेलायत', countryEn: 'United Kingdom', date: '1820–1860 catalogue period',
    targetNe: 'BHH/6/1/1; 6 large sheets / 11 sides', targetEn: 'BHH/6/1/1; 6 large sheets / 11 sides',
    findingNe: 'Kiranti भाषिक सामग्रीको archival manuscript record।', findingEn: 'An archival manuscript record of comparative Kiranti linguistic material.',
    limitationNe: 'Catalogue identity बलियो छ; manuscript content को claim-level transcription अझै छुट्टै चाहिन्छ।', limitationEn: 'The catalogue identity is secure; claim-level transcription of the manuscript remains a separate research step.',
    url: 'https://royalasiaticsociety.org/'
  },
  {
    id: 'bl-eap-21-5', level: 'direct', titleNe: 'British Library EAP1023/21/5 — किराँत धर्म', titleEn: 'British Library EAP1023/21/5 — Kiranta Religious Book',
    institutionNe: 'British Library Endangered Archives Programme', institutionEn: 'British Library Endangered Archives Programme', countryNe: 'बेलायत', countryEn: 'United Kingdom', date: '16औँ शताब्दी catalogue date',
    targetNe: '21 paper folios; research access / not public record', targetEn: '21 paper folios; research access / not public record',
    findingNe: 'Kiranta भाषामा धार्मिक पुस्तकको प्रत्यक्ष archival record।', findingEn: 'A directly catalogued Kiranta-language religious book.',
    limitationNe: 'Catalogue date र object identity लाई text-content dating वा सम्पूर्ण historical claim proof नबनाइने।', limitationEn: 'The catalogue date and object identity are not treated as proof of every textual or historical claim.',
    url: 'https://searcharchives.bl.uk/catalog/040-003665987'
  },
  {
    id: 'gerber-grollmann-2018', level: 'scholarship', titleNe: 'Gerber & Grollmann — What is Kiranti? A Critical Account', titleEn: 'Gerber & Grollmann — What is Kiranti? A Critical Account',
    institutionNe: 'University of Bern / Bulletin of Chinese Linguistics', institutionEn: 'University of Bern / Bulletin of Chinese Linguistics', countryNe: 'स्विट्जरल्यान्ड', countryEn: 'Switzerland', date: '2018',
    targetNe: 'pp. 99–152; विशेष गरी pp. 99–101', targetEn: 'pp. 99–152; especially pp. 99–101',
    findingNe: 'Kiranti नाम Sanskrit kirāta सँग सम्बन्धित र Vedic textual usage सम्म पुग्ने scholarly analysis; आधुनिक Kiranti भाषिक एकता स्वतः प्रमाणित भएको छैन भन्ने critical control।',
    findingEn: 'Connects Kiranti with Sanskrit kirāta and Vedic textual usage, while providing a critical control against assuming that the modern Kiranti linguistic grouping is automatically proven.',
    limitationNe: 'यो secondary linguistic scholarship हो; ancient political history को primary evidence होइन।', limitationEn: 'This is secondary linguistic scholarship, not primary evidence for ancient political history.',
    url: 'https://doi.org/10.1163/2405478X-01101010'
  }
];

export const KIRAT_GLOBAL_CROSSCHECK = [
  { countryNe: 'नेपाल', countryEn: 'Nepal', institutionNe: 'Department of Archaeology / Nepalese historical record', institutionEn: 'Department of Archaeology / Nepalese historical record', roleNe: 'क्रोनिकल, पुरातात्त्विक/ऐतिहासिक व्याख्या र सरकारी compilation', roleEn: 'Chronicle, archaeological/historical interpretation and official compilation' },
  { countryNe: 'बेलायत', countryEn: 'United Kingdom', institutionNe: 'British Library / Royal Asiatic Society', institutionEn: 'British Library / Royal Asiatic Society', roleNe: '16औँ–19औँ शताब्दीका पाण्डुलिपि, भाषिक तथा archival objects', roleEn: '16th–19th century manuscripts, linguistic and archival objects' },
  { countryNe: 'संयुक्त राज्य अमेरिका', countryEn: 'United States', institutionNe: 'Library of Congress', institutionEn: 'Library of Congress', roleNe: '1819 Hamilton primary-source digitisation', roleEn: 'Digitised 1819 Hamilton primary source' },
  { countryNe: 'जर्मनी', countryEn: 'Germany', institutionNe: 'Heidelberg Academy / Documenta Nepalica', institutionEn: 'Heidelberg Academy / Documenta Nepalica', roleNe: 'Pallo Kirāta/Limbuvān का प्राथमिक प्रशासनिक दस्तावेज corpus', roleEn: 'Primary administrative-document corpus for Pallo Kirāta/Limbuvān' },
  { countryNe: 'स्विट्जरल्यान्ड', countryEn: 'Switzerland', institutionNe: 'University of Bern / Brill', institutionEn: 'University of Bern / Brill', roleNe: 'आधुनिक भाषिक दाबीको independent critical scholarship', roleEn: 'Independent critical scholarship on modern linguistic claims' }
];

export const KIRAT_PUBLIC_CONCLUSION = {
  ne: 'हालसम्मको cross-check बाट सुरक्षित निष्कर्ष यस्तो छ: “Kirat” एक प्राचीन साहित्यिक नाम पनि हो, नेपालका ऐतिहासिक वंशावलीमा किरात राजकीय परम्पराको नाम पनि हो, र पूर्वी नेपालका ऐतिहासिक समुदाय तथा भू-क्षेत्रसम्बन्धी पछिल्ला documentary records मा पनि स्पष्ट रूपमा देखिन्छ। तर यी सबै तहलाई एउटै uninterrupted civilization, एउटै ancestry वा ठ्याक्कै एउटै modern identity भनेर प्रमाणबिना बराबर राख्न मिल्दैन। Sadan Rai Archive ले त्यसैले प्रमाणित कुरा अगाडि, परम्परा/व्याख्या अलग, र बाँकी प्रश्नलाई Further Research का रूपमा राख्छ।',
  en: 'The evidence currently supports a careful conclusion: “Kirat” is an ancient literary designation, a name attached to a Kirata dynastic tradition in Nepalese chronicles, and a term clearly documented in later records concerning communities and territories of eastern Nepal. The evidence does not justify collapsing all of these layers into one uninterrupted civilization, one ancestry, or one identical modern identity without further proof. The Sadan Rai Archive therefore places directly evidenced material first, tradition and interpretation separately, and unresolved questions under Further Research.'
};
