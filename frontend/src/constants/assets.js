// Image globs
export const grassNormal = import.meta.glob('../assets/background/LandingPage_Grass_png/*.png', { eager: true, query: '?url', import: 'default' });
export const hillsNormal = import.meta.glob('../assets/background/LandingPage_Hills_png/*.png', { eager: true, query: '?url', import: 'default' });
export const grassSnow = import.meta.glob('../assets/background/grass_snow/*.png', { eager: true, query: '?url', import: 'default' });
export const hillsSnow = import.meta.glob('../assets/background/hill_snow/*.png', { eager: true, query: '?url', import: 'default' });
export const allFlowers = import.meta.glob('../assets/background/flowers/*.png', { eager: true, query: '?url', import: 'default' });

// Static images
import skyImport from '../assets/background/LandingPage_Sky.webp';
import mountainsImport from '../assets/background/LandingPage_Mountain.webp';
import zyjImport from '../assets/background/zyj.png';
import poppyImgImport from '../assets/background/flowers/Invicon_Poppy.png';
import azureBluetImgImport from '../assets/background/flowers/Invicon_Azure_Bluet.png';
import heartIconImport from '../assets/hearticon.svg';
import bodyIdleImport from '../assets/background/character/body-idle.png';
import hairIdleImport from '../assets/background/character/hair1-idle.png';
import outfitIdleImport from '../assets/background/character/outfit1-idle.png';

export const sky = skyImport;
export const mountains = mountainsImport;
export const zyj = zyjImport;
export const poppyImg = poppyImgImport;
export const azureBluetImg = azureBluetImgImport;
export const heartIcon = heartIconImport;
export const bodyIdle = bodyIdleImport;
export const hairIdle = hairIdleImport;
export const outfitIdle = outfitIdleImport;

// Music
import musicFileImport from '../assets/music/welcomeandgoodbye.mp3';
export const MUSIC_FILE = musicFileImport;

// LRC
import lrcFileImport from '../assets/music/welcomeandgoodbye.lrc?url';
export const LRC_FILE = lrcFileImport;

export const ALL_ASSETS = [
    { type: 'image', url: sky },
    { type: 'image', url: mountains },
    { type: 'image', url: zyj },
    { type: 'image', url: poppyImg },
    { type: 'image', url: azureBluetImg },
    { type: 'image', url: heartIcon },
    { type: 'image', url: bodyIdle },
    { type: 'image', url: hairIdle },
    { type: 'image', url: outfitIdle },
    ...Object.values(grassNormal).map(url => ({ type: 'image', url })),
    ...Object.values(hillsNormal).map(url => ({ type: 'image', url })),
    ...Object.values(grassSnow).map(url => ({ type: 'image', url })),
    ...Object.values(hillsSnow).map(url => ({ type: 'image', url })),
    ...Object.values(allFlowers).map(url => ({ type: 'image', url })),
    { type: 'audio', url: MUSIC_FILE },
    { type: 'text', url: LRC_FILE },
];
