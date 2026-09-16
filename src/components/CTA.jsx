import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import './CTA.css';

function CTA() {
  const [ref, visible] = useReveal();

  return (
    <section id="contact" className="closing section-pad">
      <div className="container">
        <div ref={ref} className={`closing__inner reveal ${visible ? 'reveal--visible' : ''}`}>
          <h2 className="closing__title">Ready to see it in action?</h2>
          <p className="closing__subtitle">
            Placeholder closing pitch — one line encouraging the visitor to take the next step.
          </p>
          <Link to="/" className="bracket-link closing__cta">
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTA;
