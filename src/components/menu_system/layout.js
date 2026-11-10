import {hasText, t} from '../../i18n/i18n';
import {read, write} from '../tools/storage';
import {BADGES, BADGE_CASE, BADGE_CASE_ICON, ITEMS, MAIN, MAX_MAIN_SLOTS, PINS} from './menuData';

const MIN_FOLDER_ITEMS = 2;
const SLOT_SEPARATOR = ':';
const PIN_PREFIX = 'pin:';
const FOLDER_PREFIX = 'folder-';
// default folders can have any name (folder-games), created ones are numbered (folder-1).
const FOLDER_PATTERN = /^folder-[\w-]+$/;
const CREATED_FOLDER_PATTERN = /^folder-\d+$/;
const LAYOUT_KEY = 'home-menu-layout';
const NAMES_KEY = 'home-menu-folder-names';
const ZOOM_KEY = 'home-menu-zoom';

export const MAX_NAME_LENGTH = 20;

// --- ITEMS ---

const isIcon = (id) => typeof id === 'string' && Object.hasOwn(ITEMS, id);

export const isBadge = (id) => typeof id === 'string' && Object.hasOwn(BADGES, id);

export const isFolder = (id) => typeof id === 'string' && FOLDER_PATTERN.test(id);

// anything that fits in a slot, except folders.
const isTile = (id) => isIcon(id) || isBadge(id);

const folderIds = (layout) => Object.keys(layout).filter(isFolder);

const containerIds = (layout) => [MAIN, BADGE_CASE, ...folderIds(layout)];

// name of a folder until the visitor renames it: its predefined name (folders.<id>),
// or "Folder 1", "Folder 2"... for the created ones.
export const defaultFolderLabel = (folderId) =>
  hasText(`folders.${folderId}`)
    ? t(`folders.${folderId}`)
    : t('menu.folder', {number: folderId.slice(FOLDER_PREFIX.length)});

// what a slot shows, with its texts in the current language.
export function getItem(id, names) {
  if (isBadge(id)) return BADGES[id];
  if (!isFolder(id)) {
    if (!ITEMS[id]) return undefined;
    const desc = `items.${id}.desc`;
    // menu entries: their text is items.<id>.menu.<entry id>, or their `label` when it has none.
    const menu = ITEMS[id].menu?.map((entry) => {
      const key = `items.${id}.menu.${entry.id}`;
      return {...entry, label: hasText(key) ? t(key) : entry.label ?? entry.id};
    });
    return {...ITEMS[id], label: t(`items.${id}.label`), desc: hasText(desc) ? t(desc) : undefined, menu};
  }

  const desc = `folderDescs.${id}`;
  return {label: names[id]?.trim() || defaultFolderLabel(id), desc: hasText(desc) ? t(desc) : undefined, isFolder: true};
}

// --- SLOT IDS ---

export const toSlotId = (containerId, index) =>
  `${containerId}${SLOT_SEPARATOR}${index}`;

// main shows a full grid of `columns` × `rows` slots (see fitMain).
// folders and the badge case show one extra empty slot at the end, to drop new items in.
export const slotCount = (layout, containerId, columns, rows) =>
  containerId === MAIN ? columns * rows : layout[containerId].length + 1;

// number of items in main.
export const mainCount = (layout) => layout[MAIN].filter(Boolean).length;

function parseSlotId(layout, id) {
  const value = String(id ?? '');
  const cut = value.lastIndexOf(SLOT_SEPARATOR);
  const containerId = value.slice(0, cut);
  const index = Number(value.slice(cut + 1));
  // the main slots depend on the zoom.
  const max = containerId === MAIN ? MAX_MAIN_SLOTS : slotCount(layout, containerId);

  if (cut === -1 || !containerIds(layout).includes(containerId)) return null;
  if (!Number.isInteger(index) || index < 0 || index >= max) return null;

  return {containerId, index};
}

// id of the item in a slot, or null.
export function itemAt(layout, slotId) {
  const slot = parseSlotId(layout, slotId);
  return slot ? layout[slot.containerId][slot.index] ?? null : null;
}

// a pin is the spot of a folder where a badge can be attached.
export const toPinId = (folderId) => `${PIN_PREFIX}${folderId}`;

function parsePinId(layout, id) {
  const value = String(id ?? '');
  const folderId = value.slice(PIN_PREFIX.length);

  return value.startsWith(PIN_PREFIX) && isFolder(folderId) && Object.hasOwn(layout, folderId)
    ? folderId
    : null;
}

// --- LAYOUT ---

// where an item is: {containerId, index} in a slot, or {pinOf: folderId} when pinned.
function findItem(layout, itemId) {
  if (itemId == null) return null;

  for (const containerId of containerIds(layout)) {
    const index = layout[containerId].indexOf(itemId);
    if (index !== -1) return {containerId, index};
  }

  const pinOf = Object.keys(layout[PINS]).find((id) => layout[PINS][id] === itemId);
  return pinOf ? {pinOf} : null;
}

function copyLayout(layout) {
  const next = {[PINS]: {...layout[PINS]}};
  for (const id of containerIds(layout)) next[id] = [...layout[id]];

  return next;
}

// puts `itemId` (or nothing, when null) at a place returned by findItem.
function place(layout, at, itemId) {
  if (!at.pinOf) layout[at.containerId][at.index] = itemId;
  else if (itemId) layout[PINS][at.pinOf] = itemId;
  else delete layout[PINS][at.pinOf];
}

function createFolderId(layout) {
  let number = 1;
  while (Object.hasOwn(layout, `${FOLDER_PREFIX}${number}`)) number += 1;

  return `${FOLDER_PREFIX}${number}`;
}

// main without the empty slots at its end (holes, from drops past its end, are emptied).
function trimMain(main) {
  const slots = Array.from(main, (id) => id ?? null);
  return slots.slice(0, slots.findLastIndex(Boolean) + 1);
}

// compacts folders and the badge case, trims main, and removes the created folders left
// with less than two items (the default ones, when empty): their tile in main is replaced by their only item (if any).
// pins of missing folders go back in the case.
function cleanLayout(layout) {
  const folders = {};
  const pins = {};
  // removed folder id -> item taking its place in main, or null.
  const removed = new Map();
  const badgeCase = layout[BADGE_CASE].filter(Boolean);

  for (const id of folderIds(layout)) {
    const items = layout[id].filter(Boolean);
    const minItems = CREATED_FOLDER_PATTERN.test(id) ? MIN_FOLDER_ITEMS : 1;
    if (items.length >= minItems) folders[id] = items;
    else removed.set(id, items[0] ?? null);
  }

  for (const [folderId, badgeId] of Object.entries(layout[PINS])) {
    if (Object.hasOwn(folders, folderId)) pins[folderId] = badgeId;
    else badgeCase.push(badgeId);
  }

  return {
    [MAIN]: trimMain(layout[MAIN]).map((id) => (removed.has(id) ? removed.get(id) : id)),
    ...folders,
    [BADGE_CASE]: badgeCase,
    [PINS]: pins,
  };
}

// turns any saved value into a valid layout: unknown or duplicated ids are
// dropped, icons missing from it are placed in the first free slot of main,
// and badges missing from it go in the badge case.
function normalizeLayout(source) {
  const seen = new Set();
  const claim = (id) => !seen.has(id) && seen.add(id);
  const list = (id) => (Array.isArray(source?.[id]) ? source[id] : []);

  const layout = {
    [MAIN]: Array.from(list(MAIN).slice(0, MAX_MAIN_SLOTS), (id) => {
      const valid = isTile(id) || (isFolder(id) && Array.isArray(source[id]));
      return valid && claim(id) ? id : null;
    }),
    [PINS]: {},
  };

  for (const folderId of layout[MAIN].filter(isFolder)) {
    const pin = source[PINS]?.[folderId];

    layout[folderId] = source[folderId].filter((id) => isTile(id) && claim(id));
    if (isBadge(pin) && claim(pin)) layout[PINS][folderId] = pin;
  }

  layout[BADGE_CASE] = list(BADGE_CASE).filter((id) => isBadge(id) && claim(id));

  const cleaned = cleanLayout(layout);

  for (const id of Object.keys(ITEMS).filter((id) => !seen.has(id))) {
    const free = cleaned[MAIN].indexOf(null);

    if (free !== -1) cleaned[MAIN][free] = id;
    else if (cleaned[MAIN].length < MAX_MAIN_SLOTS) cleaned[MAIN].push(id);
    else cleaned[folderIds(cleaned)[0]]?.push(id);
  }

  for (const id of Object.keys(BADGES).filter((id) => !seen.has(id))) {
    cleaned[BADGE_CASE].push(id);
  }

  return cleaned;
}

// badge dropped on the pin of a folder: the badge already pinned there
// (if any) takes the place of the dropped one.
function pinBadge(layout, from, badgeId, folderId) {
  if (!isBadge(badgeId) || from.pinOf === folderId) return layout;

  const next = copyLayout(layout);
  place(next, from, layout[PINS][folderId] ?? null);
  next[PINS][folderId] = badgeId;

  return cleanLayout(next);
}

// returns the layout after dropping `sourceId` on slot or pin `targetId`,
// or the same layout object when nothing changes.
export function applyDrop(layout, sourceId, targetId) {
  const from = findItem(layout, sourceId);
  if (!from) return layout;

  const pinOf = parsePinId(layout, targetId);
  if (pinOf) return pinBadge(layout, from, sourceId, pinOf);

  const to = parseSlotId(layout, targetId);
  if (!to) return layout;
  if (from.containerId === to.containerId && from.index === to.index) return layout;

  const moved = sourceId;
  const target = layout[to.containerId][to.index] ?? null;

  // folders cannot be nested, and only badges go in the badge case.
  if (isFolder(moved) && to.containerId !== MAIN) return layout;
  if (!isBadge(moved) && to.containerId === BADGE_CASE) return layout;

  const next = copyLayout(layout);
  place(next, from, null);

  if (!isFolder(moved) && isFolder(target)) {
    // icon onto a folder tile: append it inside.
    if (target === from.containerId) return layout;
    next[target].push(moved);
  } else if (isBadge(moved) && target === BADGE_CASE_ICON) {
    // badge onto the badge case icon: put it back in the case.
    next[BADGE_CASE].push(moved);
  } else if (to.containerId !== MAIN && from.containerId !== to.containerId) {
    // icon into a slot of another folder (or of the badge case): insert it there.
    next[to.containerId].splice(to.index, 0, moved);
  } else if (!isFolder(moved) && target && to.containerId === MAIN) {
    // icon onto an icon in main: group them in a new folder.
    const folderId = createFolderId(layout);
    next[folderId] = [target, moved];
    next[MAIN][to.index] = folderId;
  } else {
    place(next, from, target);
    next[to.containerId][to.index] = moved;
  }

  return cleanLayout(next);
}

// returns the layout with the main items past its first `slots` slots moved to its free
// slots, or the same layout object when none is past them. main must hold at most `slots` items.
export function fitMain(layout, slots) {
  if (layout[MAIN].length <= slots) return layout;

  const next = copyLayout(layout);
  for (const id of next[MAIN].splice(slots).filter(Boolean)) {
    next[MAIN][next[MAIN].indexOf(null)] = id;
  }

  return cleanLayout(next);
}

// keeps only non-empty names of folders that still exist.
export function pickNames(names, layout) {
  const picked = {};

  for (const id of folderIds(layout)) {
    const name = names?.[id];
    if (typeof name === 'string' && name.trim()) picked[id] = name.slice(0, MAX_NAME_LENGTH);
  }

  return picked;
}

// --- STORAGE ---

export const loadLayout = (defaults) => normalizeLayout(read(LAYOUT_KEY) ?? defaults);
// the layout as it is on a first visit, whatever was saved.
export const initialLayout = (defaults) => normalizeLayout(defaults);
export const saveLayout = (layout) => write(LAYOUT_KEY, layout);
// only the names given by the visitor: the others come from defaultFolderLabel.
export const loadNames = (layout) => pickNames(read(NAMES_KEY) ?? {}, layout);
export const saveNames = (names) => write(NAMES_KEY, names);

// zoom is an index in the menu's zoom levels, `fallback` until one is saved.
export function loadZoom(levelCount, fallback) {
  const zoom = read(ZOOM_KEY);
  return Number.isInteger(zoom) && zoom >= 0 && zoom < levelCount ? zoom : fallback;
}

export const saveZoom = (zoom) => write(ZOOM_KEY, zoom);
