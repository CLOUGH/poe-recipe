import { Injectable } from '@angular/core';
import { ChaosSet } from '../../models/chaos-set';
import { StashTab } from '../../models/stash-tab';

@Injectable({
  providedIn: 'root'
})
export class ChaosRecipeService {


  constructor() { }

  getHighlightedItemsIndex(stashTab: StashTab, stashIndex: number, chaosSet: ChaosSet): number[] {
    console.log({ stashTab, chaosSet })
    const itemsIndex = [];
    for (let index = 0; index < stashTab.items.length; index++) {
      const stashItem = stashTab.items[index];

      if (chaosSet.amulet && chaosSet.amulet.selectedStashIndex === stashIndex) {
        itemsIndex.push(chaosSet.amulet.selectedItemIndex);
      }
      if (chaosSet.belt && chaosSet.belt.selectedStashIndex === stashIndex) {
        itemsIndex.push(chaosSet.belt.selectedItemIndex);
      }
      if (chaosSet.bodyArmour && chaosSet.bodyArmour.selectedStashIndex === stashIndex) {
        itemsIndex.push(chaosSet.bodyArmour.selectedItemIndex);
      }
      if (chaosSet.boots && chaosSet.boots.selectedStashIndex === stashIndex) {
        itemsIndex.push(chaosSet.boots.selectedItemIndex);
      }
      if (chaosSet.gloves && chaosSet.gloves.selectedStashIndex === stashIndex) {
        itemsIndex.push(chaosSet.gloves.selectedItemIndex);
      }
      if (chaosSet.head && chaosSet.head.selectedStashIndex === stashIndex) {
        itemsIndex.push(chaosSet.head.selectedItemIndex);
      }
      if (chaosSet.leftRing && chaosSet.leftRing.selectedStashIndex === stashIndex) {
        itemsIndex.push(chaosSet.leftRing.selectedItemIndex);
      }
      if (chaosSet.rightRing && chaosSet.rightRing.selectedStashIndex === stashIndex) {
        itemsIndex.push(chaosSet.rightRing.selectedItemIndex);
      }
      if (chaosSet.rightWeapon && chaosSet.rightWeapon.selectedStashIndex === stashIndex) {
        itemsIndex.push(chaosSet.rightWeapon.selectedItemIndex);
      }
      if (chaosSet.leftWeapon && chaosSet.leftWeapon.selectedStashIndex === stashIndex) {
        itemsIndex.push(chaosSet.leftWeapon.selectedItemIndex);
      }

    }

    return itemsIndex;
  }
}
