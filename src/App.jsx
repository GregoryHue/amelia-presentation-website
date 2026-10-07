import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import IdlePageCycler from './components/IdlePageCycler';
import AuroraBackground from './components/AuroraBackground';
import IntroSplash from './components/IntroSplash';
import ThemeToggle from './components/ThemeToggle';
import { MIN_VIEWPORT_WIDTH } from './backgroundModelConfig';
import { markModelLoaded } from './splashState';

// Code-split: three.js is a heavy dependency that only earns its keep on
// viewports wide enough to actually show the model (see BackgroundModel.css).
const BackgroundModel = lazy(() => import('./components/BackgroundModel'));

function App() {
  const [showModel, setShowModel] = useState(() => window.innerWidth >= MIN_VIEWPORT_WIDTH);

  useEffect(() => {
    const onResize = () => setShowModel(window.innerWidth >= MIN_VIEWPORT_WIDTH);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    // Below the width threshold, BackgroundModel never even mounts (see
    // below), so nothing will ever call markModelLoaded() for it — tell
    // the splash there's nothing to wait for, or it'd sit until its
    // fallback timeout every time on a narrow viewport.
    if (!showModel) markModelLoaded();
  }, [showModel]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <IntroSplash />
      <IdlePageCycler />
      <AuroraBackground />
      {showModel && (
        <Suspense fallback={null}>
          <BackgroundModel />
        </Suspense>
      )}
      <Navbar />
      <ThemeToggle />
      <main>
        <PageTransition />
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
