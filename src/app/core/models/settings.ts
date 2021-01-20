import { Character } from './character';

export interface Settings {
  poeSessionId?: string;
  activeCharacter?: Character;
  accountName?: string;
  selectedTabIds?: string[];
  poeApiRefreshRate?: number;
  enableAutoRefresh?: boolean;
}
