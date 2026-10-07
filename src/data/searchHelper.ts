/**
 * Bilingual & Romanization Search Normalizer for Sadan Rai Archive
 * Supports bidirectional matching between Nepali script and Roman transliterations
 */

export const SEARCH_ALIASES: Record<string, string[]> = {
  kirat: ['किराँत', 'किरात', 'kirat', 'kirata', 'kiranti'],
  किराँत: ['kirat', 'kirata', 'किरात', 'किराँत', 'kiranti'],
  किरात: ['kirat', 'kirata', 'किरात', 'किराँत', 'kiranti'],
  rai: ['राई', 'rai'],
  राई: ['rai', 'राई'],
  limbu: ['लिम्बू', 'लिम्बु', 'limbu', 'yakthung', 'याक्थुङ'],
  लिम्बू: ['limbu', 'लिम्बु', 'लिम्बू', 'yakthung'],
  yakkha: ['याक्खा', 'yakkha'],
  याक्खा: ['yakkha', 'याक्खा'],
  sunuwar: ['सुनुवार', 'sunuwar', 'कोइँच', 'koinch'],
  सुनुवार: ['sunuwar', 'सुनुवार'],
  mundum: ['मुन्दुम', 'मुन्धुम', 'mundum', 'mundhum'],
  mundhum: ['मुन्दुम', 'मुन्धुम', 'mundum', 'mundhum'],
  मुन्दुम: ['mundum', 'mundhum', 'मुन्दुम', 'मुन्धुम'],
  मुन्धुम: ['mundum', 'mundhum', 'मुन्दुम', 'मुन्धुम'],
  sakela: ['साकेला', 'sakela', 'सकेला'],
  साकेला: ['sakela', 'साकेला', 'सकेला'],
  malbase: ['माल्बासे', 'malbase', 'malbasey'],
  माल्बासे: ['malbase', 'माल्बासे'],
  patlepani: ['पात्लेपानी', 'patlepani'],
  पात्लेपानी: ['patlepani', 'पात्लेपानी'],
  bhojpur: ['भोजपुर', 'bhojpur'],
  भोजपुर: ['bhojpur', 'भोजपुर'],
  history: ['इतिहास', 'history'],
  इतिहास: ['history', 'इतिहास'],
  culture: ['संस्कृति', 'culture', 'संस्कार'],
  संस्कृति: ['culture', 'संस्कृति'],
  civilization: ['सभ्यता', 'civilization'],
  सभ्यता: ['civilization', 'सभ्यता'],
  oral: ['मौखिक', 'oral', 'मौखिक इतिहास'],
  मौखिक: ['oral', 'मौखिक'],
  evidence: ['प्रमाण', 'evidence', 'दस्तावेज', 'document'],
  प्रमाण: ['evidence', 'प्रमाण', 'दस्तावेज'],
  research: ['अनुसन्धान', 'research'],
  अनुसन्धान: ['research', 'अनुसन्धान'],
};

/**
 * Returns true if text matches the query, including cross-script synonyms
 */
export function matchBilingualQuery(text: string, query: string): boolean {
  if (!query || !query.trim()) return true;
  if (!text) return false;

  const q = query.trim().toLowerCase();
  const lowerText = text.toLowerCase();

  // Direct match
  if (lowerText.includes(q)) return true;

  // Check aliases
  for (const [key, aliases] of Object.entries(SEARCH_ALIASES)) {
    if (q === key.toLowerCase() || aliases.some(a => a.toLowerCase().includes(q) || q.includes(a.toLowerCase()))) {
      if (aliases.some(alias => lowerText.includes(alias.toLowerCase()))) {
        return true;
      }
    }
  }

  return false;
}
