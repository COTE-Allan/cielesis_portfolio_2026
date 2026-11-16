import {t} from '../../i18n/i18n';
import {RoundIcon} from '../icons/RoundIcon';
import {BadgePin} from './BadgePin';
import {Icon} from './Icon';
import {Panel, PanelHeader} from './Panel';
import {SlotGrid} from './SlotGrid';
import {PINS} from './menuData';
import {MAX_NAME_LENGTH, defaultFolderLabel, getItem, toPinId} from './layout';
import './FolderModal.scss';

// open folder: its pinned badge, its (editable) name and its icons.
// `modal` is the useModal() of the folder, `onClose` closes it from Escape or the backdrop.
// `columns` follows the zoom of the menu (Menu.jsx).
export function FolderModal({ref, modal, onClose, keepMounted, folderId, layout, names, columns, onRename, onOpen}) {
  const pinnedId = folderId && layout[PINS][folderId];
  const folder = folderId ? getItem(folderId, names) : undefined;
  const pinned = pinnedId && getItem(pinnedId);

  return (
    <Panel
      ref={ref}
      open={modal.isOpen}
      onClose={onClose}
      onExited={modal.onExited}
      keepMounted={keepMounted}
      label={folder?.label}
    >
      {folderId && (
        <>
          <PanelHeader onClose={modal.hide}>
            <BadgePin id={toPinId(folderId, 'header')} disabled={!modal.isOpen} className="badge-pin-header">
              {pinned ? (
                <Icon
                  key={pinnedId}
                  id={pinnedId}
                  image={pinned.image}
                  label={pinned.label}
                  pixelArt={pinned.pixelArt}
                  isBadge
                />
              ) : (
                <RoundIcon name="push_pin" title={t('menu.pinHint')} />
              )}
            </BadgePin>
            <input
              className="folder-name"
              aria-label={t('menu.folderName')}
              maxLength={MAX_NAME_LENGTH}
              placeholder={defaultFolderLabel(folderId)}
              value={names[folderId] ?? ''}
              onChange={(event) => onRename(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur();
              }}
            />
          </PanelHeader>

          {folder.desc && <p className="folder-desc">{folder.desc}</p>}

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
