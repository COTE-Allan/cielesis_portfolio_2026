import {RoundIcon} from '../icons/RoundIcon';
import {Panel, PanelHeader} from './Panel';
import {SlotGrid} from './SlotGrid';
import {BADGE_CASE} from './menuData';
import './BadgeCaseModal.scss';

// the badges not pinned on a folder.
// `modal` is the useModal() of the case, `onClose` closes it from Escape or the backdrop.
// `columns` follows the zoom of the menu (Menu.jsx).
export function BadgeCaseModal({ref, modal, onClose, keepMounted, layout, names, columns, onOpen}) {
  return (
    <Panel
      ref={ref}
      open={modal.isOpen}
      onClose={onClose}
      onExited={modal.onExited}
      keepMounted={keepMounted}
      label="Badges"
    >
      {modal.data && (
        <>
          <PanelHeader onClose={modal.hide}>
            <h2 className="badge-case-title">
              <RoundIcon name="workspace_premium" filled />
              Badges
            </h2>
          </PanelHeader>

          <SlotGrid
            layout={layout}
            names={names}
            containerId={BADGE_CASE}
            columns={columns}
            mobileColumns={4}
            variant="panel"
            disabled={!modal.isOpen}
            onOpen={onOpen}
          />
        </>
      )}
    </Panel>
  );
}
