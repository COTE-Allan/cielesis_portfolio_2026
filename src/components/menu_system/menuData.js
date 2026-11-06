export const MAIN = 'main';
export const ZOOM_LEVELS = [5, 4, 3];
export const MAX_MAIN_SLOTS = ZOOM_LEVELS[0] ** 2;
export const BADGE_CASE = 'badge-case';
export const PINS = 'pins';
export const BADGE_CASE_ICON = 'icon-badge-case';


export const ITEMS = {
  'icon-VN': {
    image: 'src/assets/projects/void_nebula/vn_miniature.png',
    logo: 'src/assets/projects/void_nebula/vn_logo.png',
    link: 'https://store.steampowered.com/app/4212830/Void_Nebula/',
    isApp: true,
    menu: [
      {id: 'trailer', link: 'https://www.youtube.com/watch?v=YRS3CHkJFTc'},
      {id: 'press', label: 'Press kit', link: 'https://impress.games/press-kit/cielesis-works/void-nebula'},
      {id: 'press', label: 'See on Behance', link: 'https://...'},
    ],
  },
  'icon-TAKES': {image: 'https://picsum.photos/201', isApp: true},
  'icon-3': {image: 'https://picsum.photos/202', isApp: true},
  'icon-4': {image: 'https://picsum.photos/203', isApp: true},
  'icon-5': {image: 'https://picsum.photos/204', isApp: true},
  'icon-6': {image: 'https://picsum.photos/205', isApp: true},
  'icon-7': {image: 'https://picsum.photos/206', isApp: true},
  'icon-8': {image: 'https://picsum.photos/207', isApp: true},
  'icon-linkedin': {image: 'https://picsum.photos/seed/linkedin/128', link: 'https://www.linkedin.com/in/cielesis/', isLink: true},
  'icon-malt': {image: 'https://picsum.photos/seed/malt/128', link: 'https://www.malt.fr/profile/allancote1', isLink: true},
  'icon-youtube': {image: 'https://picsum.photos/seed/youtube/128', link: 'https://www.youtube.com/channel/UCxZ85Kq0CvJXQu9jAzcNzEw', isLink: true},
  'icon-twitch': {image: 'https://picsum.photos/seed/twitch/128', link: 'https://www.twitch.tv/cielesis_', isLink: true},
  'icon-x': {image: 'https://picsum.photos/seed/x/128', link: 'https://x.com/koffi_cup', isLink: true},
  'icon-behance': {image: 'https://picsum.photos/seed/behance/128', link: 'https://www.behance.net/allancote1', isLink: true},
  'icon-github': {image: 'https://picsum.photos/seed/github/128', link: 'https://github.com/COTE-Allan', isLink: true},
  [BADGE_CASE_ICON]: {symbol: 'workspace_premium', isBadgeCase: true},
};


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


export const DEFAULT_LAYOUT = {
  [MAIN]: [
    'folder-socials', 'icon-5', BADGE_CASE_ICON, 'folder-games',
    null, 'icon-4', null, null,
    'icon-6', null, null, null,
    null, null, null, null,
  ],
  'folder-games': ['icon-TAKES', 'icon-VN'],
  'folder-socials': [
    'icon-linkedin', 'icon-malt', 'icon-youtube', 'icon-twitch',
    'icon-x', 'icon-behance', 'icon-github',
  ],
  [PINS]: {
    'folder-games': 'badge-comet',
  },
};
