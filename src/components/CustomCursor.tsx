import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Smooth lerp coordinates
  const posRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Check desktop pointer and reduced motion
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveEl = target.closest('button, a, [role="button"], [data-cursor], input, textarea, select');
        if (interactiveEl) {
          setIsHovered(true);
          const customLabel = interactiveEl.getAttribute('data-cursor');
          if (customLabel) {
            setCursorText(customLabel.toUpperCase());
          } else if (interactiveEl.closest('.place-card') || interactiveEl.classList.contains('place-card')) {
            setCursorText('VIEW');
          } else {
            setCursorText('');
          }
        } else {
          setIsHovered(false);
          setCursorText('');
        }
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth RAF loop with lerping for elegant inertia
    const render = () => {
      const pos = posRef.current;
      pos.x += (pos.targetX - pos.x) * 0.22;
      pos.y += (pos.targetY - pos.y) * 0.22;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.targetX}px, ${pos.targetY}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  if (!enabled) return null;

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-9999 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Outer Follower Ring / Badge */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{ transition: 'width 0.25s ease, height 0.25s ease' }}
      >
        <div
          className={`flex items-center justify-center rounded-full transition-all duration-300 border ${
            cursorText
              ? 'px-3 py-1 bg-[#98471d]/90 text-white border-white/60 shadow-lg scale-105'
              : isHovered
              ? 'w-10 h-10 bg-[#00435c]/20 border-[#00435c] scale-120'
              : isClicked
              ? 'w-6 h-6 bg-[#fe9666]/30 border-[#fe9666] scale-90'
              : 'w-8 h-8 bg-[#00435c]/10 border-[#00435c]/40'
          }`}
        >
          {cursorText && (
            <span className="text-[10px] font-mono font-bold tracking-widest leading-none select-none">
              [ {cursorText} ]
            </span>
          )}
        </div>
      </div>

      {/* Center Precise Dot */}
      <div
        ref={dotRef}
        className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full will-change-transform transition-colors duration-150 ${
          isHovered ? 'bg-[#fe9666]' : 'bg-[#00435c]'
        }`}
      />
    </div>
  );
};
