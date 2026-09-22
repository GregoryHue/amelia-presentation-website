import { motion } from 'motion/react';
import './BreathingText.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

function BreathingText({
  children,
  as = 'span',
  fromFontVariationSettings,
  toFontVariationSettings,
  transition = { duration: 1.5, ease: 'easeInOut' },
  staggerDuration = 0.1,
  staggerFrom = 'first',
  repeatDelay = 0.1,
  className,
  ...props
}) {
  const letterVariants = {
    initial: { fontVariationSettings: fromFontVariationSettings },
    animate: (i) => ({
      fontVariationSettings: toFontVariationSettings,
      transition: {
        ...transition,
        repeat: Infinity,
        repeatType: 'mirror',
        delay: i * staggerDuration,
        repeatDelay,
      },
    }),
  };

  const getCustomIndex = (index, total) => {
    if (typeof staggerFrom === 'number') {
      return Math.abs(index - staggerFrom);
    }
    switch (staggerFrom) {
      case 'first':
        return index;
      case 'last':
        return total - 1 - index;
      case 'center':
      default:
        return Math.abs(index - Math.floor(total / 2));
    }
  };

  const letters = String(children).split('');
  const ElementTag = as;

  return (
    <ElementTag className={cn('breathing-text', className)} {...props} data-text={children}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="breathing-text__letter"
          aria-hidden="true"
          variants={letterVariants}
          initial="initial"
          animate="animate"
          custom={getCustomIndex(i, letters.length)}
        >
          {letter}
        </motion.span>
      ))}
      <span className="breathing-text__sr-only">{children}</span>
    </ElementTag>
  );
}

export default BreathingText;
