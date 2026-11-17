import {t} from '../../i18n/i18n';
import {RoundIcon} from '../icons/RoundIcon';
import {Panel, PanelHeader} from './Panel';
import {SlotGrid} from './SlotGrid';
import {BADGE_CASE} from './menuData';
import './BadgeCaseModal.scss';

// panel holding the badges not pinned on a folder.
export function BadgeCaseModal({ref, modal, onClose, keepMounted, layout, names, columns, onOpen}) {
  return (
    <Panel
      ref={ref}
      open={modal.isOpen}
      onClose={onClose}
      onExited={modal.onExited}
      keepMounted={keepMounted}
      label={t('menu.badges')}
    >
      {modal.data && (
        <>
          <PanelHeader onClose={modal.hide}>
            <h2 className="badge-case-title">
              <RoundIcon name="workspace_premium" filled />
              {t('menu.badges')}
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
