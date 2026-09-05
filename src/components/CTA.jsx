import './CTA.css';

function CTA() {
  return (
    <section id="get-started" className="cta">
      <div className="container cta__inner">
        <span className="mark cta__mark" aria-hidden="true" />
        <h2 className="cta__title">READY TO SEE IT IN ACTION?</h2>
        <p className="cta__subtitle">
          Placeholder closing pitch — one line encouraging the visitor to take the next step.
        </p>
        <div className="cta__actions">
          <a href="#" className="btn btn-primary">
            Get Started Free
          </a>
          <a href="#" className="btn btn-outline cta__btn-outline">
            Talk to Sales
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;
