import {useEffect, useId, useRef, useState} from 'react';
import {t} from '../../i18n/i18n';
import {Button} from '../button/Button';
import {RoundIcon} from '../icons/RoundIcon';
import {playSound} from '../sound/sound';

// burger button at the end of the project controls, opening a list of links above it.
// `entries`: [{id, label, link}]. closes on a second click, a click outside, Escape
// (which then leaves the project open) or a chosen link.
export function ProjectMenu({entries}) {
  const [open, setOpen] = useState(false);
  // the list stays mounted while its exit animation plays (like Modal.jsx).
  const [listShown, setListShown] = useState(false);
  if (open && !listShown) setListShown(true);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    // on window, capturing: runs before the modal's listener, which would close the project.
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [open]);

  return (
    <div className="project-menu" ref={rootRef}>
      <Button
        ref={buttonRef}
        className="project-end"
        onClick={() => setOpen((value) => !value)}
        aria-label={t('menu.projectMenu')}
        aria-expanded={open}
        aria-controls={listId}
      >
        {/* both icons stay mounted so one can turn out while the other turns in (ProjectCard.scss) */}
        <span className={`project-menu-icon${open ? ' project-menu-icon-open' : ''}`} aria-hidden="true">
          <RoundIcon name="menu" className="project-menu-icon-burger" />
          <RoundIcon name="close" className="project-menu-icon-close" />
        </span>
      </Button>

      {listShown && (
        <ul
          id={listId}
          className={`project-menu-list animate__animated animate__${open ? 'fadeInUp' : 'fadeOutDown'}`}
          data-closing={open ? undefined : ''}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && !open) setListShown(false);
          }}
        >
          {entries.map((entry) => (
            <li key={entry.id}>
              <a
                href={entry.link}
                className="project-menu-link"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  playSound('launch_app');
                  setOpen(false);
                }}
              >
                {entry.label}
                <RoundIcon name="open_in_new" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
