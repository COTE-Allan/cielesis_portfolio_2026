import {useSyncExternalStore} from 'react';
import {read, write} from '../components/tools/storage';

// translations: one JSON file per language in ./locales, named by its code (fr.json, es.json...).
// en.json is the reference: the other files have the same keys, an empty string ("")
// meaning "not translated yet" (English is shown instead). `npm run i18n` adds the missing keys.

export const DEFAULT_LANGUAGE = 'en';
const LANGUAGE_KEY = 'language';

const files = import.meta.glob('./locales/*.json', {eager: true, import: 'default'});

// {'settings.title': 'Settings', ...}: keys starting with "_" are left out (_unused, see the script).
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

// [{code: 'en', name: 'English'}, {code: 'fr', name: 'Français'}...], English first.
export const LANGUAGES = Object.keys(catalogs)
  .sort((a, b) => (a === DEFAULT_LANGUAGE ? -1 : b === DEFAULT_LANGUAGE ? 1 : a.localeCompare(b)))
  .map((code) => ({code, name: nameOf(code)}));

const isLanguage = (code) => Object.hasOwn(catalogs, code);

// share of the English texts a language must have translated to be picked automatically.
// below it, the visitor can still choose it in the settings.
const AUTO_THRESHOLD = 0.8;

function coverage(code) {
  const keys = Object.keys(catalogs[DEFAULT_LANGUAGE]);
  return keys.filter((key) => Object.hasOwn(catalogs[code], key)).length / keys.length;
}

// first language of the browser (fr-FR, then fr...) with a file translated enough, or English.
function detectLanguage() {
  const codes = Object.keys(catalogs);
  const find = (tag) => codes.find((code) => code.toLowerCase() === tag.toLowerCase());

  for (const tag of navigator.languages ?? [navigator.language]) {
    const code = find(tag) ?? find(tag.split('-')[0]);
    if (code && coverage(code) >= AUTO_THRESHOLD) return code;
  }

  return DEFAULT_LANGUAGE;
}

// the visitor's choice, saved only when made in the settings: until then, the detection
// runs on each visit (and picks a language once it is translated enough).
let language = isLanguage(read(LANGUAGE_KEY)) ? read(LANGUAGE_KEY) : detectLanguage();
const listeners = new Set();

const OG_LOCALES = {en: 'en_US', fr: 'fr_FR'};

const setMeta = (selector, content) => document.head.querySelector(selector)?.setAttribute('content', content);

// the tab title and the description follow the language, for the visitor and for crawlers that run scripts.
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

// App uses it: the whole page renders again when the language changes.
export const useLanguage = () => useSyncExternalStore(subscribe, getLanguage);

const lookup = (key) => catalogs[language]?.[key] ?? catalogs[DEFAULT_LANGUAGE][key];

// whether `key` has a text, in the current language or in English.
export const hasText = (key) => lookup(key) !== undefined;

const warned = new Set();

// text of `key` in the current language (English when not translated),
// with its {placeholders} replaced by `values`: t('menu.folder', {number: 2}).
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
