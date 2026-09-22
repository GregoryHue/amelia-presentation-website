import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import TextCursorProximity from './TextCursorProximity';
import './Capabilities.css';

// motion's color interpolation needs resolved color values, not CSS
// custom-property references (var(--text-muted) can't be mixed as a
// color) — these must stay in sync with the tokens in index.css.
const PROXIMITY_STYLES = {
  color: { from: '#a1a1aa', to: '#ffffff' },
};

const ITEMS = [
  {
    n: '01',
    title: 'Understand',
    body: 'Placeholder — how Amelia takes in context, data, or intent from the user.',
  },
  {
    n: '02',
    title: 'Act',
    body: 'Placeholder — what Amelia actually does with that understanding.',
  },
  {
    n: '03',
    title: 'Learn',
    body: 'Placeholder — how the product improves from the feedback loop.',
  },
];

function CapabilityItem({ item, index }) {
  const [ref, visible] = useReveal();
  const containerRef = useRef(null);

  return (
    <div
      ref={(el) => {
        ref.current = el;
        containerRef.current = el;
      }}
      className={`capability reveal ${visible ? 'reveal--visible' : ''} reveal--delay-${index + 1}`}
    >
      <span className="capability__n">{item.n}</span>
      <h3>{item.title}</h3>
      <TextCursorProximity
        as="p"
        containerRef={containerRef}
        styles={PROXIMITY_STYLES}
        radius={70}
        falloff="gaussian"
      >
        {item.body}
      </TextCursorProximity>
    </div>
  );
}

function Capabilities() {
  const [headRef, headVisible] = useReveal();

  return (
    <section id="approach" className="capabilities section-pad">
      <div className="container">
        <div ref={headRef} className={`capabilities__head reveal ${headVisible ? 'reveal--visible' : ''}`}>
          <span className="eyebrow">The approach</span>
          <h2 className="capabilities__title">How it works</h2>
        </div>

        <div className="capabilities__list">
          {ITEMS.map((item, i) => (
            <CapabilityItem key={item.n} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Capabilities;
