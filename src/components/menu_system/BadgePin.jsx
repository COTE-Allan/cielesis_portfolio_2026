import {useDroppable} from '@dnd-kit/react';
import {CollisionPriority} from '@dnd-kit/abstract';
import {pointerIntersection} from '@dnd-kit/collision';
import "./BadgePin.scss";

export const BADGE_TYPE = 'badge';

// spot of a folder where a badge can be pinned, instead of being dropped inside.
// only accepts badges, and wins over the slot underneath while the pointer is on it.
export function BadgePin({id, disabled = false, className = '', children}) {
  const {ref, isDropTarget} = useDroppable({
    id,
    disabled,
    accept: BADGE_TYPE,
    collisionDetector: pointerIntersection,
    collisionPriority: CollisionPriority.Highest,
  });

  return (
    <div ref={ref} className={`badge-pin ${className}`} data-over={isDropTarget ? '' : undefined}>
      {children}
    </div>
  );
}
