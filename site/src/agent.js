// Client for the Coverage Cat AI agent running on DigitalOcean.
// The agent keeps the Gemini key server-side; the browser only sends chat turns.
const AGENT_URL =
  import.meta.env.VITE_AGENT_URL || 'https://168-144-144-87.sslip.io/coveragecat'

export async function askAgent(messages) {
  const res = await fetch(`${AGENT_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  if (!res.ok) throw new Error(`Agent error ${res.status}`)
  const data = await res.json()
  return data.reply
}
