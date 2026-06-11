import { useEffect, useRef, useState } from 'react'
import { askAgent } from './agent.js'

// Tiny markdown renderer: bold, italics, lists, paragraphs. Enough for chat.
function renderMarkdown(text) {
  const esc = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const html = esc
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split('\n')
      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${l.replace(/^\s*[-*]\s+/, '')}</li>`).join('')}</ul>`
      }
      return `<p>${block.replace(/\n/g, '<br/>')}</p>`
    })
    .join('')
  return { __html: html }
}

const SUGGESTIONS = [
  'Do I need umbrella insurance?',
  'What does collision coverage actually cover?',
  'How much home insurance should I carry?',
]

export default function ChatWidget({ open, setOpen, seedQuestion, onSeedConsumed }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  const send = async (text) => {
    const q = (text ?? input).trim()
    if (!q || busy) return
    setInput('')
    setError(null)
    const next = [...messages, { role: 'user', content: q }]
    setMessages(next)
    setBusy(true)
    try {
      const reply = await askAgent(next)
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch {
      setError('The agent could not be reached. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (open && seedQuestion) {
      send(seedQuestion)
      onSeedConsumed()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, seedQuestion])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  return (
    <>
      <button
        className={`chat-fab ${open ? 'chat-fab--hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Ask Coverage Cat"
      >
        <img src="/images/cat-umbrella.webp" alt="" />
        <span>Ask Cat</span>
      </button>

      <div className={`chat-panel ${open ? 'chat-panel--open' : ''}`} role="dialog" aria-label="Coverage Cat assistant">
        <header className="chat-head">
          <img src="/images/cat-umbrella.webp" alt="" />
          <div>
            <strong>Ask Cat</strong>
            <span>AI insurance assistant · live</span>
          </div>
          <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
        </header>

        <div className="chat-scroll" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="chat-empty">
              <p>Meow! Ask me anything about auto, home, renters, or umbrella insurance.</p>
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="msg msg--user">{m.content}</div>
            ) : (
              <div key={i} className="msg msg--bot" dangerouslySetInnerHTML={renderMarkdown(m.content)} />
            ),
          )}
          {busy && (
            <div className="msg msg--bot msg--typing">
              <span /><span /><span />
            </div>
          )}
          {error && <div className="chat-error">{error}</div>}
        </div>

        <form
          className="chat-form"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask any insurance question…"
            aria-label="Your question"
          />
          <button type="submit" disabled={busy || !input.trim()}>Send</button>
        </form>
      </div>
    </>
  )
}
