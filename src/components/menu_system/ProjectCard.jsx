import {t} from '../../i18n/i18n';
import {Button} from '../button/Button';
import {RoundIcon} from '../icons/RoundIcon';
import {Modal} from '../modal/Modal';
import {ProjectMenu} from './ProjectMenu';
import '../tooltip/Tooltip.scss';
import './ProjectCard.scss';

// project opened from its icon: logo, description, back and open buttons,
// and the menu of its links (ProjectMenu) when it has one.
// `modal` is the useModal() of the project, `onClose` closes it from Escape or the backdrop.
// the modal only fades: its parts come in one after the other (ProjectCard.scss),
// and all leave together.
export function ProjectCard({modal, onClose, item}) {
  const animation = (enter, exit) => `animate__animated animate__${modal.isOpen ? enter : exit}`;

  return (
    <Modal
      open={modal.isOpen}
      onClose={onClose}
      onExited={modal.onExited}
      className="project"
      label={item?.label}
      enter="fadeIn"
      exit="fadeOut"
    >
      {item && (
        <>
          <img
            className={`project-img ${animation('zoomIn', 'zoomOut')}`}
            src={item.logo || item.image}
            alt={item.label}
          />

          <div className="project-content">
            {/* styled like a tooltip, its dot on the controls. */}
            {item.desc && (
              <div className={`project-desc ${animation('zoomIn', 'zoomOut')}`}>
                <p className="tooltip-bubble project-text">{item.desc}</p>
                <span className="tooltip-line" aria-hidden="true" />
                <span className="tooltip-dot" aria-hidden="true" />
              </div>
            )}

            <div className={`project-controls ${animation('slideInUp', 'slideOutDown')}`}>
              <Button className="project-back" onClick={modal.hide} aria-label={t('menu.closeProject')}>
                <RoundIcon name="arrow_left" />
              </Button>
              {item.link && (
                <Button
                  href={item.link}
                  className="project-open"
                  sound="launch_app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('menu.openProject')}
                </Button>
              )}
              {item.menu?.length ? (
                <ProjectMenu entries={item.menu} />
              ) : (
                // empty end, the size of the back button (same icon, hidden), so the bar is symmetric.
                <div className="button project-end project-end-empty" aria-hidden="true">
                  <RoundIcon name="arrow_left" />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
