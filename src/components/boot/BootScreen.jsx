import {useState} from 'react';
import 'animate.css';
import {RoundIcon} from '../icons/RoundIcon';
import {loadTheme, saveTheme} from '../menu_system/layout';
import './BootScreen.scss';

export function BootScreen({onDone}) {
  const [leaving, setLeaving] = useState(false);
  const [theme, setTheme] = useState(loadTheme);
  const dark = theme === 'dark';

  const start = () => {
    if (!leaving) setLeaving(true);
  };

  const toggleTheme = (event) => {
    event.stopPropagation(); 
    const next = dark ? 'light' : 'dark';
    setTheme(next);
    saveTheme(next);
    document.documentElement.dataset.theme = next; 
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
          Warning - Epilepsy and safety
        </h1>

        <p className="boot-text">
          This website contains flashing colors
          <br />
          and large areas of bright white.
        </p>

        <p className="boot-note">Prefer dark mode?</p>
        <p className="boot-note-strong">Switch to the moon at the bottom of the screen.</p>

        <button type="button" className="boot-hint" autoFocus disabled={leaving}>
          Click anywhere to continue.
        </button>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label="Dark mode"
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
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
