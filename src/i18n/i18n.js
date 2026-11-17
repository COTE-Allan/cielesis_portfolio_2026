import {useSyncExternalStore} from 'react';
import {read, write} from '../components/tools/storage';

// translations, one json file per language in ./locales, with en.json as the reference.

export const DEFAULT_LANGUAGE = 'en';
const LANGUAGE_KEY = 'language';

const files = import.meta.glob('./locales/*.json', {eager: true, import: 'default'});

// flattens nested texts into dotted keys, leaving out the keys starting with an underscore.
function flatten(object, prefix = '', into = {}) {
  for (const [key, value] of Object.entries(object)) {
    if (key.startsWith('_')) continue;
    if (value && typeof value === 'object') flatten(value, `${prefix}${key}.`, into);
    else if (typeof value === 'string' && value !== '') into[`${prefix}${key}`] = value;
  }

  return into;
}

const catalogs = Object.fromEntries(
  Object.entries(files).map(([path, messages]) => [path.match(/([\w-]+)\.json$/)[1], flatten(messages)])
);

const nameOf = (code) => {
  const name = new Intl.DisplayNames([code], {type: 'language'}).of(code) ?? code;
  return name[0].toLocaleUpperCase(code) + name.slice(1);
};

// available languages with their own names, english first.
export const LANGUAGES = Object.keys(catalogs)
  .sort((a, b) => (a === DEFAULT_LANGUAGE ? -1 : b === DEFAULT_LANGUAGE ? 1 : a.localeCompare(b)))
  .map((code) => ({code, name: nameOf(code)}));

const isLanguage = (code) => Object.hasOwn(catalogs, code);

// share of the english texts a language must have translated to be picked automatically.
const AUTO_THRESHOLD = 0.8;

function coverage(code) {
  const keys = Object.keys(catalogs[DEFAULT_LANGUAGE]);
  return keys.filter((key) => Object.hasOwn(catalogs[code], key)).length / keys.length;
}

// first browser language with a file translated enough, or english.
function detectLanguage() {
  const codes = Object.keys(catalogs);
  const find = (tag) => codes.find((code) => code.toLowerCase() === tag.toLowerCase());

  for (const tag of navigator.languages ?? [navigator.language]) {
    const code = find(tag) ?? find(tag.split('-')[0]);
    if (code && coverage(code) >= AUTO_THRESHOLD) return code;
  }

  return DEFAULT_LANGUAGE;
}

// language chosen in the settings, or the detected one until a choice is made.
let language = isLanguage(read(LANGUAGE_KEY)) ? read(LANGUAGE_KEY) : detectLanguage();
const listeners = new Set();

const OG_LOCALES = {en: 'en_US', fr: 'fr_FR'};

const setMeta = (selector, content) => document.head.querySelector(selector)?.setAttribute('content', content);

// updates the tab title and the description to the current language.
function applyLanguage() {
  document.documentElement.lang = language;
  document.title = t('meta.title');
  setMeta('meta[name="description"]', t('meta.description'));
  if (OG_LOCALES[language]) setMeta('meta[property="og:locale"]', OG_LOCALES[language]);
}

export const getLanguage = () => language;

export function setLanguage(code) {
  if (!isLanguage(code) || code === language) return;

  language = code;
  write(LANGUAGE_KEY, code);
  applyLanguage();
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// renders the caller again when the language changes.
export const useLanguage = () => useSyncExternalStore(subscribe, getLanguage);

const lookup = (key) => catalogs[language]?.[key] ?? catalogs[DEFAULT_LANGUAGE][key];

// whether `key` has a text, in the current language or in english.
export const hasText = (key) => lookup(key) !== undefined;

const warned = new Set();

// text of `key` in the current language, falling back to english, with its placeholders replaced by `values`.
export function t(key, values) {
  const text = lookup(key);

  if (text === undefined) {
    if (import.meta.env.DEV && !warned.has(key)) {
      warned.add(key);
      console.warn(`[i18n] missing key "${key}" in en.json`);
    }
    return key;
  }

  if (!values) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in values ? String(values[name]) : match));
}

applyLanguage();
