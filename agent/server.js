// Coverage Cat AI agent — insurance Q&A over Gemini.
// Runs on the DigitalOcean droplet behind Caddy (HTTPS + CORS handled there
// and here, belt-and-suspenders). The Gemini key never reaches the browser.
import express from 'express'

const PORT = process.env.PORT || 8000
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.5-flash-lite'
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || '*'

if (!GOOGLE_API_KEY) {
  console.error('GOOGLE_API_KEY is required')
  process.exit(1)
}

const SYSTEM_PROMPT = `You are "Ask Cat", the AI assistant of Coverage Cat — a licensed US insurance broker
(coveragecat.com) and the easiest way to buy umbrella, auto, and home insurance.

Personality: warm, plain-spoken, occasionally a light cat pun (at most one per reply). You explain
insurance the way a sharp friend would — no jargon walls, no scare tactics.

Scope: personal property & casualty insurance — auto, home, renters, condo, and umbrella coverage,
plus general questions about deductibles, liability limits, claims, premiums, and how brokers work.
Coverage Cat operates in California, Florida, New York, Texas, and Washington.

Rules:
- Keep answers short: 2-5 sentences, or a few bullet points for comparisons. This is a chat widget.
- Be concrete with typical numbers/ranges when helpful, but say they vary by state and driver/home profile.
- Never quote an exact personalized price; instead suggest the Coverage Cat quiz at app.coveragecat.com/intake
  for real quotes (mention it at most once per conversation, and only when relevant).
- Coverage Cat never sells user data, never spam-calls. We show every option in our database even when
  we earn no commission on it.
- You are not a lawyer or financial advisor; for legal/tax specifics, say a licensed professional should confirm.
- If asked something outside insurance, politely steer back in one sentence.
- Use markdown sparingly: **bold** for key terms, "-" bullets for lists. No headings, no tables.`

const app = express()
app.use(express.json({ limit: '64kb' }))

// CORS — Caddy also sets these; keep both consistent.
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', ALLOW_ORIGIN)
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.get('/healthz', (_req, res) => res.json({ ok: true, model: MODEL }))

app.post('/chat', async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : []
    if (messages.length === 0) return res.status(400).json({ error: 'messages required' })

    // Keep the context window small — last 12 turns is plenty for a widget.
    const contents = messages.slice(-12).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '').slice(0, 4000) }],
    }))

    const payload = JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.6, maxOutputTokens: 600 },
    })

    // Gemini occasionally sheds load with 503s — retry, then fall back to the
    // lite model rather than surfacing an error in the chat widget.
    const attempts = [MODEL, MODEL, FALLBACK_MODEL]
    let r
    for (let i = 0; i < attempts.length; i++) {
      r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${attempts[i]}:generateContent?key=${GOOGLE_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload },
      )
      if (r.ok) break
      const body = await r.text()
      console.error(`Gemini error (${attempts[i]})`, r.status, body.slice(0, 300))
      if (r.status !== 503 && r.status !== 429) break
      if (i < attempts.length - 1) await new Promise((s) => setTimeout(s, 700 * (i + 1)))
    }

    if (!r.ok) return res.status(502).json({ error: 'upstream error' })

    const data = await r.json()
    const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
    if (!reply) return res.status(502).json({ error: 'empty reply' })
    res.json({ reply })
  } catch (err) {
    console.error('chat failed', err)
    res.status(500).json({ error: 'internal error' })
  }
})

app.listen(PORT, () => console.log(`coveragecat-agent listening on :${PORT} (model ${MODEL})`))
