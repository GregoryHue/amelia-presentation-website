import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ApproachPage from '../pages/ApproachPage';
import ContactPage from '../pages/ContactPage';
import './PageTransition.css';

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
      <Routes location={displayLocation}>
        <Route path="/" element={<HomePage />} />
        <Route path="/approach" element={<ApproachPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </div>
  );
}

export default PageTransition;
