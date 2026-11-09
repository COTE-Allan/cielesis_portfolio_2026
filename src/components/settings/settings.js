import {useSyncExternalStore} from 'react';
import {read, write} from '../tools/storage';

const THEME_KEY = 'theme';
const SETTINGS_KEY = 'settings';

const DEFAULTS = {
  theme: 'light',
  reduceMotion: null,
  highContrast: false,
  plainBackground: false,
  strongFocus: false,
  bootScreen: true,
  sounds: true,
  // between 0 and 1.
  soundVolume: 0.5,
  musicOnStart: false,
};

const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const isBoolean = (value) => typeof value === 'boolean';
const isVolume = (value) => typeof value === 'number' && value >= 0 && value <= 1;

function load() {
  const saved = read(SETTINGS_KEY) ?? {};
  const pick = (name, valid) => (valid(saved[name]) ? saved[name] : DEFAULTS[name]);

  return {
    theme: read(THEME_KEY) === 'dark' ? 'dark' : 'light',
    reduceMotion: pick('reduceMotion', isBoolean),
    highContrast: pick('highContrast', isBoolean),
    plainBackground: pick('plainBackground', isBoolean),
    strongFocus: pick('strongFocus', isBoolean),
    bootScreen: pick('bootScreen', isBoolean),
    sounds: pick('sounds', isBoolean),
    soundVolume: pick('soundVolume', isVolume),
    musicOnStart: pick('musicOnStart', isBoolean),
  };
}

function save({theme, ...others}) {
  write(THEME_KEY, theme);
  write(SETTINGS_KEY, others);
}

// whether animations are reduced: the setting, or the system's preference when it is not set.
export const reducesMotion = (settings) => settings.reduceMotion ?? systemMotion.matches;

function setAttribute(name, value) {
  if (value) document.documentElement.dataset[name] = value;
  else delete document.documentElement.dataset[name];
}

function applySettings(settings) {
  setAttribute('theme', settings.theme);
  setAttribute('motion', reducesMotion(settings) ? 'reduce' : 'full');
  setAttribute('contrast', settings.highContrast && 'high');
  setAttribute('background', settings.plainBackground && 'plain');
  setAttribute('focus', settings.strongFocus && 'strong');
}

let settings = load();
const listeners = new Set();

function update(next) {
  settings = next;
  save(settings);
  applySettings(settings);
  listeners.forEach((listener) => listener());
}

applySettings(settings);


systemMotion.addEventListener('change', () => {
  if (settings.reduceMotion !== null) return;

  settings = {...settings};
  applySettings(settings);
  listeners.forEach((listener) => listener());
});

export const getSettings = () => settings;

export const setSetting = (name, value) => update({...settings, [name]: value});

export const resetSettings = () => update({...DEFAULTS, theme: settings.theme});

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const useSettings = () => useSyncExternalStore(subscribe, getSettings);
