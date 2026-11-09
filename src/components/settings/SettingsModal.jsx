import {useEffect, useId, useState} from 'react';
import {LANGUAGES, setLanguage, t, useLanguage} from '../../i18n/i18n';
import {Button} from '../button/Button';
import {RoundIcon} from '../icons/RoundIcon';
import {playSound} from '../sound/sound';
import {Panel, PanelHeader} from '../menu_system/Panel';
import {reducesMotion, resetSettings, setSetting, useSettings} from './settings';
import './SettingsModal.scss';

// a reset button waits this long for its confirmation click, then shows it is done for this long.
const CONFIRM_MS = 3000;
const DONE_MS = 1600;

// one line of a group: its label and description, then its control.
function Row({label, description, children}) {
  const id = useId();

  return (
    <li className="settings-row">
      <div className="settings-row-text">
        <span id={`${id}-label`} className="settings-row-label">{label}</span>
        {description && <span id={`${id}-description`} className="settings-row-description">{description}</span>}
      </div>
      {children({labelledBy: `${id}-label`, describedBy: description ? `${id}-description` : undefined})}
    </li>
  );
}

// `sound`: played on click (sound.js), null for none.
function Toggle({label, description, checked, onChange, sound = 'click'}) {
  return (
    <Row label={label} description={description}>
      {({labelledBy, describedBy}) => (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          className="settings-switch"
          onClick={() => {
            if (sound) playSound(sound);
            onChange(!checked);
          }}
        >
          <span className="settings-switch-knob" aria-hidden="true" />
        </button>
      )}
    </Row>
  );
}

// each language is written in its own language, so anyone can find theirs.
function LanguageSelect() {
  const language = useLanguage();

  return (
    <Row label={t('settings.language.label')} description={t('settings.language.description')}>
      {({labelledBy, describedBy}) => (
        <span className="settings-select">
          <select
            value={language}
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            onChange={(event) => {
              playSound('click');
              setLanguage(event.target.value);
            }}
          >
            {LANGUAGES.map(({code, name}) => (
              <option key={code} value={code} lang={code}>{name}</option>
            ))}
          </select>
          <RoundIcon name="expand_more" className="settings-select-arrow" />
        </span>
      )}
    </Row>
  );
}

// volume of the sounds, in steps of 5%. a click plays at the new volume once the slider is let go.
function VolumeSlider({volume, disabled}) {
  const percent = Math.round(volume * 100);
  const preview = () => playSound('click');

  return (
    <Row label={t('settings.sound.volume')} description={t('settings.sound.volumeDescription')}>
      {({labelledBy, describedBy}) => (
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={percent}
          disabled={disabled}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-valuetext={`${percent}%`}
          className="settings-range"
          style={{'--value': `${percent}%`}}
          onChange={(event) => setSetting('soundVolume', Number(event.target.value) / 100)}
          onPointerUp={preview}
          onKeyUp={preview}
        />
      )}
    </Row>
  );
}

// asks for a second click before running `onConfirm`.
function ResetButton({label, description, onConfirm}) {
  const [state, setState] = useState('idle');

  useEffect(() => {
    if (state === 'idle') return undefined;

    const timer = setTimeout(() => setState('idle'), state === 'armed' ? CONFIRM_MS : DONE_MS);
    return () => clearTimeout(timer);
  }, [state]);

  const click = () => {
    if (state !== 'armed') return setState('armed');

    setState('done');
    onConfirm();
  };

  return (
    <Row label={label} description={description}>
      {({labelledBy, describedBy}) => (
        <Button
          className={`settings-reset settings-reset-${state}`}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          onClick={click}
        >
          {state === 'done' && <RoundIcon name="check_circle" filled className="settings-reset-check" />}
          {t(`settings.reset.${state === 'idle' ? 'button' : state === 'armed' ? 'confirm' : 'done'}`)}
        </Button>
      )}
    </Row>
  );
}

function Group({icon, title, children}) {
  const id = useId();

  return (
    <section className="settings-group" aria-labelledby={id}>
      <h3 id={id} className="settings-group-title">
        <RoundIcon name={icon} filled />
        {title}
      </h3>
      <ul className="settings-list">{children}</ul>
    </section>
  );
}

// settings of the site, opened from the toolbar. `modal` is the useModal() of the settings.
// `onResetLayout` puts the menu back as it is on a first visit.
export function SettingsModal({modal, onResetLayout}) {
  const settings = useSettings();
  const toggle = (name) => (value) => setSetting(name, value);

  return (
    <Panel open={modal.isOpen} onClose={modal.hide} onExited={modal.onExited} label={t('settings.title')}>
      {modal.data && (
        <div className="settings">
          <PanelHeader onClose={modal.hide}>
            <h2 className="settings-title">
              <RoundIcon name="settings" filled />
              {t('settings.title')}
            </h2>
          </PanelHeader>

          <Group icon="translate" title={t('settings.language.title')}>
            <LanguageSelect />
          </Group>

          <Group icon="palette" title={t('settings.display.title')}>
            <Toggle
              label={t('common.darkMode')}
              description={t('settings.display.darkDescription')}
              checked={settings.theme === 'dark'}
              sound="theme_swap"
              onChange={(dark) => setSetting('theme', dark ? 'dark' : 'light')}
            />
            <Toggle
              label={t('settings.display.contrast')}
              description={t('settings.display.contrastDescription')}
              checked={settings.highContrast}
              onChange={toggle('highContrast')}
            />
            <Toggle
              label={t('settings.display.background')}
              description={t('settings.display.backgroundDescription')}
              checked={settings.plainBackground}
              onChange={toggle('plainBackground')}
            />
          </Group>

          <Group icon="volume_up" title={t('settings.sound.title')}>
            {/* the click plays once the sounds are on, so turning them on is heard. */}
            <Toggle
              label={t('settings.sound.enabled')}
              description={t('settings.sound.enabledDescription')}
              checked={settings.sounds}
              sound={null}
              onChange={(on) => {
                setSetting('sounds', on);
                playSound('click');
              }}
            />
            <VolumeSlider volume={settings.soundVolume} disabled={!settings.sounds} />
            <Toggle
              label={t('settings.sound.musicOnStart')}
              description={t('settings.sound.musicOnStartDescription')}
              checked={settings.musicOnStart}
              onChange={toggle('musicOnStart')}
            />
          </Group>

          <Group icon="accessibility_new" title={t('settings.accessibility.title')}>
            <Toggle
              label={t('settings.accessibility.motion')}
              description={t('settings.accessibility.motionDescription')}
              checked={reducesMotion(settings)}
              onChange={toggle('reduceMotion')}
            />
            <Toggle
              label={t('settings.accessibility.focus')}
              description={t('settings.accessibility.focusDescription')}
              checked={settings.strongFocus}
              onChange={toggle('strongFocus')}
            />
            <Toggle
              label={t('settings.accessibility.warning')}
              description={t('settings.accessibility.warningDescription')}
              checked={settings.bootScreen}
              onChange={toggle('bootScreen')}
            />
          </Group>

          <Group icon="restart_alt" title={t('settings.reset.title')}>
            <ResetButton
              label={t('settings.reset.layout')}
              description={t('settings.reset.layoutDescription')}
              onConfirm={onResetLayout}
            />
            <ResetButton
              label={t('settings.reset.settings')}
              description={t('settings.reset.settingsDescription')}
              onConfirm={resetSettings}
            />
          </Group>
        </div>
      )}
    </Panel>
  );
}
