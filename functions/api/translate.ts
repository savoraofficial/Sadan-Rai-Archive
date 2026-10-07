interface Env { GEMINI_API_KEY?: string }

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json() as { text?: string; targetLanguage?: 'en' | 'ne' };
    const text = (body.text || '').trim();
    const targetLanguage = body.targetLanguage;
    if (!text || (targetLanguage !== 'en' && targetLanguage !== 'ne')) {
      return new Response(JSON.stringify({ error: 'Invalid translation request' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }
    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Translation service is not configured' }), { status: 503, headers: { 'content-type': 'application/json' } });
    }
    const target = targetLanguage === 'ne' ? 'Nepali (Devanagari)' : 'English';
    const prompt = `Translate the following archive title/name into ${target}. Preserve proper nouns, historical names, dates, and meaning. Return only the translation, with no explanation or quotation marks.\n\n${text}`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.1, maxOutputTokens: 256 } })
    });
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Translation provider failed' }), { status: 502, headers: { 'content-type': 'application/json' } });
    }
    const data = await response.json() as any;
    const translation = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || '').join('').trim();
    if (!translation) return new Response(JSON.stringify({ error: 'No translation returned' }), { status: 502, headers: { 'content-type': 'application/json' } });
    return new Response(JSON.stringify({ translation }), { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
  } catch {
    return new Response(JSON.stringify({ error: 'Translation request failed' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
};
