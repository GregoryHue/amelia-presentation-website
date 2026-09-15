import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Capabilities from './components/Capabilities';
import CTA from './components/CTA';
import Footer from './components/Footer';

const SPLASH_DURATION = 3000;

function App() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), SPLASH_DURATION);
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
