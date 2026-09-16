import { Link } from 'react-router-dom';
import './Navbar.css';

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Approach', to: '/approach' },
  { label: 'Contact', to: '/contact' },
];

function Navbar() {
  return (
    <header className="navbar navbar--visible load-in load-in--top">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          AMELIA
        </Link>

        <nav className="navbar__links">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="bracket-link">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
