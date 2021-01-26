import { ChaosSet, ChaosItem, Recipe } from './../core/models/chaos-set';
import { ChaosSetStat } from './../core/models/chaos-set-stat';
import { StashTab, Item } from './../core/models/stash-tab';
import { Settings } from './../core/models/settings';
import { SettingsService } from './../core/services/settings.service';
import { PathOfExileService } from './../core/services/path-of-exile/path-of-exile.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../shared/components/settings-dialog/settings-dialog.component';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { combineLatest, config, forkJoin, interval, Observable, of, Subscription } from 'rxjs';
import { switchMap, map, mergeMap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorDetailDialogComponent } from '../shared/components/error-detail-dialog/error-detail-dialog.component';
import { AppReleaseService, ChaosRecipeService, ElectronService } from '../core/services';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  snackBarRef: MatSnackBarRef<TextOnlySnackBar>;
  settings: Settings;
  selectedStashes: StashTab[];
  selectedTabIndex: number;
  chaosSetItems: ChaosSet[];
  selectedSetIndex: number;
  currentMode: String = 'chaos';
  highLightedItemsIndex: number[] = [];
  search: any = {};
  searchForm = new FormGroup({
    minItemLevel: new FormControl(0),
    maxItemLevel: new FormControl(0)
  });
  refreshing = false;
  refreshInterval: Subscription;
  refreshRate = 60000;
  chaosSetItemsStat: ChaosSetStat;
  itemTypeSelected: string;
  isOutdated = false;


  constructor(
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private poeService: PathOfExileService,
    private settingsService: SettingsService,
    private appReleaseService: AppReleaseService,
    private chaosRecipeService: ChaosRecipeService,
    private electronService: ElectronService,
  ) { }

  ngOnInit(): void {
    this.refresh();

    this.appReleaseService.getIsOutdated().subscribe((isOutdated) => {
      this.isOutdated = isOutdated;
    });
  }

  async refresh() {
    this.settings = this.settingsService.getSettings();
    this.poeService.setPoeSessionIdCookie(this.settings && this.settings.poeSessionId);

    setTimeout(() => {
      this.onPoeSessionIdUpdated();      
      this.getStashTabs();      
  
      if (this.refreshInterval) {
        this.refreshInterval.unsubscribe();
      }
      
      if(this.settings.enableAutoRefresh===true){
        this.refreshRate = (this.settings.poeApiRefreshRate || 60) * 1000;
        this.refreshInterval = interval(this.refreshRate).subscribe(() => {
          this.getStashTabs();
        });
      }
  
      this.searchForm.valueChanges.subscribe((searchValue) => {
        this.search = searchValue;
      })

    })
  }

  onPoeSessionIdUpdated() {
    if (!this.settings || !this.settings.poeSessionId) {
      this.snackBarRef = this.snackBar.open("No POE Session ID found. Please update settings", "Settings");
      this.snackBarRef.onAction().subscribe(() => this.openSettings());
    }

    if (this.snackBarRef && this.settings && this.settings.poeSessionId) {
      this.snackBarRef.dismiss();
    }
  }

  async getStashTabs() {
    if (this.settings && this.settings.accountName && this.settings.activeCharacter && this.settings.selectedTabIds && this.settings.selectedTabIds.length > 0) {

      this.refreshing = true;
      return this.poeService.getPlayerStashTabs(this.settings.selectedTabIds, this.settings.accountName, this.settings.activeCharacter.league, true)
        .subscribe(stashes => {
          this.selectedStashes = stashes;
          localStorage.setItem('stashes', JSON.stringify(stashes));
          
          this.chaosSetItems = this.chaosRecipeService.getChaosRecipeSets(this.selectedStashes);
          this.chaosSetItemsStat = this.chaosRecipeService.getChaosSetStat(this.selectedStashes);

          this.refreshing = false;
        }, (error) => {
          const errorSnackBar = this.snackBar.open(`An error has occurred while trying to retrieve pull your stash.`, 'More Info');
          errorSnackBar.onAction().subscribe(() => this.openErrorDetailsModal(error));
          this.refreshing = false;
        });
    }
    return Promise.resolve();
  }
  openErrorDetailsModal(error) {
    const dialogRef = this.dialog.open(ErrorDetailDialogComponent, {
      data: { error }
    });
  }

  openSettings(selectedTabIndex?: number) {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '600px',
      data: { selectedTabIndex }
    })
      .afterClosed().subscribe(() => {
        this.refresh();
      });
  }

  getCompletedChaosSet() {
    const completedChaosSets = this.chaosSetItems ? this.chaosSetItems.filter(chaosSetItem => chaosSetItem.isComplete === true) : [];
    return completedChaosSets;
  }

  toggleSelectedSet(selectedSetIndex, event) {
    if (selectedSetIndex === this.selectedSetIndex) {
      this.selectedSetIndex = null;
      event.preventDefault();
    }

    this.updateHighlightedItems(this.selectedTabIndex);
  }


  updateHighlightedItems(stashIndex: number) {
    let selectedItems = []
    if (this.itemTypeSelected) {
      
      this.chaosSetItemsStat[this.itemTypeSelected].items.forEach((item: ChaosItem) => {
        console.log(item.selectedStashIndex === this.selectedTabIndex, item.selectedStashIndex, this.selectedTabIndex);
        if (item.selectedStashIndex === this.selectedTabIndex) {
          selectedItems.push(item.selectedItemIndex);
        }
      });
    }
    else if (this.currentMode === 'chaos' && this.selectedSetIndex>=0 && stashIndex>=0 && this.chaosSetItems[this.selectedSetIndex] && this.selectedStashes[stashIndex]) {
      selectedItems = this.chaosRecipeService.getHighlightedItemsIndex(this.selectedStashes[stashIndex],stashIndex, this.chaosSetItems[this.selectedSetIndex]);
    }
    else if (this.currentMode === 'search') {
      this.selectedStashes[this.selectedTabIndex].items.forEach((item, index) => {
        let showItem = true;

        if (this.search.minItemLevel) {
          showItem = showItem && item.ilvl >= + this.search.minItemLevel;
        }
        if (this.search.maxItemLevel) {
          showItem = showItem && item.ilvl <= +this.search.maxItemLevel;
        }

        if (item.frameType === 2
          && (
            this.chaosRecipeService.getItemCategory(item) === 'Amulets'
            || this.chaosRecipeService.getItemCategory(item) === 'Rings'
            || this.chaosRecipeService.getItemType(item) === 'Helmets'
            || this.chaosRecipeService.getItemCategory(item) === 'Belts'
            || this.chaosRecipeService.getItemType(item) === 'Gloves'
            || this.chaosRecipeService.getItemType(item) === 'Boots'
            || this.chaosRecipeService.getItemType(item) === 'BodyArmours'
            || this.chaosRecipeService.getItemCategory(item) === 'Shields'
            || this.chaosRecipeService.getItemCategory(item) === 'Weapons'
            // || this.chaosRecipeService.getItemCategory(item) === 'Quivers'
          )) {

        } else {
          showItem = false
        }
        if (showItem === true) {
          selectedItems.push(index);
        }
      });
    }
    this.highLightedItemsIndex = selectedItems;
  }

  stashContainsSelectedSet(stashIndex: number) {
    if (this.selectedSetIndex === null || this.selectedSetIndex === undefined) {
      return true;
    }
    if (this.selectedSetIndex>=0 && stashIndex>=0) {
      return this.chaosRecipeService.getHighlightedItemsIndex(this.selectedStashes[stashIndex], stashIndex, this.chaosSetItems[this.selectedSetIndex]).length>0;
    }

    return true;
  }

  onTabChanged(stashIndex: MatTabChangeEvent) {
    this.highLightedItemsIndex = [];
    this.updateHighlightedItems(stashIndex.index);

  }

  toggleHighlightItemType(type) {
    this.selectedSetIndex = null;
    if (this.itemTypeSelected === type) {
      this.itemTypeSelected = null;
    } else {
      this.itemTypeSelected = type;
    }

    this.updateHighlightedItems(this.selectedTabIndex);
  }

  onSelectedSetChanged(setIndex) {
    this.selectedSetIndex = setIndex;
    if(setIndex>=0){
      this.updateHighlightedItems(this.selectedTabIndex);
    }

  }

  openStashOverlay() {
    this.electronService.ipcRenderer.send('open-overlay');
  }
}
