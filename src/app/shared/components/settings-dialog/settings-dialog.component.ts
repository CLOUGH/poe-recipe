import { StashTab, Tab } from './../../../core/models/stash-tab';
import { SettingsService } from './../../../core/services/settings.service';
import { Settings } from './../../../core/models/settings';
import { PathOfExileService } from './../../../core/services/path-of-exile/path-of-exile.service';
import { Character } from './../../../core/models/character';
import { Component, Inject, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppReleaseService, ElectronService } from '../../../core/services';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {
  characters: Character[] = [];
  settings: Settings = {};
  activeCharacterName: String;
  stashTab: StashTab;
  selectedTabIndex = 0;
  appVersion;
  isOutdated = false;

  @ViewChildren('selectedTabs') selectedTabs: any[];

  constructor(
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    private poeService: PathOfExileService,
    private settingsService: SettingsService,
    private electronService: ElectronService,
    @Inject(MAT_DIALOG_DATA) public data,
    private appReleaseService: AppReleaseService
  ) { }

  ngOnInit(): void {
    this.settings = this.settingsService.getSettings();
    this.onPoeSessionIdChange(this.settings.poeSessionId);
    this.activeCharacterName = this.settings.activeCharacter.name;

    if (!this.settings || !this.settings.poeSessionId) {
      this.settings = {
        ...this.settings,
        poeApiRefreshRate: 60
      }
    }

    if (this.data.selectedTabIndex) {
      this.selectedTabIndex = this.data.selectedTabIndex;
    }

    this.appVersion = this.electronService.remote.app.getVersion();
    console.log(this.appVersion);

    this.appReleaseService.getIsOutdated().subscribe((isOutdated) => {
      this.isOutdated = isOutdated;
    });

  }

  onPoeSessionIdChange(poeSessionId) {
    this.settings.poeSessionId = poeSessionId;
    this.poeService.setPoeSessionIdCookie(poeSessionId);
    if (poeSessionId) {
      setTimeout(() => {
        this.poeService.getCharacters().subscribe((characters) => {
          this.characters = characters;
        });
        this.getStashTabs();
      }, 500);
    }

  }
  getStashTabs() {
    this.poeService.getStash(0, this.settings.accountName, this.settings.activeCharacter.league, true).subscribe((stash) => {
      this.stashTab = stash
    });
  }

  cancel() {
    this.poeService.setPoeSessionIdCookie(this.settingsService.getSettings().poeSessionId);
    this.dialogRef.close();
  }

  save() {
    this.poeService.setPoeSessionIdCookie(this.settings.poeSessionId);
    this.settingsService.saveSettings(this.settings);
    this.dialogRef.close();
  }

  onActiveCharacterChanged(characterName) {
    this.activeCharacterName = characterName;

    this.settings.activeCharacter = this.characters.find(character => character.name === characterName);
    this.getStashTabs();
  }

  isSelectedTab(tab: Tab) {
    if (this.settings && this.settings.selectedTabIds) {
      return this.settings.selectedTabIds.findIndex(selectedTabId => selectedTabId === tab.id) >= 0;
    }

    return false
  }

  onSelectedTabChanged() {
    this.settings.selectedTabIds = this.selectedTabs.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value.id);
  }

  isChaosItemStashTab(tab: Tab) {
    return tab.type.match(/^QuadStash|NormalStash|PremiumStash$/);
  }

  openLink(url) {
    this.electronService.shell.openExternal(url);
  }

}
