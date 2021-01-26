import { StashTab } from './../../models/stash-tab';
import { SettingsService } from './../settings.service';
import { ElectronService } from './../electron/electron.service';
import { Character } from './../../models/character';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { combineLatest, forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PathOfExileService {
  private apiUrl = "https://www.pathofexile.com";

  constructor(private httpClient: HttpClient, private electronService: ElectronService, private settingService: SettingsService) {}

  getCharacters(poeSessionId?: string ) {
    if(poeSessionId) {
      this.setPoeSessionIdCookie(poeSessionId);
    }
    return this.httpClient.get<Character[]>(`${this.apiUrl}/character-window/get-characters`);
  }

  setPoeSessionIdCookie(poeSessionId: string) {
    const cookie = { url: this.apiUrl, name: "POESESSID", value: poeSessionId };
    this.electronService.ipcRenderer.send('set-cookie', { cookie })
  }

  getStash(tabIndex: number, accountName: string, league: string, getTabs?: boolean) {
    return this.httpClient.get<StashTab>(`${this.apiUrl}/character-window/get-stash-items?accountName=${accountName}&realm=pc&league=${league}&tabs=${getTabs===true?1:0}&tabIndex=${tabIndex}`);
  }

  getPlayerStashTabs(selectedTabIds: string[], accountName: string, league: string, getTabs?: boolean) {
    return this.getStash(0, accountName, league, true).pipe(
      mergeMap(stash => {
        const selectTabs = stash.tabs
          .filter(tab => {
            return selectedTabIds.findIndex(selectedTabId => selectedTabId === tab.id) >= 0;
          })
          .map(tab => this.getStash(tab.i, accountName, league, true))
        return combineLatest(of(stash), forkJoin(selectTabs));
      }),
      map(([stash, selectTabs]) => {
        return selectTabs.map((selectedStash, index) => {
          selectedStash.currentTab = stash.tabs.find(tab => tab.id === selectedTabIds[index]);
          return selectedStash;
        });
      })
    )
  }
}
