import {RoundIcon} from '../icons/RoundIcon';
import {BadgePin} from './BadgePin';
import {Icon} from './Icon';
import {Panel, PanelHeader} from './Panel';
import {SlotGrid} from './SlotGrid';
import {BADGES, PINS} from './menuData';
import {MAX_NAME_LENGTH, defaultFolderLabel, getItem, toPinId} from './layout';
import './FolderModal.scss';

// open folder: its pinned badge, its (editable) name and its icons.
// `modal` is the useModal() of the folder, `onClose` closes it from Escape or the backdrop.
// `columns` follows the zoom of the menu (Menu.jsx).
export function FolderModal({ref, modal, onClose, keepMounted, folderId, layout, names, columns, onRename, onOpen}) {
  const pinnedId = folderId && layout[PINS][folderId];

  return (
    <Panel
      ref={ref}
      open={modal.isOpen}
      onClose={onClose}
      onExited={modal.onExited}
      keepMounted={keepMounted}
      label={folderId ? getItem(folderId, names).label : undefined}
    >
      {folderId && (
        <>
          <PanelHeader onClose={modal.hide}>
            <BadgePin id={toPinId(folderId)} disabled={!modal.isOpen} className="badge-pin-header">
              {pinnedId ? (
                <Icon
                  key={pinnedId}
                  id={pinnedId}
                  image={BADGES[pinnedId].image}
                  label={BADGES[pinnedId].label}
                  isBadge
                />
              ) : (
                <RoundIcon name="push_pin" title="Drop a badge here to pin it on this folder" />
              )}
            </BadgePin>
            <input
              className="folder-name"
              aria-label="Folder name"
              maxLength={MAX_NAME_LENGTH}
              placeholder={defaultFolderLabel(folderId)}
              value={names[folderId] ?? ''}
              onChange={(event) => onRename(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur();
              }}
            />
          </PanelHeader>

          <SlotGrid
            layout={layout}
            names={names}
            containerId={folderId}
            columns={columns}
            variant="panel"
            disabled={!modal.isOpen}
            onOpen={onOpen}
          />
        </>
      )}
    </Panel>
  );
}
