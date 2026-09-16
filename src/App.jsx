import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import IdlePageCycler from './components/IdlePageCycler';
import { MIN_VIEWPORT_WIDTH } from './backgroundModelConfig';

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

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <IdlePageCycler />
      {showModel && (
        <Suspense fallback={null}>
          <BackgroundModel />
        </Suspense>
      )}
      <Navbar />
      <main>
        <PageTransition />
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
