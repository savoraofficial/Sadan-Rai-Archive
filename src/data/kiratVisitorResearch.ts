export interface KiratVisitorChapter {
  key: string;
  questionNepali: string;
  questionEnglish: string;
  bodyNepali: string;
  bodyEnglish: string;
  evidenceIds: string[];
}

/**
 * Public reading layer for the 20 Kirat research chapters.
 * This is intentionally knowledge-first: research-status metadata stays in the
 * research/admin layer, while public visitors see the evidence-bounded synthesis.
 */
export const KIRAT_VISITOR_CHAPTERS: KiratVisitorChapter[] = [
  {
    key: 'intro',
    questionNepali: 'किराँत इतिहास भन्नाले के बुझिन्छ?',
    questionEnglish: 'What does Kirat history mean?',
    bodyNepali: `किराँत इतिहासलाई एउटा मात्र राजा, एउटा मात्र पुस्तक वा एउटै समयको घटनाले पूरा व्याख्या गर्न सकिँदैन। उपलब्ध सामग्रीमा प्राचीन दक्षिण एशियाली साहित्यमा आएको Kirāta नाम-सन्दर्भ, नेपालका वंशावली तथा chronicle परम्परा, अभिलेखीय पाण्डुलिपि, पूर्वी नेपालको प्रशासनिक कागजात, १८औँ–१९औँ शताब्दीका documentary accounts, भाषिक अध्ययन, मौखिक परम्परा र आधुनिक मानवशास्त्रीय अनुसन्धान अलग-अलग प्रमाण तहका रूपमा देखिन्छन्। यस अध्यायले यी तहलाई क्रम मिलाएर बुझाउँछ।

सबैभन्दा महत्वपूर्ण कुरा प्रमाणको मिति र कथाले दाबी गरेको मिति एउटै होइन। कुनै पुरानो ग्रन्थमा Kirāta नाम भेटिनु एउटा textual reference हो; त्यसबाट त्यसै क्षणमा आजको कुनै एक समुदाय वा निरन्तर एउटै राजनीतिक राज्य थियो भन्ने निष्कर्ष स्वतः निस्कँदैन। त्यसैगरी chronicle मा सुरक्षित राजपरम्परा ऐतिहासिक परम्पराको महत्वपूर्ण प्रमाण हो, तर त्यसको compilation date र त्यसमा दिइएको प्राचीन chronology पनि छुट्टै जाँचिनुपर्छ।

पछि आउने archival records ले अझ ठोस तस्वीर दिन्छन्। British Library मा Kiranta धार्मिक तथा अन्य manuscript objects catalogue भएका छन्; Documenta Nepalica मा Pallo Kirāta/Limbuvān सम्बन्धी primary administrative records सुरक्षित छन्; Hamilton को 1819 को account ले पूर्वी Nepal Proper बाहिर Kirat/Kichak समुदायबारे early nineteenth-century documentary description दिन्छ। यी स्रोतले फरक समय र फरक प्रश्नको उत्तर दिन्छन्।

यस archive मा “किराँत” शब्द, “किराँत राजनीतिक परम्परा”, “किराँती भाषिक/सांस्कृतिक समुदाय” र आधुनिक Kirat identity लाई evidence ले समर्थन गरेको ठाउँमा मात्र जोडिन्छ। जहाँ direct continuity स्थापित छैन, त्यहाँ scholarly interpretation वा open research question भनेर स्पष्ट राखिन्छ। यही separation ले इतिहासलाई रोचक मात्र होइन, विश्वसनीय पनि बनाउँछ।

**अनुसन्धान निष्कर्ष:** उपलब्ध प्रमाणले Kirāta सम्बन्धी लामो textual, chronicle, manuscript, documentary र living-cultural history को अध्ययन सम्भव बनाउँछ; तर एउटै निश्चित सुरु-मिति वा सबै काललाई जोड्ने एकल continuous model अहिलेको evidence बाट जबर्जस्ती बनाउनु उचित हुँदैन।`,
    bodyEnglish: `Kirat history cannot be reduced to one ruler, one book, or one date. The surviving record contains several layers: references to the term Kirāta in early South Asian literature, Nepalese chronicles and dynastic traditions, archival manuscripts, administrative records from eastern Nepal, documentary accounts of the eighteenth and nineteenth centuries, linguistic research, oral traditions, and modern ethnography. This chapter explains how those layers fit together without collapsing them into one kind of proof.

A source date and the date claimed by a tradition are not automatically the same. An ancient textual occurrence of Kirāta is evidence for the use of a term in that textual world; it does not by itself prove that a particular present-day community or a single continuous state existed in exactly the same form. Likewise, a chronicle tradition is important historical evidence, but its compilation date, transmission history, and chronology must be evaluated separately.

Later archival records provide a more concrete documentary picture. The British Library catalogue preserves Kiranta religious and related manuscript objects; Documenta Nepalica preserves primary administrative records concerning Pallo Kirāta/Limbuvān; and Hamilton’s 1819 account gives an early nineteenth-century documentary description of Kirat/Kichak communities east of Nepal Proper. Each source answers a different historical question.

This archive therefore distinguishes the ancient term Kirāta, the Kirata dynastic tradition, Kiranti linguistic and cultural communities, and modern Kirat identity. They are connected only where the evidence permits the connection. Where direct continuity is not established, the archive labels the relationship as interpretation or an open research question.

**Research conclusion:** The evidence supports a long and layered history of Kirāta-related textual, chronicle, manuscript, documentary, and living-cultural records. It does not currently justify forcing all of those layers into one exact start date or one uninterrupted historical model.`,
    evidenceIds: ['hamilton-1819', 'nepal-parichaya-kirat-bamshi', 'michaels-2024']
  },
  {
    key: 'timeline',
    questionNepali: 'कुन प्रमाण कुन समयमा देखिन्छ?',
    questionEnglish: 'When do the different evidence layers appear?',
    bodyNepali: `किराँत इतिहासको कालक्रम बनाउँदा “कुन समयमा के दाबी गरियो?” र “कुन समयमा के प्रत्यक्ष प्रमाण सुरक्षित छ?” भन्ने दुई प्रश्न छुट्टाछुट्टै राखिन्छ। यसले visitor लाई पुरानो नाम-सन्दर्भ, chronicle tradition र पछि भेटिने archival evidence बीचको फरक बुझ्न मद्दत गर्छ।

पहिलो तह प्राचीन textual references हो। Kirāta नाम विभिन्न पुराना दक्षिण एशियाली साहित्यिक परम्परामा देखिन्छ, तर ती references को geographic, social र ethnographic अर्थ एउटै हो भनेर मान्न मिल्दैन। त्यसैले यहाँ “प्राचीन नाम-सन्दर्भ” लेखिन्छ, “आजको Kirat civilization को exact beginning” होइन।

दोस्रो तह Nepalese chronicle tradition हो। Gopālarājavamsāvali जस्ता medieval chronicles मा Kirata rulers को परम्परा सुरक्षित छ। यस्तो chronicle ले medieval period मा एउटा पुरानो political memory कसरी लेखिएको/सुरक्षित गरिएको थियो भन्ने देखाउँछ; त्यसमा दिइएको धेरै लामो regnal chronology लाई contemporary archaeological dating को रूपमा प्रस्तुत गरिँदैन।

तेस्रो तह manuscript evidence हो। British Library EAP1023 मा Kiranta Book, religious books, prayers, story र documents जस्ता objects catalogue भएका छन्। Catalogue date र physical object अलग-अलग metadata हुन्; कुनै object digitised हुनु मात्रैले त्यसको सबै content को exact historical interpretation स्वतः तय गर्दैन।

चौथो तह १८औँ–१९औँ शताब्दीका administrative तथा documentary records हुन्। Pallo Kirāta/Limbuvān सम्बन्धी documents, land/revenue records र Hamilton जस्ता accounts ले निश्चित समय, स्थान र प्रशासनिक प्रसङ्गमा Kirat/Kirāta designation तथा communities को इतिहास देखाउँछन्।

**कालक्रमको निष्कर्ष:** अहिलेको archive मा chronology “एकै continuous line” होइन, evidence layers को timeline हो। नयाँ page, folio, inscription वा dated object भेटिएमा सम्बन्धित layer र conclusion version सहित update गरिन्छ।`,
    bodyEnglish: `A responsible Kirat chronology asks two different questions: when was a claim or tradition recorded, and when do we have a surviving direct historical object or document? Keeping those questions separate prevents a later chronicle from being mistaken for a contemporary record of the distant past.

The earliest layer is textual. The term Kirāta appears in older South Asian literary traditions, but the geographic and social meaning of each occurrence is not automatically identical. The archive therefore labels this as an ancient textual layer rather than as proof of one exact beginning of the modern civilization.

The next layer is Nepalese chronicle tradition. Medieval chronicles such as the Gopālarājavamsāvali preserve a tradition of Kirata rulers. This is evidence for the preservation of a historical memory and dynastic tradition; its long regnal totals are not treated as contemporary archaeological dates.

A further layer is manuscript evidence. The British Library EAP1023 catalogue contains Kiranta books, religious works, prayers, stories, and documents. Catalogue dating and the physical object must be recorded together, but digitisation alone does not settle every question about the text’s origin, use, or historical interpretation.

The later documentary layer is particularly strong for specific historical contexts. Pallo Kirāta/Limbuvān records, land and revenue documents, and Hamilton’s account provide dated evidence for particular places, institutions, and communities in the eighteenth and nineteenth centuries.

**Chronology conclusion:** the archive presents a layered evidence timeline rather than an invented uninterrupted line. New dated pages, folios, inscriptions, or objects can revise the relevant layer and its versioned conclusion.`,
    evidenceIds: ['bl-eap1023-21-7-kirat-book', 'bl-eap1023-22-17-kirat-dharma', 'documenta-pallo-kirata-records', 'hamilton-1819']
  },
  {
    key: 'authors_researchers',
    questionNepali: 'इतिहासकार र अनुसन्धानकर्ताले के भने?',
    questionEnglish: 'What have historians and researchers argued?',
    bodyNepali: `किराँत इतिहासबारे लेख्ने विद्वानहरू एउटै प्रश्नमा एउटै विधि प्रयोग गरेका छैनन्। Kirkpatrick र Hamilton जस्ता early observers ले आफ्नो समयको Nepal र eastern territories बारे documentary accounts दिए; Hodgson ले Kiranti languages, communities, religion र culture सम्बन्धी विस्तृत materials सङ्कलन/प्रकाशन गरे; पछि Caplan, Hansson, Gaenszle, van Driem, Hardman, Michaels र अन्य अनुसन्धानकर्ताले सामाजिक, भाषिक, ऐतिहासिक र धार्मिक पक्ष अलग-अलग अध्ययन गरे।

यी works दुई तरिकाले उपयोगी छन्। पहिलो, उनीहरूले आफ्नो समयका records, informants, manuscripts वा field observations सुरक्षित गरेका हुन सक्छन्। दोस्रो, उनीहरूले उपलब्ध सामग्रीको interpretation दिएका हुन्छन्। दोस्रो कुरा पहिलोसँग बराबर होइन। त्यसैले archive मा “विद्वानले भने” र “मूल document ले देखायो” छुट्टाछुट्टै राखिन्छ।

कुनै आधुनिक historian को राम्रो interpretation पनि primary evidence को substitute होइन। त्यस्तै पुरानो लेखकको statement स्वतः सही इतिहास पनि होइन; author को context, informant, उद्देश्य, terminology र सम्भावित limitation जाँचिन्छ।

**विद्वत् निष्कर्ष:** research को strength लेखकहरूको संख्या गनेर होइन, उनीहरूले प्रयोग गरेको evidence, exact reference, method र independent corroboration हेरेर निर्धारण हुन्छ।`,
    bodyEnglish: `Scholars of Kirat history have not worked with one method or one historical question. Early observers such as Kirkpatrick and Hamilton documented Nepal and eastern territories in their own periods. Hodgson collected and published extensive material on Kiranti languages, communities, religion, and culture. Later researchers such as Caplan, Hansson, Gaenszle, van Driem, Hardman, Michaels, and others approached social, linguistic, historical, and religious questions through different methods.

These works are valuable in two different ways. A scholar may preserve observations, informant testimony, manuscript material, or records from an earlier period; and the same scholar may also interpret those materials. Interpretation is not identical to the underlying historical object. The archive therefore distinguishes “a scholar argues” from “the primary document records.”

A modern historian’s careful interpretation is not a substitute for a primary source. Conversely, an old author’s statement is not automatically correct simply because it is old. Context, informants, terminology, purpose, and limitations are all considered.

**Scholarly conclusion:** research strength is measured not by the number of authors cited, but by the quality of the evidence they used, exact references, method, and independent corroboration.`,
    evidenceIds: ['hamilton-1819', 'hodgson-kiranti-1859', 'caplan-1970', 'van-driem-limbu']
  },
  {
    key: 'evidence_archive',
    questionNepali: 'प्रत्यक्ष प्रमाण कहाँ छन्?',
    questionEnglish: 'Where are the direct evidence objects?',
    bodyNepali: `प्रमाण अभिलेख यो २० खण्डको सबैभन्दा “वस्तु-केन्द्रित” भाग हो। यहाँ visitor ले “इतिहासमा के लेखिएको छ?” मात्र होइन, “त्यो लेखिएको कुरा कुन वास्तविक object वा record बाट आएको हो?” भनेर हेर्न पाउँछ।

प्रत्येक evidence record मा सम्भव भएसम्म author/informant, institution/archive, work or document title, date, edition, catalogue/shelfmark, exact page/folio/object number, source actually says, supported claim, rights/access र actual uploaded evidence छुट्टाछुट्टै राखिन्छ।

उदाहरणका लागि British Library का Kiranta manuscripts catalogue objects हुन्; Documenta Nepalica का Pallo Kirāta records primary administrative documents हुन्; Hamilton 1819 एउटा published documentary source हो जसको Library of Congress copy digitised छ। यी तीनै “source” हुन्, तर evidence type एउटै होइन।

Restricted/copyrighted materialमा archive ले scan भएको नाटक गर्दैन। Catalogue identity, official link र exact target page/folio राखिन्छ; lawful permission भएपछि owner upload जोडिन्छ। “Digitised” र “free to redistribute” पनि एउटै कुरा होइन।

**Evidence conclusion:** प्रमाण अभिलेखको उद्देश्य धेरै source cards देखाउनु होइन; प्रत्येक महत्वपूर्ण historical claim लाई सम्भव भएसम्म वास्तविक page, folio, inscription, object वा official catalogue record सम्म पुर्‍याउनु हो।`,
    bodyEnglish: `The Evidence Archive is the most object-centred part of the twenty chapters. It should let a visitor ask not only “what has been written?” but also “what historical object or record is that statement based on?”

Where available, each evidence record preserves the author or informant, institution or archive, work/document title, date, edition, catalogue or shelfmark, exact page/folio/object number, what the source actually says, which claim it supports, rights/access information, and the actual evidence file.

British Library Kiranta manuscripts are catalogue objects; Documenta Nepalica Pallo Kirāta records are primary administrative documents; Hamilton’s 1819 work is a published documentary source with a digitised Library of Congress copy. All are evidence-bearing sources, but they are not the same evidence type.

For restricted or copyrighted material, the archive does not pretend to hold an unrestricted scan. It preserves the catalogue identity, official reference, and exact page or folio target, then adds an owner-uploaded copy only when lawful rights permit. Digitised does not mean free to redistribute.

**Evidence conclusion:** the purpose of the Evidence Archive is not to display a large number of status cards. Its purpose is to connect important historical claims to the strongest available page, folio, inscription, object, or official catalogue record.`,
    evidenceIds: ['bl-eap1023-22-17-kirat-dharma', 'bl-eap1023-21-5-kirat-dharma', 'documenta-pallo-kirata-records', 'documenta-rrc-0036-0252']
  },
  {
    key: 'civilization',
    questionNepali: 'किराँत सभ्यता भन्नाले के बुझ्ने?',
    questionEnglish: 'What can responsibly be called Kirat civilization?',
    bodyNepali: `“किराँत सभ्यता” भन्ने शीर्षकलाई visitor ले एउटै राजवंश वा एउटा निश्चित वर्षको कथा भनेर नबुझोस् भन्ने कुरा यस अध्यायको पहिलो उद्देश्य हो। सभ्यता अध्ययनमा मानिस, भूगोल, बसोबास, राजनीतिक संस्था, सामाजिक संरचना, भाषा, धर्म, ज्ञान, उत्पादन, व्यापार, कला, स्मृति र अभिलेख सबैलाई सम्बन्धित evidence सहित हेर्नुपर्छ।

किराँतको case मा प्रमाणहरू फरक कालमा फरक strength का छन्। प्राचीन Kirāta textual references ले नामको पुरानो प्रयोग देखाउँछन्; chronicle traditions ले Nepalese historical memory र dynastic tradition देखाउँछन्; manuscripts ले धार्मिक/सांस्कृतिक textual objects दिन्छन्; Pallo Kirāta/Limbuvān records ले निश्चित प्रशासनिक र क्षेत्रीय इतिहास देखाउँछन्; Hamilton र Hodgson जस्ता १८औँ–१९औँ शताब्दीका records ले समुदाय, भाषा र समाजबारे थप documentary/ethnographic material दिन्छन्।

त्यसैले “किराँत सभ्यता कति वर्ष पुरानो?” भन्ने प्रश्नको एउटै number भन्दा “कुन evidence कुन कालसम्म सुरक्षित छ?” भन्ने उत्तर बढी वैज्ञानिक हुन्छ। जहाँ exact date छैन, archive ले date invent गर्दैन।

आधुनिक Rai, Limbu, Yakkha, Sunuwar र अन्य Kiranti communities को living culture महत्वपूर्ण evidence हो, तर modern identity लाई ancient textual term को automatic proof बनाइँदैन। Continuity को प्रत्येक दाबी आफ्नै evidence माग्छ।

**सभ्यता निष्कर्ष:** किराँत सभ्यता यहाँ एक evidence-led historical field का रूपमा प्रस्तुत हुन्छ—बहु-स्तरीय, क्षेत्रीय रूपमा विस्तृत, living cultural traditions सहित; तर प्रमाणले नदिएको एकल exact origin date वा uninterrupted identity archive ले बनाउँदैन।`,
    bodyEnglish: `The first purpose of this chapter is to prevent “Kirat civilization” from being reduced to one dynasty or one exact starting year. A civilization is studied through people, geography, settlement, political institutions, social structures, languages, religion, knowledge, production, exchange, art, memory, and documentary records, each connected to the evidence that can actually support it.

In the Kirat case, the evidence has different strengths in different periods. Ancient references to Kirāta show the older use of a term; chronicle traditions preserve Nepalese historical memory and a dynastic tradition; manuscripts provide religious and cultural textual objects; Pallo Kirāta/Limbuvān records document specific administrative and regional history; and nineteenth-century materials such as Hamilton and Hodgson provide additional documentary and ethnographic evidence for communities, language, and society.

For that reason, the question “how many years old is Kirat civilization?” is better answered by showing what evidence survives for which period than by inventing one large number. Where an exact date is not established, the archive does not manufacture one.

The living cultures of Rai, Limbu, Yakkha, Sunuwar, and other Kiranti communities are important evidence for modern cultural history. They are not, by themselves, automatic proof that every ancient use of Kirāta referred to the same modern population. Each continuity claim needs its own evidence.

**Civilization conclusion:** Kirat civilization is presented here as an evidence-led, multi-layered historical field with regional depth and living cultural traditions. The archive does not invent an exact origin date or an uninterrupted identity where the evidence does not establish one.`,
    evidenceIds: ['hamilton-1819', 'caplan-1970', 'hansson-1991', 'documenta-limbuvan-collection']
  },
  {
    key: 'oral_history',
    questionNepali: 'मौखिक इतिहास र मुन्धुम/मुन्दुमलाई कसरी राख्ने?',
    questionEnglish: 'How should oral history and Mundhum/Mundum be treated?',
    bodyNepali: `मौखिक इतिहास र मुन्दुम/मुन्धुम Kiranti cultural knowledge बुझ्न अत्यन्त महत्वपूर्ण छन्। गीत, आख्यान, ritual recitation, genealogy, place memory, sacred narratives र community-held knowledge पुस्तादेखि पुस्तामा सर्दै आएका हुन सक्छन्। यसको मूल्य केवल “पुरानो कथा” भएकोमा होइन; समुदायले इतिहास, धर्म, सम्बन्ध, नैतिकता र भू-दृश्यलाई कसरी सम्झन्छ भन्ने पनि यसले देखाउँछ।

तर oral tradition लाई historical dating गर्दा थप प्रश्न चाहिन्छ: कसले सुनायो? कुन समुदाय? कुन स्थान? कुन भाषामा? कुन version? कहिले record गरियो? record गर्ने व्यक्ति को हो? performance को context के हो? अन्य independent evidence सँग के सम्बन्ध छ?

त्यसैले एउटै Mundhum narrative लाई archaeological date वा राजवंशको exact year को equivalent बनाइँदैन। यसको सट्टा oral tradition, ethnographic observation, manuscript version र documentary evidence बीच सम्बन्ध/अन्तर देखाइन्छ।

Archive मा oral history record गर्दा consent, privacy, rights, informant identity, recording date, place, language, transcript/translation र source context पनि सुरक्षित हुन्छ।

**मौखिक इतिहास निष्कर्ष:** oral tradition historical evidence हो, तर evidence को आफ्नै प्रकार हो। यसको आवाज जोगाउँदै यसको सीमा पनि इमानदारीपूर्वक देखाउनु नै archive को जिम्मेवारी हो।`,
    bodyEnglish: `Oral history and Mundum/Mundhum are essential for understanding Kiranti cultural knowledge. Songs, narratives, ritual recitations, genealogies, place memories, sacred narratives, and community-held knowledge may be transmitted across generations. Their value is not simply that they are “old stories”; they reveal how communities remember history, religion, relationships, ethics, and landscape.

Historical use of an oral tradition requires additional questions: who transmitted it, from which community and place, in which language, in which version, when it was recorded, who recorded it, what was the performance context, and how does it relate to independent evidence?

A Mundhum narrative is therefore not converted automatically into an archaeological date or an exact dynastic year. Instead, oral tradition, ethnographic observation, manuscript versions, and documentary evidence are compared while preserving their different evidence types.

Oral-history records in the archive should also preserve consent, privacy, rights, informant identity, recording date, place, language, transcript or translation, and source context.

**Oral-history conclusion:** oral tradition is historical evidence, but it is a distinct kind of evidence. Preserving its voice while clearly stating its evidentiary limits is part of the archive’s research standard.`,
    evidenceIds: ['gaenszle-ancestral-voices', 'tu-limbu-mundhum-2010', 'streltsova-2023']
  },
  {
    key: 'disputed_topics',
    questionNepali: 'कुन कुरा अझै प्रमाणित हुन बाँकी छ?',
    questionEnglish: 'Which claims remain unresolved?',
    bodyNepali: `अन्तर्राष्ट्रिय स्तरको इतिहास archive को बल केवल “हामीले के भेटायौँ” मा होइन, “के भेटिएन वा केमा मतभेद छ” भन्ने कुरा देखाउनमा पनि हुन्छ। त्यसैले यो खण्डमा विवादित दाबी हटाइँदैन, बरु claim-by-claim जाँचिन्छ।

यलम्बरको नाम र स्थान, उनको exact historical date, उनलाई Mahābhārata को निश्चित पात्रसँग समान ठहराउने दाबी, प्राचीन Kirāta references र आधुनिक Kiranti populations बीचको direct continuity, केही manuscripts को exact dating, र archaeological attribution जस्ता प्रश्नलाई एउटै evidence level मा राख्न मिल्दैन।

हरेक disputed claim मा “दाबी के हो?”, “कुन स्रोतले भनेको?”, “source actually says के?”, “independent corroboration छ?”, “विरोधी evidence के छ?” र “अहिलेको conclusion के हो?” भन्ने chain राखिन्छ।

यसले traditional history लाई अपमान गर्दैन। Chronicle वा oral tradition को historical importance स्वीकारिन्छ, तर त्यसलाई contemporary direct proof भनेर बढाइँदैन। त्यस्तै modern scholarly criticism लाई final truth बनाएर पनि राखिँदैन।

**विवादित विषयको निष्कर्ष:** evidence नपुगेको claim “थप अनुसन्धान आवश्यक” रहन्छ। नयाँ primary evidence आएमा पुरानो version मेटिँदैन; conclusion version सहित संशोधन हुन्छ।`,
    bodyEnglish: `A serious international archive is strengthened not only by what it finds, but also by showing what remains disputed or unknown. This chapter therefore keeps contested claims visible and tests them one by one.

Questions such as Yalambar’s historical date and identity, identification of Yalambar with a specific Mahābhārata character, direct continuity between ancient Kirāta references and present-day Kiranti populations, dating of particular manuscripts, and archaeological attribution do not all have the same evidentiary status.

For each disputed claim, the research chain records: what is claimed, which source makes the claim, what the source actually says, whether independent corroboration exists, what contradictory evidence is known, and what conclusion is currently justified.

This does not dismiss traditional history. A chronicle or oral tradition may be historically important without being contemporary direct proof. Likewise, a modern scholarly criticism is not automatically the final truth.

**Disputed-topic conclusion:** where evidence is insufficient, the claim remains “further research required.” New primary evidence can revise a conclusion, but the earlier research version is preserved rather than erased.`,
    evidenceIds: ['ancient-nepal-yellung-crosscheck', 'nepal-parichaya-kirat-bamshi', 'bl-eap1023-22-3-kirata-dastabej']
  },
  {
    key: 'sources_references',
    questionNepali: 'पूरा स्रोत सूची कहाँ हेर्ने?',
    questionEnglish: 'Where can the full source register be examined?',
    bodyNepali: `स्रोत तथा सन्दर्भ खण्ड visitor का लागि bibliography को भारी सूची मात्र होइन, “यो इतिहास कुन आधारमा बनेको हो?” भन्ने प्रश्नको नक्सा हो। यहाँ मुख्य evidence-bearing works पहिले देखाइन्छन् र full research register मा थप विवरणतर्फ जाने बाटो दिइन्छ।

मुख्य स्रोतमा author/institution, title, publication or catalogue date, archive/country, exact page/folio target, evidence type र official source link जस्ता metadata प्राथमिक हुन्छन्। जहाँ exact page/folio अझै जाँच्न बाँकी छ, त्यसलाई जाँचिएको जस्तो लेखिँदैन।

एकै ऐतिहासिक work को Library of Congress, National Archives, British Library वा अन्य institutional catalogue record अलग record हुन सक्छ। Master archive ले traceability का कारण यस्ता records हटाउँदैन; तर visitor-facing presentation मा duplicate clutter घटाइन्छ।

Research layer मा 45-source audit र त्यसपछिका worldwide discoveries जोडिँदै जान्छन्। त्यसैले source list “एकपटक पूरा भयो” भनेर बन्द हुँदैन।

**स्रोत निष्कर्ष:** public page मा मुख्य स्रोतबाट सुरु गर्ने, research layer मा पूर्ण audit trail राख्ने र नयाँ source आएपछि versioned cross-check गर्ने—यही permanent archive model हो।`,
    bodyEnglish: `The Sources & References chapter is not merely a long bibliography. It is the map showing how the historical narrative is supported. Main evidence-bearing works appear first, while the full research register provides the deeper audit trail.

For each principal source, the archive prioritizes author or institution, title, publication or catalogue date, archive/country, exact page or folio target, evidence type, and official source link. If an exact page or folio is still pending, it is not presented as verified.

The same historical work may appear in different institutional catalogues, such as the Library of Congress, National Archives, British Library, or another research collection. Such records are preserved for traceability, while the public reading layer avoids unnecessary duplicate clutter.

The 45-source audit and later worldwide discoveries remain expandable. A permanent research archive should never close its source register simply because one version has been published.

**Sources conclusion:** lead with the principal sources in public, preserve the full audit trail in the research layer, and version every future addition or correction.`,
    evidenceIds: ['hamilton-1819', 'hodgson-ras-manuscript', 'documenta-pallo-kirata-records']
  },
  {
    key: 'geography_settlements',
    questionNepali: 'किराँत इतिहासको भूगोल कहाँ थियो?',
    questionEnglish: 'Where is Kirat historical geography documented?',
    bodyNepali: `किराँत इतिहासको भूगोल एउटै modern political map बाट तय गर्न मिल्दैन। ऐतिहासिक documents मा Pallo Kirāta, Majha Kirāta र Limbuvān जस्ता नाम विशेष क्षेत्र, प्रशासनिक सम्बन्ध र राजनीतिक भू-दृश्यसँग जोडिएका छन्। Documenta Nepalica को Pallo Kirāta ontology र सम्बन्धित records ले eastern Nepal को ऐतिहासिक geography बुझ्न महत्वपूर्ण आधार दिन्छ।

Hamilton को early nineteenth-century account ले Nepal Proper को पूर्वतर्फ Kirat/Kichak समुदायबारे documentary description दिन्छ। यसले “पूर्वी क्षेत्र” भन्ने historical picture लाई थप independent context दिन्छ, तर यसबाट हजारौँ वर्ष पुरानो exact border निकालिँदैन।

Settlement history मा place-name, map, land record, administrative document, oral memory, archaeological report र later scholarship सबै अलग evidence हुन्। कुनै ठाउँमा आज Kirati community बस्छ भनेर मात्र त्यो ठाउँलाई प्राचीन Kirat capital भनेर घोषणा गरिँदैन।

Archive मा geography सम्बन्धी प्रत्येक claim लाई date, source, map/record र historical terminology सँग जोडिन्छ। आधुनिक province वा international border र historical region बीचको फरक पनि स्पष्ट राखिन्छ।

**भूगोल निष्कर्ष:** अहिलेको प्रमाणले eastern Nepal र Pallo/Majha Kirāta सम्बन्धी historical geography लाई राम्रोसँग document गर्छ; तर historical boundaries लाई आधुनिक नक्सामा जबर्जस्ती स्थिर बनाउनु उचित हुँदैन।`,
    bodyEnglish: `Kirat historical geography cannot be defined from a single modern political map. Historical documents use names such as Pallo Kirāta, Majha Kirāta, and Limbuvān in relation to particular regions, administrative relationships, and political landscapes. The Documenta Nepalica Pallo Kirāta ontology and related records provide an important documentary basis for eastern Nepal.

Hamilton’s early nineteenth-century account independently describes Kirat/Kichak communities east of Nepal Proper. This strengthens the documentary picture of the eastern region, but it does not allow the archive to reconstruct an exact border thousands of years earlier without additional evidence.

Settlement history requires separate evidence types: place names, maps, land records, administrative documents, oral memory, archaeological reports, and later scholarship. A place is not declared an ancient Kirat capital merely because a Kirati community lives there today.

Every geographic claim in the archive should therefore be tied to a date, source, map or record, and the historical terminology used by that source. Modern provincial or international borders are not silently substituted for historical regions.

**Geography conclusion:** current evidence documents an important eastern Nepal and Pallo/Majha Kirāta historical geography, but historical boundaries should not be frozen into modern borders without direct evidence.`,
    evidenceIds: ['nepalica-pallo-kirata', 'hamilton-1819', 'caplan-1970']
  },
  {
    key: 'origins_migration',
    questionNepali: 'किराँती समुदायको उत्पत्ति र बसाइँसराइ कसरी अध्ययन गर्ने?',
    questionEnglish: 'How can origins and migration be studied?',
    bodyNepali: `उत्पत्ति र बसाइँसराइको प्रश्नमा सबैभन्दा धेरै सावधानी आवश्यक हुन्छ। भाषा, स्थाननाम, genealogy, oral tradition, archaeology, anthropology र historical documents ले फरक किसिमका संकेत दिन सक्छन्। एउटा संकेतलाई अर्कोको पूर्ण प्रमाण बनाएर migration story बनाउनु गलत हुन सक्छ।

Kiranti languages को internal diversity, eastern Himalayan distribution र community histories बाट population movement र contact का प्रश्न अध्ययन गर्न सकिन्छ। तर language family वा linguistic similarity ले आफैंमा एउटै political kingdom वा एउटै ancient ethnic group को exact migration route प्रमाणित गर्दैन।

Modern Rai, Limbu, Yakkha, Sunuwar आदि समुदायहरूको इतिहासलाई उनीहरूको आफ्नै records, ethnography र oral traditions सहित पढिन्छ। “Ancient Kirāta” र “modern Kiranti” बीच direct ancestry/identity equivalence जहाँ evidence ले establish गर्दैन, त्यहाँ archive ले interpretation भनेर label गर्छ।

Migration claim मा “कहाबाट?”, “कहिले?”, “कुन evidence?”, “कुन direction?”, “कुन alternative explanation?” भन्ने प्रश्न अनिवार्य हुन्छ।

**उत्पत्ति निष्कर्ष:** अहिलेको evidence ले eastern Himalayan/Kiranti historical formation र movement अध्ययन गर्न बलियो material दिन्छ; तर एकै origin point र एकै migration route घोषणा गर्न पर्याप्त direct evidence सबै ठाउँमा छैन।`,
    bodyEnglish: `Origins and migration require particular caution. Languages, place names, genealogies, oral traditions, archaeology, anthropology, and historical documents can provide different kinds of signals. One signal should not be converted into complete proof of a migration story.

The internal diversity of Kiranti languages, their eastern Himalayan distribution, and community histories allow questions of movement and contact to be studied. A language family or linguistic similarity, however, does not by itself prove one political kingdom or one exact ancient migration route.

The histories of Rai, Limbu, Yakkha, Sunuwar, and other communities should be studied through their own records, ethnographies, and oral traditions. Where direct ancestry or identity equivalence between ancient Kirāta and modern Kiranti populations is not established, the archive labels it as interpretation rather than fact.

Every migration claim should answer: from where, when, what evidence, in which direction, and what alternative explanations remain possible?

**Origins conclusion:** current evidence provides substantial material for studying eastern Himalayan and Kiranti historical formation and movement, but it does not justify one universal origin point or single migration route for every period and community.`,
    evidenceIds: ['hansson-1991', 'van-driem-limbu', 'hamilton-1819', 'hardman']
  },
  {
    key: 'political_history',
    questionNepali: 'किराँत राजनीतिक इतिहासमा के प्रमाण छन्?',
    questionEnglish: 'What evidence exists for Kirat political history?',
    bodyNepali: `किराँत राजनीतिक इतिहासलाई दुई मुख्य evidence layers मा पढ्नुपर्छ। पहिलो, Nepalese chronicles मा सुरक्षित Kirata rulers को tradition हो। दोस्रो, Pallo Kirāta/Limbuvān सम्बन्धी royal orders, land survey, revenue तथा administrative documents हुन्। यी दुवैलाई एउटै प्रकारको evidence मान्न मिल्दैन।

Chronicle evidence ले political memory, ruler lists र later historical tradition देखाउँछ। त्यसको compilation/transmission history जाँचेर मात्र प्राचीन political chronology बनाइन्छ। Yalambar जस्ता नाममा traditional account महत्वपूर्ण छ, तर exact reign date को direct contemporary evidence छुट्टै चाहिन्छ।

अर्कोतर्फ १८औँ–१९औँ शताब्दीका primary documents ले निश्चित administrative practice, land relation, authority, boundary, revenue वा royal order बारे प्रत्यक्ष जानकारी दिन सक्छन्। यही कारणले Documenta Nepalica records विशेष evidence value राख्छन्।

Political history मा “राजा थियो” भन्ने claim मात्र होइन—कुन territory, कुन institution, कुन document, कुन date, कुन authority र कुन independent confirmation भन्ने कुरा पनि राखिन्छ।

**राजनीतिक निष्कर्ष:** Kirata political tradition र later eastern Nepal administrative history दुवै documented छन्; तर chronicle tradition बाट exact ancient dynasty chronology स्वतः प्रमाणित भएको मानिँदैन।`,
    bodyEnglish: `Kirat political history should be read through at least two major evidence layers. The first is the tradition of Kirata rulers preserved in Nepalese chronicles. The second is the primary documentary record of Pallo Kirāta/Limbuvān, including royal orders, land surveys, revenue records, and administrative documents. These are not the same type of evidence.

Chronicles preserve political memory, ruler traditions, and later historical narratives. Their compilation and transmission histories must be considered before constructing an ancient political chronology. Traditional accounts about figures such as Yalambar are important, but an exact reign date requires separate contemporary evidence.

The eighteenth- and nineteenth-century documents, by contrast, can directly record particular administrative practices, land relations, authority, boundaries, revenue, and royal orders. This is why the Documenta Nepalica corpus has special evidentiary value.

Political history should therefore ask not only whether a ruler is named, but which territory, institution, document, date, authority, and independent confirmation are involved.

**Political conclusion:** a Kirata political tradition and later eastern Nepal administrative history are documented, but a chronicle tradition alone is not treated as automatic proof of an exact ancient dynastic chronology.`,
    evidenceIds: ['nepal-parichaya-kirat-bamshi', 'documenta-pallo-kirata-records', 'nepalica-land-survey', 'nepalica-revenue']
  },
  {
    key: 'social_structure',
    questionNepali: 'समाज, कुल र नातासम्बन्ध कस्ता थिए?',
    questionEnglish: 'What can be studied about society, clans, and kinship?',
    bodyNepali: `किराँत समाजको अध्ययनमा “प्राचीन समाज” र “ऐतिहासिक रूपमा document भएको समुदाय” छुट्याउनुपर्छ। Hodgson का १९औँ शताब्दीका materials, Caplan को eastern Nepal social research, Hansson/Winter को Rai linguistic-ethnic grouping र Hardman जस्ता ethnographic studies ले निश्चित समय र समुदायका सामाजिक संरचना बुझ्न मद्दत गर्छन्।

कुल, lineage, clan, kinship, village institution, customary authority र identity को अर्थ समुदायअनुसार फरक हुन सक्छ। त्यसैले एउटा Rai community को ethnographic description लाई सबै Kiranti समुदायको universal ancient model बनाइँदैन।

Historical social structure मा gender, status, ritual role, land relation, marriage, inheritance र local authority जस्ता विषय evidence अनुसार छुट्टाछुट्टै जाँचिन्छन्। Oral testimony र later ethnography लाई समय-सन्दर्भसहित राखिन्छ।

**सामाजिक निष्कर्ष:** Kiranti communities को social organization सम्बन्धी substantial ethnographic/linguistic evidence छ; तर unspecified ancient period को सम्पूर्ण Kirat society लाई एउटै fixed structure भनेर घोषणा गर्न evidence पर्याप्त छैन।`,
    bodyEnglish: `Social history must distinguish an unspecified ancient society from communities that are historically documented at particular times. Hodgson’s nineteenth-century materials, Caplan’s research on social change in eastern Nepal, Hansson and Winter’s work on Rai ethnic and linguistic grouping, and ethnographies such as Hardman’s provide useful evidence for particular communities and periods.

Clan, lineage, kinship, village institutions, customary authority, and identity can differ between communities. A description of one Rai community is therefore not converted into a universal ancient model for all Kiranti peoples.

Social history can examine gender, status, ritual roles, land relations, marriage, inheritance, and local authority where evidence exists. Oral testimony and later ethnography are always presented with their date and context.

**Social conclusion:** substantial ethnographic and linguistic evidence exists for Kiranti social organization, but the evidence does not justify declaring one fixed structure for every Kirat community and every ancient period.`,
    evidenceIds: ['hodgson-kiranti-1859', 'caplan-1970', 'hansson-1991', 'hardman']
  },
  {
    key: 'religion_worldview',
    questionNepali: 'किराँत धर्म र मुन्धुम/मुन्दुमलाई कसरी बुझ्ने?',
    questionEnglish: 'How should Kirat religion and Mundhum/Mundum be understood?',
    bodyNepali: `किराँत धार्मिक इतिहासमा written manuscripts, ritual texts, oral tradition, ethnography र modern religious movements सबै महत्वपूर्ण छन्, तर तिनको evidence level फरक हुन्छ। British Library का Kiranta religious manuscripts written religious traditions को archival history अध्ययन गर्न सकिने प्रत्यक्ष objects हुन्।

Mundhum/Mundum भनेको केवल एउटा “book” होइन; विभिन्न समुदायमा oral knowledge, ritual performance, genealogy, cosmology र ethical teaching का रूपमा जीवित परम्पराहरू पनि छन्। त्यसैले original community terminology र performance context सुरक्षित राखिन्छ।

धार्मिक continuity को प्रश्नमा manuscript को date, oral tradition को recording date, ritual practice को observed period र modern religious identity को emergence अलग-अलग जाँचिन्छ। आधुनिक Kirat religion को संस्थागत विकासलाई प्राचीन religion को direct unchanged survival भनेर automatically लेखिँदैन।

**धार्मिक निष्कर्ष:** Kiranti religious history का written, oral र ethnographic evidence बलिया र विविध छन्; archive ले ती सबैलाई जोड्छ, तर एउटै uninterrupted religious form को दाबी evidence ले जहाँ support गर्छ त्यहाँ मात्र राख्छ।`,
    bodyEnglish: `Kirat religious history requires several evidence types: written manuscripts, ritual texts, oral traditions, ethnography, and modern religious movements. British Library Kiranta religious manuscripts are direct archival objects for the history of written religious traditions.

Mundhum/Mundum is not simply a single “book.” Across communities it can exist as oral knowledge, ritual performance, genealogy, cosmology, and ethical teaching. The archive therefore preserves original community terminology and performance context.

Questions of religious continuity require separate checks of manuscript dates, recording dates for oral traditions, observed ritual practice, and the emergence of modern religious institutions. Modern Kirat religious organization is not automatically presented as an unchanged survival of an ancient religion.

**Religious conclusion:** Kiranti religious history has diverse written, oral, and ethnographic evidence. The archive connects those layers while claiming uninterrupted continuity only where the evidence supports it.`,
    evidenceIds: ['bl-eap1023-22-17-kirat-dharma', 'bl-eap1023-21-5-kirat-dharma', 'gaenszle-ancestral-voices', 'tu-limbu-mundhum-2010']
  },
  {
    key: 'language_literature',
    questionNepali: 'भाषा र लिपिले के प्रमाण दिन्छ?',
    questionEnglish: 'What do language and scripts reveal?',
    bodyNepali: `भाषा र लिपि किराँत इतिहासको सबैभन्दा उपयोगी comparative evidence मध्ये एक हो, किनकि भाषा समयसँग परिवर्तन हुन्छ र पुराना linguistic records ले historical relationships को अध्ययन सम्भव बनाउँछन्। Hodgson का comparative vocabulary materials, Limbu grammar, Yakkha research र Kiranta manuscript records यसका महत्वपूर्ण आधार हुन्।

तर भाषा evidence को सीमा पनि हुन्छ। दुई भाषामा समान शब्द भेटिनु contact, inheritance, borrowing वा broader language-family relationship मध्ये कुन कारणले भयो भन्ने छुट्टै जाँच चाहिन्छ। त्यस्तै script को existence ले आफूले मात्र political state वा exact ethnicity प्रमाणित गर्दैन।

Literature र manuscripts मा original spelling, language, script, dating, scribal context र provenance सुरक्षित राखिन्छ। Modern transliteration लाई original script को substitute बनाइँदैन।

**भाषिक निष्कर्ष:** Kiranti linguistic diversity र manuscript tradition को evidence महत्वपूर्ण छ; तर language similarity मात्रबाट ancient political identity वा exact ancestry निष्कर्ष निकालिँदैन।`,
    bodyEnglish: `Language and script are among the most useful comparative forms of evidence in Kirat research because languages change through time and historical linguistic records can reveal relationships. Hodgson’s comparative vocabulary materials, Limbu grammar, Yakkha research, and Kiranta manuscript records are important resources.

Language evidence also has limits. Similar words may result from inheritance, contact, borrowing, or wider language-family relationships, and those possibilities must be tested separately. The existence of a script likewise does not by itself prove a political state or an exact ethnic identity.

Literary and manuscript records preserve original spelling, language, script, dating, scribal context, and provenance. Modern transliteration is not treated as a replacement for the original script.

**Language conclusion:** evidence for Kiranti linguistic diversity and manuscript traditions is substantial, but linguistic similarity alone does not establish an exact ancient political identity or ancestry.`,
    evidenceIds: ['hodgson-vocabulary-1857', 'hodgson-ras-manuscript', 'van-driem-limbu', 'bl-hodgson-85-limbu-manuscripts']
  },
  {
    key: 'archaeology_material',
    questionNepali: 'पुरातत्त्व र भौतिक प्रमाण कहाँ जोडिन्छ?',
    questionEnglish: 'Where does archaeology and material evidence fit?',
    bodyNepali: `पुरातत्त्वमा दाबीको शक्ति वस्तु, provenance र dating बाट आउँछ। उत्खनन गरिएको object, stratigraphy, inscription, coin, seal, architectural remains, scientific dating report वा museum/archive record बिना केवल folklore वा place-name का आधारमा archaeological civilization claim गर्नु उचित हुँदैन।

किराँत research मा manuscript पनि material object हो, तर manuscript भेटिनु र “त्यसैले यही प्राचीन राज्य थियो” भन्नु अलग कुरा हो। British Library catalogue objects र Hodgson manuscript holdings ले material/archive history दिन्छन्; उनीहरूले आफूले record गरेको claim भन्दा बाहिरको conclusion स्वतः प्रमाणित गर्दैनन्।

प्रत्येक archaeological claim मा site, excavation report, layer/date, object number, present repository र scholarly interpretation छुट्टाछुट्टै राखिन्छ।

**पुरातत्त्व निष्कर्ष:** direct material evidence भेटिँदा Kirat history अझ बलियो हुन सक्छ; तर evidence नपुगेको ठाउँमा catalogue object वा oral tradition लाई archaeological proof बनाएर प्रस्तुत गरिँदैन।`,
    bodyEnglish: `Archaeological claims gain strength from objects, provenance, and dating. Excavated material, stratigraphy, inscriptions, coins, seals, architectural remains, scientific dating reports, and museum or archive records are required before making a strong archaeological claim. Folklore or a place name alone is not sufficient.

A manuscript is itself a material object, but finding a manuscript does not automatically prove that a particular ancient state existed exactly as later tradition describes. British Library catalogue objects and Hodgson manuscript holdings document material and archival history; they support the claims they actually record, not every broader conclusion.

Each archaeological claim should therefore preserve the site, excavation report, layer or date, object number, present repository, and scholarly interpretation separately.

**Archaeology conclusion:** direct material evidence can strengthen Kirat history considerably, but catalogue objects or oral traditions are not converted into archaeological proof where the necessary provenance or dating is absent.`,
    evidenceIds: ['hodgson-ras-manuscript', 'bl-eap1023-22-3-kirata-dastabej', 'hamilton-loc-1819-evidence']
  },
  {
    key: 'economy_livelihood',
    questionNepali: 'अर्थव्यवस्था, भूमि र जीविकाबारे के प्रमाण छन्?',
    questionEnglish: 'What evidence exists for economy, land, and livelihood?',
    bodyNepali: `भूमि, कृषि, कर, राजस्व, व्यापार र जीविका इतिहास बुझ्न administrative documents अत्यन्त उपयोगी हुन्छन्। Pallo Kirāta/Majha Kirāta सम्बन्धी land survey र revenue records ले निश्चित समय र क्षेत्रको आर्थिक तथा प्रशासनिक सम्बन्धलाई प्रत्यक्ष रूपमा document गर्छन्।

यस्ता records बाट “त्यो समयमा यो document मा के व्यवस्था थियो?” भन्ने प्रश्न बलियोसँग उत्तर दिन सकिन्छ। तर त्यसबाट हजारौँ वर्षअघिको सम्पूर्ण economy को model स्वतः निकालिँदैन।

Kipat/land relations, agricultural practice, local exchange, routes, labour र household economy सम्बन्धी claims मा documentary record, ethnography, archaeology र oral history लाई context अनुसार तुलना गर्नुपर्छ।

**आर्थिक निष्कर्ष:** पछिल्ला historical periods का land/revenue records बलिया primary evidence हुन्; broader ancient economic claims का लागि थप independent evidence आवश्यक हुन्छ।`,
    bodyEnglish: `Land, agriculture, taxation, revenue, trade, and livelihood are especially well suited to documentary research. Land survey and revenue records concerning Pallo Kirāta and Majha Kirāta provide direct evidence for economic and administrative relationships in particular places and periods.

Such records can answer a strong question: what arrangement is documented for this place and date? They cannot automatically reconstruct the entire economy of a much earlier period.

Claims about kipat or land relations, agriculture, local exchange, routes, labour, and household economy should be compared with documents, ethnography, archaeology, and oral history according to their context.

**Economic conclusion:** later historical land and revenue records are strong primary evidence for their own periods; broader ancient economic claims require additional independent evidence.`,
    evidenceIds: ['nepalica-land-survey', 'nepalica-revenue', 'documenta-limbuvan-collection', 'caplan-1970']
  },
  {
    key: 'places_sacred_landscape',
    questionNepali: 'ऐतिहासिक स्थान र पवित्र भू-दृश्य कसरी प्रमाणित गर्ने?',
    questionEnglish: 'How can historical places and sacred landscapes be documented?',
    bodyNepali: `ऐतिहासिक स्थानलाई “किराँत स्थान” भन्नु अघि evidence chain पूरा गर्नुपर्छ। place-name, local tradition वा sacred association महत्वपूर्ण starting point हुन सक्छ, तर त्यसले आफैंमा ancient date प्रमाणित गर्दैन।

सबैभन्दा उपयोगी evidence मा पुराना maps, royal/administrative documents, inscriptions, archaeological reports, archival photographs, historical travel accounts, local oral history र independent scholarly identification पर्न सक्छन्। प्रत्येक source ले location बारे वास्तवमा के भन्छ भन्ने exact reference चाहिन्छ।

Sacred landscape को अर्थ केवल पुरानो monument होइन; नदी, डाँडा, forest, ritual place, route र community memory पनि हुन सक्छ। तर प्रत्येक प्रकारको claim को evidence type अलग हुन्छ।

**स्थान निष्कर्ष:** archive ले historical place claims लाई evidence सहित document गर्छ; “परम्परा छ” र “archaeologically dated site छ” भन्ने दुई कुरा अलग राख्छ।`,
    bodyEnglish: `A historical place should not be labelled a “Kirat site” until an evidence chain is established. A place name, local tradition, or sacred association may be an important starting point, but none of these alone establishes an ancient date.

Useful evidence can include old maps, royal or administrative documents, inscriptions, archaeological reports, archival photographs, historical travel accounts, local oral histories, and independent scholarly identifications. Each source must be tied to what it actually says about the location.

A sacred landscape is not limited to a monument. Rivers, hills, forests, ritual places, routes, and community memory can all have historical meaning, but each type of claim has a different evidence requirement.

**Place conclusion:** the archive documents historical-place claims with evidence and keeps “a tradition associates this place with Kirat history” separate from “this is an archaeologically dated site.”`,
    evidenceIds: ['hamilton-1819', 'nepalica-pallo-kirata', 'gaenszle-ancestral-voices']
  },
  {
    key: 'external_records_comparison',
    questionNepali: 'विश्वका बाह्य स्रोतले किराँतबारे के देखाउँछन्?',
    questionEnglish: 'What do independent external records show?',
    bodyNepali: `विश्वव्यापी cross-check को अर्थ धेरै देशका source जोडेर “सबैले एउटै कुरा भने” भन्नु मात्र होइन। एउटा claim लाई independent institutional records, different scholarly traditions र different evidence types बाट परीक्षण गर्नु हो।

उदाहरणका लागि Hamilton को Library of Congress copy, British Library manuscripts, Heidelberg/Documenta Nepalica documents, Royal Asiatic Society Hodgson materials र Nepal government/Department of Archaeology publications फरक institutional contexts का records हुन्। एउटै claim को प्रत्येक source ले वास्तवमा के support गर्छ भन्ने तुलना गरिन्छ।

Cross-check गर्दा source independence पनि जाँचिन्छ। एउटै पुरानो book को पाँच library catalogue record पाँच independent historical witnesses होइनन्। त्यस्तै एउटै modern article लाई पाँच websites ले reproduce गरे भन्दै पाँच independent sources मानिँदैन।

यस archive मा “worldwide 100%” को operational अर्थ defined research inventory का claims/sources लाई systematically check गरेर status, agreement, contradiction वा research gap assign गर्नु हो। विश्वका हरेक archive को सबै सामग्री जाँचिसकियो भन्ने दाबी होइन।

**विश्वव्यापी निष्कर्ष:** international evidence nodes ले Kirat research लाई फराकिलो बनाउँछन्; strength source count बाट होइन, independent evidence र precise agreement/disagreement बाट आउँछ।`,
    bodyEnglish: `Worldwide cross-checking does not simply mean collecting sources from many countries and saying that “everyone agrees.” It means testing a claim against independent institutional records, different scholarly traditions, and different evidence types.

For example, the Library of Congress copy of Hamilton, British Library manuscripts, Heidelberg/Documenta Nepalica documents, Royal Asiatic Society Hodgson materials, and Nepal government or Department of Archaeology publications come from different institutional contexts. The archive compares exactly what each record supports.

Source independence must also be checked. Five library catalogues describing the same old book are not five independent historical witnesses. Likewise, five websites repeating one modern article are not five independent sources.

In this archive, “100% worldwide cross-check” operationally means that the defined research inventory is systematically checked and every claim/source receives an explicit status, agreement, contradiction, or research-gap treatment. It does not mean that every archive in the world has been exhaustively searched.

**Worldwide conclusion:** international evidence nodes broaden the research; strength comes from independent evidence and precise agreement or disagreement, not from simply counting sources.`,
    evidenceIds: ['hamilton-1819', 'bl-eap1023-22-17-kirat-dharma', 'documenta-pallo-kirata-records', 'hodgson-ras-manuscript']
  },
  {
    key: 'modern_identity',
    questionNepali: 'आधुनिक किरात पहिचान र इतिहासको सम्बन्ध के हो?',
    questionEnglish: 'How are modern Kirat identities related to history?',
    bodyNepali: `आधुनिक Kirat/Kiranti identity बुझ्न history, language, religion, community organization, political movements, cultural revival र memory सबै हेर्नुपर्छ। Rai, Limbu, Yakkha, Sunuwar र अन्य Kiranti communities को आधुनिक identity एउटै uniform process बाट बनेको होइन।

२०औँ–२१औँ शताब्दीका scholarship र religious movements ले “Kirat” लाई modern ethnic, cultural र religious identity का रूपमा कसरी प्रयोग गरिएको छ भन्ने देखाउँछन्। Streltsova जस्ता studies ले modern identity formation र religious change लाई historical process का रूपमा अध्ययन गर्छन्।

तर modern identity को existence लाई ancient historical claim को proof बनाइँदैन। उदाहरणका लागि आजको community आफ्नो ancestry लाई पुरानो Kirāta परम्परासँग जोड्न सक्छ; archive ले त्यो community claim सुरक्षित राख्छ, तर independent historical evidence ले त्यस link लाई कति support गर्छ भन्ने छुट्टै जाँच गर्छ।

**आधुनिक पहिचान निष्कर्ष:** modern Kirat identity आफैंमा महत्वपूर्ण historical subject हो। यसलाई ancient textual/chronicle history सँग सम्मानपूर्वक तर evidence-based boundary सहित जोडिन्छ।`,
    bodyEnglish: `Understanding modern Kirat/Kiranti identity requires history, language, religion, community organization, political movements, cultural revival, and memory. The modern identities of Rai, Limbu, Yakkha, Sunuwar, and other Kiranti communities did not emerge through one uniform process.

Twentieth- and twenty-first-century scholarship and religious movements document how “Kirat” has been used as a modern ethnic, cultural, and religious identity. Studies such as Streltsova’s examine modern identity formation and religious change as historical processes.

The existence of a modern identity is not itself proof of an ancient historical claim. A community may connect its ancestry to an older Kirāta tradition; the archive preserves that community claim, while separately testing how strongly independent historical evidence supports the connection.

**Modern-identity conclusion:** modern Kirat identity is an important historical subject in its own right. The archive connects it respectfully to ancient textual and chronicle history while maintaining an explicit evidence boundary.`,
    evidenceIds: ['streltsova-2023', 'vandenhelsken-gaenszle', 'tu-limbu-mundhum-2010', 'hansson-1991']
  },
  {
    key: 'research_method_conclusions',
    questionNepali: 'अन्तिम अनुसन्धान निष्कर्ष कसरी बनाइन्छ?',
    questionEnglish: 'How are final research conclusions made?',
    bodyNepali: `अन्तिम अनुसन्धान निष्कर्ष कुनै एक source वा researcher को वाक्यबाट तयार हुँदैन। यस archive को स्थायी research chain हो: **स्रोत → exact page/folio → स्रोतले वास्तवमा के भन्यो → वास्तविक evidence object → claim → independent cross-check → evidence assessment → researcher analysis → final conclusion → public version → version history।**

यसको अर्थ “source भेटियो” र “claim प्रमाणित भयो” एउटै कुरा होइन। Bibliographic identity verified हुन सक्छ तर page-level claim pending हुन सक्छ। Catalogue object verified हुन सक्छ तर actual image restricted हुन सक्छ। Oral tradition documented हुन सक्छ तर exact historical date unresolved हुन सक्छ। प्रत्येक अवस्थालाई स्पष्ट status दिइन्छ।

Final conclusion researcher/owner-controlled हुन्छ। System ले कुनै claim लाई स्वतः True, False वा Final Truth घोषणा गर्दैन। नयाँ evidence आएमा conclusion revise गर्न सकिन्छ, तर पुरानो research history हराइँदैन।

Public visitor ले concise knowledge synthesis देख्छ; researcher ले पूरा source/evidence audit देख्न सक्छ। यही separation ले archive लाई पढ्न सजिलो र अनुसन्धानका लागि गहिरो बनाउँछ।

**अन्तिम निष्कर्ष:** यो archive को लक्ष्य “सबै कुरा थाहा छ” भन्नु होइन। लक्ष्य हो—जति प्रमाण भेटिन्छ, त्यसलाई व्यवस्थित, traceable, cross-checked र intellectually honest रूपमा सुरक्षित गर्नु।`,
    bodyEnglish: `Final historical conclusions are not produced from one source or one researcher’s sentence. The archive follows a permanent chain: **source → exact page/folio → what the source actually says → evidence object → claim → independent cross-check → evidence assessment → researcher analysis → final conclusion → public version → version history.**

Finding a source and proving a claim are therefore not the same thing. A bibliographic identity can be verified while a page-level claim remains pending. A catalogue object can be verified while its image is restricted. An oral tradition can be documented while its exact historical date remains unresolved. Each state receives an explicit status.

Final conclusions remain researcher- and owner-controlled. The system does not automatically declare a claim True, False, or Final Truth. New evidence can revise a conclusion, but earlier research history is retained rather than erased.

Public visitors receive a concise knowledge synthesis; researchers can follow the complete source and evidence audit. This separation keeps the archive easy to read while making it deep enough for serious research.

**Final conclusion:** the archive does not need to pretend that everything is known. Its standard is to preserve every available piece of evidence in a structured, traceable, cross-checked, and intellectually honest way.`,
    evidenceIds: ['hamilton-loc-1819-evidence', 'documenta-rrc-0036-0252', 'bl-eap1023-22-17-kirat-dharma']
  }
];
