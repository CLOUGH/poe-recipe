import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, forkJoin, interval, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ChaosSet } from '../core/models/chaos-set';
import { ChaosSetStat } from '../core/models/chaos-set-stat';
import { Settings } from '../core/models/settings';
import { StashTab, Item } from '../core/models/stash-tab';
import { ChaosRecipeService, ElectronService, PathOfExileService } from '../core/services';
import { SettingsService } from '../core/services/settings.service';

@Component({
  selector: 'app-stash-overlay',
  templateUrl: './stash-overlay.component.html',
  styleUrls: ['./stash-overlay.component.scss']
})
export class StashOverlayComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('stashGrid') stashGrid: ElementRef;
  @ViewChild('dragBtn') dragBtn: ElementRef;
  @ViewChild('doneBtn') doneBtn: ElementRef;
  @ViewChild('editModeBtn') editModeBtn: ElementRef;
  @ViewChild('completedSetList') completedSetList: ElementRef;
  currentWindow: Electron.BrowserWindow;
  entered = false;
  gridBox = new Array(24 * 24)
  windowPosition: number[];
  editModeEnabled = true;
  @ViewChild('footer') footer: ElementRef;
  focusedWindow: Electron.BrowserWindow;
  stashTabs: StashTab[];
  chaosRecipeSets: ChaosSet[];
  chaosSetStat: ChaosSetStat;
  selectedSetIndex: number;
  selectedStashTabIndex: number = 0;
  chaosRecipeItemsIndex: number[];
  stashContainerHeight: number;
  stashPanelSize: number;
  settings: Settings;
  refreshing: boolean;
  @ViewChild("stashImgPanel") public stashImgPanel: ElementRef;

  @HostListener('window:resize', ['$event.target'])
  onResize() {
    this.onResizeStashPanel();
    const [width, height] = this.currentWindow.getSize();
    const [x, y] = this.currentWindow.getPosition();
    this.settings.overlay = {
      width,
      height,
      x,
      y
    };

    this.settingsService.saveSettings(this.settings);
  }

  constructor(
    private electronService: ElectronService,
    private elRef: ElementRef,
    private chaosRecipeService: ChaosRecipeService,
    private settingsService: SettingsService,
    private poeService: PathOfExileService
  ) {
    this.currentWindow = this.electronService.remote.getCurrentWindow();

    this.elRef.nativeElement.addEventListener('mouseenter', (event) => {
      this.forwardMouseEvent();
    });
    this.elRef.nativeElement.addEventListener('mouseleave', (event) => {
      this.stopForwardingMouseEvents();
    });

    this.settings = this.settingsService.getSettings();
    if(this.settings.overlay) {
      this.currentWindow.setPosition(this.settings.overlay.x, this.settings.overlay.y);
      this.currentWindow.setSize(this.settings.overlay.width, this.settings.overlay.height);
    }

  }
  ngOnDestroy(): void {
    window.removeEventListener("storage", this.onLocalStorageUpdate.bind(this), false);
  }


  ngAfterViewInit(): void {
    this.editModeBtn.nativeElement.addEventListener('mouseenter', (event) => {
      this.stopForwardingMouseEvents();
    });
    this.doneBtn.nativeElement.addEventListener('mouseenter', (event) => {
      this.stopForwardingMouseEvents();
    });
    this.completedSetList.nativeElement.addEventListener('mouseenter', (event) => {
      this.stopForwardingMouseEvents();
    });
    this.completedSetList.nativeElement.addEventListener('mouseleave', (event) => {
      this.forwardMouseEvent();
    });
    this.onResizeStashPanel();
  }


  ngOnInit(): void {
    interval(1000).subscribe(() => {
      this.windowPosition = this.currentWindow.getPosition();
      this.focusedWindow = this.electronService.remote.BrowserWindow.getFocusedWindow();
    })
    this.onLocalStorageUpdate();

    if (window.addEventListener) {
      window.addEventListener("storage", this.onLocalStorageUpdate.bind(this), false);
    }

    this.currentWindow.on('move', this.onResize.bind(this));
  }

  onLocalStorageUpdate() {
    if (localStorage.getItem('stashes')) {
      this.stashTabs = JSON.parse(localStorage.getItem('stashes')) as StashTab[];
      setTimeout(() => {
        this.chaosRecipeSets = this.chaosRecipeService.getChaosRecipeSets(this.stashTabs);
        this.chaosSetStat = this.chaosRecipeService.getChaosSetStat(this.stashTabs);
      });
    }
  }

  forwardMouseEvent() {
    this.currentWindow.setIgnoreMouseEvents(true, { forward: true });
    this.entered = true;
  }

  stopForwardingMouseEvents() {
    this.currentWindow.setIgnoreMouseEvents(false);
    this.entered = false;
  }

  toggleEditMode() {
    this.editModeEnabled = !this.editModeEnabled;
    this.entered = true;
    this.currentWindow.setResizable(this.editModeEnabled);
  }

  closeWindow() {
    console.log("close window event fired")
    this.currentWindow.close();
  }

  toggleSelectedSet(selectedSetIndex, event) {
    if (selectedSetIndex === this.selectedSetIndex) {
      this.selectedSetIndex = null;
      event.preventDefault();
    }

    // this.updateHighlightedItems(this.selectedTabIndex);
  }

  onSelectedSetChanged(selectedSetIndex: number) {
    if (selectedSetIndex >= 0 && this.selectedStashTabIndex >= 0) {
      this.chaosRecipeItemsIndex = this.chaosRecipeService.getHighlightedItemsIndex(this.stashTabs[this.selectedStashTabIndex], +this.selectedStashTabIndex, this.chaosRecipeSets[+selectedSetIndex]);
      console.log(this.chaosRecipeItemsIndex);
    }
  }

  getNoCompletedSets() {
    return this.chaosRecipeSets.filter(set => set.isComplete === true).length;
  }

  onStashTabSelectedChanged(selectedStashTabIndex: number) {
    if (this.selectedSetIndex >= 0 && selectedStashTabIndex >= 0) {
      this.chaosRecipeItemsIndex = this.chaosRecipeService.getHighlightedItemsIndex(this.stashTabs[selectedStashTabIndex], +selectedStashTabIndex, this.chaosRecipeSets[+this.selectedSetIndex]);
    }
  }

  containsChaosSet(stashTabIndex) {
    if (!this.selectedSetIndex && this.selectedSetIndex !== 0) {
      return true;
    }
    if (this.selectedSetIndex >= 0 && stashTabIndex >= 0) {
      const highlightedSetItems = this.chaosRecipeService.getHighlightedItemsIndex(this.stashTabs[+stashTabIndex], +stashTabIndex, this.chaosRecipeSets[+this.selectedSetIndex]);
      return highlightedSetItems.length > 0;
    }

    return true;

  }

  getItemPerPanel(stashTab: StashTab) {
    if (stashTab.quadLayout === true) {
      return 24;
    }
    if (stashTab.currentTab.type.match(/NormalStash|PremiumStash/)) {
      return 12;
    }

  }

  getItemPositionX(item: Item, stashTab: StashTab) {
    return item.x * (this.stashPanelSize / this.getItemPerPanel(stashTab));
  }
  getItemPositionY(item: Item, stashTab: StashTab) {

    return item.y * (this.stashPanelSize / this.getItemPerPanel(stashTab));
  }

  getItemHeight(item: Item, stashTab: StashTab) {
    return item.h * (this.stashPanelSize / this.getItemPerPanel(stashTab));
  }
  getItemWidth(item: Item, stashTab: StashTab) {
    return item.w * (this.stashPanelSize / this.getItemPerPanel(stashTab));
  }

  onResizeStashPanel() {
    this.stashPanelSize = this.stashImgPanel.nativeElement.offsetHeight;
    this.stashPanelSize;
  }

  async refresh() {
    this.settings = this.settingsService.getSettings();
    this.poeService.setPoeSessionIdCookie(this.settings && this.settings.poeSessionId);

    setTimeout(() => {
      this.getStashTabs();
    })
  }


  getStashTabs() {
    if (this.settings && this.settings.accountName && this.settings.activeCharacter && this.settings.selectedTabIds && this.settings.selectedTabIds.length > 0) {

      this.refreshing = true;
      return this.poeService.getPlayerStashTabs(this.settings.selectedTabIds, this.settings.accountName, this.settings.activeCharacter.league, true)
        .subscribe(stashes => {
          this.stashTabs = stashes;
          localStorage.setItem('stashes', JSON.stringify(stashes));
          this.chaosRecipeSets = this.chaosRecipeService.getChaosRecipeSets(this.stashTabs);
          this.refreshing = false;
        }, (error) => {
          this.refreshing = false;
        });
    }
  }


}
