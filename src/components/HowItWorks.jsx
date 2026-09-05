import './HowItWorks.css';

const STEPS = [
  {
    n: '01',
    title: 'Connect',
    body: 'Placeholder step description — explain how a user gets started or links their data.',
  },
  {
    n: '02',
    title: 'Configure',
    body: 'Placeholder step description — explain how the product is tuned to their needs.',
  },
  {
    n: '03',
    title: 'Launch',
    body: 'Placeholder step description — explain what happens once everything goes live.',
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="how section-pad">
      <div className="container">
        <div className="how__head">
          <span className="eyebrow how__eyebrow">The process</span>
          <h2 className="how__title">FROM ZERO TO LAUNCH</h2>
        </div>

        <div className="how__steps">
          {STEPS.map((step, i) => (
            <div className="how-step" key={step.n}>
              <div className="how-step__number">{step.n}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              {i < STEPS.length - 1 && <span className="how-step__connector" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
