import {useLayoutEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import 'animate.css';
import './Tooltip.scss';

// name bubble above `anchorRef`, linked by a line to a dot on its top edge.
// rendered in the body so no scroll area (folders, badge case) cuts it,
// and moved to the anchor every frame while open (scroll, hover scale, zoom...).
// pops in with the same zoomIn as the modals.
export function Tooltip({anchorRef, open, label, duration = 200}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!open) return undefined;

    let frame;
    const follow = () => {
      const anchor = anchorRef.current;
      const tooltip = ref.current;
      if (anchor && tooltip) {
        const {left, top, width} = anchor.getBoundingClientRect();
        tooltip.style.left = `${left + width / 2}px`;
        tooltip.style.top = `${top}px`;
      }
      frame = requestAnimationFrame(follow);
    };
    follow();

    return () => cancelAnimationFrame(frame);
  }, [open, anchorRef]);

  if (!open) return null;

  return createPortal(
    <span
      ref={ref}
      className="tooltip animate__animated animate__zoomIn"
      style={{'--animate-duration': `${duration}ms`}}
      aria-hidden="true"
    >
      <span className="tooltip-bubble">{label}</span>
      <span className="tooltip-line" />
      <span className="tooltip-dot" />
    </span>,
    document.body
  );
}
