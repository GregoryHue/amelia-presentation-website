import './Hero.css';

function Hero() {
  return (
    <section id="top" className="hero section-pad">
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="eyebrow hero__eyebrow">Introducing Amelia</span>
          <h1 className="hero__title">
            INTELLIGENCE,
            <br />
            REISSUED.
          </h1>
          <p className="hero__subtitle">
            Placeholder copy: a short, punchy description of what your AI product does and
            who it's for goes here. Swap this out for your real value proposition.
          </p>
          <div className="hero__actions">
            <a href="#get-started" className="btn btn-primary">
              Get Started Free
            </a>
            <a href="#demo" className="btn btn-outline">
              Watch Demo
            </a>
          </div>
          <div className="hero__meta">
            <span className="mark hero__meta-mark" aria-hidden="true" />
            No credit card required &middot; Placeholder trust line
          </div>
        </div>

        <div className="hero__art" aria-hidden="true">
          <div className="hero__grid">
            <div className="hero__tile hero__tile--navy hero__tile--dots" />
            <div className="hero__tile hero__tile--red">
              <svg viewBox="0 0 100 100" className="hero__icon">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--cream)" strokeWidth="3" />
                <circle cx="50" cy="50" r="24" fill="none" stroke="var(--cream)" strokeWidth="3" />
                <circle cx="50" cy="50" r="7" fill="var(--cream)" />
              </svg>
            </div>
            <div className="hero__tile hero__tile--navy">
              <svg viewBox="0 0 100 70" className="hero__icon hero__icon--bird">
                <path
                  fill="var(--cream)"
                  d="M50 8c3 6 2 12-3 17 9-2 16-7 20-15-3 12-11 20-23 23-3 8-10 14-19 17 6-6 9-12 9-19-10-1-19-7-24-17 9 6 18 8 26 5-3-6-3-12 0-18 2 5 6 8 11 9 1-1 2-1 3-2Z"
                />
              </svg>
            </div>
            <div className="hero__tile hero__tile--cream-dots" />
          </div>
          <span className="hero__ring" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
