import {useLayoutEffect, useRef, useState} from 'react';
import {RoundIcon} from '../icons/RoundIcon';
import {useIntroAnimation} from './introAnimation';
import {loadTheme, saveTheme} from './layout';
import './Toolbar.scss';

function ToolButton({icon, label, className, children, ...props}) {
  return (
    <button type="button" className={`toolbar-button ${className}`} aria-label={label} title={label} {...props}>
      {children ?? <RoundIcon name={icon} filled />}
    </button>
  );
}


export function Toolbar({zoom, maxZoom, onZoom}) {
  const [theme, setTheme] = useState(loadTheme);
  const dark = theme === 'dark';
  const ref = useRef(null);
  useIntroAnimation(ref, 'toolbar');

  // global.scss picks the page colours from data-theme.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark';
    setTheme(next);
    saveTheme(next);
  };

  return (
    <nav ref={ref} className="toolbar" aria-label="Menu toolbar">
      {/* both icons stay mounted so one can turn out while the other turns in (Toolbar.scss) */}
      <ToolButton
        label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={`toolbar-theme${dark ? ' toolbar-theme-dark' : ''}`}
        onClick={toggleTheme}
      >
        <RoundIcon name="light_mode" filled className="toolbar-theme-sun" />
        <RoundIcon name="dark_mode" filled className="toolbar-theme-moon" />
      </ToolButton>

      <div className="toolbar-tools">
        <ToolButton icon="music_note" label="Music" className="toolbar-tool music" />
        <ToolButton icon="brush" label="Drawing" className="toolbar-tool brush" />
        <ToolButton icon="note_stack" label="Notes" className="toolbar-tool notes" />
        <ToolButton icon="settings" label="Settings" className="toolbar-tool settings" />
      </div>

      <div className="toolbar-zoom" role="group" aria-label="Menu size">
        <ToolButton
          icon="zoom_out"
          label="Zoom out"
          className="toolbar-zoom-button"
          disabled={zoom <= 0}
          onClick={() => onZoom(zoom - 1)}
        />
        <ToolButton
          icon="zoom_in"
          label={zoom < maxZoom ? 'Zoom in' : 'Too many icons to zoom in'}
          className="toolbar-zoom-button"
          disabled={zoom >= maxZoom}
          onClick={() => onZoom(zoom + 1)}
        />
      </div>
    </nav>
  );
}
