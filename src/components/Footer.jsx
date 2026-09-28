import './Footer.css';


function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__copy">&copy; 2026 COFEE. All rights reserved.</span>
        <div className="footer__socials">
            <a href="mailto:info@cofeebiotech.com?subject=Amelia%20pilot%20inquiry" className="bracket-link footer__social">
              info@cofeebiotech.com
            </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
