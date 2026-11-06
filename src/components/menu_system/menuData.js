export const MAIN = 'main';
// columns (and rows) of the main menu at each zoom level, from the smallest icons to the biggest.
export const ZOOM_LEVELS = [5, 4, 3];
// slots of the main menu at its smallest zoom: it never holds more items.
export const MAX_MAIN_SLOTS = ZOOM_LEVELS[0] ** 2;
// container holding the badges that are not placed on the menu.
export const BADGE_CASE = 'badge-case';
// folder id -> id of the badge pinned on it.
export const PINS = 'pins';
// app icon opening the badge case.
export const BADGE_CASE_ICON = 'icon-badge-case';

// list of projects
export const ITEMS = {
  'icon-VN': {
    label: 'Void Nebula',
    image: 'src/assets/projects/void_nebula/vn_miniature.png',
    logo: 'src/assets/projects/void_nebula/vn_logo.png',
    desc: 'One my biggest project, this is a video-game made from scratch, with over 2000 hours of work. This game is a sci-fi roguelike deckbuilding game with card customisation elements.',
    link: 'https://store.steampowered.com/app/4212830/Void_Nebula/',
    isApp: true,
  },
  'icon-TAKES': {label: 'TAKES', image: 'https://picsum.photos/201', isApp: true},
  'icon-3': {label: 'Shop', image: 'https://picsum.photos/202', isApp: true},
  'icon-4': {label: 'Notes', image: 'https://picsum.photos/203', isApp: true},
  'icon-5': {label: 'Music', image: 'https://picsum.photos/204', isApp: true},
  'icon-6': {label: 'Games', image: 'https://picsum.photos/205', isApp: true},
  'icon-7': {label: 'Web', image: 'https://picsum.photos/206', isApp: true},
  'icon-8': {label: 'Set', image: 'https://picsum.photos/207', isApp: true},
  'icon-github': {label: 'GitHub', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPyt9o2vV7qbUzPXo1bet8BsmumaYMNWALTk29xdsx5A&s=10', link: 'https://github.com/COTE-Allan', isLink: true},
  [BADGE_CASE_ICON]: {label: 'Badges', symbol: 'workspace_premium', isBadgeCase: true},
};

// placeholder badges: purely cosmetic, they can be placed on the menu,
// in folders, or pinned on a folder.
const BADGE_SEEDS = [
  'comet', 'pixel', 'lotus', 'ember', 'tide', 'moss', 'nova', 'quartz',
  'maple', 'orbit', 'coral', 'frost', 'dune', 'spark', 'fern', 'echo',
  'prism', 'cinder', 'aurora', 'pebble', 'zephyr', 'ivy', 'onyx', 'saffron',
];

export const BADGES = Object.fromEntries(
  BADGE_SEEDS.map((seed) => [
    `badge-${seed}`,
    {label: seed[0].toUpperCase() + seed.slice(1), image: `https://picsum.photos/seed/${seed}/128`, isBadge: true},
  ])
);

// folders need at least two items, or they are replaced by their only item.
// a folder can have a predefined name (DEFAULT_NAMES), a pinned badge (PINS), or both.
// main is laid out row by row, so items move to other rows when the zoom changes the column count
// (and the ones past the last slot move to the free slots).
export const DEFAULT_LAYOUT = {
  [MAIN]: [
    'icon-github', 'icon-5', BADGE_CASE_ICON, 'folder-games',
    null, 'icon-4', null, null,
    'icon-6', null, null, null,
    null, null, null, null,
  ],
  'folder-games': ['icon-TAKES', 'icon-VN'],
  [PINS]: {
    'folder-games': 'badge-comet',
  },
};

// folder id -> name shown until the visitor renames it.
export const DEFAULT_NAMES = {
  'folder-games': 'My games',
};
