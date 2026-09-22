import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './PageTransition.css';

// Code-split per route: visiting Home shouldn't also pull down Team's
// (AnimatedTestimonials + motion) or Approach/Contact's code upfront.
const HomePage = lazy(() => import('../pages/HomePage'));
const ApproachPage = lazy(() => import('../pages/ApproachPage'));
const TeamPage = lazy(() => import('../pages/TeamPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));

const FADE_DURATION = 250;

function PageTransition() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setFading(!reduceMotion);
    timerRef.current = setTimeout(
      () => {
        window.scrollTo(0, 0);
        setDisplayLocation(location);
        setFading(false);
      },
      reduceMotion ? 0 : FADE_DURATION
    );

    return () => clearTimeout(timerRef.current);
  }, [location, displayLocation]);

  return (
    <div className={`page-fade ${fading ? 'page-fade--out' : ''}`}>
      <Suspense fallback={null}>
        <Routes location={displayLocation}>
          <Route path="/" element={<HomePage />} />
          <Route path="/approach" element={<ApproachPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default PageTransition;
