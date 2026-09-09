import './Footer.css';

const SOCIALS = [
  { label: 'X', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'GitHub', href: '#' },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__copy">&copy; 2026 Amelia, Inc.</span>
        <div className="footer__socials">
          {SOCIALS.map((social) => (
            <a key={social.label} href={social.href} className="bracket-link footer__social">
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
