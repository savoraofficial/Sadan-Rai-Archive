/**
 * Bilingual translation bridge used by all paired English/Nepali archive fields.
 *
 * Priority:
 *  1. The project's secure /api/translate endpoint (Gemini on Cloudflare/local).
 *  2. A small offline archive vocabulary fallback for common labels/names.
 *  3. Google public translation endpoint as a last-resort browser fallback.
 *
 * The UI always keeps the generated value editable; callers decide whether a
 * later source edit may overwrite it.
 */
const OFFLINE_EN_TO_NE: Record<string, string> = {
  'short': 'छोटो', 'short title': 'छोटो शीर्षक', 'long': 'लामो', 'title': 'शीर्षक', 'name': 'नाम', 'nepal': 'नेपाल', 'nepali': 'नेपाली', 'history': 'इतिहास', 'culture': 'संस्कृति',
  'civilization': 'सभ्यता', 'oral history': 'मौखिक इतिहास', 'village': 'गाउँ',
  'village history': 'गाउँको इतिहास', 'local history': 'स्थानीय इतिहास',
  'ancient history': 'प्राचीन इतिहास', 'medieval history': 'मध्यकालीन इतिहास',
  'modern history': 'आधुनिक इतिहास', 'comparative history': 'तुलनात्मक इतिहास',
  'buddhist history': 'बौद्ध इतिहास', 'kirat history': 'किरात इतिहास',
  'himalayan history': 'हिमाली इतिहास', 'religion': 'धर्म', 'tradition': 'परम्परा',
  'traditions': 'परम्पराहरू', 'language': 'भाषा', 'linguistics': 'भाषाविज्ञान',
  'archaeology': 'पुरातत्व', 'evidence': 'प्रमाण', 'research': 'अनुसन्धान',
  'source': 'स्रोत', 'sources': 'स्रोतहरू', 'author': 'लेखक', 'researcher': 'अनुसन्धानकर्ता',
  'community': 'समुदाय', 'location': 'स्थान', 'place': 'स्थान', 'culture, religion & traditions': 'संस्कृति, धर्म तथा परम्परा',
  'history & civilization': 'इतिहास तथा सभ्यता', 'places & local history': 'स्थान तथा स्थानीय इतिहास',
  'oral traditions': 'मौखिक परम्पराहरू', 'identity': 'पहिचान',
  'photograph': 'तस्बिर', 'photo': 'तस्बिर', 'video': 'भिडियो', 'document': 'दस्तावेज',
  'date': 'मिति', 'period': 'कालखण्ड', 'evidence details': 'प्रमाण विवरण',
  'rights and permission': 'अधिकार तथा अनुमति', 'rights': 'अधिकार', 'permission': 'अनुमति',
  'sadan rai': 'सदन राई', 'about sadan rai': 'सदन राईको बारेमा',
  'history, civilization & culture archive': 'इतिहास, सभ्यता तथा संस्कृति अभिलेखालय',
  'our identity: preserving history, civilization, and culture together.': 'हाम्रो पहिचान: इतिहास, सभ्यता र संस्कृतिको साझा संरक्षण।',
  'responsible documentation through evidence': 'प्रमाणमा आधारित जिम्मेवार अभिलेखीकरण',
  'malbase-1, patlepani': 'माल्बासे–१, पात्लेपानी',
  'hatuwagadhi, bhojpur, nepal': 'हतुवागढी, भोजपुर, नेपाल'
};

const OFFLINE_NE_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(OFFLINE_EN_TO_NE).map(([en, ne]) => [ne.toLowerCase(), en])
);

function offlineTranslate(text: string, targetLanguage: 'en' | 'ne'): string | null {
  const key = text.trim().toLowerCase();
  if (targetLanguage === 'ne' && OFFLINE_EN_TO_NE[key]) return OFFLINE_EN_TO_NE[key];
  if (targetLanguage === 'en' && OFFLINE_NE_TO_EN[key]) return OFFLINE_NE_TO_EN[key];
  return null;
}

async function publicGoogleTranslate(text: string, targetLanguage: 'en' | 'ne'): Promise<string | null> {
  try {
    const source = /[\u0900-\u097F]/.test(text) ? 'ne' : 'en';
    const target = targetLanguage === 'ne' ? 'ne' : 'en';
    if (source === target) return text;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) return null;
    const payload = await response.json() as unknown;
    if (!Array.isArray(payload) || !Array.isArray(payload[0])) return null;
    const translated = (payload[0] as unknown[])
      .map(part => Array.isArray(part) ? String(part[0] || '') : '')
      .join('')
      .trim();
    return translated || null;
  } catch {
    return null;
  }
}

export async function translateArchiveText(text: string, targetLanguage: 'en' | 'ne'): Promise<string | null> {
  const value = text.trim();
  if (value.length < 2) return null;

  // Resolve the local archive vocabulary first. This makes common fields
  // (for example, `short` -> `छोटो`) work immediately in local Vite runs,
  // without waiting for a serverless/API route that may not exist in dev.
  const offline = offlineTranslate(value, targetLanguage);
  if (offline) return offline;

  // For text outside the local vocabulary, use the secure API when deployed.
  // A missing/failed local API must never prevent the bilingual field from
  // reaching the browser fallback.
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: value, targetLanguage }),
      signal: AbortSignal.timeout(5000)
    });
    if (response.ok) {
      const payload = await response.json() as { translation?: string };
      if (typeof payload.translation === 'string' && payload.translation.trim()) {
        return payload.translation.trim();
      }
    }
  } catch {
    // Continue through safe browser fallback.
  }

  return publicGoogleTranslate(value, targetLanguage);
}
