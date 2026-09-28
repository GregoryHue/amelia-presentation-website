// Shared between IntroSplash (which owns the splash overlay) and
// BackgroundModel (which reports when the 3D model has finished loading,
// so the splash knows it's safe to auto-dismiss) — without prop-drilling
// or a React context, since these live at unrelated points in the tree.
let hasPlayedIntro = false;
const splashListeners = new Set();

// True until the intro has completed (or been skipped) for this session
// (i.e. this page load — a real browser reload resets it, client-side
// route changes within the app don't).
export function shouldShowSplash() {
  return !hasPlayedIntro;
}

export function markSplashPlayed() {
  if (hasPlayedIntro) return;
  hasPlayedIntro = true;
  splashListeners.forEach((fn) => fn());
}

export function subscribeSplashPlayed(fn) {
  splashListeners.add(fn);
  return () => splashListeners.delete(fn);
}

let modelLoaded = false;
const modelListeners = new Set();

// True once the background 3D model has either finished loading (or
// failed to, or was never going to load at all on a narrow viewport) —
// whatever the outcome, there's nothing left for the splash to wait on.
export function isModelLoaded() {
  return modelLoaded;
}

export function markModelLoaded() {
  if (modelLoaded) return;
  modelLoaded = true;
  modelListeners.forEach((fn) => fn());
}

export function subscribeModelLoaded(fn) {
  modelListeners.add(fn);
  return () => modelListeners.delete(fn);
}
