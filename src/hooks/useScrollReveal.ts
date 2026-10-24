import { useEffect } from 'react';

/**
 * Attaches an IntersectionObserver to all elements with '.reveal-item'
 * or auto-reveals on scroll.
 */
export const useScrollReveal = (depKey?: unknown) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If user prefers reduced motion, reveal everything immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-item').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1,
      }
    );

    const elements = document.querySelectorAll('.reveal-item:not(.is-revealed)');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [depKey]);
};
