import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import TextRotate from './TextRotate';
import TextCursorProximity from './TextCursorProximity';
import { useProximityStyles } from '../lib/proximityStyles';
import { shouldShowSplash, subscribeSplashPlayed } from '../splashState';
import './Hero.css';

const TAGLINE_TEXTS = ['Agentic AI.', 'Biotech & genetics.'];

function Hero() {
  const proximityStyles = useProximityStyles();
  // IntroSplash (mounted at the App level, covering every page) hides the
  // hero on first load regardless of route. Once it's dismissed, play the
  // entrance animation below — same as if the splash had never covered it.
  const [ready, setReady] = useState(!shouldShowSplash());
  const heroRightRef = useRef(null);

  useEffect(() => {
    if (ready) return undefined;
    return subscribeSplashPlayed(() => setReady(true));
  }, [ready]);

  const loadIn = (extra = '') => (ready ? `load-in ${extra}`.trim() : '');

  return (
    <section id="top" className="hero">
      <div className="container hero__inner">
        <div className="hero__left">
          <h1 className={`hero__title ${loadIn('load-in--left load-in--delay-1')}`}>Amelia</h1>
          <TextRotate
            texts={TAGLINE_TEXTS}
            as="p"
            mainClassName={`hero__tagline ${loadIn('load-in--left load-in--delay-2')}`}
            splitBy="words"
            staggerDuration={0.15}
            rotationInterval={3500}
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ type: 'tween', duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        <div ref={heroRightRef} className={`hero__right ${loadIn('load-in--right load-in--delay-2')}`}>
          <TextCursorProximity
            as="p"
            className="hero__copy"
            containerRef={heroRightRef}
            styles={proximityStyles}
            radius={80}
            falloff="gaussian"
          >
            Amelia is an agentic AI optimised for research and product design in the biotech industry. Give her a research question, upload your data and she plans the work, runs the analyses, and reports back with evidence you can check.
          </TextCursorProximity>
          <Link to="/approach" className="bracket-link hero__cta">
            See how it works
          </Link>
          <i className="hero__caption">Developed by COFEE · Private pilots now open.</i>
        </div>
      </div>
    </section>
  );
}

export default Hero;
