import {useRef} from 'react';
import {RoundIcon} from '../icons/RoundIcon';
import {t} from '../../i18n/i18n';
import {DrawingPad} from '../drawing/DrawingPad';
import {useModal} from '../modal/useModal';
import {NotesPanel} from '../notes/NotesPanel';
import {useMusic} from '../music/music';
import {MusicPlayer} from '../music/MusicPlayer';
import {SettingsModal} from '../settings/SettingsModal';
import {setSetting, useSettings} from '../settings/settings';
import {playSound} from '../sound/sound';
import {useIntroAnimation} from './introAnimation';
import './Toolbar.scss';

// toolbar button with a click sound and an optional hover sound.
function ToolButton({icon, label, className, sound = 'click', hoverSound, onClick, children, ...props}) {
  const handleClick = (event) => {
    playSound(sound);
    onClick?.(event);
  };
  const handlePointerEnter = (event) => {
    if (hoverSound && event.pointerType === 'mouse') playSound(hoverSound);
  };

  return (
    <button
      type="button"
      className={`toolbar-button ${className}`}
      aria-label={label}
      title={label}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      {...props}
    >
      {children ?? <RoundIcon name={icon} filled />}
    </button>
  );
}


// toolbar of the menu.
export function Toolbar({zoom, maxZoom, onZoom, onResetLayout}) {
  const dark = useSettings().theme === 'dark';
  const settings = useModal();
  const musicPlayer = useModal();
  const drawing = useModal();
  const notes = useModal();
  const {playing} = useMusic();
  const ref = useRef(null);
  useIntroAnimation(ref, 'toolbar');

  const toggleTheme = () => setSetting('theme', dark ? 'light' : 'dark');

  return (
    <>
    <nav ref={ref} className="toolbar" aria-label={t('toolbar.label')}>
      <ToolButton
        label={dark ? t('common.switchToLight') : t('common.switchToDark')}
        className={`toolbar-theme${dark ? ' toolbar-theme-dark' : ''}`}
        sound="theme_swap"
        onClick={toggleTheme}
      >
        <RoundIcon name="light_mode" filled className="toolbar-theme-sun" />
        <RoundIcon name="dark_mode" filled className="toolbar-theme-moon" />
      </ToolButton>

      <div className="toolbar-tools">
        <ToolButton
          icon="music_note"
          label={t('toolbar.music')}
          className={`toolbar-tool toolbar-tool-music${playing ? ' toolbar-tool-playing' : ''}`}
          hoverSound="hover"
          aria-haspopup="dialog"
          onClick={() => musicPlayer.show()}
        />
        <ToolButton
          icon="brush"
          label={t('toolbar.drawing')}
          className="toolbar-tool toolbar-tool-brush"
          hoverSound="hover"
          aria-haspopup="dialog"
          onClick={() => drawing.show()}
        />
        <ToolButton
          icon="note_stack"
          label={t('toolbar.notes')}
          className="toolbar-tool toolbar-tool-notes"
          hoverSound="hover"
          aria-haspopup="dialog"
          onClick={() => notes.show()}
        />
        <ToolButton
          icon="settings"
          label={t('toolbar.settings')}
          className="toolbar-tool toolbar-tool-settings"
          hoverSound="hover"
          aria-haspopup="dialog"
          onClick={() => settings.show()}
        />
      </div>

      <div className="toolbar-zoom" role="group" aria-label={t('toolbar.size')}>
        <ToolButton
          icon="zoom_out"
          label={t('toolbar.zoomOut')}
          className="toolbar-zoom-button"
          sound="zoom_out"
          disabled={zoom <= 0}
          onClick={() => onZoom(zoom - 1)}
        />
        <ToolButton
          icon="zoom_in"
          label={zoom < maxZoom ? t('toolbar.zoomIn') : t('toolbar.zoomInFull')}
          className="toolbar-zoom-button"
          sound="zoom_in"
          disabled={zoom >= maxZoom}
          onClick={() => onZoom(zoom + 1)}
        />
      </div>
    </nav>
    <MusicPlayer modal={musicPlayer} />
    <DrawingPad modal={drawing} />
    <NotesPanel modal={notes} />
    <SettingsModal modal={settings} onResetLayout={onResetLayout} />
    </>
  );
}
