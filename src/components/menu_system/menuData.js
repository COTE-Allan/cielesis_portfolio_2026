import vnJingle from '../../assets/projects/void_nebula/vn_jingle.wav';
import vnLogo from '../../assets/projects/void_nebula/vn_logo.png';
import vnLogoVideo from '../../assets/projects/void_nebula/vn_logo.webm';
import vnMiniature from '../../assets/projects/void_nebula/vn_miniature.png';

import takesMiniature from '../../assets/projects/takes/takes_miniature.png'
import takesLogoVideo from '../../assets/projects/takes/takes_logo.webm';
import takesJingle from '../../assets/projects/takes/takes_jingle.wav';

import badgeKali from '../../assets/badges/badge_kali.png';
import badgeShare from '../../assets/badges/badge_share.png';
import badgeController from '../../assets/badges/badge_controller.png';
import badgeOrigami from '../../assets/badges/badge_origami.png';
import badgeFlyingPawn from '../../assets/badges/badge_flying_pawn.png';
import badgeCrabPawn from '../../assets/badges/badge_crab_pawn.png';
import badgeDragonKing from '../../assets/badges/badge_dragon_king.png';
import badgeExplosiveKnight from '../../assets/badges/badge_explosive_knight.png';
import badgeDecoratedKing from '../../assets/badges/badge_decorated_king.png';
import badgeZombieQueen from '../../assets/badges/badge_zombie_queen.png';

import socialBehance from '../../assets/socials/socials_behance_icon.webp';
import socialGithub from '../../assets/socials/socials_github_icon.webp';
import socialLinkedin from '../../assets/socials/socials_linkedin_icon.webp';
import socialMalt from '../../assets/socials/socials_malt_icon.webp';
import socialTwitch from '../../assets/socials/socials_twitch_icon.webp';
import socialX from '../../assets/socials/socials_x_icon.webp';
import socialYoutube from '../../assets/socials/socials_youtube_icon.webp';
import socialBluesky from '../../assets/socials/socials_bluesky.png';

import mailMiniature from '../../assets/others/mail_miniature.png';
import nexusMniature from '../../assets/others/nexus_miniature.png';

import oceanMiniature from '../../assets/videos/ocean_miniature.jpg';
import vnDevlog1Miniature from '../../assets/videos/vn_devlog_1_miniature.jpg';

export const MAIN = 'main';
export const ZOOM_LEVELS = [5, 4, 3];
export const MAX_MAIN_SLOTS = ZOOM_LEVELS[0] ** 2;
export const BADGE_CASE = 'badge-case';
export const PINS = 'pins';
export const BADGE_CASE_ICON = 'icon-badge-case';


export const ITEMS = {
  'icon-VN': {
    image: vnMiniature,
    logo: vnLogo,
    logoVideo: vnLogoVideo,
    jingle: vnJingle,
    link: 'https://store.steampowered.com/app/4212830/Void_Nebula/',
    isApp: true,
    menu: [
      {id: 'trailer', link: 'https://www.youtube.com/watch?v=YRS3CHkJFTc'},
      {id: 'press', label: 'Press kit', link: 'https://impress.games/press-kit/cielesis-works/void-nebula'},
      {id: 'press', label: 'See on Behance', link: 'https://...'},
    ],
  },
  'icon-TAKES': {
    image: takesMiniature,
    logoVideo: takesLogoVideo,
    jingle: takesJingle,
    link: 'https://cielesis.itch.io/explosive-knight-takes-flying-pawn',
    isApp: true,
    menu: [
      {id: 'trailer', link: 'https://youtu.be/oXzcTaKokes?si=dm4bmcs8UcuLtHba'},
      {id: 'press', label: 'See on Behance', link: 'https://www.behance.net/gallery/249653707/Explosive-Knight-TAKES-Flying-Pawn'},
    ],
  },
  'icon-babelfest': {
    symbol: 'style',
    link: 'https://babelfest.fr/',
    isApp: true,
    menu: [
      {id: 'trailer', link: 'https://youtu.be/xMIN6jj21eA?si=WGRfDX2gtUrkKGcs'},
      {id: 'press', label: 'See on Behance', link: 'https://www.behance.net/gallery/258214519/Babelfest'},
    ],
  },
  'icon-lofi-cafe': {symbol: 'local_cafe', link: 'https://lofi-cafe.cielesis.fr/', isApp: true},
  'icon-alternative': {symbol: 'inventory_2', link: 'https://alternative.cielesis.fr/archives', isLink: true},
  'icon-denshattack': {symbol: 'train', link: 'https://denshattack-station.cielesis.fr/', isLink: true},
  'icon-nexus': {image: nexusMniature, isLink: true, link: 'https://www.nexusmods.com/profile/cielesis1/mods'},
  'icon-mail': {image: mailMiniature, isLink: true, link: 'mailto:ctn.email.pro@gmail.com'},
  'icon-linkedin': {image: socialLinkedin, link: 'https://www.linkedin.com/in/cielesis/', isLink: true},
  'icon-youtube': {image: socialYoutube, link: 'https://www.youtube.com/channel/UCxZ85Kq0CvJXQu9jAzcNzEw', isLink: true},
  'icon-twitch': {image: socialTwitch, link: 'https://www.twitch.tv/cielesis_', isLink: true},
  'icon-x': {image: socialX, link: 'https://x.com/koffi_cup', isLink: true},
  'icon-behance': {image: socialBehance, link: 'https://www.behance.net/allancote1', isLink: true},
  'icon-malt': {image: socialMalt, link: 'https://www.malt.fr/profile/allancote1', isLink: true},
  'icon-github': {image: socialGithub, link: 'https://github.com/COTE-Allan', isLink: true},
  'icon-bluesky': {image: socialBluesky, link: 'https://bsky.app/profile/cielesis-dev.bsky.social', isLink: true},
  'icon-video-vn-devlog-1': {image: vnDevlog1Miniature, link: 'https://www.youtube.com/watch?v=26Jw-pbi1Vk', isLink: true},
  'icon-video-ocean': {image: oceanMiniature, link: 'https://youtu.be/0ooX-6AeozE', isLink: true},
  [BADGE_CASE_ICON]: {symbol: 'workspace_premium', isBadgeCase: true},
};


export const BADGES = {
  'badge-controller': {label: 'Controller', image: badgeController, pixelArt: true, isBadge: true},
  'badge-kali': {label: 'Kali', image: badgeKali, pixelArt: true, isBadge: true},
  'badge-share': {label: 'Share', image: badgeShare, pixelArt: false, isBadge: true},
  'badge-origami': {label: 'Origami', image: badgeOrigami, pixelArt: true, isBadge: true},
  'badge-flying-pawn': {label: 'Flying Pawn', image: badgeFlyingPawn, pixelArt: true, isBadge: true},
  'badge-crab-pawn': {label: 'Crab Pawn', image: badgeCrabPawn, pixelArt: true, isBadge: true},
  'badge-dragon-king': {label: 'Dragon King', image: badgeDragonKing, pixelArt: true, isBadge: true},
  'badge-explosive-knight': {label: 'Explosive Knight', image: badgeExplosiveKnight, pixelArt: true, isBadge: true},
  'badge-decorated-king': {label: 'Decorated King', image: badgeDecoratedKing, pixelArt: true, isBadge: true},
  'badge-zombie-queen': {label: 'Zombie Queen', image: badgeZombieQueen, pixelArt: true, isBadge: true},
};


export const DEFAULT_LAYOUT = {
  [MAIN]: [
    'folder-games', 'folder-websites', 'folder-videos', null,
    null, null, BADGE_CASE_ICON, 'folder-socials',
    'icon-mail'
  ],
  'folder-games': ['icon-VN', 'icon-TAKES', 'icon-babelfest', 'icon-nexus'],
  'folder-websites': ['icon-lofi-cafe', 'icon-alternative', 'icon-denshattack'],
  'folder-videos': ['icon-video-vn-devlog-1', 'icon-video-ocean'],
  'folder-socials': [
    'icon-linkedin', 'icon-twitch', 'icon-youtube', 'icon-x', 'icon-behance', 'icon-bluesky', 'icon-malt', 'icon-github',
  ],
  [PINS]: {
    'folder-games': 'badge-controller',
    'folder-socials': 'badge-share',
  },
};
