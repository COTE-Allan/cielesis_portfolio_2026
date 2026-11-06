import {useRef, useState} from 'react';
import {useDraggable} from '@dnd-kit/react';
import {RoundIcon} from '../icons/RoundIcon';
import {Tooltip} from '../tooltip/Tooltip';
import {BADGE_TYPE} from './BadgePin';
import "./Icon.scss";

function iconClass({isFolder, isBadge}) {
  if (isFolder) return 'icon icon-folder';
  if (isBadge) return 'icon icon-badge';
  return 'icon';
}

// draggable item rendered inside a slot: an app icon, a badge, or a folder
// (showing the badge pinned on it instead of its name, if any).
// link icons open their url directly, so they are announced as links.
// its name shows in a tooltip on mouse hover or keyboard focus (not while dragged).
export function Icon({id, label, image, symbol, isFolder, isBadge, isLink, pinnedImage, onOpen}) {
  const {ref, isDragging} = useDraggable({id, type: isBadge ? BADGE_TYPE : undefined});
  const anchorRef = useRef(null);
  const [hinted, setHinted] = useState(false);

  const showHint = (event) => {
    anchorRef.current = event.currentTarget;
    setHinted(true);
  };
  const hideHint = () => setHinted(false);

  return (
    <button
      ref={ref}
      type="button"
      className={iconClass({isFolder, isBadge})}
      data-icon-id={id}
      data-dragging={isDragging ? '' : undefined}
      role={isLink ? 'link' : undefined}
      aria-label={label}
      onPointerEnter={(event) => event.pointerType === 'mouse' && showHint(event)}
      onPointerLeave={hideHint}
      onFocus={(event) => event.currentTarget.matches(':focus-visible') && showHint(event)}
      onBlur={hideHint}
      onClick={() => {
        hideHint();
        onOpen?.();
      }}
    >
      <section className='icon-content'>
        { isFolder && !pinnedImage &&
        <span className="icon-label">{label}</span>
        }
        {
          !isFolder && symbol &&
        <RoundIcon className='icon-symbol' name={symbol} filled />
        }
        {
          !isFolder && !symbol &&
        <img className='icon-img' src={image} alt="" draggable={false} />
        }
      </section>
      {pinnedImage && <img className='icon-pinned' src={pinnedImage} alt="" draggable={false} />}
      <Tooltip anchorRef={anchorRef} open={hinted && !isDragging} label={label} />
    </button>
  );
}
