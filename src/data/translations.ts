import { BRAND_INFO } from './archiveData';

export type Language = 'ne' | 'en';

export interface TranslationsSchema {
  // Brand
  brandName: string;
  brandNameSub: string;
  institutionalName: string;
  tagline: string;
  subtitle: string;
  topics: string;
  researchStatement: string;
  location: string;
  verifiedBadgeTitle: string;
  
  // Navigation
  nav: {
    home: string;
    history: string;
    culture: string;
    civilization: string;
    village: string;
    oralHistory: string;
    research: string;
    articles: string;
    photos: string;
    media: string;
    sources: string;
    about: string;
    contact: string;
    admin: string;
    more: string;
    menuTitle: string;
    curatorDesk: string;
  };

  // Actions & Buttons
  actions: {
    startResearch: string;
    exploreArchive: string;
    readMore: string;
    viewAll: string;
    searchPlaceholder: string;
    clear: string;
    close: string;
    copyLink: string;
    linkCopied: string;
    print: string;
    share: string;
    backToArticles: string;
    backToArchive: string;
    viewDetails: string;
    viewProfile: string;
    openSection: string;
    submit: string;
    switchLanguage: string;
    contentComingSoon: string;
    fontNormal: string;
    fontLarge: string;
    fontLarger: string;
  };

  // Research Statuses
  researchStatus: {
    verified: string;
    oralHistory: string;
    furtherResearch: string;
    standardTitle: string;
    verifiedDesc: string;
    oralHistoryDesc: string;
    furtherResearchDesc: string;
    oralEthicsNotice: string;
    integrityTitle: string;
    integrityDesc: string;
  };

  // Sections
  sections: {
    historyTitle: string;
    historySubtitle: string;
    historyCategory: string;
    cultureTitle: string;
    cultureSubtitle: string;
    cultureCategory: string;
    civilizationTitle: string;
    civilizationSubtitle: string;
    civilizationCategory: string;
    villageTitle: string;
    villageSubtitle: string;
    villageCategory: string;
    villageAllSections: string;
    villageSubheadingsCount: string;
    oralHistoryTitle: string;
    oralHistorySubtitle: string;
    oralHistoryCategory: string;
    researchTitle: string;
    researchSubtitle: string;
    researchCategory: string;
    articlesTitle: string;
    articlesSubtitle: string;
    articlesCategory: string;
    photosTitle: string;
    photosSubtitle: string;
    photosCategory: string;
    mediaTitle: string;
    mediaSubtitle: string;
    mediaCategory: string;
    sourcesTitle: string;
    sourcesSubtitle: string;
    sourcesCategory: string;
    aboutTitle: string;
    aboutSubtitle: string;
    contactTitle: string;
    contactSubtitle: string;
    coreCategoriesTitle: string;
    coreCategoriesSubtitle: string;
  };

  // Trust Indicators
  trust: {
    verifiedSources: string;
    villageLocation: string;
    distinction: string;
  };

  // Archive Support & Membership
  support: {
    eyebrow: string;
    title: string;
    message: string;
    membershipTitle: string;
    membershipDescription: string;
    supporter: string;
    supporterPrice: string;
    supporterDescription: string;
    archiveMember: string;
    archiveMemberPrice: string;
    archiveMemberDescription: string;
    patron: string;
    patronPrice: string;
    patronDescription: string;
    becomeMember: string;
    oneTimeTitle: string;
    oneTimeDescription: string;
    contactForSupport: string;
    note: string;
  };

  // Footer
  footer: {
    sectionsTitle: string;
    archivesTitle: string;
    integrityTitle: string;
    factRuleTitle: string;
    factRuleText: string;
    aboutLink: string;
    contactLink: string;
    rightsLink: string;
    adminLink: string;
    copyright: string;
  };

  // Village Subheadings
  villageHeadings: Record<string, string>;
}

export const TRANSLATIONS: Record<Language, TranslationsSchema> = {
  ne: {
    brandName: 'सदन राई',
    brandNameSub: '',
    institutionalName: 'इतिहास, सभ्यता तथा संस्कृति अभिलेखालय',
    tagline: 'हाम्रो पहिचान: इतिहास, सभ्यता र संस्कृतिको साझा संरक्षण।',
    subtitle: 'हाम्रो पुर्खा • हाम्रो पहिचान',
    topics: 'इतिहास • संस्कृति • सभ्यता • मौखिक परम्परा',
    researchStatement: 'इतिहास, संस्कृति, सभ्यता र मौखिक परम्पराको प्रमाणमा आधारित अभिलेख।',
    location: 'माल्बासे–१, पात्लेपानी, हतुवागढी, भोजपुर, नेपाल',
    verifiedBadgeTitle: 'आधिकारिक प्रमाणित अभिलेख',

    nav: {
      home: 'गृहपृष्ठ',
      history: 'इतिहास',
      culture: 'संस्कृति, धर्म तथा परम्परा',
      civilization: 'सभ्यता',
      village: 'स्थान तथा गाउँ अभिलेख',
      oralHistory: 'मौखिक इतिहास',
      research: 'अनुसन्धान',
      articles: 'लेखहरू',
      photos: 'तस्बिर सङ्ग्रह',
      media: 'मौलिक सङ्गीत तथा भिडियो',
      sources: 'स्रोत तथा सन्दर्भ',
      about: 'सदन राईको बारेमा',
      contact: 'सम्पर्क',
      admin: 'सम्पादकीय कन्सोल',
      more: 'थप अभिलेख',
      menuTitle: 'मुख्य अभिलेख सूची',
      curatorDesk: 'सम्पादकीय व्यवस्थापक कन्सोल',
    },

    actions: {
      startResearch: 'अनुसन्धान तथा स्रोत',
      exploreArchive: 'अभिलेख हेर्नुहोस्',
      readMore: 'पढ्नुहोस्',
      viewAll: 'सबै हेर्नुहोस्',
      searchPlaceholder: 'इतिहास, मुन्दुम, मुन्धुम, माल्बासे, साकेला, स्रोत खोज्नुहोस्...',
      clear: 'खाली गर्नुहोस्',
      close: 'बन्द',
      copyLink: 'लिङ्क कपी',
      linkCopied: 'लिङ्क कपी भयो!',
      print: 'प्रिन्ट',
      share: 'साझेदारी गर्नुहोस्',
      backToArticles: 'सबै लेखहरूमा फर्कनुहोस्',
      backToArchive: 'अभिलेख सूचीमा फर्कनुहोस्',
      viewDetails: 'विस्तृत विवरण हेर्नुहोस्',
      viewProfile: 'सदन राईको विस्तृत विवरण हेर्नुहोस्',
      contentComingSoon: 'यो सामग्री हाल उपलब्ध छैन वा चाँडै थपिँदैछ',
      openSection: 'खण्ड खोल्नुहोस्',
      submit: 'सन्देश पठाउनुहोस्',
      switchLanguage: 'English',
      fontNormal: 'सामान्य',
      fontLarge: 'ठूलो',
      fontLarger: 'अझ ठूलो',
    },

    researchStatus: {
      verified: 'प्रमाणित स्रोत',
      oralHistory: 'स्थानीय मौखिक इतिहास',
      furtherResearch: 'अझै अनुसन्धान आवश्यक',
      standardTitle: 'अनुसन्धान स्थिति मापदण्ड',
      verifiedDesc: 'लिखित ऐतिहासिक दस्तावेज, सरकारी तथा पुरातात्विक प्रतिवेदन, वा प्राज्ञिक शोधपत्रहरूद्वारा पुष्टि गरिएको सामग्री।',
      oralHistoryDesc: 'गाउँका अग्रज, ज्येष्ठ नागरिक तथा मुन्धुमी जानकारहरूसँगको मौखिक अन्तर्वार्ता। थप प्रमाण आवश्यक।',
      furtherResearchDesc: 'प्रारम्भिक अध्ययन वा परिकल्पना जहाँ तथ्य पुष्टि गर्न थप पुरातात्विक अन्वेषण वा दस्तावेज आवश्यक छ।',
      oralEthicsNotice: 'यो जानकारी स्थानीय मौखिक इतिहासमा आधारित छ र थप प्रमाण आवश्यक छ। लिखित/दस्तावेजी प्रमाण र मौखिक परम्परालाई सधैं स्पष्ट छुट्ट्याइन्छ।',
      integrityTitle: 'अनुसन्धान निष्पक्षता तथा तथ्य शुद्धता',
      integrityDesc: 'हामी कुनै पनि अप्रमाणित दाबीलाई स्थापित तथ्यको रूपमा प्रस्तुत गर्दैनौँ। लिखित प्रमाण र मौखिक परम्परालाई स्पष्ट रूपमा छुट्ट्याइएको छ।',
    },

    sections: {
      historyTitle: 'इतिहास तथा सभ्यता',
      historySubtitle: 'विभिन्न काल, स्थान, समुदाय, स्रोत र प्रमाणसँग सम्बन्धित इतिहास तथा सभ्यता अभिलेखहरू।',
      historyCategory: 'इतिहास तथा सभ्यता अभिलेख',
      cultureTitle: 'संस्कृति, धर्म तथा परम्परा',
      cultureSubtitle: 'विभिन्न समुदायका संस्कृति, धर्म, संस्कार र परम्परासम्बन्धी अभिलेख।',
      cultureCategory: 'सांस्कृतिक तथा मुन्धुमी परम्परा',
      civilizationTitle: 'सभ्यता',
      civilizationSubtitle: 'सभ्यता, समाज, ज्ञान, संस्थान, प्रविधि, वास्तुकला र जीवनपद्धतिसम्बन्धी अध्ययन।',
      civilizationCategory: 'सभ्यता तथा ज्ञान परम्परा',
      villageTitle: 'स्थान तथा गाउँ अभिलेख',
      villageSubtitle: 'माल्बासे–१, पात्लेपानीको स्थानीय इतिहास, संस्कृति, भूगोल र जीवनसम्बन्धी अभिलेख।',
      villageCategory: 'स्थानीय इतिहास तथा भूगोल',
      villageAllSections: 'गाउँको सम्पूर्ण अभिलेख खण्ड हेर्नुहोस्',
      villageSubheadingsCount: 'गाउँका ११ मुख्य अभिलेख शीर्षकहरू',
      oralHistoryTitle: 'मौखिक इतिहास',
      oralHistorySubtitle: 'स्थानीय अग्रज तथा जानकारहरूसँग संकलन गरिने मौखिक इतिहास र स्मृतिहरू।',
      oralHistoryCategory: 'जीवित स्मृति तथा अन्तर्वार्ता खण्ड',
      researchTitle: 'अनुसन्धान तथा स्रोत',
      researchSubtitle: 'स्रोत, प्रमाण र अनुसन्धान विधिमा आधारित सामग्री।',
      researchCategory: 'प्राज्ञिक सत्यनिष्ठा तथा कार्यविधि',
      articlesTitle: 'लेखहरू',
      articlesSubtitle: 'इतिहास, सभ्यता, संस्कृति, स्थान, समुदाय र अनुसन्धानसम्बन्धी प्रकाशित अभिलेखहरू।',
      articlesCategory: 'प्रकाशित अनुसन्धान तथा अभिलेख',
      photosTitle: 'पुरातात्त्विक तथा ऐतिहासिक तस्बिर अभिलेख',
      photosSubtitle: 'कहाँको, कहिलेको, कसले खिचेको, स्रोत, अधिकार र प्रमाणसहितको दृश्य अभिलेख।',
      photosCategory: 'पुरातात्त्विक तथा ऐतिहासिक दृश्य प्रमाण',
      mediaTitle: 'ऐतिहासिक, सांस्कृतिक तथा दस्तावेजी भिडियो अभिलेख',
      mediaSubtitle: 'स्थान, मिति, सिर्जनाकर्ता, स्रोत, अधिकार र सम्बन्धित प्रमाणसहितको ध्वनि–दृश्य अभिलेख।',
      mediaCategory: 'ध्वनि तथा दृश्य प्रमाण',
      sourcesTitle: 'स्रोत तथा सन्दर्भ',
      sourcesSubtitle: 'लिखित, प्राज्ञिक तथा मौखिक स्रोतहरूको सन्दर्भ प्रणाली।',
      sourcesCategory: 'प्राज्ञिक सन्दर्भ ग्रन्थ सूची',
      aboutTitle: 'सदन राईको बारेमा',
      aboutSubtitle: 'अभिलेखकर्ता परिचय तथा कार्यनीति',
      contactTitle: 'सम्पर्क',
      contactSubtitle: 'सदन राईसँग ऐतिहासिक दस्तावेज, तस्बिर, मौखिक अन्तर्वार्ता वा सोधपुछका लागि सम्पर्क गर्नुहोस्।',
      coreCategoriesTitle: 'मूल विषयगत खण्डहरू',
      coreCategoriesSubtitle: 'इतिहास, संस्कृति, सभ्यता र मौखिक परम्पराको प्रामाणिक दस्तावेजीकरण।',
    },

    trust: {
      verifiedSources: 'प्रमाणित स्रोत वा स्पष्ट वर्गीकरण',
      villageLocation: 'माल्बासे–१, पात्लेपानी, हतुवागढी, भोजपुर, नेपाल',
      distinction: 'मौखिक इतिहास र दस्तावेजी प्रमाणको स्पष्ट भेद',
    },

    support: {
      eyebrow: 'अभिलेख संरक्षणमा सहभागी हुनुहोस्',
      title: 'अभिलेख संरक्षणमा साथ दिन चाहनुहुन्छ? तपाईंसँग पनि यस्तै ऐतिहासिक सामग्री वा अभिलेख छ?',
      message: 'सहयोग, अनुसन्धान, संरक्षण वा सुझावका लागि अभिलेखसँग सिधै सम्पर्क गर्नुहोस्।',
      membershipTitle: 'सहयोगका लागि सम्पर्क गर्नुहोस्',
      membershipDescription: 'सहयोगसम्बन्धी कुराकानीका लागि सुरक्षित सम्पर्क बाकस प्रयोग गर्नुहोस्।',
      supporter: 'Supporter',
      supporterPrice: '$3 / महिना',
      supporterDescription: 'अभिलेखको निरन्तर संरक्षणमा आधारभूत मासिक सहयोग।',
      archiveMember: 'Archive Member',
      archiveMemberPrice: '$5 / महिना',
      archiveMemberDescription: 'नियमित सहयोगसँगै सदस्य-केन्द्रित अभिलेख अपडेटहरू।',
      patron: 'Patron',
      patronPrice: '$10 / महिना',
      patronDescription: 'अभिलेख संरक्षणका लागि थप सहयोग र विशेष अपडेटहरू।',
      becomeMember: 'सदस्यता सम्बन्धी जानकारी',
      oneTimeTitle: 'एकपटक मात्र सहयोग गर्न चाहनुहुन्छ?',
      oneTimeDescription: 'अभिलेख संरक्षणका लागि एकपटकको सहयोगबारे जानकारी लिनुहोस्।',
      contactForSupport: 'अभिलेखसँग साझा गर्नुहोस्',
      note: 'नोट: सदस्यता/सहयोग भुक्तानी प्रणाली अहिले जोडिएको छैन। भुक्तानी प्रदायक र खाता सेटअप भएपछि यी बटनलाई सुरक्षित payment flow मा जोड्न सकिन्छ।',
    },

    footer: {
      sectionsTitle: 'अभिलेख विषयहरू',
      archivesTitle: 'सङ्ग्रह तथा स्रोत',
      integrityTitle: 'अनुसन्धान निष्पक्षता',
      factRuleTitle: 'तथ्य शुद्धताको नियम',
      factRuleText: 'हामी कुनै पनि अप्रमाणित दाबीलाई स्थापित तथ्यको रूपमा प्रस्तुत गर्दैनौँ। लिखित प्रमाण र मौखिक परम्परालाई स्पष्ट रूपमा छुट्ट्याइएको छ।',
      aboutLink: 'सदन राईको बारेमा',
      contactLink: 'सम्पर्क',
      rightsLink: 'प्रतिलिपि अधिकार तथा सोधपुछ',
      adminLink: 'सम्पादकीय कन्सोल',
      copyright: '© २०२६ सदन राई। सर्वाधिकार सुरक्षित।',
    },

    villageHeadings: {
      intro: 'स्थान परिचय',
      history: 'गाउँको इतिहास',
      culture: 'स्थानीय संस्कृति',
      customs: 'पुराना चलन',
      livelihood: 'मानिसहरूको जीवन',
      migration: 'बसाइँसराइ र सामाजिक परिवर्तन',
      nature: 'प्राकृतिक वातावरण',
      places: 'महत्वपूर्ण स्थानहरू',
      elders: 'स्थानीय व्यक्तित्व',
      archives: 'पुराना फोटो / दस्तावेज',
      stories: 'स्मृति तथा मौखिक अभिलेख',
    },
  },

  en: {
    brandName: 'SADAN RAI',
    brandNameSub: 'Sadan Rai',
    institutionalName: 'History, Civilization & Culture Archive',
    tagline: 'Our identity: preserving history, civilization, and culture together.',
    subtitle: 'Our Ancestors • Our Identity',
    topics: 'History • Culture • Civilization • Oral Traditions',
    researchStatement: 'An evidence-based archive of history, culture, civilization and oral traditions.',
    location: 'Malbase–1, Patlepani, Hatuwagadhi, Bhojpur, Nepal',
    verifiedBadgeTitle: 'Official Verified Archive',

    nav: {
      home: 'Home',
      history: 'History',
      culture: 'Culture, Religion & Traditions',
      civilization: 'Civilization',
      village: 'Places & Local History',
      oralHistory: 'Oral History',
      research: 'Research',
      articles: 'Articles',
      photos: 'Photo Archive',
      media: 'Music & Video',
      sources: 'Sources & References',
      about: 'About Sadan Rai',
      contact: 'Contact',
      admin: 'Editorial Console',
      more: 'More Archives',
      menuTitle: 'Main Navigation Menu',
      curatorDesk: 'Editorial Management Console',
    },

    actions: {
      startResearch: 'Research & Sources',
      exploreArchive: 'Explore Archive',
      readMore: 'Read Article',
      viewAll: 'View All',
      searchPlaceholder: 'Search history, Mundum, Mundhum, Malbase, Sakela, sources...',
      clear: 'Clear',
      close: 'Close',
      copyLink: 'Copy Link',
      linkCopied: 'Link Copied!',
      print: 'Print',
      share: 'Share',
      backToArticles: 'Back to All Articles',
      backToArchive: 'Back to Archive List',
      viewDetails: 'View Details',
      viewProfile: 'View Full Profile of Sadan Rai',
      contentComingSoon: 'This content is not available yet or is coming soon.',
      openSection: 'Open Section',
      submit: 'Send Message',
      switchLanguage: 'English',
      fontNormal: 'Normal',
      fontLarge: 'Large',
      fontLarger: 'Extra Large',
    },

    researchStatus: {
      verified: 'Verified / Documented Source',
      oralHistory: 'Local Oral History',
      furtherResearch: 'Further Research Needed',
      standardTitle: 'Research Status Standards',
      verifiedDesc: 'Information substantiated by written historical documents, government/archaeological reports, or peer-reviewed scholarship.',
      oralHistoryDesc: 'Oral testimonies collected from village elders and Mundhum knowledge-bearers. Additional corroboration needed.',
      furtherResearchDesc: 'Preliminary inquiry or hypotheses where further archaeological exploration or documentary findings are required.',
      oralEthicsNotice: 'This information is based on local oral history and requires further corroboration. Documentary evidence and oral tradition are strictly distinguished.',
      integrityTitle: 'Research Integrity & Fact Accuracy',
      integrityDesc: 'We never present unverified claims as established fact. Written documentary evidence and oral tradition are clearly distinguished.',
    },

    sections: {
      historyTitle: 'History & Civilization',
      historySubtitle: 'Sources, scholarly investigations, and archival documentation on Kirat history.',
      historyCategory: 'History & Civilization Archive',
      cultureTitle: 'Culture, Religion & Traditions',
      cultureSubtitle: 'Archival records of Kirat and local rituals, customs, and heritage.',
      cultureCategory: 'Cultural & Mundhum Traditions',
      civilizationTitle: 'Civilization',
      civilizationSubtitle: 'Kirat civilization, ways of living, indigenous knowledge systems, and related studies.',
      civilizationCategory: 'Civilization & Knowledge Systems',
      villageTitle: 'Places & Local History',
      villageSubtitle: 'Local history, cultural traditions, geography, and archival records of Malbase–1, Patlepani.',
      villageCategory: 'Local History & Geography',
      villageAllSections: 'Explore Full Village Archive',
      villageSubheadingsCount: '11 Core Village Archive Subsections',
      oralHistoryTitle: 'Oral History',
      oralHistorySubtitle: 'Living memories, testimonies, and oral accounts gathered from local elders and knowledge-bearers.',
      oralHistoryCategory: 'Living Memories & Testimonies',
      researchTitle: 'Research & Sources',
      researchSubtitle: 'Critical methodology, evidence evaluation, and research standards.',
      researchCategory: 'Academic Integrity & Methodology',
      articlesTitle: 'Articles',
      articlesSubtitle: 'Documented essays and articles on Kirat history, Mundhum traditions, civilization, Malbase, and oral history.',
      articlesCategory: 'Published Research & Archives',
      photosTitle: 'Archaeological & Historical Photographic Archive',
      photosSubtitle: 'Photographic, visual, and archival document records.',
      photosCategory: 'Archaeological & Historical Visual Evidence',
      mediaTitle: 'Historical, Cultural & Documentary Video Archive',
      mediaSubtitle: 'Traditional songs, ritual melodies, cultural recordings, and documentary footage.',
      mediaCategory: 'Audio & Visual Recordings',
      sourcesTitle: 'Sources & References',
      sourcesSubtitle: 'Referencing framework for written, scholarly, and oral research sources.',
      sourcesCategory: 'Scholarly References & Bibliography',
      aboutTitle: 'About Sadan Rai',
      aboutSubtitle: 'Archivist Profile & Institutional Mission',
      contactTitle: 'Contact',
      contactSubtitle: 'Contact Sadan Rai for historical documents, photographs, oral history interviews, or general inquiries.',
      coreCategoriesTitle: 'Core Thematic Sections',
      coreCategoriesSubtitle: 'Authentic documentation of history, culture, civilization, and oral tradition.',
    },

    trust: {
      verifiedSources: 'Documented Sources & Clear Classification',
      villageLocation: 'Malbase–1, Patlepani, Hatuwagadhi, Bhojpur, Nepal',
      distinction: 'Clear distinction between Oral History & Documentary Evidence',
    },

    support: {
      eyebrow: 'Support the Archive',
      title: 'Would you like to support the archive? Do you have historical records or materials to share?',
      message: 'For support, research, preservation or suggestions, contact the archive directly.',
      membershipTitle: 'Contact the Archive for Support',
      membershipDescription: 'Use the secure contact box for support-related conversation.',
      supporter: 'Supporter',
      supporterPrice: '$3 / month',
      supporterDescription: 'A simple monthly contribution toward ongoing archive preservation.',
      archiveMember: 'Archive Member',
      archiveMemberPrice: '$5 / month',
      archiveMemberDescription: 'Regular support with member-focused archive updates.',
      patron: 'Patron',
      patronPrice: '$10 / month',
      patronDescription: 'Additional support for preservation and special archive updates.',
      becomeMember: 'Membership Information',
      oneTimeTitle: 'Prefer a one-time contribution?',
      oneTimeDescription: 'Contact us to learn about one-time support for archive preservation.',
      contactForSupport: 'Share with the Archive',
      note: 'Note: Membership/support payment processing is not connected yet. Once a payment provider and account are configured, these buttons can be connected to a secure payment flow.',
    },

    footer: {
      sectionsTitle: 'Archive Sections',
      archivesTitle: 'Collections & Sources',
      integrityTitle: 'Research Integrity',
      factRuleTitle: 'Standards of Verification',
      factRuleText: 'We never present unverified claims as established fact. Written documentary evidence and oral tradition are clearly distinguished.',
      aboutLink: 'About Sadan Rai',
      contactLink: 'Contact',
      rightsLink: 'Rights & Inquiries',
      adminLink: 'Editorial Console',
      copyright: '© 2026 Sadan Rai. All rights reserved.',
    },

    villageHeadings: {
      intro: 'Location Profile',
      history: 'Village History',
      culture: 'Local Culture',
      customs: 'Ancient Customs',
      livelihood: 'Daily Life & Livelihood',
      migration: 'Migration & Social Change',
      nature: 'Natural Environment',
      places: 'Significant Places',
      elders: 'Local Personalities & Elders',
      archives: 'Historical Photos & Documents',
      stories: 'Memory & Oral Records',
    },
  },
};
