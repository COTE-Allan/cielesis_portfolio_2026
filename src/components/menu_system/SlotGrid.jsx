import {RoundIcon} from '../icons/RoundIcon';
import {BadgePin} from './BadgePin';
import {Icon} from './Icon';
import {Slot} from './Slot';
import {BADGES, PINS} from './menuData';
import {getItem, slotCount, toPinId, toSlotId} from './layout';
import './SlotGrid.scss';

// grid of slots of one container: the main grid, a folder or the badge case.
// `variant`: 'main' (card on the home page) or 'panel' (scrolls inside a modal).
// `rows`: rows of the main grid.
// `mobileColumns`: columns of a panel grid on phones (defaults to `columns`).
// `showPins`: folder tiles show a spot to pin the badge being dragged.
export function SlotGrid({ref, layout, names, containerId, columns, mobileColumns, rows, variant, disabled, showPins, onOpen}) {
  return (
    <div
      ref={ref}
      className={`slot-grid slot-grid-${variant}`}
      style={{'--columns': columns, '--columns-mobile': mobileColumns}}
    >
      {Array.from({length: slotCount(layout, containerId, columns, rows)}, (_, index) => {
        const itemId = layout[containerId][index];
        const slotId = toSlotId(containerId, index);
        const item = itemId && getItem(itemId, names);
        const pinned = item?.isFolder && BADGES[layout[PINS][itemId]];

        return (
          <Slot key={slotId} id={slotId} disabled={disabled}>
            {item && (
              <Icon
                key={itemId}
                id={itemId}
                image={item.image}
                symbol={item.symbol}
                label={item.label}
                isFolder={item.isFolder}
                isBadge={item.isBadge}
                isLink={item.isLink}
                pixelArt={item.pixelArt}
                pinnedImage={pinned?.image}
                pinnedPixelArt={pinned?.pixelArt}
                onOpen={() => onOpen(itemId)}
              />
            )}
            {item?.isFolder && showPins && (
              <BadgePin id={toPinId(itemId)} disabled={disabled} className="badge-pin-tile">
                <RoundIcon name="push_pin" filled />
              </BadgePin>
            )}
          </Slot>
        );
      })}
    </div>
  );
}
