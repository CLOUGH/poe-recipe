import { StashTab, Item } from './../../../core/models/stash-tab';
import { AfterViewInit, Component, ElementRef, HostListener, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-stash-tab',
  templateUrl: './stash-tab.component.html',
  styleUrls: ['./stash-tab.component.scss']
})
export class StashTabComponent implements OnInit, AfterViewInit {
  stashContainerHeight: number;
  stashPanelSize: number;
  popoverItemIndex: number;

  @Input()
  public stashTab: StashTab;

  @Input()
  public highlightedItemIndex: number[];

  @ViewChild("stashContainer") public stashContainer: ElementRef;
  @ViewChild("stashImgPanel") public stashImgPanel: ElementRef;

  @HostListener('window:resize', ['$event.target'])
  onResize() {
    this.onResizeStashPanel();
  }

  
  constructor() {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.onResizeStashPanel();
    });
  }

  onResizeStashPanel(){
    this.stashPanelSize = this.stashImgPanel.nativeElement.offsetHeight;
  }

  getItemPositionX(item: Item, stashTab: StashTab) {
    return item.x * (this.stashPanelSize/this.getItemPerPanel(stashTab));
  }
  getItemPerPanel(stashTab: StashTab) {
    if(stashTab.quadLayout===true){
      return 24;
    }
    if(stashTab.currentTab.type.match(/NormalStash|PremiumStash/)){
      return 12;
    }

  }
  getItemPositionY(item: Item, stashTab: StashTab) {
    return item.y * (this.stashPanelSize/this.getItemPerPanel(stashTab));
  }

  getItemHeight(item: Item, stashTab: StashTab) {
    return item.h * (this.stashPanelSize/this.getItemPerPanel(stashTab));
  }

  isItemHighlighted(itemIndex){
    return this.highlightedItemIndex && this.highlightedItemIndex.findIndex(highLightIndex =>highLightIndex ===itemIndex)>=0;

  }

  showItemPopover(itemIndex: number){
    this.popoverItemIndex = itemIndex;
  }
  hidePopoverItem(itemIndex: number){
    this.popoverItemIndex = null;
  }

}
