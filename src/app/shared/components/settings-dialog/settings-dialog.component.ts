import { StashTab, Tab } from './../../../core/models/stash-tab';
import { SettingsService } from './../../../core/services/settings.service';
import { Settings } from './../../../core/models/settings';
import { PathOfExileService } from './../../../core/services/path-of-exile/path-of-exile.service';
import { Character } from './../../../core/models/character';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

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

  @ViewChildren('selectedTabs') selectedTabs: any[];

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>, private poeService: PathOfExileService, private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.settings = this.settingsService.getSettings();
    this.onPoeSessionIdChange(this.settings.poeSessionId);
    this.activeCharacterName = this.settings.activeCharacter.name;
  }

  onPoeSessionIdChange(poeSessionId) {
    this.settings.poeSessionId = poeSessionId;
    this.poeService.setPoeSessionIdCookie(poeSessionId);
    if(poeSessionId){
      setTimeout(() => {
        this.poeService.getCharacters().subscribe((characters) => {
          this.characters=characters;
        });
        this.getStashTabs();
      }, 500);
    }

  }
  getStashTabs() {
    this.poeService.getStash(0,this.settings.accountName, this.settings.activeCharacter.league, true).subscribe((stash) => {
      this.stashTab = stash
    });
  }

  cancel(){
    this.poeService.setPoeSessionIdCookie(this.settingsService.getSettings().poeSessionId);
    this.dialogRef.close();
  }

  save(){
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
    if(this.settings && this.settings.selectedTabIds) {
      return this.settings.selectedTabIds.findIndex(selectedTabId => selectedTabId === tab.id)>=0;
    }

    return false
  }

  onSelectedTabChanged() {
    this.settings.selectedTabIds = this.selectedTabs.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value.id);
  }

  isChaosItemStashTab(tab: Tab)  {
    return tab.type.match(/^QuadStash|NormalStash|PremiumStash$/);
  }

}
