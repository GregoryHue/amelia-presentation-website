import './Hero.css';

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero__inner">
        <div className="hero__left">
          <span className="eyebrow load-in">Introducing</span>
          <h1 className="hero__title load-in load-in--left">AMELIA</h1>
          <p className="hero__tagline load-in load-in--left load-in--delay-1">
            Intelligence, reissued.
          </p>
          <div className="hero__mark load-in load-in--delay-2" aria-hidden="true">
            <span className="hero__ring hero__ring--1" />
            <span className="hero__ring hero__ring--2" />
            <span className="hero__dot" />
          </div>
        </div>

        <div className="hero__right load-in load-in--right load-in--delay-1">
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
