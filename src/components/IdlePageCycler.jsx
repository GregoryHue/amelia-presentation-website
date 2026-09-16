import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './IdlePageCycler.css';

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
  // The bar goes false (disappears immediately) the moment real activity
  // interrupts the cycle. `barKey` bumps on every new segment so the bar
  // element remounts and its CSS fill animation restarts from empty.
  const [barVisible, setBarVisible] = useState(false);
  const [barDuration, setBarDuration] = useState(IDLE_DELAY);
  const [barKey, setBarKey] = useState(0);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  // Runs once: the timer/listener lifecycle must not reset just because
  // `navigate` or `location` change identity on every route change.
  useEffect(() => {
    // Whether the user has ever actually interacted with the page. Before
    // that, there's nothing to "stop" yet, so the very first idle wait
    // (e.g. right after loading the Home page) still gets a countdown bar
    // — otherwise the first automatic switch of a session always happened
    // with zero warning. Once the user interacts, an idle wait triggered
    // by that interaction goes back to being silent until it actually
    // resolves into cycling.
    const hasInteractedRef = { current: false };

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
      setBarVisible(true);
      setBarDuration(CYCLE_INTERVAL);
      setBarKey((k) => k + 1);
      cycleTimerRef.current = setInterval(() => {
        goToNextPage();
        setBarKey((k) => k + 1);
      }, CYCLE_INTERVAL);
    };

    const armIdleTimer = () => {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(startCycling, IDLE_DELAY);
    };

    // Used both for real user activity and for the initial arm at mount.
    const resetIdleTimer = (isRealActivity) => {
      stopCycling();
      if (isRealActivity) {
        hasInteractedRef.current = true;
      }
      setBarVisible(false);
      clearTimeout(idleTimerRef.current);
      // Once the user has ever interacted, cycling is done for good — no
      // re-arming, silent or otherwise.
      if (hasInteractedRef.current) return;
      setBarVisible(true);
      setBarDuration(IDLE_DELAY);
      setBarKey((k) => k + 1);
      armIdleTimer();
    };

    const handleActivity = () => resetIdleTimer(true);

    const handleVisibility = () => {
      if (document.hidden) {
        stopCycling();
        setBarVisible(false);
        clearTimeout(idleTimerRef.current);
      } else {
        resetIdleTimer(hasInteractedRef.current);
      }
    };

    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));
    document.addEventListener('visibilitychange', handleVisibility);

    resetIdleTimer(false);

    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, handleActivity));
      document.removeEventListener('visibilitychange', handleVisibility);
      clearTimeout(idleTimerRef.current);
      stopCycling();
    };
  }, []);

  if (!barVisible) return null;

  return (
    <div
      key={barKey}
      className="idle-progress-bar"
      style={{ animationDuration: `${barDuration}ms` }}
      aria-hidden="true"
    />
  );
}

export default IdlePageCycler;
