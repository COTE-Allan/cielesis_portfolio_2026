import {useEffect, useEffectEvent, useState} from 'react';
import 'animate.css';
import './Modal.scss';

// open modals, most recent last: Escape only closes the top-most one.
const stack = [];

// generic dialog with animate.css in/out animations.
// stays mounted while its exit animation plays (and after it, as long as
// `keepMounted` is true), then calls `onExited` so the owner can drop its content.
// `keepMounted` never mounts a modal that is already gone.
export function Modal({
  open,
  onClose,
  onExited,
  keepMounted = false,
  label,
  className = '',
  enter = 'zoomIn',
  exit = 'zoomOut',
  duration = 200,
  ref,
  children,
}) {
  // 'shown' -> (closed + exit animation done) 'exited' -> (not kept) 'gone'
  const [phase, setPhase] = useState(open ? 'shown' : 'gone');
  if (open && phase !== 'shown') setPhase('shown');
  if (phase === 'exited' && !keepMounted) setPhase('gone');

  const mounted = phase !== 'gone';
  const close = useEffectEvent(() => onClose?.());
  const exited = useEffectEvent(() => onExited?.());

  useEffect(() => {
    if (!open) return undefined;

    const token = {};
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && stack.at(-1) === token) close();
    };

    stack.push(token);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      stack.splice(stack.indexOf(token), 1);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!mounted) exited();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      className={`modal-backdrop animate__animated animate__${open ? 'fadeIn' : 'fadeOut'}`}
      style={{'--animate-duration': `${duration}ms`}}
      data-closing={open ? undefined : ''}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && !open) setPhase('exited');
      }}
    >
      <section
        ref={ref}
        className={`modal animate__animated animate__${open ? enter : exit} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        {children}
      </section>
    </div>
  );
}
