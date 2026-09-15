import './Hero.css';

function Hero({ introDone, onSkipIntro }) {
  const loadIn = (extra = '') => (introDone ? `load-in ${extra}`.trim() : '');

  return (
    <section id="top" className="hero">
      <button
        type="button"
        className={`hero__splash ${introDone ? 'hero__splash--hidden' : ''}`}
        aria-hidden={introDone}
        tabIndex={introDone ? -1 : 0}
        onClick={onSkipIntro}
        aria-label="Skip intro animation"
      >
        <span className="hero__splash-text">Amelia</span>
        <span className="hero__splash-skip" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"  >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </span>
      </button>

      <div className="container hero__inner">
        <div className="hero__left">
          <span className={`eyebrow ${loadIn('load-in--delay-1')}`}>Introducing</span>
          <h1 className={`hero__title ${loadIn('load-in--left load-in--delay-1')}`}>AMELIA</h1>
          <p className={`hero__tagline ${loadIn('load-in--left load-in--delay-2')}`}>
            Intelligence, reissued.
          </p>
          <div className={`hero__mark ${loadIn('load-in--delay-3')}`} aria-hidden="true">
            <span className="hero__ring hero__ring--1" />
            <span className="hero__ring hero__ring--2" />
            <span className="hero__dot" />
          </div>
        </div>

        <div className={`hero__right ${loadIn('load-in--right load-in--delay-2')}`}>
          <p className="hero__copy">
            Placeholder copy: a short, punchy description of what your AI product does and
            who it's for goes here. Swap this out for your real value proposition.
          </p>
          <a href="#approach" className="bracket-link hero__cta">
            See how it works
          </a>
          <i className="hero__caption">Placeholder trust line — no credit card required.</i>
        </div>
      </div>
    </section>
  );
}

export default Hero;
