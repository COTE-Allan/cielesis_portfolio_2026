import {RoundIcon} from '../icons/RoundIcon';
import {Panel, PanelHeader} from './Panel';
import './BadgeViewer.scss';

// a badge shown big, with its name.
export function BadgeViewer({modal, onClose, badge}) {
  return (
    <Panel open={modal.isOpen} onClose={onClose} onExited={modal.onExited} label={badge?.label}>
      {badge && (
        <div className="badge-viewer">
          <PanelHeader onClose={modal.hide}>
            <h2 className="badge-viewer-title">
              <RoundIcon name="workspace_premium" filled />
              {badge.label}
            </h2>
          </PanelHeader>
          <img
            className={`badge-viewer-img${badge.pixelArt ? ' badge-viewer-pixel-art' : ''}`}
            src={badge.image}
            alt={badge.label}
            draggable={false}
          />
        </div>
      )}
    </Panel>
  );
}
