import {useDroppable} from '@dnd-kit/react';
import {closestCenter} from '@dnd-kit/collision';
import "./Slot.scss";

// droppable slot that always resolves to the closest slot while dragging.
// disabled slots are ignored (e.g. the main grid while a folder covers it).
export function Slot({id, disabled = false, children}) {
  const {ref, isDropTarget} = useDroppable({id, disabled, collisionDetector: closestCenter});

  return (
    <div ref={ref} className="slot" data-over={isDropTarget ? '' : undefined}>
      <div className="slot-content">
        <div className='slot-magnet'></div>
        {children}
      </div>
    </div>
  );
}
