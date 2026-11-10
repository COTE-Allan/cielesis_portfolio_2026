import {useEffect, useRef} from 'react';
import {t} from '../../i18n/i18n';
import {Button} from '../button/Button';
import {RoundIcon} from '../icons/RoundIcon';
import {Modal} from '../modal/Modal';
import {loadSound, playJingle} from '../sound/sound';
import {ProjectMenu} from './ProjectMenu';
import '../tooltip/Tooltip.scss';
import './ProjectCard.scss';

// Safari draws the transparent parts of a webm in black.
const SUPPORTS_ALPHA_WEBM = !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export function ProjectCard({modal, onClose, item}) {
  const animation = (enter, exit) => `animate__animated animate__${modal.isOpen ? enter : exit}`;
  const jingle = item?.jingle;
  const stopJingle = useRef(null);
  const videoRef = useRef(null);
  const logoVideo = SUPPORTS_ALPHA_WEBM ? item?.logoVideo : undefined;
  const logoAnimation = animation('zoomIn', 'zoomOut');
  const logoClass = `project-img ${logoAnimation}`;

  const onLogoAnimationStart = (event) => {
    if (!modal.isOpen || event.animationName !== 'zoomIn') return;

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
    if (jingle) {
      stopJingle.current?.();
      stopJingle.current = playJingle(jingle);
    }
  };

  useEffect(() => {
    if (!modal.isOpen || !jingle) return undefined;

    loadSound(jingle);
    return () => {
      stopJingle.current?.();
      stopJingle.current = null;
    };
  }, [modal.isOpen, jingle]);

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
          {logoVideo ? (
            <video
              ref={videoRef}
              className={logoClass}
              src={logoVideo}
              aria-label={item.label}
              muted
              loop
              playsInline
              preload="auto"
              onAnimationStart={onLogoAnimationStart}
            />
          ) : item.logo ? (
            <img
              className={logoClass}
              src={item.logo}
              alt={item.label}
              onAnimationStart={onLogoAnimationStart}
            />
          ) : (
            <h2 className={`project-title ${logoAnimation}`} onAnimationStart={onLogoAnimationStart}>
              {item.label}
            </h2>
          )}

          <div className="project-content">
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
