import { useRef } from 'react';
import { Link } from 'react-router-dom';
import TextRotate from './TextRotate';
import TextCursorProximity from './TextCursorProximity';
import AuroraBackground from './AuroraBackground';
import { PROXIMITY_STYLES } from '../lib/proximityStyles';
import './Hero.css';

const TAGLINE_TEXTS = ['Intelligence, reissued.', 'Focus, restored.', 'Time, reclaimed.'];

function Hero({ introDone, onSkipIntro }) {
  const loadIn = (extra = '') => (introDone ? `load-in ${extra}`.trim() : '');
  const heroRightRef = useRef(null);

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
        <AuroraBackground inline as="span" />
        <span className="hero__splash-text">Amelia</span>
        <span className="hero__splash-subtitle">Placeholder — intelligence, reissued for the way you actually work.</span>
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
          <TextRotate
            texts={TAGLINE_TEXTS}
            as="p"
            mainClassName={`hero__tagline ${loadIn('load-in--left load-in--delay-2')}`}
            splitBy="words"
            staggerDuration={0.05}
            rotationInterval={2800}
          />
          <div className={`hero__mark ${loadIn('load-in--delay-3')}`} aria-hidden="true">
            <span className="hero__ring hero__ring--1" />
            <span className="hero__ring hero__ring--2" />
            <span className="hero__dot" />
          </div>
        </div>

        <div ref={heroRightRef} className={`hero__right ${loadIn('load-in--right load-in--delay-2')}`}>
          <TextCursorProximity
            as="p"
            className="hero__copy"
            containerRef={heroRightRef}
            styles={PROXIMITY_STYLES}
            radius={80}
            falloff="gaussian"
          >
            Placeholder copy: a short, punchy description of what your AI product does and who
            it's for goes here. Swap this out for your real value proposition.
          </TextCursorProximity>
          <Link to="/approach" className="bracket-link hero__cta">
            See how it works
          </Link>
          <i className="hero__caption">Placeholder trust line — no credit card required.</i>
        </div>
      </div>
    </section>
  );
}

export default Hero;
