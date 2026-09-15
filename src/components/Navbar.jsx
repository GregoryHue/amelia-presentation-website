import './Navbar.css';

const LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Approach', href: '#approach' },
  { label: 'Contact', href: '#contact' },
];

function Navbar() {
  return (
    <header className="navbar navbar--visible load-in load-in--top">
      <div className="container navbar__inner">
        <a href="#top" className="navbar__brand">
          AMELIA
        </a>

        <nav className="navbar__links">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="bracket-link">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
