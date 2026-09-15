import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Capabilities from './components/Capabilities';
import CTA from './components/CTA';
import Footer from './components/Footer';

const BLANK_DURATION = 1000;
const SPLASH_DURATION = 2000;

function App() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), BLANK_DURATION + SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero introDone={introDone} onSkipIntro={() => setIntroDone(true)} />
        <Capabilities />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

export default App;
