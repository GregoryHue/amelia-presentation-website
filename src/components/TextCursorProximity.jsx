import { Children, forwardRef, useMemo, useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'motion/react';
import { useMousePositionRef } from '../hooks/useMousePositionRef';
import './TextCursorProximity.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function calculateFalloff(distance, radius, falloff) {
  const normalizedDistance = Math.min(Math.max(1 - distance / radius, 0), 1);

  switch (falloff) {
    case 'exponential':
      return normalizedDistance ** 2;
    case 'gaussian':
      return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
    case 'linear':
    default:
      return normalizedDistance;
  }
}

const TextCursorProximity = forwardRef(
  ({ children, as, styles, containerRef, radius = 50, falloff = 'linear', className, ...props }, ref) => {
    const MotionComponent = useMemo(() => motion.create(as ?? 'span'), [as]);
    const letterRefs = useRef([]);
    const mousePositionRef = useMousePositionRef(containerRef);

    const text = Children.toArray(children).join('');

    const letterProximities = useRef(
      Array(text.replace(/\s/g, '').length)
        .fill(0)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        .map(() => useMotionValue(0))
    );

    const frameCountRef = useRef(0);

    useAnimationFrame(() => {
      // Measuring every letter's getBoundingClientRect() on every single
      // frame (and there are several of these components mounted at
      // once) is expensive for no visible benefit on a cursor-follow
      // effect — every other frame (~30fps) still reads as smooth.
      frameCountRef.current += 1;
      if (frameCountRef.current % 2 !== 0) return;

      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const { x, y } = mousePositionRef.current;

      // Cheap bounds check first: skip the per-letter layout reads
      // entirely while the cursor isn't anywhere near this text block
      // (the common case for most of the page, most of the time).
      const withinBounds =
        x >= -radius && x <= containerRect.width + radius && y >= -radius && y <= containerRect.height + radius;

      if (!withinBounds) {
        letterProximities.current.forEach((proximity) => {
          if (proximity.get() !== 0) proximity.set(0);
        });
        return;
      }

      letterRefs.current.forEach((letterRef, index) => {
        if (!letterRef) return;

        const rect = letterRef.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
        const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

        const distance = calculateDistance(x, y, letterCenterX, letterCenterY);

        const proximity = calculateFalloff(distance, radius, falloff);
        letterProximities.current[index].set(proximity);
      });
    });

    const words = text.split(' ');
    let letterIndex = 0;

    return (
      <MotionComponent ref={ref} className={cn(className)} {...props}>
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="text-cursor-proximity__word" aria-hidden="true">
            {word.split('').map((letter) => {
              const currentLetterIndex = letterIndex++;
              const proximity = letterProximities.current[currentLetterIndex];

              const transformedStyles = Object.entries(styles).reduce((acc, [key, value]) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                acc[key] = useTransform(proximity, [0, 1], [value.from, value.to]);
                return acc;
              }, {});

              return (
                <motion.span
                  key={currentLetterIndex}
                  ref={(el) => {
                    letterRefs.current[currentLetterIndex] = el;
                  }}
                  className="text-cursor-proximity__letter"
                  aria-hidden="true"
                  style={transformedStyles}
                >
                  {letter}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span className="text-cursor-proximity__letter">&nbsp;</span>
            )}
          </span>
        ))}
        <span className="text-cursor-proximity__sr-only">{text}</span>
      </MotionComponent>
    );
  }
);

TextCursorProximity.displayName = 'TextCursorProximity';

export default TextCursorProximity;
