import { Settings } from './../models/settings';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {


  constructor() { }

  getSettings(): Settings {
    const settingsString = localStorage.getItem('settings');
    const settings: Settings = settingsString ? JSON.parse(settingsString): {};

    return settings;
  }

  saveSettings(settings: Settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
  }
}
