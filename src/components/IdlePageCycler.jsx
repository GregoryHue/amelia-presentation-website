import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ROUTES = ['/', '/approach', '/contact'];
const IDLE_DELAY = 10000;
const CYCLE_INTERVAL = 8000;
// Deliberately excludes 'scroll': our own auto-navigation calls
// window.scrollTo(0, 0), which fires a scroll event that would otherwise
// look like user activity and stall the cycle. 'wheel' already covers
// real user-initiated scrolling (mouse wheel and most trackpads).
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'wheel'];

function IdlePageCycler() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);
  const navigateRef = useRef(navigate);
  const idleTimerRef = useRef(null);
  const cycleTimerRef = useRef(null);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  // Runs once: the timer/listener lifecycle must not reset just because
  // `navigate` or `location` change identity on every route change.
  useEffect(() => {
    const stopCycling = () => {
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
    };

    const goToNextPage = () => {
      const currentIndex = ROUTES.indexOf(locationRef.current.pathname);
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % ROUTES.length;
      navigateRef.current(ROUTES[nextIndex]);
    };

    const startCycling = () => {
      stopCycling();
      goToNextPage();
      cycleTimerRef.current = setInterval(goToNextPage, CYCLE_INTERVAL);
    };

    const resetIdleTimer = () => {
      stopCycling();
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(startCycling, IDLE_DELAY);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stopCycling();
        clearTimeout(idleTimerRef.current);
      } else {
        resetIdleTimer();
      }
    };

    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, resetIdleTimer, { passive: true }));
    document.addEventListener('visibilitychange', handleVisibility);

    resetIdleTimer();

    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
      document.removeEventListener('visibilitychange', handleVisibility);
      clearTimeout(idleTimerRef.current);
      stopCycling();
    };
  }, []);

  return null;
}

export default IdlePageCycler;
