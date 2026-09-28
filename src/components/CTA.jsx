import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import BreathingText from './BreathingText';
import TextCursorProximity from './TextCursorProximity';
import { PROXIMITY_STYLES } from '../lib/proximityStyles';
import './CTA.css';

function CTA() {
  const [ref, visible] = useReveal();
  const containerRef = useRef(null);

  return (
    <section id="contact" className="closing section-pad">
      <div className="container">
        <div
          ref={(el) => {
            ref.current = el;
            containerRef.current = el;
          }}
          className={`closing__inner reveal ${visible ? 'reveal--visible' : ''}`}
        >
          <BreathingText
            as="h2"
            className="closing__title"
            staggerDuration={0.08}
            fromFontVariationSettings="'wght' 400"
            toFontVariationSettings="'wght' 800"
          >
            Put amelia on your problem
          </BreathingText>
          <TextCursorProximity
            as="p"
            className="closing__subtitle"
            containerRef={containerRef}
            styles={PROXIMITY_STYLES}
            radius={70}
            falloff="gaussian"
          >
            Tell us about your business, your data, and the question you're stuck on. The COFEE team replies, espresso.
          </TextCursorProximity>
          <a href="mailto:info@cofeebiotech.com?subject=Amelia%20pilot%20inquiry" className="bracket-link closing__cta">
            Email the team
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;
