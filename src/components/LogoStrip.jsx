import './LogoStrip.css';

const LOGOS = ['NORTHWIND', 'ACME CORP', 'GLOBEX', 'INITECH', 'UMBRELLA', 'HOOLI'];

function LogoStrip() {
  return (
    <section className="logo-strip">
      <div className="container logo-strip__inner">
        <span className="logo-strip__label">Trusted by teams at</span>
        <div className="logo-strip__logos">
          {LOGOS.map((name) => (
            <span key={name} className="logo-strip__logo">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LogoStrip;
