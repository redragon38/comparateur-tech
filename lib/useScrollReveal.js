import { useEffect, useRef, useState } from 'react';

/**
 * Hook de scroll reveal avec IntersectionObserver.
 * Usage : const { ref, visible } = useScrollReveal({ threshold: 0.15, delay: 100 })
 */
export function useScrollReveal({ threshold = 0.12, delay = 0, once = true } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setVisible(true), delay);
          if (once) observer.disconnect();
          return () => clearTimeout(t);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, delay, once]);

  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 500ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 500ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  };

  return { ref, visible, style };
}

/**
 * Composant wrapper scroll reveal.
 * Usage : <Reveal delay={100}><MonComposant /></Reveal>
 */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div', ...props }) {
  const { ref, style } = useScrollReveal({ delay });
  return (
    <Tag ref={ref} style={style} className={className} {...props}>
      {children}
    </Tag>
  );
}
