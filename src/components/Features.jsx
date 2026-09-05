import './Features.css';

const ICONS = {
  bolt: (
    <path d="M13 2 3 14h7l-1 8 11-14h-7l0-6Z" />
  ),
  shield: (
    <path d="M12 2l8 3.5v6c0 5-3.4 8.9-8 10.5-4.6-1.6-8-5.5-8-10.5v-6L12 2Z" />
  ),
  chat: (
    <path d="M4 4h16v12H8l-4 4V4Z" />
  ),
  layers: (
    <path d="M12 2 2 8l10 6 10-6-10-6ZM2 14l10 6 10-6M2 10l10 6 10-6" />
  ),
  gauge: (
    <path d="M12 3a9 9 0 1 0 9 9M12 3v3M12 12l5-4" />
  ),
  lock: (
    <path d="M6 11V7a6 6 0 1 1 12 0v4M4 11h16v10H4V11Z" />
  ),
};

const FEATURES = [
  {
    icon: 'bolt',
    title: 'Placeholder Speed',
    body: 'Short description of a key benefit — swap in the real performance story here.',
  },
  {
    icon: 'shield',
    title: 'Placeholder Security',
    body: 'Explain how the product keeps user data safe, compliant, and under control.',
  },
  {
    icon: 'chat',
    title: 'Placeholder Interface',
    body: 'Describe the interaction model — chat, API, workflow, whatever fits the product.',
  },
  {
    icon: 'layers',
    title: 'Placeholder Integrations',
    body: 'List the ecosystems and tools this connects to, or the platforms it runs on.',
  },
  {
    icon: 'gauge',
    title: 'Placeholder Insights',
    body: 'Highlight the analytics, reporting, or feedback loop your product provides.',
  },
  {
    icon: 'lock',
    title: 'Placeholder Control',
    body: 'Cover permissions, governance, or customization options available to teams.',
  },
];

function Features() {
  return (
    <section id="features" className="features section-pad">
      <div className="container">
        <div className="features__head">
          <span className="eyebrow features__eyebrow">What it does</span>
          <h2 className="features__title">BUILT FOR THE WAY YOU WORK</h2>
          <p className="features__subtitle">
            Placeholder section intro — one or two sentences framing the feature grid below.
          </p>
        </div>

        <div className="features__grid">
          {FEATURES.map((feature, i) => (
            <div className="feature-card" key={feature.title}>
              <span className="feature-card__index">{String(i + 1).padStart(2, '0')}</span>
              <svg
                viewBox="0 0 24 24"
                className="feature-card__icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {ICONS[feature.icon]}
              </svg>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
