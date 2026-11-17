import vnJingle from '../../assets/projects/void_nebula/vn_jingle.wav';
import vnLogoVideo from '../../assets/projects/void_nebula/vn_logo.webm';
import vnMiniature from '../../assets/projects/void_nebula/vn_miniature.webp';

import takesMiniature from '../../assets/projects/takes/takes_miniature.webp'
import takesLogoVideo from '../../assets/projects/takes/takes_logo.webm';
import takesJingle from '../../assets/projects/takes/takes_jingle.wav';

import babelfestMiniature from '../../assets/projects/babelfest/babelfest_miniature.webp';
import babelfestLogoVideo from '../../assets/projects/babelfest/babelfest_logo.webm';
import babelfestJingle from '../../assets/projects/babelfest/babelfest_jingle.wav';

import lofiRadioMiniature from '../../assets/projects/lofi_radio/lofi_radio_miniature.webp';
import lofiRadioLogoVideo from '../../assets/projects/lofi_radio/lofi_radio_logo.webm';
import lofiRadioJingle from '../../assets/projects/lofi_radio/lofi_radio_jingle.wav';

import alternativeMiniature from '../../assets/projects/alternative/alternative_miniature.webp';
import alternativeLogoVideo from '../../assets/projects/alternative/alternative_logo.webm';
import alternativeJingle from '../../assets/projects/alternative/alternative_jingle.wav';

import mlMiniature from '../../assets/projects/ml/ml_miniature.webp';
import mlLogoVideo from '../../assets/projects/ml/ml_logo.webm';
import mlJingle from '../../assets/projects/ml/ml_jingle.wav';

import badgeKali from '../../assets/badges/badge_kali.webp';
import badgeShare from '../../assets/badges/badge_share.webp';
import badgeController from '../../assets/badges/badge_controller.webp';
import badgeOrigami from '../../assets/badges/badge_origami.webp';
import badgeFlyingPawn from '../../assets/badges/badge_flying_pawn.webp';
import badgeCrabPawn from '../../assets/badges/badge_crab_pawn.webp';
import badgeDragonKing from '../../assets/badges/badge_dragon_king.webp';
import badgeExplosiveKnight from '../../assets/badges/badge_explosive_knight.webp';
import badgeDecoratedKing from '../../assets/badges/badge_decorated_king.webp';
import badgeZombieQueen from '../../assets/badges/badge_zombie_queen.webp';
import badgeProfilePicture from '../../assets/badges/badge_profile_picture.webp';
import badgeClapperboard from '../../assets/badges/badge_clapperboard.webp';
import badgeInternet from '../../assets/badges/badge_internet.webp';
import badgeWorks from '../../assets/badges/badge_works.webp';
import badgeComic from '../../assets/badges/badge_comic.webp';
import badgeCielesisWorks from '../../assets/badges/badge_cielesis_works.webp';
import badgeClemie from '../../assets/badges/badge_clemie.webp';

import socialBehance from '../../assets/socials/socials_behance_icon.webp';
import socialGithub from '../../assets/socials/socials_github_icon.webp';
import socialLinkedin from '../../assets/socials/socials_linkedin_icon.webp';
import socialMalt from '../../assets/socials/socials_malt_icon.webp';
import socialTwitch from '../../assets/socials/socials_twitch_icon.webp';
import socialX from '../../assets/socials/socials_x_icon.webp';
import socialYoutube from '../../assets/socials/socials_youtube_icon.webp';
import socialBluesky from '../../assets/socials/socials_bluesky.webp';

import mailMiniature from '../../assets/others/mail_miniature.webp';
import nexusMniature from '../../assets/others/nexus_miniature.webp';
import fondationAlternativeMiniature from '../../assets/others/fondation_alternative_miniature.webp';
import denshattackMiniature from '../../assets/others/denshattack_station_miniature.webp';

import oceanMiniature from '../../assets/videos/ocean_miniature.webp';
import vnDevlog1Miniature from '../../assets/videos/vn_devlog_1_miniature.webp';
import vnDemoTrailerMiniature from '../../assets/videos/vn_demo_trailer_miniature.webp';
import takesTrailerMiniature from '../../assets/videos/takes_trailer_miniature.webp';

export const MAIN = 'main';
export const ZOOM_LEVELS = [5, 4, 3];
export const MAX_MAIN_SLOTS = ZOOM_LEVELS[0] ** 2;
export const BADGE_CASE = 'badge-case';
export const PINS = 'pins';
export const BADGE_CASE_ICON = 'icon-badge-case';


export const ITEMS = {
  'icon-VN': {
    image: vnMiniature,
    logoVideo: vnLogoVideo,
    jingle: vnJingle,
    link: 'https://store.steampowered.com/app/4212830/Void_Nebula/',
    isApp: true,
    menu: [
      {id: 'trailer', link: 'https://www.youtube.com/watch?v=YRS3CHkJFTc'},
      {id: 'pressKit', link: 'https://impress.games/press-kit/cielesis-works/void-nebula'},
      {id: 'behance', link: 'https://...'},
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
      {id: 'behance', link: 'https://www.behance.net/gallery/249653707/Explosive-Knight-TAKES-Flying-Pawn'},
    ],
  },
  'icon-babelfest': {
    image: babelfestMiniature,
    logoVideo: babelfestLogoVideo,
    jingle: babelfestJingle,
    link: 'https://babelfest.fr/',
    isApp: true,
    menu: [
      {id: 'trailer', link: 'https://youtu.be/xMIN6jj21eA?si=WGRfDX2gtUrkKGcs'},
      {id: 'behance', link: 'https://www.behance.net/gallery/258214519/Babelfest'},
    ],
  },
  'icon-mission-locale': {
    image: mlMiniature,
    logoVideo: mlLogoVideo,
    jingle: mlJingle,
    link: 'https://www.behance.net/gallery/249240195/Mission-Locale-Visual-Rebranding',
    isApp: true,
  },
  'icon-webcomic-alternative': {
    image: alternativeMiniature,
    logoVideo: alternativeLogoVideo,
    jingle: alternativeJingle,
    link: 'https://www.mangadraft.com/manga/alternative',
    isApp: true,
    menu: [
      {id: 'behance', link: 'https://www.behance.net/gallery/258352961/Alternative-A-post-apo-webcomic'},
    ],
  },
  'icon-lofi-cafe': {
    image: lofiRadioMiniature,
    logoVideo: lofiRadioLogoVideo,
    jingle: lofiRadioJingle,
    link: 'https://lofi-cafe.cielesis.fr/',
    isApp: true,
  },
  'icon-alternative': {image: fondationAlternativeMiniature, link: 'https://alternative.cielesis.fr/archives', isLink: true},
  'icon-denshattack': {image: denshattackMiniature, link: 'https://denshattack-station.cielesis.fr/', isLink: true},
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
  'icon-video-ocean': {image: oceanMiniature, link: 'https://youtu.be/8_supJStapg', isLink: true},
  'icon-video-vn-demo-trailer': {image: vnDemoTrailerMiniature, link: 'https://www.youtube.com/watch?v=YRS3CHkJFTc', isLink: true},
  'icon-video-takes-trailer': {image: takesTrailerMiniature, link: 'https://www.youtube.com/watch?v=oXzcTaKokes', isLink: true},
  [BADGE_CASE_ICON]: {symbol: 'workspace_premium', isBadgeCase: true},
};


export const BADGES = {
  'badge-controller': {image: badgeController, pixelArt: true, isBadge: true},
  'badge-kali': {image: badgeKali, pixelArt: true, isBadge: true},
  'badge-share': {image: badgeShare, pixelArt: false, isBadge: true},
  'badge-origami': {image: badgeOrigami, pixelArt: true, isBadge: true},
  'badge-flying-pawn': {image: badgeFlyingPawn, pixelArt: true, isBadge: true},
  'badge-crab-pawn': {image: badgeCrabPawn, pixelArt: true, isBadge: true},
  'badge-dragon-king': {image: badgeDragonKing, pixelArt: true, isBadge: true},
  'badge-explosive-knight': {image: badgeExplosiveKnight, pixelArt: true, isBadge: true},
  'badge-decorated-king': {image: badgeDecoratedKing, pixelArt: true, isBadge: true},
  'badge-zombie-queen': {image: badgeZombieQueen, pixelArt: true, isBadge: true},
  'badge-profile-picture': {image: badgeProfilePicture, pixelArt: false, isBadge: true},
  'badge-clapperboard': {image: badgeClapperboard, pixelArt: false, isBadge: true},
  'badge-internet': {image: badgeInternet, pixelArt: false, isBadge: true},
  'badge-works': {image: badgeWorks, pixelArt: false, isBadge: true},
  'badge-comic': {image: badgeComic, pixelArt: false, isBadge: true},
  'badge-cielesis-works': {image: badgeCielesisWorks, pixelArt: false, isBadge: true},
  'badge-clemie': {image: badgeClemie, pixelArt: false, isBadge: true},
};


export const DEFAULT_LAYOUT = {
  [MAIN]: [
    'folder-pro', 'folder-websites', 'folder-videos', 'folder-games',
    'badge-profile-picture', 'folder-webcomics', BADGE_CASE_ICON, 'folder-socials',
    'icon-mail'
  ],
  'folder-games': ['icon-VN', 'badge-cielesis-works', 'icon-TAKES', 'icon-babelfest', 'icon-nexus'],
  'folder-websites': ['icon-lofi-cafe', 'icon-alternative', 'icon-denshattack'],
  'folder-videos': ['icon-video-vn-demo-trailer', 'icon-video-takes-trailer', 'icon-video-vn-devlog-1', 'icon-video-ocean'],
  'folder-webcomics': ['icon-webcomic-alternative'],
  'folder-pro': ['icon-mission-locale'],
  'folder-socials': [
    'icon-linkedin', 'icon-twitch', 'icon-youtube', 'icon-x', 'icon-behance', 'icon-bluesky', 'icon-malt', 'icon-github',
  ],
  [PINS]: {
    'folder-games': 'badge-controller',
    'folder-socials': 'badge-share',
    'folder-videos': 'badge-clapperboard',
    'folder-websites': 'badge-internet',
    'folder-pro': 'badge-works',
    'folder-webcomics': 'badge-comic',
  },
};
