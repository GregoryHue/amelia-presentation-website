// Light/dark theme, shared the same way as splashState: a tiny module-level
// store instead of a React context. The active theme lives on
// <html data-theme="…">, which the CSS tokens in index.css key off — an
// inline script in index.html sets it before first paint so there's no
// flash of the wrong theme.
const STORAGE_KEY = 'theme';
const listeners = new Set();

function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');

function apply(theme) {
  if (document.documentElement.dataset.theme === theme) return;
  document.documentElement.dataset.theme = theme;
  listeners.forEach((fn) => fn());
}

export function getTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage blocked — the choice still holds for this page load.
  }
  apply(theme);
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

export function subscribeTheme(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Follow the OS setting until the visitor picks one explicitly.
systemQuery.addEventListener('change', (e) => {
  if (!readStored()) apply(e.matches ? 'dark' : 'light');
});
