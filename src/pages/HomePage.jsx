import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { markSplashPlayed, shouldShowSplash } from '../splashState';

const BLANK_DURATION = 1000;
const SPLASH_DURATION = 3000;

function HomePage() {
  const [introDone, setIntroDone] = useState(!shouldShowSplash());

  useEffect(() => {
    if (!shouldShowSplash()) return undefined;

    const timer = setTimeout(() => {
      markSplashPlayed();
      setIntroDone(true);
    }, BLANK_DURATION + SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const handleSkipIntro = () => {
    markSplashPlayed();
    setIntroDone(true);
  };

  return <Hero introDone={introDone} onSkipIntro={handleSkipIntro} />;
}

export default HomePage;
