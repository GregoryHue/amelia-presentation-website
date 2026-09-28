import { useEffect, useState } from 'react';
import AuroraBackground from './AuroraBackground';
import { isModelLoaded, markSplashPlayed, shouldShowSplash, subscribeModelLoaded } from '../splashState';
import './IntroSplash.css';

// Keeps the splash up at least this long, regardless of load speed, so it
// doesn't just flash past when the model loads instantly from cache — long
// enough for the text fade-ins below (subtitle finishes around 1.7s) to
// actually be seen.
const MIN_DISPLAY_DURATION = 1400;
// Upper bound in case loading hangs or something goes wrong — the splash
// dismisses itself either way once this fires, rather than blocking the
// site indefinitely.
const MAX_DISPLAY_DURATION = 3000;

function IntroSplash() {
  const [visible, setVisible] = useState(shouldShowSplash);
  const [minElapsed, setMinElapsed] = useState(false);
  const [modelReady, setModelReady] = useState(isModelLoaded);

  useEffect(() => {
    if (!visible) return undefined;

    const minTimer = setTimeout(() => setMinElapsed(true), MIN_DISPLAY_DURATION);
    const maxTimer = setTimeout(() => {
      setMinElapsed(true);
      setModelReady(true);
    }, MAX_DISPLAY_DURATION);
    const unsubscribe = subscribeModelLoaded(() => setModelReady(true));

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      unsubscribe();
    };
  }, [visible]);

  useEffect(() => {
    if (visible && minElapsed && modelReady) {
      markSplashPlayed();
      setVisible(false);
    }
  }, [visible, minElapsed, modelReady]);

  const handleSkip = () => {
    markSplashPlayed();
    setVisible(false);
  };

  return (
    <button
      type="button"
      className={`intro-splash ${visible ? '' : 'intro-splash--hidden'}`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={handleSkip}
      aria-label="Skip intro animation"
    >
      <AuroraBackground inline as="span" />
      <span className="intro-splash__text">amelia</span>
      <span className="intro-splash__subtitle">
        Placeholder — intelligence, reissued for the way you actually work.
      </span>
    </button>
  );
}

export default IntroSplash;
