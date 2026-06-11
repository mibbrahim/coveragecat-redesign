import { useState } from 'react'
import ChatWidget from './ChatWidget.jsx'

const PRODUCTS = [
  {
    img: '/images/auto.webp',
    name: 'Auto',
    blurb: 'Real prices from dozens of carriers, side by side. No callbacks, no haggling.',
  },
  {
    img: '/images/home.webp',
    name: 'Home',
    blurb: 'Coverage that actually matches your house — not a one-size-fits-all bundle.',
  },
  {
    img: '/images/cat-umbrella.webp',
    name: 'Umbrella',
    blurb: 'A million dollars of extra liability protection, often for under $1/day.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Tell us once',
    body: 'One short quiz. No repeating your details across a dozen carrier forms.',
  },
  {
    n: '02',
    title: 'See every option',
    body: 'We show the best quotes from our database of millions of prices — even when we earn nothing on them.',
  },
  {
    n: '03',
    title: 'Buy in minutes',
    body: 'Pick a policy and bind it online. No spam, no sales calls, ever.',
  },
]

const CALCULATORS = [
  { name: 'Carrier price comparison', href: 'https://www.coveragecat.com/calculators/' },
  { name: 'Collision & comprehensive', href: 'https://www.coveragecat.com/calculators/' },
  { name: 'Should I file a claim?', href: 'https://www.coveragecat.com/calculators/' },
  { name: 'Home insurance calculator', href: 'https://www.coveragecat.com/calculators/' },
  { name: 'Umbrella calculator', href: 'https://www.coveragecat.com/calculators/' },
]

export default function App() {
  const [chatOpen, setChatOpen] = useState(false)
  const [seed, setSeed] = useState(null)
  const [heroQ, setHeroQ] = useState('')

  const askFromHero = (e) => {
    e.preventDefault()
    const q = heroQ.trim()
    if (!q) return
    setSeed(q)
    setHeroQ('')
    setChatOpen(true)
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <nav className="nav">
        <a className="nav-logo" href="/">
          <img src="/images/logo.webp" alt="Coverage Cat" />
        </a>
        <div className="nav-links">
          <a href="#insurance">Insurance</a>
          <a href="#why">Why us</a>
          <a href="#how">How it works</a>
          <a href="#calculators">Calculators</a>
        </div>
        <div className="nav-cta">
          <a className="btn btn--ghost" href="https://app.coveragecat.com/login">Log in</a>
          <a className="btn btn--solid" href="https://app.coveragecat.com/intake">Get quotes</a>
        </div>
      </nav>

      <main id="main">
        {/* ---------------- Hero ---------------- */}
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow reveal">The AI-native insurance broker</p>
            <h1 className="reveal d1">
              Ask any <em>insurance</em> question.
            </h1>
            <p className="lede reveal d2">
              Coverage Cat is the easiest way to buy umbrella, auto, and home
              insurance. We don't sell your information — no spam, and no calls.
            </p>
            <form className="askbar reveal d3" onSubmit={askFromHero}>
              <input
                value={heroQ}
                onChange={(e) => setHeroQ(e.target.value)}
                placeholder='Try "Do I need umbrella insurance?"'
                aria-label="Ask any insurance question"
              />
              <button type="submit">Ask Cat</button>
            </form>
            <p className="hero-proof reveal d4">
              <span className="stars" aria-hidden="true">★★★★★</span>
              <strong>4.9</strong> across <strong>26,977</strong> users served
            </p>
          </div>
          <div className="hero-art reveal d2">
            <div className="hero-blob" aria-hidden="true" />
            <img src="/images/cat-umbrella.webp" alt="Coverage Cat mascot holding an umbrella" />
          </div>
        </section>

        {/* ---------------- Trust strip ---------------- */}
        <section className="strip">
          <span>Licensed insurance broker</span>
          <span className="dot" aria-hidden="true" />
          <span>BBB accredited</span>
          <span className="dot" aria-hidden="true" />
          <span>CA · FL · NY · TX · WA</span>
          <span className="dot" aria-hidden="true" />
          <span>Your data is never sold</span>
        </section>

        {/* ---------------- Products ---------------- */}
        <section className="section" id="insurance">
          <div className="section-head">
            <h2>Three policies.<br />One honest answer.</h2>
            <p>
              Quotes for the coverage that protects almost everything you own —
              compared in one place, in plain English.
            </p>
          </div>
          <div className="cards">
            {PRODUCTS.map((p) => (
              <article className="card" key={p.name}>
                <div className="card-img">
                  <img src={p.img} alt={`${p.name} insurance illustration`} loading="lazy" />
                </div>
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
                <a className="card-link" href="https://app.coveragecat.com/intake">
                  Get a {p.name.toLowerCase()} quote <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- Why ---------------- */}
        <section className="why" id="why">
          <div className="why-inner">
            <h2>We show you the best option, <em>even if we won't get paid for it.</em></h2>
            <p>
              Traditional marketplaces only show you the carriers that pay them.
              Coverage Cat displays every option in our database regardless of
              commission — because insurance works better when you can see what
              it actually costs.
            </p>
            <div className="why-stats">
              <div>
                <strong>Millions</strong>
                <span>of real prices in our database</span>
              </div>
              <div>
                <strong>100+</strong>
                <span>carriers reviewed in depth</span>
              </div>
              <div>
                <strong>$0</strong>
                <span>cost to you — free for everyone</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- How it works ---------------- */}
        <section className="section" id="how">
          <div className="section-head">
            <h2>How it works</h2>
            <p>From "what even is umbrella insurance?" to fully covered — without a single phone call.</p>
          </div>
          <ol className="steps">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------- Calculators ---------------- */}
        <section className="calcs" id="calculators">
          <div className="calcs-head">
            <h2>Do the math first</h2>
            <p>Free calculators built on real pricing data — no email required.</p>
          </div>
          <div className="calc-links">
            {CALCULATORS.map((c) => (
              <a key={c.name} href={c.href} target="_blank" rel="noreferrer">
                {c.name} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        {/* ---------------- CTA ---------------- */}
        <section className="cta">
          <img src="/images/cat-umbrella.webp" alt="" aria-hidden="true" />
          <h2>Insurance without the spam.</h2>
          <p>Take the two-minute quiz and see your real options.</p>
          <a className="btn btn--solid btn--big" href="https://app.coveragecat.com/intake">Take the quiz</a>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/images/logo.webp" alt="Coverage Cat" />
            <p>The easiest way to buy insurance.</p>
            <p className="footer-mail">
              <a href="mailto:support@coveragecat.com">support@coveragecat.com</a>
            </p>
          </div>
          <div className="footer-col">
            <h4>Coverage Cat</h4>
            <a href="https://www.coveragecat.com/blog/">Blog</a>
            <a href="https://www.coveragecat.com/faq/">FAQ</a>
            <a href="https://www.coveragecat.com/glossary/">Glossary</a>
            <a href="https://www.coveragecat.com/team/">Our team</a>
          </div>
          <div className="footer-col">
            <h4>Calculators</h4>
            <a href="https://www.coveragecat.com/calculators/">Price comparison</a>
            <a href="https://www.coveragecat.com/calculators/">Claims guidance</a>
            <a href="https://www.coveragecat.com/calculators/">Home & umbrella</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="https://www.coveragecat.com/terms/">Terms of service</a>
            <a href="https://www.coveragecat.com/privacy/">Privacy policy</a>
            <a href="https://www.coveragecat.com/refund-policy/">Refund policy</a>
          </div>
        </div>
        <div className="footer-legal">
          <p>
            Coverage Cat, Inc. is a licensed insurance broker (or producer). In California, Coverage Cat
            does business as Coverage Cat Insurance Services. Coverage Cat places insurance with a number
            of insurance companies, each of which is not an affiliate of Coverage Cat.
          </p>
          <p>© 2026 Coverage Cat. All rights reserved.</p>
        </div>
      </footer>

      <ChatWidget
        open={chatOpen}
        setOpen={setChatOpen}
        seedQuestion={seed}
        onSeedConsumed={() => setSeed(null)}
      />
    </>
  )
}
