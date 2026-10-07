import { useRef } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { useTheme } from '../hooks/useTheme';
import { toggleTheme } from '../themeState';
import './ThemeToggle.css';

// How far (px) the knob has to be pulled before letting go flips the theme.
const PULL_THRESHOLD = 40;
const MAX_PULL = 80;

// A light-switch pull cord hanging from the top of the viewport: drag the
// knob down and release (or just click / press Enter) to toggle the theme.
// The cord stretches with the knob, springs back, and swings a little.
function ThemeToggle() {
  const theme = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';

  const pull = useMotionValue(0);
  const swing = useMotionValue(0);
  // The cord is drawn from the anchor down to the knob, so it stretches
  // with the pull instead of the whole thing sliding down.
  const cordHeight = useTransform(pull, (y) => `calc(var(--cord-length) + ${y}px)`);
  const draggedRef = useRef(false);

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const flip = () => {
    toggleTheme();
    if (reduceMotion()) return;
    animate(swing, [0, 7, -5, 3, -1.5, 0], { duration: 1.4, ease: 'easeOut' });
  };

  const handleClick = () => {
    // A drag also ends in a click; the drag handler already dealt with it.
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    if (reduceMotion()) {
      toggleTheme();
      return;
    }
    // Simulate a quick tug, flipping at the bottom of it like a real switch.
    animate(pull, 50, { duration: 0.15, ease: 'easeOut' }).then(() => {
      flip();
      animate(pull, 0, { type: 'spring', stiffness: 500, damping: 12 });
    });
  };

  const handleDragEnd = () => {
    draggedRef.current = true;
    if (pull.get() >= PULL_THRESHOLD) flip();
  };

  return (
    <motion.div className="theme-cord" style={{ rotate: swing }}>
      <motion.span className="theme-cord__string" style={{ height: cordHeight }} aria-hidden="true" />
      <motion.button
        type="button"
        className="theme-cord__knob"
        style={{ y: pull }}
        drag="y"
        dragConstraints={{ top: 0, bottom: MAX_PULL }}
        dragElastic={0.15}
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: 500, bounceDamping: 12 }}
        onPointerDown={() => {
          draggedRef.current = false;
        }}
        onDragStart={() => {
          draggedRef.current = true;
        }}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        aria-label={`Switch to ${next} theme`}
        title={`Pull to switch to ${next} theme`}
      />
    </motion.div>
  );
}

export default ThemeToggle;
