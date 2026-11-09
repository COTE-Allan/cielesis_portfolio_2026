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

import mailMiniature from '../../assets/others/mail_miniature.png';
import nexusMniature from '../../assets/others/nexus_miniature.png';

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
  'icon-nexus': {image: nexusMniature, isLink: true, link: 'https://www.nexusmods.com/profile/cielesis1/mods'},
  'icon-mail': {image: mailMiniature, isLink: true, link: 'mailto:ctn.email.pro@gmail.com'},
  'icon-linkedin': {image: socialLinkedin, link: 'https://www.linkedin.com/in/cielesis/', isLink: true},
  'icon-youtube': {image: socialYoutube, link: 'https://www.youtube.com/channel/UCxZ85Kq0CvJXQu9jAzcNzEw', isLink: true},
  'icon-twitch': {image: socialTwitch, link: 'https://www.twitch.tv/cielesis_', isLink: true},
  'icon-x': {image: socialX, link: 'https://x.com/koffi_cup', isLink: true},
  'icon-behance': {image: socialBehance, link: 'https://www.behance.net/allancote1', isLink: true},
  'icon-malt': {image: socialMalt, link: 'https://www.malt.fr/profile/allancote1', isLink: true},
  'icon-github': {image: socialGithub, link: 'https://github.com/COTE-Allan', isLink: true},
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
    'folder-games', null, null, null,
    null, null, BADGE_CASE_ICON, 'folder-socials',
    'icon-mail'
  ],
  'folder-games': ['icon-VN', 'icon-TAKES', 'icon-nexus'],
  'folder-socials': [
    'icon-linkedin', 'icon-twitch', 'icon-youtube', 'icon-x',
    'icon-malt', 'icon-behance', 'icon-github',
  ],
  [PINS]: {
    'folder-games': 'badge-controller',
    'folder-socials': 'badge-share',
  },
};
