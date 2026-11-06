import {useState} from 'react';
import 'animate.css';
import {RoundIcon} from '../icons/RoundIcon';
import {t} from '../../i18n/i18n';
import {setSetting, useSettings} from '../settings/settings';
import './BootScreen.scss';

export function BootScreen({onDone}) {
  const [leaving, setLeaving] = useState(false);
  const dark = useSettings().theme === 'dark';

  const start = () => {
    if (!leaving) setLeaving(true);
  };

  const toggleTheme = (event) => {
    event.stopPropagation();
    setSetting('theme', dark ? 'light' : 'dark');
  };

  return (
    <div
      className={`boot${leaving ? ' animate__animated animate__fadeOut' : ''}`}
      onClick={start}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) onDone?.();
      }}
    >
      <span className="boot-squares" aria-hidden="true">
        {Array.from({length: 8}, (_, i) => (
          <span key={i} className="boot-square" />
        ))}
      </span>

      <div className="boot-content">
        <h1 className="boot-title">
          <RoundIcon name="warning" filled className="boot-title-icon" />
          {t('boot.title')}
        </h1>

        <p className="boot-text">{t('boot.text')}</p>

        <p className="boot-note">{t('boot.darkQuestion')}</p>
        <p className="boot-note-strong">{t('boot.darkHint')}</p>

        <button type="button" className="boot-hint" autoFocus disabled={leaving}>
          {t('boot.continue')}
        </button>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label={t('common.darkMode')}
        title={dark ? t('common.switchToLight') : t('common.switchToDark')}
        className={`boot-theme${dark ? ' boot-theme-dark' : ''}`}
        disabled={leaving}
        onClick={toggleTheme}
      >
        <span className="boot-theme-knob" aria-hidden="true" />
        <RoundIcon name="light_mode" filled className="boot-theme-sun" />
        <RoundIcon name="dark_mode" filled className="boot-theme-moon" />
      </button>
    </div>
  );
}
