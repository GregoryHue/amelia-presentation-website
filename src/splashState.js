// Shared between HomePage (which owns the splash) and BackgroundModel
// (which needs to know whether the splash is currently covering Home, so
// it can render above it) — without prop-drilling or a React context.
let hasPlayedIntro = false;
const listeners = new Set();

// True until the intro has completed (or been skipped) for this session.
export function shouldShowSplash() {
  return !hasPlayedIntro;
}

export function markSplashPlayed() {
  if (hasPlayedIntro) return;
  hasPlayedIntro = true;
  listeners.forEach((fn) => fn());
}

export function subscribeSplashPlayed(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
