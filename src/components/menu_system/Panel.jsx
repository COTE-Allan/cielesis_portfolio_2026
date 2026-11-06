import {t} from '../../i18n/i18n';
import {RoundIcon} from '../icons/RoundIcon';
import {Modal} from '../modal/Modal';
import {playSound} from '../sound/sound';
import './Panel.scss';

// modal holding a grid of icons: a folder or the badge case.
export function Panel(props) {
  return <Modal {...props} className="panel" />;
}

// header of a panel: its content, then a close button shown as a tab on top of the panel.
export function PanelHeader({onClose, children}) {
  return (
    <header className="modal-header panel-header">
      {children}
      <button
        type="button"
        className="panel-tab"
        onClick={() => {
          playSound('click');
          onClose();
        }}
        aria-label={t('common.close')}
      >
        <RoundIcon name="reply" />
      </button>
    </header>
  );
}
