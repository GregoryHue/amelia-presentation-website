import './Footer.css';

const COLUMNS = [
  {
    title: 'Product',
    links: ['Features', 'How it Works', 'Pricing', 'Changelog'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Blog', 'Contact'],
  },
  {
    title: 'Resources',
    links: ['Docs', 'API Reference', 'Support', 'Status'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security'],
  },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#top" className="footer__logo">
            <span className="mark footer__mark" aria-hidden="true" />
            AMELIA
          </a>
          <p className="footer__tagline">
            Placeholder tagline — a short sentence about the product's mission.
          </p>
        </div>

        <div className="footer__columns">
          {COLUMNS.map((col) => (
            <div className="footer__column" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer__bar container">
        <span>&copy; 2026 Amelia, Inc. Placeholder copyright line.</span>
        <div className="footer__social">
          <a href="#" aria-label="X">X</a>
          <a href="#" aria-label="LinkedIn">in</a>
          <a href="#" aria-label="GitHub">GH</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
