import {useEffect, useId, useRef, useState} from 'react';
import {t} from '../../i18n/i18n';
import {Button} from '../button/Button';
import {RoundIcon} from '../icons/RoundIcon';

// burger button at the end of the project controls, opening a list of links above it.
// `entries`: [{id, label, link}]. closes on a second click, a click outside, Escape
// (which then leaves the project open) or a chosen link.
export function ProjectMenu({entries}) {
  const [open, setOpen] = useState(false);
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
        <RoundIcon name={open ? 'close' : 'menu'} />
      </Button>

      {open && (
        <ul id={listId} className="project-menu-list animate__animated animate__fadeInUp">
          {entries.map((entry) => (
            <li key={entry.id}>
              <a
                href={entry.link}
                className="project-menu-link"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
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
