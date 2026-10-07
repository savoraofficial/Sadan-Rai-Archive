import { Article, MediaItem, PhotoItem, Source, VillageSectionData, KiratHistorySectionData, HistoricalAuthorEntry } from '../types';

// Brand Information strictly from user brief
export const BRAND_INFO = {
  name: 'SADAN RAI',
  nepaliName: 'सदन राई',
  tagline: 'हाम्रो पहिचान: इतिहास, सभ्यता र संस्कृतिको साझा संरक्षण।',
  taglineEnglish: 'Our identity: preserving history, civilization, and culture together.',
  institutionalName: 'इतिहास, सभ्यता तथा संस्कृति अभिलेखालय',
  institutionalNameEnglish: 'History, Civilization & Culture Archive',
  subtitleNepali: 'हाम्रो पुर्खा • हाम्रो पहिचान',
  subtitleEnglish: 'History • Culture • Civilization • Oral Traditions',
  village: {
    name: 'माल्बासे–१, पात्लेपानी',
    municipality: 'हतुवागढी गाउँपालिका',
    district: 'भोजपुर',
    country: 'नेपाल',
    english: 'Malbase–1, Patlepani, Hatuwagadhi, Bhojpur, Nepal'
  },
  contactEmail: 'raiktosadan@gmail.com'
};

// Expandable Content Categories for CMS
export interface ResearchCategoryDef {
  key: string;
  nepali: string;
  english: string;
  descriptionNepali: string;
  descriptionEnglish: string;
}

// Universal subject families: the research workflow is shared across civilizations, religions, cultures, places, and traditions.
export interface CivilizationFamilyDef {
  key: string;
  nepali: string;
  english: string;
}

export const CIVILIZATION_FAMILIES: CivilizationFamilyDef[] = [
  { key: 'kirat', nepali: 'किराँत', english: 'Kirat' },
  { key: 'buddhist', nepali: 'बौद्ध / बौद्ध सभ्यता', english: 'Buddhist / Buddhist Civilizations' },
  { key: 'hindu_vedic', nepali: 'हिन्दू / वैदिक परम्परा', english: 'Hindu / Vedic Traditions' },
  { key: 'newar', nepali: 'नेवार / नेपाल मण्डल', english: 'Newar / Nepal Mandala' },
  { key: 'himalayan', nepali: 'हिमाली सभ्यताहरू', english: 'Himalayan Civilizations' },
  { key: 'tibetan', nepali: 'तिब्बती सभ्यता', english: 'Tibetan Civilization' },
  { key: 'indus', nepali: 'सिन्धु सभ्यता', english: 'Indus Civilization' },
  { key: 'mesopotamian', nepali: 'मेसोपोटामियाली सभ्यताहरू', english: 'Mesopotamian Civilizations' },
  { key: 'egyptian', nepali: 'प्राचीन मिस्री सभ्यता', english: 'Ancient Egyptian Civilization' },
  { key: 'persian', nepali: 'फारसी / इरानी सभ्यताहरू', english: 'Persian / Iranian Civilizations' },
  { key: 'greek', nepali: 'युनानी / ग्रीक सभ्यता', english: 'Greek Civilization' },
  { key: 'roman', nepali: 'रोमन सभ्यता', english: 'Roman Civilization' },
  { key: 'chinese', nepali: 'चिनियाँ सभ्यता', english: 'Chinese Civilization' },
  { key: 'japanese', nepali: 'जापानी सभ्यता', english: 'Japanese Civilization' },
  { key: 'korean', nepali: 'कोरियाली सभ्यता', english: 'Korean Civilization' },
  { key: 'southeast_asian', nepali: 'दक्षिण–पूर्वी एसियाली सभ्यताहरू', english: 'Southeast Asian Civilizations' },
  { key: 'islamic', nepali: 'इस्लामी सभ्यताहरू', english: 'Islamic Civilizations' },
  { key: 'african', nepali: 'अफ्रिकी सभ्यताहरू', english: 'African Civilizations' },
  { key: 'european', nepali: 'युरोपेली सभ्यताहरू', english: 'European Civilizations' },
  { key: 'mesoamerican', nepali: 'मेसोअमेरिकी सभ्यताहरू', english: 'Mesoamerican Civilizations' },
  { key: 'andean', nepali: 'एन्डियन सभ्यताहरू', english: 'Andean Civilizations' },
  { key: 'indigenous_world', nepali: 'विश्वका आदिवासी तथा स्थानीय सभ्यताहरू', english: 'Indigenous & Local Civilizations Worldwide' },
  { key: 'south_asian', nepali: 'दक्षिण एसियाली सभ्यताहरू', english: 'South Asian Civilizations' },
  { key: 'other', nepali: 'अन्य / कस्टम सभ्यता वा परम्परा', english: 'Other / Custom Civilization or Tradition' },
];

export const RESEARCH_CATEGORIES: ResearchCategoryDef[] = [
  { key: 'history_civilization', nepali: 'इतिहास तथा सभ्यता', english: 'History & Civilization', descriptionNepali: 'सबै काल, भूगोल, समुदाय र सभ्यताका इतिहास तथा सभ्यता अध्ययन।', descriptionEnglish: 'History and civilization studies across periods, regions, communities, and civilizations.' },
  { key: 'kirat_history', nepali: 'किराँत इतिहास', english: 'Kirat History', descriptionNepali: 'किराँत इतिहाससम्बन्धी स्रोत, अध्ययन र अभिलेखहरू।', descriptionEnglish: 'Sources, studies, and archival records relating to Kirat history.' },
  { key: 'buddhist_history', nepali: 'बौद्ध इतिहास', english: 'Buddhist History', descriptionNepali: 'बौद्ध इतिहास, परम्परा, स्रोत र ऐतिहासिक विकाससम्बन्धी सामग्री।', descriptionEnglish: 'Historical records, traditions, sources, and developments related to Buddhist history.' },
  { key: 'nepal_history', nepali: 'नेपाल इतिहास', english: 'Nepal History', descriptionNepali: 'नेपालका विभिन्न कालखण्ड, क्षेत्र र समुदायका ऐतिहासिक अभिलेख।', descriptionEnglish: 'Historical records covering periods, regions, and communities of Nepal.' },
  { key: 'himalayan_history', nepali: 'हिमाली इतिहास', english: 'Himalayan History', descriptionNepali: 'हिमाली क्षेत्रका इतिहास, समाज, सम्पर्क र ऐतिहासिक परिवर्तन।', descriptionEnglish: 'History, societies, connections, and historical change across the Himalayan region.' },
  { key: 'ancient_history', nepali: 'प्राचीन इतिहास', english: 'Ancient History', descriptionNepali: 'प्राचीन समाज, राज्य, संस्कृति, सभ्यता र स्रोतहरूको अध्ययन।', descriptionEnglish: 'Studies of ancient societies, states, cultures, civilizations, and sources.' },
  { key: 'medieval_history', nepali: 'मध्यकालीन इतिहास', english: 'Medieval History', descriptionNepali: 'मध्यकालीन समाज, राज्य, संस्कृति र ऐतिहासिक परिवर्तन।', descriptionEnglish: 'Medieval societies, states, cultures, and historical change.' },
  { key: 'modern_history', nepali: 'आधुनिक इतिहास', english: 'Modern History', descriptionNepali: 'आधुनिक कालका राजनीतिक, सामाजिक, सांस्कृतिक र आर्थिक परिवर्तन।', descriptionEnglish: 'Political, social, cultural, and economic change in the modern period.' },
  { key: 'comparative_history', nepali: 'तुलनात्मक इतिहास', english: 'Comparative History', descriptionNepali: 'विभिन्न समाज, क्षेत्र र सभ्यताबीचको तुलनात्मक ऐतिहासिक अध्ययन।', descriptionEnglish: 'Comparative historical study across societies, regions, and civilizations.' },
  { key: 'kirat_culture', nepali: 'किराँत संस्कृति, धर्म तथा परम्परा', english: 'Kirat Culture, Religion & Traditions', descriptionNepali: 'किराँत समुदायका संस्कार, परम्परा र मूल्यमान्यता।', descriptionEnglish: 'Rituals, traditions, beliefs, and values of Kirat communities.' },
  { key: 'buddhist_culture', nepali: 'बौद्ध संस्कृति, धर्म तथा परम्परा', english: 'Buddhist Culture, Religion & Traditions', descriptionNepali: 'बौद्ध संस्कृति, धर्म, अभ्यास, परम्परा र सम्पदाको अभिलेख।', descriptionEnglish: 'Buddhist culture, religion, practices, traditions, and heritage.' },
  { key: 'rai_culture', nepali: 'राई संस्कृति', english: 'Rai Culture', descriptionNepali: 'राई समुदायको भाषा, संस्कार, चुल्हा र रैथाने चलन।', descriptionEnglish: 'Rai language, rituals, household traditions, and local practices.' },
  { key: 'limbu_culture', nepali: 'लिम्बू संस्कृति', english: 'Limbu Culture', descriptionNepali: 'लिम्बू समुदायको सिरिजङ्गा लिपि, मुन्धुम र संस्कृति।', descriptionEnglish: 'Limbu script, Mundhum, traditions, and cultural heritage.' },
  { key: 'tamang_culture', nepali: 'तामाङ संस्कृति', english: 'Tamang Culture', descriptionNepali: 'तामाङ समुदायको परम्परा, भाषा र संस्कृति।', descriptionEnglish: 'Tamang traditions, language, and cultural heritage.' },
  { key: 'indigenous_cultures', nepali: 'आदिवासी तथा अन्य समुदायका संस्कृति', english: 'Indigenous & Other Cultures', descriptionNepali: 'विभिन्न आदिवासी तथा स्थानीय समुदायका सांस्कृतिक अभिलेख।', descriptionEnglish: 'Cultural records of Indigenous and other local communities.' },
  { key: 'religion_belief', nepali: 'धर्म तथा विश्वास प्रणाली', english: 'Religion & Belief Systems', descriptionNepali: 'धर्म, आस्था, दर्शन, अनुष्ठान र विश्वास प्रणाली।', descriptionEnglish: 'Religion, belief, philosophy, ritual, and systems of faith.' },
  { key: 'language', nepali: 'भाषा तथा भाषाविज्ञान', english: 'Language & Linguistics', descriptionNepali: 'मातृभाषा, लिपि, भाषिक परिवर्तन र भाषावैज्ञानिक अनुसन्धान।', descriptionEnglish: 'Languages, scripts, linguistic change, and linguistic research.' },
  { key: 'mundhum_oral', nepali: 'मुन्धुम तथा मौखिक परम्परा', english: 'Mundhum & Oral Tradition', descriptionNepali: 'मुन्धुमका ऋचा, आख्यान, स्मृति र मौखिक परम्परा।', descriptionEnglish: 'Mundhum verses, narratives, memory, and oral traditions.' },
  { key: 'civilization', nepali: 'सभ्यता', english: 'Civilization', descriptionNepali: 'सभ्यता, जीवनपद्धति, ज्ञान, सामाजिक संरचना र सम्बन्धित अध्ययन।', descriptionEnglish: 'Civilization, lifeways, knowledge systems, social structures, and related studies.' },
  { key: 'buddhist_civilization', nepali: 'बौद्ध सभ्यता', english: 'Buddhist Civilization', descriptionNepali: 'बौद्ध सभ्यता, संस्था, कला, ज्ञान र ऐतिहासिक विकास।', descriptionEnglish: 'Buddhist civilization, institutions, art, knowledge, and historical development.' },
  { key: 'himalayan_civilizations', nepali: 'हिमाली सभ्यताहरू', english: 'Himalayan Civilizations', descriptionNepali: 'हिमाली क्षेत्रका विभिन्न सभ्यता, समाज र सांस्कृतिक सम्पर्क।', descriptionEnglish: 'Civilizations, societies, and cultural connections of the Himalayan region.' },
  { key: 'archaeology', nepali: 'पुरातत्त्व तथा भौतिक प्रमाण', english: 'Archaeology & Material Evidence', descriptionNepali: 'पुरातात्त्विक स्थल, उत्खनन, अवशेष, शिलालेख र भौतिक प्रमाण।', descriptionEnglish: 'Archaeological sites, excavations, remains, inscriptions, and material evidence.' },
  { key: 'local_history', nepali: 'स्थानीय तथा क्षेत्रीय इतिहास', english: 'Local & Regional History', descriptionNepali: 'विभिन्न भूगोल, क्षेत्र, बस्ती र समुदायका स्थानीय इतिहास।', descriptionEnglish: 'Local histories of places, regions, settlements, and communities.' },
  { key: 'village_history', nepali: 'स्थान तथा गाउँको इतिहास', english: 'Places & Village History', descriptionNepali: 'स्थान, गाउँ, भूगोल, बस्ती, ऐतिहासिक स्थल र स्थानीय जीवनका अभिलेख।', descriptionEnglish: 'Places, villages, geography, settlements, historic sites, and local life.' },
  { key: 'oral_history', nepali: 'मौखिक इतिहास', english: 'Oral History', descriptionNepali: 'जानकार, अग्रज र समुदायबाट संकलित मौखिक इतिहास, स्मृति र साक्ष्य।', descriptionEnglish: 'Oral histories, memories, testimony, and knowledge collected from informants and elders.' },
  { key: 'ancient_authors', nepali: 'लेखक तथा अनुसन्धानकर्ताका दृष्टिकोण', english: 'Authors & Researchers Perspectives', descriptionNepali: 'इतिहासकार, विद्वान् र अनुसन्धानकर्ताले लेखेका स्रोत तथा दृष्टिकोणहरूको तुलनात्मक अभिलेख।', descriptionEnglish: 'Comparative records of works and perspectives by historians, scholars, and researchers.' },
  { key: 'research_methodology', nepali: 'अनुसन्धान तथा विश्लेषण', english: 'Research & Analysis', descriptionNepali: 'स्रोत, प्रमाण, विश्लेषण, निष्कर्ष र अनुसन्धान विधिमा आधारित सामग्री।', descriptionEnglish: 'Source-based research, evidence analysis, conclusions, and research methods.' },
  { key: 'music_songs', nepali: 'गीत तथा संगीत', english: 'Music & Songs', descriptionNepali: 'मौलिक लोकभाका, पुर्ख्यौली धुन, गीत र संगीत अभिलेख।', descriptionEnglish: 'Folk melodies, ancestral songs, music, and audiovisual records.' },
  { key: 'art_material_culture', nepali: 'कला तथा भौतिक संस्कृति', english: 'Art & Material Culture', descriptionNepali: 'कला, हस्तकला, वस्तु, पोशाक र भौतिक सांस्कृतिक सम्पदा।', descriptionEnglish: 'Art, crafts, objects, clothing, and material cultural heritage.' },
  { key: 'photos_documents', nepali: 'फोटो तथा दस्तावेज', english: 'Photos & Documents', descriptionNepali: 'ऐतिहासिक तस्बिर, लिखत, स्क्यान र अभिलेखीय प्रमाण।', descriptionEnglish: 'Historical photographs, documents, scans, and archival evidence.' },
  { key: 'research_custom', nepali: 'अन्य / कस्टम विषय', english: 'Other / Custom Topic', descriptionNepali: 'प्रशासकले आवश्यकताअनुसार थप्ने नयाँ इतिहास, सभ्यता, संस्कृति वा अनुसन्धान विषय।', descriptionEnglish: 'A flexible category for new history, civilization, culture, or research topics added by the administrator.' }
];

export const RESEARCH_STATUS_LABELS: Record<'verified' | 'oral_history' | 'further_research', { nepali: string; english: string; color: string }> = {
  verified: { nepali: 'प्रमाणित स्रोत', english: 'Verified / Documented Source', color: 'bg-emerald-950 text-emerald-200 border-emerald-700' },
  oral_history: { nepali: 'स्थानीय मौखिक इतिहास', english: 'Local Oral History', color: 'bg-amber-950 text-amber-200 border-amber-700' },
  further_research: { nepali: 'अझै अनुसन्धान आवश्यक', english: 'Further Research Needed', color: 'bg-stone-800 text-stone-200 border-stone-600' }
};

export const WORKFLOW_STATUS_LABELS: Record<string, { nepali: string; english: string }> = {
  draft: { nepali: 'मस्यौदा (Draft)', english: 'Draft' },
  under_review: { nepali: 'पुनरावलोकनमा (Under Review)', english: 'Under Review' },
  published: { nepali: 'प्रकाशित (Published)', english: 'Published' },
  archived: { nepali: 'अभिलेखबद्ध (Archived)', english: 'Archived' }
};

export const RIGHTS_STATUS_LABELS: Record<string, { nepali: string; english: string; notice: string }> = {
  original_sadan_rai: {
    nepali: 'मौलिक सदन राई सामग्री',
    english: 'Original Sadan Rai Content',
    notice: '© Sadan Rai · All Rights Reserved'
  },
  third_party_source: {
    nepali: 'तेस्रो-पक्षीय स्रोत सामग्री',
    english: 'Third-party Source Material',
    notice: 'उद्धृत स्रोतको अधिकार सम्बन्धित लेखक/प्रकाशकमा सुरक्षित'
  },
  public_domain: {
    nepali: 'सार्वजनिक अधिकार क्षेत्र (Public Domain)',
    english: 'Public-Domain Source Material',
    notice: 'ऐतिहासिक ग्रन्थ (Public Domain Archive)'
  },
  licensed: {
    nepali: 'अनुमतिप्राप्त / इजाजतपत्र प्राप्त सामग्री',
    english: 'Licensed Material',
    notice: 'इजाजतपत्र अनुसार सुरक्षित'
  },
  oral_history_permission: {
    nepali: 'सहमतिसहितको मौखिक इतिहास',
    english: 'Oral-History Material with Permission',
    notice: 'जानकार/सूचनादाताको पूर्व-सहमतिमा संकलित'
  }
};


// Primary sources
export const INITIAL_SOURCES: Source[] = [];

export const INITIAL_ARTICLES: Article[] = [];

export const INITIAL_PHOTOS: PhotoItem[] = [];

export const INITIAL_MEDIA: MediaItem[] = [];

// Headings for Malbase–1, Patlepani section (strictly based on the user's brief)
export const MALBASE_SECTION_HEADINGS: VillageSectionData[] = [
  {
    key: 'intro',
    nepaliTitle: 'स्थान परिचय',
    englishTitle: 'Location Profile',
    summary: 'माल्बासे–१, पात्लेपानी, हतुवागढी, भोजपुर, नेपाल।',
    summaryEnglish: 'Location profile of Malbase–1, Patlepani, Hatuwagadhi, Bhojpur, Nepal.',
    content: []
  },
  {
    key: 'history',
    nepaliTitle: 'गाउँको इतिहास',
    englishTitle: 'Village History',
    summary: 'गाउँको ऐतिहासिक पृष्ठभूमि र पुर्ख्यौली थातथलो।',
    summaryEnglish: 'Historical background, ancestral origins, and settlement of the village.',
    content: []
  },
  {
    key: 'culture',
    nepaliTitle: 'स्थानीय संस्कृति',
    englishTitle: 'Local Culture',
    summary: 'स्थानीय सांस्कृतिक परम्परा तथा चाडपर्वहरू।',
    summaryEnglish: 'Local cultural customs, traditions, and festival heritage.',
    content: []
  },
  {
    key: 'customs',
    nepaliTitle: 'पुराना चलन',
    englishTitle: 'Ancient Customs',
    summary: 'पुर्खाका पुराना सामाजिक चलन तथा जीवनशैली।',
    summaryEnglish: 'Ancestral social customs, traditions, and daily lifestyle.',
    content: []
  },
  {
    key: 'livelihood',
    nepaliTitle: 'मानिसहरूको जीवन',
    englishTitle: 'Daily Life & Livelihood',
    summary: 'गाउँले जनजीवन, कृषि र श्रम।',
    summaryEnglish: 'Rural village life, agricultural heritage, and community labor.',
    content: []
  },
  {
    key: 'migration',
    nepaliTitle: 'बसाइँसराइ र सामाजिक परिवर्तन',
    englishTitle: 'Migration & Social Change',
    summary: 'बसाइँसराइ र समाजमा आएका परिवर्तनहरू।',
    summaryEnglish: 'Historical migration patterns and evolving social structures.',
    content: []
  },
  {
    key: 'nature',
    nepaliTitle: 'प्राकृतिक वातावरण',
    englishTitle: 'Natural Environment',
    summary: 'भूगोल, वनस्पति, पानीका मुहान तथा वातावरण।',
    summaryEnglish: 'Geography, vegetation, water sources, and natural landscape.',
    content: []
  },
  {
    key: 'places',
    nepaliTitle: 'महत्वपूर्ण स्थानहरू',
    englishTitle: 'Significant Places',
    summary: 'ऐतिहासिक तथा भौगोलिक महत्वपूर्ण स्थलहरू।',
    summaryEnglish: 'Historically and geographically significant landmarks.',
    content: []
  },
  {
    key: 'elders',
    nepaliTitle: 'स्थानीय व्यक्तित्व',
    englishTitle: 'Local Personalities & Elders',
    summary: 'गाउँका अग्रजहरू तथा व्यक्तित्वहरू।',
    summaryEnglish: 'Village elders, respected knowledge-bearers, and personalities.',
    content: []
  },
  {
    key: 'archives',
    nepaliTitle: 'पुराना फोटो / दस्तावेज',
    englishTitle: 'Historical Photos & Documents',
    summary: 'पुराना तस्बिर, लिखत तथा ऐतिहासिक दस्तावेज।',
    summaryEnglish: 'Historical photographs, written records, and archival documents.',
    content: []
  },
  {
    key: 'stories',
    nepaliTitle: 'स्मृति तथा मौखिक अभिलेख',
    englishTitle: 'Memory & Oral Records',
    summary: 'पुर्खादेखि चलिआएका लोककथा तथा मौखिक आख्यान।',
    summaryEnglish: 'Recorded memories, oral testimony, and locally documented knowledge.',
    content: []
  }
];

// Structured sections for किराँत इतिहास (Kirat History)

// Public-facing civilization index. These are navigation categories; records are added with sources/evidence.
export const CIVILIZATION_SECTIONS = [
  { key: 'origins', nepaliTitle: 'उत्पत्ति तथा ऐतिहासिक पृष्ठभूमि', englishTitle: 'Origins & Historical Background' },
  { key: 'society', nepaliTitle: 'सामाजिक संरचना तथा समुदाय', englishTitle: 'Social Structure & Community' },
  { key: 'governance', nepaliTitle: 'शासन व्यवस्था तथा संस्थाहरू', englishTitle: 'Governance & Institutions' },
  { key: 'law', nepaliTitle: 'न्याय, नियम तथा परम्परागत व्यवस्था', englishTitle: 'Law, Rules & Traditional Governance' },
  { key: 'economy', nepaliTitle: 'अर्थतन्त्र, कृषि तथा जीविकोपार्जन', englishTitle: 'Economy, Agriculture & Livelihoods' },
  { key: 'trade', nepaliTitle: 'व्यापार, विनिमय तथा सम्बन्ध', englishTitle: 'Trade, Exchange & Relations' },
  { key: 'language', nepaliTitle: 'भाषा, लिपि तथा मौखिक ज्ञान', englishTitle: 'Language, Script & Oral Knowledge' },
  { key: 'knowledge', nepaliTitle: 'ज्ञान प्रणाली, शिक्षा तथा उपचार परम्परा', englishTitle: 'Knowledge Systems, Education & Healing Traditions' },
  { key: 'beliefs', nepaliTitle: 'धर्म, मुन्धुम तथा आध्यात्मिक परम्परा', englishTitle: 'Religion, Mundhum & Spiritual Traditions' },
  { key: 'arts', nepaliTitle: 'कला, संगीत, नृत्य तथा सिर्जना', englishTitle: 'Arts, Music, Dance & Creative Heritage' },
  { key: 'architecture', nepaliTitle: 'वास्तुकला, बस्ती तथा भौतिक सम्पदा', englishTitle: 'Architecture, Settlement & Material Heritage' },
  { key: 'dress', nepaliTitle: 'पोशाक, आभूषण तथा जीवनशैली', englishTitle: 'Dress, Adornment & Ways of Life' },
  { key: 'food', nepaliTitle: 'खाद्य परम्परा तथा पाक संस्कृति', englishTitle: 'Food Traditions & Culinary Heritage' },
  { key: 'technology', nepaliTitle: 'स्थानीय प्रविधि तथा सीप', englishTitle: 'Indigenous Technology & Skills' },
  { key: 'environment', nepaliTitle: 'प्रकृति, भूमि तथा वातावरणीय ज्ञान', englishTitle: 'Nature, Land & Environmental Knowledge' },
  { key: 'archaeology', nepaliTitle: 'पुरातत्त्व तथा भौतिक प्रमाण', englishTitle: 'Archaeology & Material Evidence' },
  { key: 'heritage', nepaliTitle: 'सम्पदा, संरक्षण तथा पुस्तान्तरण', englishTitle: 'Heritage, Preservation & Transmission' },
  { key: 'comparative', nepaliTitle: 'तुलनात्मक अध्ययन तथा थप अनुसन्धान', englishTitle: 'Comparative Studies & Further Research' },
] as const;

export const KIRAT_HISTORY_SECTIONS: KiratHistorySectionData[] = [
  {
    key: 'intro',
    nepaliTitle: 'किराँत कालको परिचय',
    englishTitle: 'Introduction to Kirat Era',
    summary: 'किराँत कालको ऐतिहासिक पृष्ठभूमि र परिचय।',
    summaryEnglish: 'Historical background, scope, and introduction to the Kirat era.',
    schema: {
      sourceLabel: 'स्रोत (Source)',
      authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)',
      dateLabel: 'मिति / काल (Date / Period)',
      evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)',
      researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)'
    }
  },
  {
    key: 'timeline',
    nepaliTitle: 'ऐतिहासिक कालक्रम (Timeline)',
    englishTitle: 'Historical Timeline',
    summary: 'किराँत इतिहासको कालक्रमिक विकास तथा विभाजन।',
    summaryEnglish: 'Chronological timeline, key eras, and historical developments of Kirat history.',
    schema: {
      sourceLabel: 'स्रोत (Source)',
      authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)',
      dateLabel: 'मिति / काल (Date / Period)',
      evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)',
      researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)'
    }
  },
  {
    key: 'authors_researchers',
    nepaliTitle: 'ऐतिहासिक ग्रन्थ तथा विद्वत् दृष्टिकोण',
    englishTitle: 'Authors & Researchers Perspectives',
    summary: 'विभिन्न इतिहासकार, प्राज्ञ तथा अनुसन्धाताहरूको दृष्टिकोण।',
    summaryEnglish: 'Critical comparative analysis of perspectives from historians and researchers.',
    schema: {
      sourceLabel: 'स्रोत (Source)',
      authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)',
      dateLabel: 'मिति / काल (Date / Period)',
      evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)',
      researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)'
    }
  },
  {
    key: 'evidence_archive',
    nepaliTitle: 'प्रमाण अभिलेख (Evidence Archive)',
    englishTitle: 'Evidence & Documentary Archive',
    summary: 'पुरातात्विक, अभिलेखीय तथा भौतिक प्रमाणहरूको अभिलेख।',
    summaryEnglish: 'Catalog of archaeological findings, inscriptions, manuscripts, and documentary evidence.',
    schema: {
      sourceLabel: 'स्रोत (Source)',
      authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)',
      dateLabel: 'मिति / काल (Date / Period)',
      evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)',
      researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)'
    }
  },
  {
    key: 'civilization',
    nepaliTitle: 'किराँत सभ्यता',
    englishTitle: 'Kirat Civilization',
    summary: 'किराँत सभ्यता, जीवनपद्धति, शासन प्रणाली तथा रैथाने ज्ञान।',
    summaryEnglish: 'Kirat civilization, lifestyle, governance structures, and indigenous wisdom.',
    schema: {
      sourceLabel: 'स्रोत (Source)',
      authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)',
      dateLabel: 'मिति / काल (Date / Period)',
      evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)',
      researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)'
    }
  },
  {
    key: 'oral_history',
    nepaliTitle: 'मौखिक इतिहास',
    englishTitle: 'Oral History',
    summary: 'पुस्तान्तरण भएका मौखिक स्मृति, आख्यान र परम्परा।',
    summaryEnglish: 'Intergenerational oral testimonies, living memories, and Mundhum narratives.',
    schema: {
      sourceLabel: 'स्रोत (Source)',
      authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)',
      dateLabel: 'मिति / काल (Date / Period)',
      evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)',
      researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)'
    }
  },
  {
    key: 'disputed_topics',
    nepaliTitle: 'विवादित तथा थप अनुसन्धान आवश्यक विषय',
    englishTitle: 'Disputed Topics & Further Research',
    summary: 'थप तथ्य, पुरातात्विक अन्वेषण वा दस्तावेज आवश्यक पर्ने विषयहरू।',
    summaryEnglish: 'Topics requiring further archaeological excavation, documentation, and critical inquiry.',
    schema: {
      sourceLabel: 'स्रोत (Source)',
      authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)',
      dateLabel: 'मिति / काल (Date / Period)',
      evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)',
      researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)'
    }
  },
  {
    key: 'sources_references',
    nepaliTitle: 'स्रोत तथा सन्दर्भ',
    englishTitle: 'Sources & References',
    summary: 'किराँत इतिहास अध्ययनमा उपयोगी सन्दर्भ ग्रन्थ तथा सामग्री।',
    summaryEnglish: 'Comprehensive bibliography, reference volumes, and source texts.',
    schema: {
      sourceLabel: 'स्रोत (Source)',
      authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)',
      dateLabel: 'मिति / काल (Date / Period)',
      evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)',
      researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)'
    }
  },
  {
    key: 'geography_settlements',
    nepaliTitle: 'भूगोल, क्षेत्र तथा ऐतिहासिक बस्ती',
    englishTitle: 'Geography, Territory & Historical Settlements',
    summary: 'किराँतसँग सम्बन्धित ऐतिहासिक भूगोल, क्षेत्रीय नाम, बस्ती तथा स्थानसम्बन्धी स्रोतलाई प्रमाणको तहअनुसार राख्ने खण्ड।',
    summaryEnglish: 'Historical geography, territorial references, regional names, and settlements associated with Kirat history, separated by evidence level.',
    schema: { sourceLabel: 'स्रोत (Source)', authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)', dateLabel: 'मिति / काल (Date / Period)', evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)', researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)' }
  },
  {
    key: 'origins_migration',
    nepaliTitle: 'उत्पत्ति, समुदाय तथा बसाइँसराइ',
    englishTitle: 'Origins, Peoples & Migration',
    summary: 'उत्पत्ति, समुदायको ऐतिहासिक पहिचान, जनसमूह र बसाइँसराइसम्बन्धी दाबीलाई स्रोतअनुसार छुट्याउने खण्ड।',
    summaryEnglish: 'Origins, historical identities of communities, population movement, and migration claims, kept source-bounded.',
    schema: { sourceLabel: 'स्रोत (Source)', authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)', dateLabel: 'मिति / काल (Date / Period)', evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)', researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)' }
  },
  {
    key: 'political_history',
    nepaliTitle: 'राजनीतिक इतिहास, शासन तथा वंश',
    englishTitle: 'Political History, Governance & Dynasties',
    summary: 'राजा, शासक, राजनीतिक संरचना, प्रशासन र वंशसम्बन्धी दाबीलाई प्रत्यक्ष स्रोत, क्रोनिकल र पछिल्लो इतिहासलेखन छुट्याएर राख्ने खण्ड।',
    summaryEnglish: 'Rulers, political structures, administration, and dynastic claims separated into direct evidence, chronicle tradition, and later historiography.',
    schema: { sourceLabel: 'स्रोत (Source)', authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)', dateLabel: 'मिति / काल (Date / Period)', evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)', researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)' }
  },
  {
    key: 'social_structure',
    nepaliTitle: 'सामाजिक संरचना, कुल तथा नातासम्बन्ध',
    englishTitle: 'Social Structure, Clans & Kinship',
    summary: 'समुदाय, सामाजिक संस्था, कुल/थर, नातासम्बन्ध र सामाजिक परिवर्तनसम्बन्धी अनुसन्धान।',
    summaryEnglish: 'Community organization, social institutions, clans, kinship, and social change research.',
    schema: { sourceLabel: 'स्रोत (Source)', authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)', dateLabel: 'मिति / काल (Date / Period)', evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)', researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)' }
  },
  {
    key: 'religion_worldview',
    nepaliTitle: 'धर्म, मुन्धुम/मुन्दुम तथा विश्वदृष्टि',
    englishTitle: 'Religion, Mundhum/Mundum & Worldview',
    summary: 'धार्मिक परम्परा, मुन्धुम/मुन्दुम, पूजा, विश्वदृष्टि र पवित्र अवधारणालाई मौखिक, पाण्डुलिपि र विद्वत् स्रोतका रूपमा छुट्याउने खण्ड।',
    summaryEnglish: 'Religion, Mundhum/Mundum, worship, worldview, and sacred concepts separated across oral, manuscript, and scholarly evidence.',
    schema: { sourceLabel: 'स्रोत (Source)', authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)', dateLabel: 'मिति / काल (Date / Period)', evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)', researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)' }
  },
  {
    key: 'language_literature',
    nepaliTitle: 'भाषा, लिपि तथा साहित्य',
    englishTitle: 'Language, Script & Literature',
    summary: 'किराँती भाषाहरू, लिपि, शब्दसंग्रह, साहित्य तथा भाषिक इतिहाससम्बन्धी प्रमाण र अनुसन्धान।',
    summaryEnglish: 'Kirati languages, scripts, vocabularies, literature, and linguistic history supported by source-level records.',
    schema: { sourceLabel: 'स्रोत (Source)', authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)', dateLabel: 'मिति / काल (Date / Period)', evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)', researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)' }
  },
  {
    key: 'archaeology_material',
    nepaliTitle: 'पुरातत्त्व तथा भौतिक संस्कृति',
    englishTitle: 'Archaeology & Material Culture',
    summary: 'पुरातात्त्विक वस्तु, पाण्डुलिपि, भौतिक संस्कृति र प्रत्यक्ष अभिलेखीय वस्तुलाई छुट्टै प्रमाण तहमा राख्ने खण्ड।',
    summaryEnglish: 'Archaeological objects, manuscripts, material culture, and direct archival objects are preserved as distinct evidence layers.',
    schema: { sourceLabel: 'स्रोत (Source)', authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)', dateLabel: 'मिति / काल (Date / Period)', evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)', researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)' }
  },
  {
    key: 'economy_livelihood',
    nepaliTitle: 'अर्थव्यवस्था, कृषि, व्यापार तथा जीविका',
    englishTitle: 'Economy, Agriculture, Trade & Livelihood',
    summary: 'भूमि, राजस्व, कृषि, व्यापार र जीविकासम्बन्धी उपलब्ध ऐतिहासिक दस्तावेज तथा अध्ययन।',
    summaryEnglish: 'Land, revenue, agriculture, trade, and livelihood evidence from historical documents and scholarship.',
    schema: { sourceLabel: 'स्रोत (Source)', authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)', dateLabel: 'मिति / काल (Date / Period)', evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)', researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)' }
  },
  {
    key: 'places_sacred_landscape',
    nepaliTitle: 'ऐतिहासिक स्थान, स्मारक तथा पवित्र भू-दृश्य',
    englishTitle: 'Historical Places, Monuments & Sacred Landscapes',
    summary: 'ऐतिहासिक स्थान, बस्ती, मार्ग, स्मारक र धार्मिक/सांस्कृतिक भू-दृश्यका प्रमाण र अनुसन्धान।',
    summaryEnglish: 'Historical places, settlements, routes, monuments, and sacred/cultural landscapes with evidence boundaries.',
    schema: { sourceLabel: 'स्रोत (Source)', authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)', dateLabel: 'मिति / काल (Date / Period)', evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)', researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)' }
  },
  {
    key: 'external_records_comparison',
    nepaliTitle: 'बाह्य स्रोत तथा तुलनात्मक अनुसन्धान',
    englishTitle: 'External Records & Comparative Research',
    summary: 'नेपालबाहिरका अभिलेख, यात्रावृत्तान्त, भाषिक/मानवशास्त्रीय अध्ययन र अन्य सभ्यतासँग तुलना गर्ने अनुसन्धान।',
    summaryEnglish: 'External records, travel accounts, linguistic/anthropological studies, and cross-regional comparisons.',
    schema: { sourceLabel: 'स्रोत (Source)', authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)', dateLabel: 'मिति / काल (Date / Period)', evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)', researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)' }
  },
  {
    key: 'modern_identity',
    nepaliTitle: 'आधुनिक परिवर्तन, पहिचान तथा निरन्तरता',
    englishTitle: 'Modern Transformation, Identity & Continuity',
    summary: 'आधुनिक कालमा किराँत पहिचान, धार्मिक/सांस्कृतिक पुनर्संरचना र परम्पराको निरन्तरतासम्बन्धी अनुसन्धान।',
    summaryEnglish: 'Modern Kirat identity, religious and cultural transformation, reconstruction, and continuity of traditions.',
    schema: { sourceLabel: 'स्रोत (Source)', authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)', dateLabel: 'मिति / काल (Date / Period)', evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)', researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)' }
  },
  {
    key: 'research_method_conclusions',
    nepaliTitle: 'प्रमाण विश्लेषण, अनुसन्धान निष्कर्ष तथा थप अनुसन्धान',
    englishTitle: 'Evidence Analysis, Research Conclusions & Further Research',
    summary: 'दाबी–स्रोत–प्रमाण सम्बन्ध, विरोधाभास, अनुसन्धानकर्ता विश्लेषण, अन्तिम निष्कर्ष र थप अनुसन्धान आवश्यक क्षेत्रको master section।',
    summaryEnglish: 'Master section for claim-source-evidence relationships, contradictions, researcher analysis, final conclusions, and research gaps.',
    schema: { sourceLabel: 'स्रोत (Source)', authorLabel: 'लेखक / अनुसन्धाता (Author / Researcher)', dateLabel: 'मिति / काल (Date / Period)', evidenceTypeLabel: 'प्रमाण प्रकार (Evidence Type)', researchStatusLabel: 'अनुसन्धान स्थिति (Research Status)' }
  },

];

// Additive world-source registry for the Kirat Civilization research collection.
// Existing archive data is preserved; this export is intentionally separate.
export { KIRAT_WORLD_SOURCE_COLLECTION } from './kiratWorldSourceCollection';
