// keeps the translation files in step with en.json, the reference.
//   npm run i18n           updates every language and shows how much is translated
//   npm run i18n -- fr es  same, creating fr.json and es.json first if they don't exist
//
// in each language file: keys missing from it are added with "" (to translate),
// and translations of keys removed from en.json move to "_unused", so they are not lost
// (they come back if the key is added again). en.json itself is never changed.

import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, relative} from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const SOURCES = join(ROOT, 'src');
const LOCALES = join(SOURCES, 'i18n', 'locales');
const REFERENCE = 'en';
const UNUSED = '_unused';

// without the byte order mark some Windows editors add (the file is written back without it).
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8').replace(/^﻿/, ''));
const writeJson = (file, value) => writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);

function flatten(object, prefix = '', into = {}) {
  for (const [key, value] of Object.entries(object)) {
    if (key.startsWith('_')) continue;
    if (value && typeof value === 'object') flatten(value, `${prefix}${key}.`, into);
    else into[`${prefix}${key}`] = value;
  }

  return into;
}

// the structure of `reference`, with the texts of `flat` ("" when it has none).
function rebuild(reference, flat, prefix = '') {
  const result = {};

  for (const [key, value] of Object.entries(reference)) {
    if (key.startsWith('_')) continue;
    const path = `${prefix}${key}`;
    result[key] = value && typeof value === 'object'
      ? rebuild(value, flat, `${path}.`)
      : typeof flat[path] === 'string' ? flat[path] : '';
  }

  return result;
}

function sync(code, reference) {
  const file = join(LOCALES, `${code}.json`);
  const current = existsSync(file) ? readJson(file) : {};
  // the unused texts can be used again.
  const flat = {...current[UNUSED], ...flatten(current)};
  const keys = flatten(reference);

  const next = rebuild(reference, flat);
  const unused = Object.fromEntries(
    Object.entries(flat).filter(([key, text]) => !(key in keys) && typeof text === 'string' && text !== '')
  );
  if (Object.keys(unused).length) next[UNUSED] = unused;

  writeJson(file, next);

  const total = Object.keys(keys).length;
  const done = Object.keys(keys).filter((key) => typeof flat[key] === 'string' && flat[key] !== '').length;
  const unusedNote = next[UNUSED] ? `, ${Object.keys(unused).length} unused` : '';
  console.log(`  ${code}: ${done}/${total} translated (${Math.floor((done / total) * 100)}%)${unusedNote}`);
}

// t('some.key') written in the code but missing from en.json.
function missingKeys(keys) {
  const missing = [];
  const walk = (folder) => {
    for (const entry of readdirSync(folder, {withFileTypes: true})) {
      const path = join(folder, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.jsx?$/.test(entry.name)) {
        const source = readFileSync(path, 'utf8');
        for (const match of source.matchAll(/(?<![\w.$])t\(\s*['"]([\w.-]+)['"]/g)) {
          if (!(match[1] in keys)) missing.push(`${match[1]}  (${relative(ROOT, path)})`);
        }
      }
    }
  };
  walk(SOURCES);

  return missing;
}

const reference = readJson(join(LOCALES, `${REFERENCE}.json`));
const codes = new Set(
  readdirSync(LOCALES).filter((name) => name.endsWith('.json')).map((name) => name.slice(0, -5))
);

for (const code of process.argv.slice(2)) {
  if (!/^[a-z]{2,3}(-[A-Z]{2})?$/.test(code)) {
    console.error(`"${code}" is not a language code (like fr, es, pt-BR).`);
    process.exit(1);
  }
  if (!codes.has(code)) console.log(`created ${code}.json`);
  codes.add(code);
}

codes.delete(REFERENCE);

console.log(`${Object.keys(flatten(reference)).length} texts in ${REFERENCE}.json`);
for (const code of [...codes].sort()) sync(code, reference);

const missing = missingKeys(flatten(reference));
if (missing.length) {
  console.log(`\nused in the code but missing from ${REFERENCE}.json:`);
  for (const line of missing) console.log(`  ${line}`);
}
