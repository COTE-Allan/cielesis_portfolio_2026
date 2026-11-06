import {getSettings} from '../settings/settings';

// sound effects: one .wav file per sound in assets/audio, played by its name
// (playSound('click') plays click.wav). `sounds` and `soundVolume` (settings.js) turn them off or down.

const files = import.meta.glob('../../assets/audio/*.wav', {eager: true, query: '?url', import: 'default'});

const URLS = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.match(/([\w-]+)\.wav$/)[1], url])
);

// the same sound played again this soon is skipped (a mouse sweeping over the icons).
const MIN_GAP_MS = 40;

// files are downloaded right away, but decoded on their first play:
// decoding needs an audio context, which browsers only start after a click or a key press.
const downloads = new Map(
  Object.entries(URLS).map(([name, url]) => [
    name,
    fetch(url)
      .then((response) => response.arrayBuffer())
      .catch(() => null),
  ])
);
const buffers = new Map();
const lastPlayed = new Map();

let context = null;
let master = null;

function getContext() {
  if (context) return context;

  const AudioContext = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContext) return null;

  context = new AudioContext();
  master = context.createGain();
  master.connect(context.destination);
  return context;
}

function decode(name) {
  if (!buffers.has(name)) {
    const promise = downloads
      .get(name)
      .then((data) => (data ? context.decodeAudioData(data.slice(0)) : null));
    promise.catch(() => buffers.delete(name));
    buffers.set(name, promise);
  }

  return buffers.get(name);
}

// before the first click or key press, the browser would only queue the sounds
// (and play them all at once later): they are dropped instead.
const canStart = () => navigator.userActivation?.hasBeenActive ?? true;

// `throttle: false` plays it even right after the same sound (see MIN_GAP_MS).
// `pitch`: in semitones, higher (and shorter) above 0, lower below.
export function playSound(name, {throttle = true, pitch = 0} = {}) {
  const {sounds, soundVolume} = getSettings();
  if (!sounds || soundVolume <= 0 || !Object.hasOwn(URLS, name) || !canStart()) return;

  const now = performance.now();
  if (throttle && now - (lastPlayed.get(name) ?? -Infinity) < MIN_GAP_MS) return;
  lastPlayed.set(name, now);

  const audio = getContext();
  if (!audio) return;

  Promise.all([decode(name), audio.state === 'running' ? null : audio.resume()])
    .then(([buffer]) => {
      if (!buffer) return;

      const source = audio.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = 2 ** (pitch / 12);
      source.connect(master);
      master.gain.value = getSettings().soundVolume;
      source.start();
    })
    .catch(() => {});
}
