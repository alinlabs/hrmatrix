export * from './guide-data-types';
import { PortalGuideData } from './guide-data-types';
import { guideKemenakerData } from './guide-kemenaker';
import { guideBPJSTKData } from './guide-bpjstk';
import { guideEdabuData } from './guide-edabu';
import { guideDJPData } from './guide-djp';
import { guideEPPPKBData } from './guide-e-pp-pkb';
import { guideTemanK3Data } from './guide-temank3';
import { guideTKAOnlineData } from './guide-tka-online';
import { guideKarirhubData } from './guide-karirhub';
import { guidePPHIData } from './guide-pphi';
import { guideOSSData } from './guide-oss';
import { guideSimpelData } from './guide-simpel';
import { guideFestronikData } from './guide-festronik';
import { guideSIMBGData } from './guide-simbg';
import { guideBapendaData } from './guide-bapenda';

export const PORTAL_GUIDES_DATA: Record<string, PortalGuideData> = {
  kemenaker: guideKemenakerData,
  bpjstk: guideBPJSTKData,
  edabu: guideEdabuData,
  djp: guideDJPData,
  'e-pp-pkb': guideEPPPKBData,
  temank3: guideTemanK3Data,
  'tka-online': guideTKAOnlineData,
  karirhub: guideKarirhubData,
  pphi: guidePPHIData,
  oss: guideOSSData,
  simpel: guideSimpelData,
  festronik: guideFestronikData,
  simbg: guideSIMBGData,
  bapenda: guideBapendaData,
};
