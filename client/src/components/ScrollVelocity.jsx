import { useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import './ScrollVelocity.css';

function wrap(min, max, value) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

function useElementWidth(ref) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setWidth(element.offsetWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

function VelocityRow({ text, velocity, outlined = false }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 45, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 3], { clamp: false });
  const reduceMotion = useReducedMotion();
  const copyRef = useRef(null);
  const copyWidth = useElementWidth(copyRef);
  const direction = useRef(1);

  const x = useTransform(baseX, value => copyWidth ? `${wrap(-copyWidth, 0, value)}px` : '0px');

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !copyWidth) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    const move = direction.current * velocity * (Math.min(delta, 64) / 1000);
    baseX.set(baseX.get() + move + move * factor);
  });

  const skills = text.split(/\s*•\s*/).filter(Boolean);

  return (
    <div className="parallax skill-velocity-row" aria-label={text}>
      <motion.div className={`scroller ${outlined ? 'skill-velocity-outline' : ''}`} style={{ x }}>
        {Array.from({ length: 5 }, (_, copyIndex) => (
          <span className="skill-velocity-copy" key={copyIndex} ref={copyIndex === 0 ? copyRef : null} aria-hidden={copyIndex > 0}>
            {skills.map((skill, skillIndex) => (
              <span className="skill-velocity-item" key={`${skill}-${skillIndex}`}>
                {skill}
                {skillIndex < skills.length - 1 && <span className="skill-velocity-separator" aria-hidden="true">•</span>}
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ScrollVelocity({ texts = [], velocity = 35 }) {
  return (
    <section className="skill-velocity-banner" aria-label="Skills">
      {texts.map((text, index) => (
        <VelocityRow key={`${index}-${text}`} text={text} velocity={velocity} />
      ))}
    </section>
  );
}
