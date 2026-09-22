import { useRef } from 'react';
import AnimatedTestimonials from './AnimatedTestimonials';
import TextCursorProximity from './TextCursorProximity';
import { useReveal } from '../hooks/useReveal';
import { placeholderAvatar } from '../lib/placeholderAvatar';
import './Team.css';

// motion's color interpolation needs resolved color values, not CSS
// custom-property references (var(--text-muted) can't be mixed as a
// color) — these must stay in sync with the tokens in index.css.
const PROXIMITY_STYLES = {
  color: { from: '#a1a1aa', to: '#ffffff' },
};

const MEMBERS = [
  {
    name: 'Placeholder Name',
    designation: 'Founder & CEO',
    quote:
      "Placeholder quote — a line about why they started Amelia and what problem they're obsessed with solving.",
    src: placeholderAvatar('AR', '#da5e57'),
  },
  {
    name: 'Placeholder Name',
    designation: 'Head of Design',
    quote:
      'Placeholder quote — a line about their approach to making the product feel simple and considered.',
    src: placeholderAvatar('JL', '#5e7ada'),
  },
  {
    name: 'Placeholder Name',
    designation: 'Lead Engineer',
    quote:
      'Placeholder quote — a line about the technical challenge they find most interesting about Amelia.',
    src: placeholderAvatar('MK', '#5eda8f'),
  },
  {
    name: 'Placeholder Name',
    designation: 'Head of Research',
    quote:
      "Placeholder quote — a line about the research direction they're most excited about right now.",
    src: placeholderAvatar('SP', '#daa15e'),
  },
];

function Team() {
  const [headRef, headVisible] = useReveal();
  const containerRef = useRef(null);

  return (
    <section id="team" className="team section-pad">
      <div className="container">
        <div
          ref={(el) => {
            headRef.current = el;
            containerRef.current = el;
          }}
          className={`team__head reveal ${headVisible ? 'reveal--visible' : ''}`}
        >
          <span className="eyebrow">The people</span>
          <h2 className="team__title">Meet the team</h2>
          <TextCursorProximity
            as="p"
            className="team__subtitle"
            containerRef={containerRef}
            styles={PROXIMITY_STYLES}
            radius={70}
            falloff="gaussian"
          >
            Placeholder copy — a short line introducing the people behind Amelia.
          </TextCursorProximity>
        </div>

        <AnimatedTestimonials testimonials={MEMBERS} autoplay />
      </div>
    </section>
  );
}

export default Team;
