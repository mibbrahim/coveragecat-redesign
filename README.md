# Coverage Cat — Redesign + AI Agent

A ground-up redesign of [coveragecat.com](https://www.coveragecat.com/) with a live AI insurance
assistant ("Ask Cat"), built as a growth-engineering demo.

## What's here

| Piece | Stack | Where it runs |
|---|---|---|
| [`site/`](site/) | Vite + React, no UI framework | Vercel |
| [`agent/`](agent/) | Node 20 + Express → Gemini 2.5 Flash, Docker + Caddy (auto-HTTPS) | DigitalOcean droplet |

## The redesign

- **Warm editorial minimalism** — cream paper, deep warm ink, the brand orange pulled straight
  from the original mascot illustrations (logo + images reused, as-is).
- Fraunces (display serif) + Instrument Sans (body).
- The hero *is* the product: "Ask any insurance question" is a working chat input wired to the
  live agent, not a static tagline.
- Single page, fast: no component library, one CSS file, staggered load reveal, micro-interactions.

## The agent

`POST /chat` with `{ messages: [{role, content}, …] }` → `{ reply }`.

- Gemini 2.5 Flash with a tight system prompt: scope-locked to personal P&C insurance,
  short chat-widget answers, never quotes personalized prices (steers to the intake quiz),
  one cat pun maximum per reply.
- Key stays server-side; browser only ever sees chat text.
- Caddy terminates TLS on a free `sslip.io` hostname — real Let's Encrypt cert, no domain needed.

### Deploy (droplet)

```bash
scp -r agent root@<droplet>:/root/coveragecat-agent
ssh root@<droplet> "cd /root/coveragecat-agent && cp .env.example .env && nano .env && docker compose up -d --build"
```

### Run the site locally

```bash
cd site && npm install && npm run dev
```

`VITE_AGENT_URL` overrides the agent endpoint (defaults to the live droplet gateway).
