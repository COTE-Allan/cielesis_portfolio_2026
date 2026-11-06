import {t} from '../../i18n/i18n';
import {RoundIcon} from '../icons/RoundIcon';
import {Panel, PanelHeader} from '../menu_system/Panel';
import {playSound} from '../sound/sound';
import {
  SONGS,
  next,
  playSong,
  previous,
  seek,
  setLoop,
  setMuted,
  setShuffle,
  setVolume,
  togglePlay,
  useMusic,
  useMusicTime,
} from './music';
import './MusicPlayer.scss';

// 83 -> "1:23".
function formatTime(seconds) {
  const total = Math.floor(seconds || 0);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function volumeIcon({muted, volume}) {
  if (muted || volume === 0) return 'volume_off';
  return volume < 0.5 ? 'volume_down' : 'volume_up';
}

// round button of the player. `pressed`: on/off state of a toggle (shuffle, loop, mute).
function Control({icon, label, pressed, className = '', onClick}) {
  return (
    <button
      type="button"
      className={`music-control ${className}`}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      onClick={() => {
        playSound('click');
        onClick();
      }}
    >
      <RoundIcon name={icon} filled />
    </button>
  );
}

// its own component: the time changes several times a second, the rest of the player doesn't.
function Progress() {
  const {current, duration} = useMusicTime();
  const value = Math.min(current, duration);
  const percent = duration ? (value / duration) * 100 : 0;

  return (
    <div className="music-progress">
      <span className="music-time">{formatTime(value)}</span>
      <input
        type="range"
        className="music-range"
        min={0}
        max={duration}
        step={0.1}
        value={value}
        disabled={!duration}
        aria-label={t('music.seek')}
        aria-valuetext={`${formatTime(value)} / ${formatTime(duration)}`}
        style={{'--value': `${percent}%`}}
        onChange={(event) => seek(Number(event.target.value))}
      />
      <span className="music-time">{formatTime(duration)}</span>
    </div>
  );
}

// panel of the music player, opened from the toolbar. `modal` is its useModal().
// the music keeps playing once it is closed (music.js).
export function MusicPlayer({modal}) {
  const music = useMusic();
  const song = SONGS[music.index];
  const volume = music.muted ? 0 : Math.round(music.volume * 100);

  return (
    <Panel open={modal.isOpen} onClose={modal.hide} onExited={modal.onExited} label={t('music.title')}>
      {modal.data && (
        <div className="music">
          <PanelHeader onClose={modal.hide}>
            <h2 className="music-title">
              <RoundIcon name="music_note" filled />
              {t('music.title')}
            </h2>
          </PanelHeader>

          {!song ? (
            <p className="music-empty">{t('music.empty')}</p>
          ) : (
            <>
              <div className="music-now">
                <span className="music-disc" aria-hidden="true">
                  <span className={`music-disc-face${music.playing ? ' music-disc-face-playing' : ''}`} />
                </span>
                <div className="music-song" aria-live="polite">
                  <p className="music-song-title">{song.title}</p>
                  {song.artist && <p className="music-song-artist">{song.artist}</p>}
                </div>
              </div>

              <Progress />

              <div className="music-controls" role="group" aria-label={t('music.controls')}>
                <Control
                  icon="shuffle"
                  label={t('music.shuffle')}
                  pressed={music.shuffle}
                  className="music-toggle"
                  onClick={() => setShuffle(!music.shuffle)}
                />
                <Control icon="skip_previous" label={t('music.previous')} onClick={previous} />
                <Control
                  icon={music.playing ? 'pause' : 'play_arrow'}
                  label={music.playing ? t('music.pause') : t('music.play')}
                  className="music-play"
                  onClick={togglePlay}
                />
                <Control icon="skip_next" label={t('music.next')} onClick={next} />
                <Control
                  icon="repeat_one"
                  label={t('music.loop')}
                  pressed={music.loop}
                  className="music-toggle"
                  onClick={() => setLoop(!music.loop)}
                />
              </div>

              <div className="music-volume">
                <Control
                  icon={volumeIcon(music)}
                  label={t('music.mute')}
                  pressed={music.muted}
                  className="music-toggle music-mute"
                  onClick={() => setMuted(!music.muted)}
                />
                <input
                  type="range"
                  className="music-range"
                  min={0}
                  max={100}
                  step={1}
                  value={volume}
                  aria-label={t('music.volume')}
                  aria-valuetext={`${volume}%`}
                  style={{'--value': `${volume}%`}}
                  onChange={(event) => setVolume(Number(event.target.value) / 100)}
                />
              </div>

              <ol className="music-list" aria-label={t('music.tracks')}>
                {SONGS.map((track) => {
                  const current = track.index === music.index;

                  return (
                    <li key={track.index}>
                      <button
                        type="button"
                        className="music-track"
                        aria-current={current ? 'true' : undefined}
                        onClick={() => {
                          playSound('click');
                          if (current) togglePlay();
                          else playSong(track.index);
                        }}
                      >
                        <span className="music-track-number">
                          {current && music.playing ? <RoundIcon name="graphic_eq" /> : track.index + 1}
                        </span>
                        <span className="music-track-title">{track.title}</span>
                        {track.artist && <span className="music-track-artist">{track.artist}</span>}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </div>
      )}
    </Panel>
  );
}
