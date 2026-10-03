import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function localTranslationApi(apiKey: string): Plugin {
  return {
    name: 'sadan-rai-local-translation-api',
    configureServer(server) {
      server.middlewares.use('/api/translate', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        try {
          let raw = ''
          for await (const chunk of req) raw += chunk
          const body = JSON.parse(raw || '{}') as { text?: string; targetLanguage?: 'en' | 'ne' }
          const text = (body.text || '').trim()
          const targetLanguage = body.targetLanguage
          if (!text || (targetLanguage !== 'en' && targetLanguage !== 'ne')) {
            res.statusCode = 400
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ error: 'Invalid translation request' }))
            return
          }
          const target = targetLanguage === 'ne' ? 'Nepali (Devanagari)' : 'English'
          const prompt = `Translate the following archive title/name into ${target}. Preserve proper nouns, historical names, dates, and meaning. Return only the translation, with no explanation or quotation marks.\n\n${text}`
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.1, maxOutputTokens: 256 } })
          })
          const data = await response.json() as any
          const translation = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || '').join('').trim()
          res.statusCode = response.ok && translation ? 200 : 502
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(response.ok && translation ? { translation } : { error: 'Translation provider failed' }))
        } catch {
          res.statusCode = 500
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: 'Local translation request failed' }))
        }
      })
    }
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // Cloudflare Pages serves from the domain root; GitHub Pages uses the repo subpath.
    base: command === 'serve' || process.env.CF_PAGES ? '/' : '/Sadan-Rai-Archive/',
    plugins: [react(), tailwindcss(), ...(command === 'serve' && env.GEMINI_API_KEY ? [localTranslationApi(env.GEMINI_API_KEY)] : [])],
  }
})
