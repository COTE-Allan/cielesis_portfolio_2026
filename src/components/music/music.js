import {useSyncExternalStore} from 'react';
import {read, write} from '../tools/storage';

const files = import.meta.glob('../../assets/songs/*.{mp3,ogg,opus,wav,m4a,aac,flac,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const STORAGE_KEY = 'music';
const RESTART_AFTER = 3;
const FADE_MS = 600;

function parseName(path) {
  const name = path.split('/').pop().replace(/\.[^.]+$/, '');
  const clean = name.replace(/^\d+\s*[-._)]?\s*/, '').replace(/_/g, ' ').trim() || name;
  const [artist, ...title] = clean.split(' - ');

  return title.length ? {artist: artist.trim(), title: title.join(' - ').trim()} : {artist: '', title: clean};
}

export const SONGS = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b, undefined, {numeric: true}))
  .map(([path, url], index) => ({index, url, ...parseName(path)}));

const isBoolean = (value) => typeof value === 'boolean';
const isVolume = (value) => typeof value === 'number' && value >= 0 && value <= 1;

const saved = read(STORAGE_KEY) ?? {};

// `shuffle`: "next" picks a random song. `loop`: the current song plays again and again.
let state = {
  index: 0,
  playing: false,
  shuffle: isBoolean(saved.shuffle) ? saved.shuffle : false,
  loop: isBoolean(saved.loop) ? saved.loop : false,
  muted: isBoolean(saved.muted) ? saved.muted : false,
  volume: isVolume(saved.volume) ? saved.volume : 0.5,
};
// apart from the state: it changes several times a second, only the progress bar needs it.
let time = {current: 0, duration: 0};

const stateListeners = new Set();
const timeListeners = new Set();
// songs played in shuffle mode, so "previous" goes back to them.
const history = [];

function setState(changes) {
  state = {...state, ...changes};
  const {shuffle, loop, muted, volume} = state;
  write(STORAGE_KEY, {shuffle, loop, muted, volume});
  stateListeners.forEach((listener) => listener());
}

function setTime(next) {
  time = next;
  timeListeners.forEach((listener) => listener());
}

let audio = null;
let fade = 1;
let fadeFrame = null;
let pausedByFade = false;

const applyVolume = () => {
  if (audio) audio.volume = state.volume * fade;
};

// created on the first play.
function getAudio() {
  if (audio) return audio;

  audio = new Audio();
  audio.preload = 'auto';
  audio.volume = state.volume * fade;
  audio.muted = state.muted;
  audio.loop = state.loop;

  const updateTime = () => setTime({current: audio.currentTime, duration: audio.duration || 0});
  audio.addEventListener('play', () => setState({playing: true}));
  audio.addEventListener('pause', () => setState({playing: false}));
  audio.addEventListener('timeupdate', updateTime);
  audio.addEventListener('durationchange', updateTime);
  audio.addEventListener('emptied', updateTime);
  audio.addEventListener('ended', () => next());

  return audio;
}

function load(index) {
  const player = getAudio();
  player.src = SONGS[index].url;
  setState({index});
}

function play() {
  getAudio()
    .play()
    .catch(() => {});
}

export function playSong(index, {remember = true} = {}) {
  if (!SONGS[index]) return;

  if (remember && state.shuffle) history.push(state.index);
  load(index);
  play();
}

export function togglePlay() {
  if (!SONGS.length) return;

  const player = getAudio();
  if (!player.src) load(state.index);

  if (player.paused) play();
  else player.pause();
}

function randomIndex() {
  if (SONGS.length < 2) return state.index;

  const other = Math.floor(Math.random() * (SONGS.length - 1));
  return other >= state.index ? other + 1 : other;
}

export function next() {
  if (!SONGS.length) return;

  playSong(state.shuffle ? randomIndex() : (state.index + 1) % SONGS.length);
}

export function previous() {
  if (!SONGS.length) return;

  if (audio && audio.currentTime > RESTART_AFTER) {
    audio.currentTime = 0;
    return;
  }

  const index = state.shuffle && history.length ? history.pop() : (state.index - 1 + SONGS.length) % SONGS.length;
  playSong(index, {remember: false});
}

export function seek(seconds) {
  if (!audio?.src) return;

  audio.currentTime = seconds;
  setTime({...time, current: seconds});
}

export function setShuffle(shuffle) {
  history.length = 0;
  setState({shuffle});
}

export function setLoop(loop) {
  if (audio) audio.loop = loop;
  setState({loop});
}

export function setMuted(muted) {
  if (audio) audio.muted = muted;
  setState({muted});
}

// turning the volume up unmutes.
export function setVolume(volume) {
  if (audio && volume > 0) audio.muted = false;
  setState({volume, muted: volume > 0 ? false : state.muted});
  applyVolume();
}

function fadeTo(target, onDone) {
  cancelAnimationFrame(fadeFrame);
  const from = fade;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / FADE_MS, 1);
    fade = from + (target - from) * progress;
    applyVolume();

    if (progress < 1) fadeFrame = requestAnimationFrame(step);
    else {
      fadeFrame = null;
      onDone?.();
    }
  };

  fadeFrame = requestAnimationFrame(step);
}

// the volume goes down to nothing, then the music pauses (when a project opens).
export function fadeOutMusic() {
  if (!audio || audio.paused) return;

  fadeTo(0, () => {
    pausedByFade = true;
    audio.pause();
  });
}

// the music paused by fadeOutMusic plays again, its volume coming back up.
// called before the fade out is over, it stops it (the music never paused).
export function fadeInMusic() {
  if (pausedByFade) {
    pausedByFade = false;
    play();
  }

  if (fade < 1) fadeTo(1);
}

const subscribe = (listeners) => (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const subscribeState = subscribe(stateListeners);
const subscribeTime = subscribe(timeListeners);

export const useMusic = () => useSyncExternalStore(subscribeState, () => state);

export const useMusicTime = () => useSyncExternalStore(subscribeTime, () => time);
