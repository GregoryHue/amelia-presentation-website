import './GlassesLogo.css';

function GlassesLogo() {
  return (
    <svg
      className="glasses-logo"
      viewBox="0 0 200 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M80 38 Q100 20 120 38" />
      <circle className="glasses-logo-eye glasses-logo-eye--wink" cx="50" cy="40" r="30" />
      <circle cx="150" cy="40" r="30" />
    </svg>
  );
}

export default GlassesLogo;
