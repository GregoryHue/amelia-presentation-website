import { useMemo, useRef } from 'react';
import AnimatedTestimonials from './AnimatedTestimonials';
import TextCursorProximity from './TextCursorProximity';
import { useReveal } from '../hooks/useReveal';
import { placeholderAvatar } from '../lib/placeholderAvatar';
import { useProximityStyles } from '../lib/proximityStyles';
import { useTheme } from '../hooks/useTheme';
import './Team.css';

// Avatar field colors per theme — data-URI SVGs can't read CSS tokens.
const AVATAR_COLORS = {
  light: ['#9a4938', '#526e72', '#34483a', '#c9a85d'],
  dark: ['#da5e57', '#5e7ada', '#5eda8f', '#daa15e'],
};

const AVATAR_TEXT = {
  light: '#f1ebdd',
  dark: 'rgba(255,255,255,0.92)',
};

const MEMBERS = [
  {
    name: 'Placeholder Name',
    designation: 'Founder & CEO',
    quote:
      "Placeholder quote — a line about why they started Amelia and what problem they're obsessed with solving.",
    initials: 'AR',
  },
  {
    name: 'Placeholder Name',
    designation: 'Head of Design',
    quote:
      'Placeholder quote — a line about their approach to making the product feel simple and considered.',
    initials: 'JL',
  },
  {
    name: 'Placeholder Name',
    designation: 'Lead Engineer',
    quote:
      'Placeholder quote — a line about the technical challenge they find most interesting about Amelia.',
    initials: 'MK',
  },
  {
    name: 'Placeholder Name',
    designation: 'Head of Research',
    quote:
      "Placeholder quote — a line about the research direction they're most excited about right now.",
    initials: 'SP',
  },
];

function Team() {
  const proximityStyles = useProximityStyles();
  const theme = useTheme();
  const members = useMemo(
    () =>
      MEMBERS.map(({ initials, ...member }, i) => ({
        ...member,
        src: placeholderAvatar(initials, AVATAR_COLORS[theme][i], AVATAR_TEXT[theme]),
      })),
    [theme],
  );
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
            styles={proximityStyles}
            radius={70}
            falloff="gaussian"
          >
            Placeholder copy — a short line introducing the people behind Amelia.
          </TextCursorProximity>
        </div>

        <AnimatedTestimonials testimonials={members} autoplay />
      </div>
    </section>
  );
}

export default Team;
