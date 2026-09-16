import { useEffect, useState } from 'react';
import Hero from '../components/Hero';

const BLANK_DURATION = 1000;
const SPLASH_DURATION = 3000;

// Module-scoped so it survives client-side navigation back to "/" but
// resets on an actual page reload.
let hasPlayedIntro = false;

function HomePage() {
  const [introDone, setIntroDone] = useState(hasPlayedIntro);

  useEffect(() => {
    if (hasPlayedIntro) return undefined;

    const timer = setTimeout(() => {
      hasPlayedIntro = true;
      setIntroDone(true);
    }, BLANK_DURATION + SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const handleSkipIntro = () => {
    hasPlayedIntro = true;
    setIntroDone(true);
  };

  return <Hero introDone={introDone} onSkipIntro={handleSkipIntro} />;
}

export default HomePage;
