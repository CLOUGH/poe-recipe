import { Character } from './character';

export interface Settings {
  poeSessionId?: string;
  activeCharacter?: Character;
  accountName?: string;
  selectedTabIds?: string[];
  poeApiRefreshRate?: number;
  enableAutoRefresh?: boolean;
  overlay?: OverlaySettings;

}

export interface OverlaySettings {
  x?: number;
  y?: number;
  height?: number;
  width?:number;
  editable?: boolean;
}