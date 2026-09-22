import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './AnimatedTestimonials.css';

function randomRotateY() {
  return Math.floor(Math.random() * 21) - 10;
}

function AnimatedTestimonials({ testimonials, autoplay = false }) {
  const [active, setActive] = useState(0);
  const [autoplaying, setAutoplaying] = useState(autoplay);

  const stopAutoplay = () => setAutoplaying(false);

  const handleNext = () => {
    stopAutoplay();
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    stopAutoplay();
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => index === active;

  useEffect(() => {
    if (!autoplaying) return undefined;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoplaying, testimonials.length]);

  return (
    <div className="animated-testimonials">
      <div className="animated-testimonials__grid">
        <div className="animated-testimonials__media" onClick={stopAutoplay}>
          <AnimatePresence>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.src}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: randomRotateY(),
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.7,
                  scale: isActive(index) ? 1 : 0.95,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) ? 0 : randomRotateY(),
                  zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
                  y: isActive(index) ? [0, -80, 0] : 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: randomRotateY(),
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="animated-testimonials__image-wrap"
              >
                <img
                  src={testimonial.src}
                  alt={testimonial.name}
                  draggable={false}
                  className="animated-testimonials__image"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="animated-testimonials__content">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <h3 className="animated-testimonials__name">{testimonials[active].name}</h3>
            <p className="animated-testimonials__designation">{testimonials[active].designation}</p>
            <motion.p className="animated-testimonials__quote">
              {testimonials[active].quote.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
                  animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.02 * index }}
                  className="animated-testimonials__word"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          <div className="animated-testimonials__controls">
            <button
              type="button"
              onClick={handlePrev}
              className="animated-testimonials__button"
              aria-label="Previous team member"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="animated-testimonials__button"
              aria-label="Next team member"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimatedTestimonials;
