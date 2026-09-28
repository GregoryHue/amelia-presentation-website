import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import TextCursorProximity from './TextCursorProximity';
import { PROXIMITY_STYLES } from '../lib/proximityStyles';
import './Capabilities.css';

const ITEMS = [
  {
    n: 'Genomics',
    title: 'Bioinformatics, end to end',
    body: 'amelia ingests raw sequencing output and runs dedicated pipelines based on your research needs. All-in-one.',
  },
  {
    n: 'Literature',
    title: 'Evidence synthesis on demand',
    body: 'She reads the papers you don\'t have time for — screening thousands of abstracts, extracting findings, and citing the exact passages behind every claim.',
  },
  {
    n: 'Lab workflows',
    title: 'Protocols that keep themselves',
    body: 'amelia drafts protocols, tracks runs across instruments, and catches deviations early — so experiments stay reproducible without manual bookkeeping.',
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
