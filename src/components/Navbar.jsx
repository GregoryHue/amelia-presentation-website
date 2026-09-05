import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Results', href: '#results' },
  { label: 'Pricing', href: '#pricing' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#top" className="navbar__brand">
          <span className="navbar__mark mark" aria-hidden="true" />
          AMELIA
        </a>

        <nav className="navbar__links">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar__cta">
          <ThemeToggle />
          <a href="#" className="navbar__signin">
            Sign In
          </a>
          <a href="#get-started" className="btn btn-primary navbar__btn">
            Get Started
          </a>
        </div>

        <div className="navbar__mobile-controls">
          <ThemeToggle />
          <button
            className={`navbar__toggle ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <div className="navbar__mobile">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#" onClick={() => setOpen(false)}>
            Sign In
          </a>
          <a href="#get-started" className="btn btn-primary" onClick={() => setOpen(false)}>
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}

export default Navbar;
