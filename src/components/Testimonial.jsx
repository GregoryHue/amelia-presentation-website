import './Testimonial.css';

function Testimonial() {
  return (
    <section className="testimonial section-pad">
      <div className="container testimonial__inner">
        <span className="testimonial__quote-mark" aria-hidden="true">
          &ldquo;
        </span>
        <p className="testimonial__quote">
          Placeholder testimonial goes here — a sentence or two describing the impact this
          product had, quoted from a real (or representative) customer.
        </p>
        <div className="testimonial__person">
          <div className="testimonial__avatar" aria-hidden="true" />
          <div>
            <div className="testimonial__name">Jane Doe</div>
            <div className="testimonial__role">Title, Company Placeholder</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
