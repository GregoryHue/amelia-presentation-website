// Generates a simple "initials on a color field" avatar as a data URI, so
// team placeholders don't depend on an external image host.
export function placeholderAvatar(initials, bg) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
    <rect width="500" height="500" fill="${bg}" />
    <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
      font-family="Arial, sans-serif" font-size="180" font-weight="700" fill="rgba(255,255,255,0.92)">
      ${initials}
    </text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
