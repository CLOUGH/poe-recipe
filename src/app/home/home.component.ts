import { ChaosSet, ChaosItem, Recipe } from './../core/models/chaos-set';
import {ChaosSetStat} from './../core/models/chaos-set-stat';
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
  highLightedItemsIndex : number[] = [];
  search : any = {};
  searchForm = new FormGroup({
    minItemLevel: new FormControl(0),
    maxItemLevel: new FormControl(0)
  });
  refreshing = false;
  refreshInterval: Subscription;
  refreshRate = 60000;
  chaosSetItemsStat: ChaosSetStat;
  itemTypeSelected: string;

  constructor(private router: Router, public dialog: MatDialog, private snackBar: MatSnackBar, private poeService: PathOfExileService, private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.refresh();
  }

  async refresh() {
    this.settings = this.settingsService.getSettings();
    this.onPoeSessionIdUpdated();
    await this.getStashTabs();

    if(this.refreshInterval) {
      this.refreshInterval.unsubscribe();
    }
    
    console.log(this.settings);
    this.refreshRate = (this.settings.poeApiRefreshRate || 60) * 1000;
    this.refreshInterval = interval(this.refreshRate).subscribe(() => {
      this.getStashTabs();
      console.log("Refreshed", this.settings.poeApiRefreshRate);
    });

    this.searchForm.valueChanges.subscribe((searchValue) => {
      this.search = searchValue;
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
      return this.poeService.getStash(0, this.settings.accountName, this.settings.activeCharacter.league, true)
        .pipe(
          mergeMap(stash => {
            const selectTabs = stash.tabs
              .filter(tab => {
                return this.settings.selectedTabIds.findIndex(selectedTabId => selectedTabId === tab.id) >= 0;
              })
              .map(tab => this.poeService.getStash(tab.i, this.settings.accountName, this.settings.activeCharacter.league, true))
            return combineLatest(of(stash), forkJoin(selectTabs));
          }),
          map(([stash, selectTabs]) => {
            return selectTabs.map((selectedStash, index) => {
              selectedStash.currentTab = stash.tabs.find(tab => tab.id === this.settings.selectedTabIds[index]);
              return selectedStash;
            });
          })
        )
        .subscribe(stashes => {
          this.selectedStashes = stashes;
          this.chaosSetItems = this.getItemChaosRecipeItems(stashes);         
          
          this.refreshing = false;
        }, (error) => {
          const errorSnackBar = this.snackBar.open(`An error has occured while trying to retrieve pull your stash.`, 'More Info');
          errorSnackBar.onAction().subscribe(() => this.openErrorDetailsModal(error));
          this.refreshing = false;
        });
    }
    return Promise.resolve();
  }
  updateChaosSetStat(chaosItems: ChaosItem[]) {
    
    this.chaosSetItemsStat = {
      bodyArmour: {
        count: 0,
        items: []
      },
      boot: {
        count: 0,
        items: []
      },
      gloves: {
        count: 0,
        items: []
      },
      helmet: {
        count: 0,
        items: []
      },
      ring:  {
        count: 0,
        items: []
      },
      weapon:  {
        count: 0,
        items: []
      },      
      belt:  {
        count: 0,
        items: []
      },
      amulet: {
        count: 0,
        items: []
      }

    };

    chaosItems.forEach((chaosItem, index) => {
      
      if(this.getItemCategory(chaosItem.item) === 'Amulets'){
        this.chaosSetItemsStat.amulet.count++;
        this.chaosSetItemsStat.amulet.items.push(chaosItem);
      }
      if(this.getItemCategory(chaosItem.item)=== 'Rings'){
        this.chaosSetItemsStat.ring.count++;
        this.chaosSetItemsStat.ring.items.push(chaosItem);
      }
      if(this.getItemType(chaosItem.item)=== 'Helmets'){
        this.chaosSetItemsStat.helmet.count++;
        this.chaosSetItemsStat.helmet.items.push(chaosItem);
      }
      if(this.getItemCategory(chaosItem.item)=== 'Belts'){
        this.chaosSetItemsStat.belt.count++;
        this.chaosSetItemsStat.belt.items.push(chaosItem);
      }
      if(this.getItemType(chaosItem.item)=== 'Gloves'){
        this.chaosSetItemsStat.gloves.count++;
        this.chaosSetItemsStat.gloves.items.push(chaosItem);
      }
      if(this.getItemType(chaosItem.item)=== 'Boots'){
        this.chaosSetItemsStat.boot.count++;
        this.chaosSetItemsStat.boot.items.push(chaosItem);
      }
      if(this.getItemType(chaosItem.item)=== 'BodyArmours'){
        this.chaosSetItemsStat.bodyArmour.count++;
        this.chaosSetItemsStat.bodyArmour.items.push(chaosItem);
      }
      if(this.getItemCategory(chaosItem.item)=== 'Shields'){
        this.chaosSetItemsStat.weapon.count++;
        this.chaosSetItemsStat.weapon.items.push(chaosItem);
      }
      if(this.getItemCategory(chaosItem.item)=== 'Weapons'){
        this.chaosSetItemsStat.weapon.count++;
        this.chaosSetItemsStat.weapon.items.push(chaosItem);
      }
    });
  }

  openErrorDetailsModal(error) {
    const dialogRef = this.dialog.open(ErrorDetailDialogComponent,{
      data: {error}
    });
  }

  openSettings() {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '600px',
    })
      .afterClosed().subscribe(() => {
        this.refresh();
      });
  }

  getCompletedChaosSet() {
    return this.chaosSetItems ?  this.chaosSetItems.filter(chaosSetItem => chaosSetItem.isComplete===true): [];
  }

  toggleSelectedSet( selectedSetIndex, event) {
    if(selectedSetIndex === this.selectedSetIndex) {
      this.selectedSetIndex = null;
      event.preventDefault();
    }
  }

  getItemChaosRecipeItems(stashes: StashTab[]) {
    const chaosItems: ChaosItem[] = [];
    stashes.forEach((stashTab, stashIndex) => {
      for (let itemIndex = 0; itemIndex < stashTab.items.length; itemIndex++) {
        const item = stashTab.items[itemIndex];

        if (this.isChaosItem(item) === false) {
          continue;
        }
        chaosItems.push({
          item: item,
          selectedItemIndex: itemIndex,
          selectedStashIndex: stashIndex
        });
      }
    });
    this.updateChaosSetStat(chaosItems);

    let chaosSets: ChaosSet[] = [];
    while (chaosItems.length > 0) {
      const chaosItem = chaosItems.shift();
      const itemRecipe = this.getRecipe(chaosItem.item);
      const isItemWeapon = this.isWeapon(chaosItem.item);
      const isItemTwoHandedWeapon = this.getItemType(chaosItem.item) === 'TwoHandWeapons';
      const itemType = this.getItemType(chaosItem.item);
      const isItemBow = isItemWeapon && this.isWeaponBow(chaosItem.item);
      const isItemQuiver = this.getItemCategory(chaosItem.item) === 'Quivers';
      const itemCategory = this.getItemCategory(chaosItem.item);

      //find a place to put the item
      let itemSlotted = false;
      for (let index = 0; index < chaosSets.length; index++) {
        const chaosSet = chaosSets[index];

        if (chaosSet.isComplete) {
          continue;
        }
        else if (chaosSet.recipe.type !== itemRecipe.type || chaosSet.recipe.quantity !== itemRecipe.quantity) {
          continue;
        }
        else if (isItemQuiver && (!chaosSet.leftWeapon
          || (this.getItemType(chaosSet.leftWeapon.item) !== 'TwoHandWeapons' && this.isWeaponBow(chaosSet.leftWeapon.item)))) {
          chaosSet.rightWeapon = chaosItem;
          itemSlotted = true;
        }
        else if (isItemWeapon && isItemTwoHandedWeapon && !chaosSet.leftWeapon && !chaosSet.rightWeapon) {
          chaosSet.leftWeapon = chaosItem;
          itemSlotted = true;
        }
        else if (isItemWeapon && isItemTwoHandedWeapon && chaosSet.leftWeapon && !chaosSet.rightWeapon && this.getItemType(chaosSet.leftWeapon.item) !== 'TwoHandWeapons') {
          chaosItems.unshift(chaosSet.leftWeapon);
          chaosSet.leftWeapon = chaosItem;
          itemSlotted = true;
        }
        else if (isItemWeapon && !isItemTwoHandedWeapon && !chaosSet.leftWeapon) {
          chaosSet.leftWeapon = chaosItem;
          itemSlotted = true;
        }
        else if (isItemWeapon && !isItemTwoHandedWeapon && chaosSet.leftWeapon && !chaosSet.rightWeapon && this.getItemType(chaosSet.leftWeapon.item) !== 'TwoHandWeapons') {
          chaosSet.rightWeapon = chaosItem;
          itemSlotted = true;
        }
        else if (itemType === 'Shields' && !chaosSet.rightWeapon && (!chaosSet.leftWeapon || this.getItemType(chaosSet.leftWeapon.item) !== 'TwoHandWeapons')) {
          chaosSet.rightWeapon = chaosItem;
          itemSlotted = true;
        }
        else if (isItemTwoHandedWeapon && isItemBow && !chaosSet.leftWeapon && chaosSet.rightWeapon && this.getItemCategory(chaosSet.rightWeapon.item) === 'Quivers') {
          chaosSet.leftWeapon = chaosItem;
          itemSlotted = true;
        }
        else if (itemType === 'BodyArmours' && !chaosSet.bodyArmour) {
          chaosSet.bodyArmour = chaosItem;
          itemSlotted = true;
        }
        else if (itemType === 'Boots' && !chaosSet.boots) {
          chaosSet.boots = chaosItem;
          itemSlotted = true;
        }
        else if (itemType === 'Gloves' && !chaosSet.gloves) {
          chaosSet.gloves = chaosItem;
          itemSlotted = true;
        }
        else if (itemCategory === 'Amulets' && !chaosSet.amulet) {
          chaosSet.amulet = chaosItem;
          itemSlotted = true;
        }
        else if (itemCategory === 'Rings' && !chaosSet.rightRing) {
          chaosSet.rightRing = chaosItem;
          itemSlotted = true;
        }
        else if (itemCategory === 'Rings' && !chaosSet.leftRing) {
          chaosSet.leftRing = chaosItem;
          itemSlotted = true;
        }
        else if (itemCategory === 'Belts' && !chaosSet.belt) {
          chaosSet.belt = chaosItem;
          itemSlotted = true;
        }
        else if (itemType === 'Helmets' && !chaosSet.head) {
          chaosSet.head = chaosItem;
          itemSlotted = true;
        }

        chaosSet.isComplete = this.getIsChaosSetComplete(chaosSet);
        if (itemSlotted) {

          break;
        }
      }

      if (itemSlotted === false) {
        chaosSets.push({
          recipe: itemRecipe
        });
      }

      if (itemCategory === 'Amulets') {
        chaosSets[chaosSets.length - 1].amulet = chaosItem;
      }
      if (itemCategory === 'Rings') {
        chaosSets[chaosSets.length - 1].leftRing = chaosItem;
      }
      if (itemType === 'Helmets') {
        chaosSets[chaosSets.length - 1].head = chaosItem;
      }
      if (itemCategory === 'Belts') {
        chaosSets[chaosSets.length - 1].belt = chaosItem;
      }
      if (itemType === 'Gloves') {
        chaosSets[chaosSets.length - 1].gloves = chaosItem;
      }
      if (itemType === 'Boots') {
        chaosSets[chaosSets.length - 1].boots = chaosItem;
      }
      if (itemType === 'BodyArmours') {
        chaosSets[chaosSets.length - 1].bodyArmour = chaosItem;
      }
      if (itemType === 'Shields') {
        chaosSets[chaosSets.length - 1].rightWeapon = chaosItem;
      }
      if (isItemQuiver === true) {
        chaosSets[chaosSets.length - 1].rightWeapon = chaosItem;
      }
      if (isItemWeapon === true) {
        chaosSets[chaosSets.length - 1].leftWeapon = chaosItem;
      }
    }
    return chaosSets;
  }

  getIsChaosSetComplete(chaosSet: ChaosSet): boolean {
    return !!(chaosSet.amulet
      && chaosSet.belt
      && chaosSet.bodyArmour
      && chaosSet.boots
      && chaosSet.gloves
      && chaosSet.head
      && chaosSet.leftRing
      && chaosSet.rightRing
      && chaosSet.leftWeapon
      && (
        this.getItemType(chaosSet.leftWeapon.item) === 'TwoHandWeapons'
        || chaosSet.rightRing
      ));
  }

  getChaosItemSetTypeMapping(item: Item) {
    if (this.getItemType(item) === 'BodyArmours') {
      return 'bodyArmour';
    }
  }
  getItemCategory(item) {
    const match = item.icon.match(/https:\/\/web\.poecdn\.com\/image\/Art\/2DItems\/(\w+)/);

    return match[1];
  }

  isWeapon(item: Item) {
    return this.getItemCategory(item) === 'Weapons';
  }

  isWeaponBow(item: Item) {
    const match = item.icon.match(/https:\/\/web\.poecdn\.com\/image\/Art\/2DItems\/\w+\/\w+\/(\w+)/);

    return match[1] === 'Bows';
  }

  getItemType(item: Item) {
    const match = item.icon.match(/https:\/\/web\.poecdn\.com\/image\/Art\/2DItems\/\w+\/(\w+)/);

    return match[1];
  }

  getRecipe(item: Item): Recipe {
    if (item.ilvl >= 60 && item.ilvl<=74 &&  item.identified === true && item.frameType === 2) {
      return { quantity: 1, type: 'Chaos Orb' }
    }
    if (item.ilvl >= 60 && item.ilvl<=74 && item.identified === false && item.frameType === 2) {
      return { quantity: 2, type: 'Chaos Orb' }
    }
    return { quantity: null, type: null };
  }

  isChaosItem(item: Item): Boolean {
    return item.ilvl >= 60 && item.ilvl<=74
      && item.frameType === 2
      && (
        this.getItemCategory(item) === 'Amulets'
        || this.getItemCategory(item) === 'Rings'
        || this.getItemType(item) === 'Helmets'
        || this.getItemCategory(item) === 'Belts'
        || this.getItemType(item) === 'Gloves'
        || this.getItemType(item) === 'Boots'
        || this.getItemType(item) === 'BodyArmours'
        || this.getItemCategory(item) === 'Shields'
        || this.getItemCategory(item) === 'Weapons'
        // || this.getItemCategory(item) === 'Quivers'
      );
  }


  getHighLightedItems(stashIndex: number) {
    let selectedItems = []
    if(this.itemTypeSelected){
      this.chaosSetItemsStat[this.itemTypeSelected].items.forEach((item:ChaosItem) => {
        if(item.selectedStashIndex===stashIndex) {
          selectedItems.push(item.selectedItemIndex);
        }
      });
    }
    else if(this.currentMode === 'chaos'){
      this.chaosSetItems.filter((chaosSetItem, index) => index===this.selectedSetIndex)
        .forEach(chaosSetItem => {
          if (chaosSetItem.amulet && chaosSetItem.amulet.selectedStashIndex === stashIndex) {
            selectedItems.push(chaosSetItem.amulet.selectedItemIndex);
          }
          if (chaosSetItem.belt && chaosSetItem.belt.selectedStashIndex === stashIndex) {
            selectedItems.push(chaosSetItem.belt.selectedItemIndex);
          }
          if (chaosSetItem.bodyArmour && chaosSetItem.bodyArmour.selectedStashIndex === stashIndex) {
            selectedItems.push(chaosSetItem.bodyArmour.selectedItemIndex);
          }
          if (chaosSetItem.boots && chaosSetItem.boots.selectedStashIndex === stashIndex) {
            selectedItems.push(chaosSetItem.boots.selectedItemIndex);
          }
          if ( chaosSetItem.gloves && chaosSetItem.gloves.selectedStashIndex === stashIndex) {
            selectedItems.push(chaosSetItem.gloves.selectedItemIndex);
          }
          if (chaosSetItem.head && chaosSetItem.head.selectedStashIndex === stashIndex) {
            selectedItems.push(chaosSetItem.head.selectedItemIndex);
          }
          if (chaosSetItem.leftRing && chaosSetItem.leftRing.selectedStashIndex === stashIndex) {
            selectedItems.push(chaosSetItem.leftRing.selectedItemIndex);
          }
          if (chaosSetItem.rightRing && chaosSetItem.rightRing.selectedStashIndex === stashIndex) {
            selectedItems.push(chaosSetItem.rightRing.selectedItemIndex);
          }
          if (chaosSetItem.rightWeapon && chaosSetItem.rightWeapon.selectedStashIndex === stashIndex) {
            selectedItems.push(chaosSetItem.rightWeapon.selectedItemIndex);
          }
          if (chaosSetItem.leftWeapon && chaosSetItem.leftWeapon.selectedStashIndex === stashIndex) {
            selectedItems.push(chaosSetItem.leftWeapon.selectedItemIndex);
          }
  
        });
    }
    else if(this.currentMode === 'search') {
      this.selectedStashes[this.selectedTabIndex].items.forEach((item,index) => {
        let showItem = true;
        
        if(this.search.minItemLevel){
          showItem = showItem && item.ilvl>=+ this.search.minItemLevel;
        }
        if(this.search.maxItemLevel){
          showItem = showItem && item.ilvl<=+this.search.maxItemLevel;
        }

        if(item.frameType === 2
          && (
            this.getItemCategory(item) === 'Amulets'
            || this.getItemCategory(item) === 'Rings'
            || this.getItemType(item) === 'Helmets'
            || this.getItemCategory(item) === 'Belts'
            || this.getItemType(item) === 'Gloves'
            || this.getItemType(item) === 'Boots'
            || this.getItemType(item) === 'BodyArmours'
            || this.getItemCategory(item) === 'Shields'
            || this.getItemCategory(item) === 'Weapons'
            // || this.getItemCategory(item) === 'Quivers'
          )){

        } else {
          showItem = false
        }
        if(showItem === true){
          selectedItems.push(index);
        }

        
      });
    }
    return selectedItems;
  }

  stashContainsSelectedSet(stashIndex:  number ){
    const highLightedItems: ChaosItem[] = this.getHighLightedItems(stashIndex);
    if(this.selectedSetIndex===null || this.selectedSetIndex===undefined){
      return true;
    }
    if(highLightedItems.length===0){
      return false;
    }

    return true;
  }

  onTabChanged(stashIndex) {
    this.highLightedItemsIndex = this.getHighLightedItems(stashIndex);
  }

  toggleHighlightItemType(type) {
    this.selectedSetIndex = null;
    if(this.itemTypeSelected === type){
      this.itemTypeSelected = null;
    } else{
      this.itemTypeSelected = type;
    }
  }
}
