import { useTheme } from '../hooks/useTheme';

// Shared by every TextCursorProximity usage. motion's color interpolation
// needs resolved color values, not CSS custom-property references
// (var(--text-muted) can't be mixed as a color) — these must stay in sync
// with the tokens in index.css.
const PROXIMITY_STYLES = {
  light: { color: { from: '#6b6a5c', to: '#9a4938' } },
  dark: { color: { from: '#a1a1aa', to: '#ffffff' } },
};

export function useProximityStyles() {
  return PROXIMITY_STYLES[useTheme()];
}
