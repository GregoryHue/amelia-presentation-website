// Shared by every TextCursorProximity usage. motion's color interpolation
// needs resolved color values, not CSS custom-property references
// (var(--text-muted) can't be mixed as a color) — these must stay in sync
// with the tokens in index.css.
export const PROXIMITY_STYLES = {
  color: { from: '#a1a1aa', to: '#ffffff' },
};
