# Sadan Rai Archive — Kirat History 20 Research Chapters
## Visitor Presentation Master / 2026-10-04

### Master Rule
Public Kirat History is a knowledge-first reading experience. It must not look like an internal source register.

**Public flow:**
20 Chapters → readable historical explanation → main evidence → source link → previous/next chapter.

**Research flow:**
Source → exact page/folio → what the source actually says → evidence object → claim → independent cross-check → evidence assessment → researcher analysis → final conclusion → version history.

### 20 chapters
1. किराँत कालको परिचय — Introduction to Kirat Era
2. ऐतिहासिक कालक्रम — Historical Timeline
3. ऐतिहासिक ग्रन्थ तथा विद्वत् दृष्टिकोण — Authors & Researchers Perspectives
4. प्रमाण अभिलेख — Evidence & Documentary Archive
5. किराँत सभ्यता — Kirat Civilization
6. मौखिक इतिहास — Oral History
7. विवादित तथा थप अनुसन्धान आवश्यक विषय — Disputed Topics & Further Research
8. स्रोत तथा सन्दर्भ — Sources & References
9. भूगोल, क्षेत्र तथा ऐतिहासिक बस्ती — Geography, Territory & Historical Settlements
10. उत्पत्ति, समुदाय तथा बसाइँसराइ — Origins, Peoples & Migration
11. राजनीतिक इतिहास, शासन तथा वंश — Political History, Governance & Dynasties
12. सामाजिक संरचना, कुल तथा नातासम्बन्ध — Social Structure, Clans & Kinship
13. धर्म, मुन्धुम/मुन्दुम तथा विश्वदृष्टि — Religion, Mundhum/Mundum & Worldview
14. भाषा, लिपि तथा साहित्य — Language, Script & Literature
15. पुरातत्त्व तथा भौतिक संस्कृति — Archaeology & Material Culture
16. अर्थव्यवस्था, कृषि, व्यापार तथा जीविका — Economy, Agriculture, Trade & Livelihood
17. ऐतिहासिक स्थान, स्मारक तथा पवित्र भू-दृश्य — Historical Places, Monuments & Sacred Landscapes
18. बाह्य स्रोत तथा तुलनात्मक अनुसन्धान — External Records & Comparative Research
19. आधुनिक परिवर्तन, पहिचान तथा निरन्तरता — Modern Transformation, Identity & Continuity
20. प्रमाण विश्लेषण, अनुसन्धान निष्कर्ष तथा थप अनुसन्धान — Evidence Analysis, Research Conclusions & Further Research

### Public Evidence Archive rule
“प्रमाण अभिलेख” is the evidence repository. It should contain:
- evidence object title
- author / issuing institution
- country or archive location (only when verified)
- date / period
- book / document / manuscript / inscription / photograph / map / audio / video type
- exact page / folio / inscription number when verified
- what the source actually says
- claim(s) supported
- evidence file or official catalogue link
- rights / access condition
- independent cross-check references

A catalogue record is not automatically treated as proof of every historical claim. Restricted material is cited honestly; it is not presented as a freely redistributable scan.

### Public vs Research separation
Public pages show the main evidence-bearing sources only. The full 45-source register, status codes, page-pending notes, duplicate institutional records, private cross-check notes, and researcher analysis remain in the research/admin layer.

### 100% definition
“100% cross-check” means 100% of the defined research inventory has been reviewed and assigned an explicit evidence/status treatment. It does not mean every historical proposition in the world has been proven true.

### Critical routing bug fixed
The application uses the URL hash for top-level routes (for example `#/history`). The old History tab handler wrote a section key such as `#intro` into the same hash. The router interpreted `/intro` as a top-level route and correctly fell back to Home. The fixed implementation stores the selected History chapter separately in sessionStorage and keeps the top-level route at `#/history`.
