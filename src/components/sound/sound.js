import {getSettings} from '../settings/settings';

// sound effects: one .wav file per sound in assets/audio, played by its name
// (playSound('click') plays click.wav). `sounds` and `soundVolume` (settings.js) turn them off or down.

const files = import.meta.glob('../../assets/audio/*.wav', {eager: true, query: '?url', import: 'default'});

const URLS = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.match(/([\w-]+)\.wav$/)[1], url])
);

// the same sound played again this soon is skipped (a mouse sweeping over the icons).
const MIN_GAP_MS = 40;
// a jingle cut short (its project closed) fades out this fast.
const JINGLE_FADE_S = 0.3;

// files are kept by url. the sound effects are downloaded right away, the jingles when asked
// (loadSound), and all are decoded on their first play:
// decoding needs an audio context, which browsers only start after a click or a key press.
const downloads = new Map();
const buffers = new Map();
const lastPlayed = new Map();

export function loadSound(url) {
  if (!downloads.has(url)) {
    downloads.set(
      url,
      fetch(url)
        .then((response) => response.arrayBuffer())
        .catch(() => null)
    );
  }

  return downloads.get(url);
}

Object.values(URLS).forEach(loadSound);

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

function decode(url) {
  if (!buffers.has(url)) {
    const promise = loadSound(url).then((data) => (data ? context.decodeAudioData(data.slice(0)) : null));
    promise.catch(() => buffers.delete(url));
    buffers.set(url, promise);
  }

  return buffers.get(url);
}

// before the first click or key press, the browser would only queue the sounds
// (and play them all at once later): they are dropped instead.
const canStart = () => navigator.userActivation?.hasBeenActive ?? true;

const canPlay = () => {
  const {sounds, soundVolume} = getSettings();
  return sounds && soundVolume > 0 && canStart();
};

// plays the file at `url` (once it is decoded), through its own gain node.
// returns stop(fade): stops it, fading it out over `fade` seconds (0: at once).
function start(url, {pitch = 0} = {}) {
  const audio = getContext();
  if (!audio) return () => {};

  let stopped = false;
  let stopPlaying = null;

  Promise.all([decode(url), audio.state === 'running' ? null : audio.resume()])
    .then(([buffer]) => {
      if (!buffer || stopped) return;

      const source = audio.createBufferSource();
      const gain = audio.createGain();
      source.buffer = buffer;
      source.playbackRate.value = 2 ** (pitch / 12);
      source.connect(gain).connect(master);
      master.gain.value = getSettings().soundVolume;
      source.start();

      stopPlaying = (fade) => {
        const end = audio.currentTime + fade;
        gain.gain.setValueAtTime(gain.gain.value, audio.currentTime);
        gain.gain.linearRampToValueAtTime(0, end);
        source.stop(end);
      };
    })
    .catch(() => {});

  return (fade = 0) => {
    if (stopped) return;
    stopped = true;
    stopPlaying?.(fade);
  };
}

// `throttle: false` plays it even right after the same sound (see MIN_GAP_MS).
// `pitch`: in semitones, higher (and shorter) above 0, lower below.
export function playSound(name, {throttle = true, pitch = 0} = {}) {
  if (!Object.hasOwn(URLS, name) || !canPlay()) return;

  const now = performance.now();
  if (throttle && now - (lastPlayed.get(name) ?? -Infinity) < MIN_GAP_MS) return;
  lastPlayed.set(name, now);

  start(URLS[name], {pitch});
}

// a project's jingle (its url), with the sound effects' settings.
// returns a function that stops it with a short fade out.
export function playJingle(url) {
  if (!url || !canPlay()) return () => {};

  const stop = start(url);
  return () => stop(JINGLE_FADE_S);
}
