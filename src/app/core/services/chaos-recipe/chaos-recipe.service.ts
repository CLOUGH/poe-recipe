import { Injectable } from '@angular/core';
import { ChaosItem, ChaosSet } from '../../models/chaos-set';
import { ChaosSetStat } from '../../models/chaos-set-stat';
import { Item, StashTab } from '../../models/stash-tab';

enum EItemType {
  boots = 'Boots',
  gloves = 'Gloves',
  bodyArmour = 'BodyArmours',
  twoHandedWeapon = 'TwoHandWeapons',
  oneHandedWeapon = 'OneHandWeapons',
  helmet = 'Helmets',
}

enum EItemCategory {
  amulet = 'Amulets',
  ring = 'Rings',
  belt = 'Belts',
  weapon = 'Weapons'
}

@Injectable({
  providedIn: 'root'
})
export class ChaosRecipeService {
  constructor() { }

  getChaosRecipeSets(stashTabs: StashTab[]): ChaosSet[] {
    let chaosItemSets: ChaosSet[] = [];
    stashTabs.forEach((stashTab, stashIndex) => {
      stashTab.items.forEach((item, itemIndex) => {
        if (this.isItemAChaosItem(item)) {
          chaosItemSets = this.addItemToChaosSet(item, chaosItemSets, itemIndex, stashIndex);
        }
      });
    });

    return chaosItemSets;
  }

  addItemToChaosSet(item: Item, chaosItemSets: ChaosSet[], itemIndex: number, stashIndex: number): ChaosSet[] {
    const updatedChaosItemSets = [...chaosItemSets];

    if (updatedChaosItemSets.length === 0) {
      updatedChaosItemSets.push({
        isComplete: false,
        recipe: {
          type: 'Chaos Orb',
          quantity: this.getItemYieldQuantity(item)
        }
      });
    }

    for (let chaosSetIndex = 0; chaosSetIndex < updatedChaosItemSets.length; chaosSetIndex++) {
      const chaosSet = updatedChaosItemSets[chaosSetIndex];
      let slotted = false;
      if (chaosSet.isComplete === true || chaosSet.recipe.quantity !== this.getItemYieldQuantity(item)) {
        continue;
      }
      else if (this.canWeaponFitInSet(item, chaosSet)) {
        updatedChaosItemSets[chaosSetIndex] = this.fitWeaponInSet(item, chaosSet, itemIndex, stashIndex);
        slotted = true;
      }
      else if (this.canRingFitInSet(item, chaosSet)) {
        updatedChaosItemSets[chaosSetIndex] = this.fitRingInSet(item, chaosSet, itemIndex, stashIndex);
        slotted = true;
      }
      else if (this.getItemType(item) === EItemType.boots && !chaosSet.boots) {
        updatedChaosItemSets[chaosSetIndex].boots = this.toChaosItem(item, itemIndex, stashIndex);
        slotted = true;
      }
      else if (this.getItemType(item) === EItemType.gloves && !chaosSet.gloves) {
        updatedChaosItemSets[chaosSetIndex].gloves = this.toChaosItem(item, itemIndex, stashIndex);
        slotted = true;
      }
      else if (this.getItemType(item) === EItemType.helmet && !chaosSet.head) {
        updatedChaosItemSets[chaosSetIndex].head = this.toChaosItem(item, itemIndex, stashIndex);
        slotted = true;
      }
      else if (this.getItemType(item) === EItemType.bodyArmour && !chaosSet.bodyArmour) {
        updatedChaosItemSets[chaosSetIndex].bodyArmour = this.toChaosItem(item, itemIndex, stashIndex);
        slotted = true;
      }
      else if (this.getItemType(item) === EItemType.bodyArmour && !chaosSet.bodyArmour) {
        updatedChaosItemSets[chaosSetIndex].bodyArmour = this.toChaosItem(item, itemIndex, stashIndex);
        slotted = true;
      }
      else if (this.getItemCategory(item) === EItemCategory.belt && !chaosSet.belt) {
        updatedChaosItemSets[chaosSetIndex].belt = this.toChaosItem(item, itemIndex, stashIndex);
        slotted = true;
      }
      else if (this.getItemCategory(item) === EItemCategory.amulet && !chaosSet.amulet) {
        updatedChaosItemSets[chaosSetIndex].amulet = this.toChaosItem(item, itemIndex, stashIndex);
        slotted = true;
      }

      if (slotted === true) {
        updatedChaosItemSets[chaosSetIndex].isComplete = this.isSetCompleted(updatedChaosItemSets[chaosSetIndex]);
        return updatedChaosItemSets;
      }
    }

    updatedChaosItemSets.push({
      isComplete: false,
      recipe: {
        type: 'Chaos Orb',
        quantity: this.getItemYieldQuantity(item)
      }
    });
    const chaosSetIndex = updatedChaosItemSets.length - 1;
    const chaosSet = updatedChaosItemSets[chaosSetIndex];
    if (this.canWeaponFitInSet(item, chaosSet)) {
      updatedChaosItemSets[chaosSetIndex] = this.fitWeaponInSet(item, chaosSet, itemIndex, stashIndex);
      return updatedChaosItemSets;
    }
    else if (this.canRingFitInSet(item, chaosSet)) {
      updatedChaosItemSets[chaosSetIndex] = this.fitRingInSet(item, chaosSet, itemIndex, stashIndex);
      return updatedChaosItemSets;
    }
    else if (this.getItemType(item) === EItemType.boots && !chaosSet.boots) {
      updatedChaosItemSets[chaosSetIndex].boots = this.toChaosItem(item, itemIndex, stashIndex);
      return updatedChaosItemSets;
    }
    else if (this.getItemType(item) === EItemType.gloves && !chaosSet.gloves) {
      updatedChaosItemSets[chaosSetIndex].gloves = this.toChaosItem(item, itemIndex, stashIndex);
      return updatedChaosItemSets;
    }
    else if (this.getItemType(item) === EItemType.helmet && !chaosSet.head) {
      updatedChaosItemSets[chaosSetIndex].head = this.toChaosItem(item, itemIndex, stashIndex);
      return updatedChaosItemSets;
    }
    else if (this.getItemType(item) === EItemType.bodyArmour && !chaosSet.bodyArmour) {
      updatedChaosItemSets[chaosSetIndex].bodyArmour = this.toChaosItem(item, itemIndex, stashIndex);
      return updatedChaosItemSets;
    }
    else if (this.getItemType(item) === EItemType.bodyArmour && !chaosSet.bodyArmour) {
      updatedChaosItemSets[chaosSetIndex].bodyArmour = this.toChaosItem(item, itemIndex, stashIndex);
      return updatedChaosItemSets;
    }
    else if (this.getItemCategory(item) === EItemCategory.belt && !chaosSet.belt) {
      updatedChaosItemSets[chaosSetIndex].belt = this.toChaosItem(item, itemIndex, stashIndex);
      return updatedChaosItemSets;
    }
    else if (this.getItemCategory(item) === EItemCategory.amulet && !chaosSet.amulet) {
      updatedChaosItemSets[chaosSetIndex].amulet = this.toChaosItem(item, itemIndex, stashIndex);
      return updatedChaosItemSets;
    }


    return updatedChaosItemSets;
  }

  isSetCompleted(chaosSet: ChaosSet): boolean {
    return chaosSet.amulet
      && chaosSet.belt
      && chaosSet.bodyArmour
      && chaosSet.boots
      && chaosSet.gloves
      && chaosSet.head
      && (chaosSet.leftRing && chaosSet.rightRing)
      && (
        (
          (chaosSet.leftWeapon && this.getItemType(chaosSet.leftWeapon.item) === EItemType.twoHandedWeapon)
          || (chaosSet.rightWeapon && this.getItemType(chaosSet.rightWeapon.item) === EItemType.twoHandedWeapon)
        )
        || (chaosSet.leftWeapon && chaosSet.rightWeapon)
      ) ? true : false;
  }

  toChaosItem(item, stashIndex, itemIndex) {
    return {
      item,
      selectedItemIndex: stashIndex,
      selectedStashIndex: itemIndex
    };
  }

  fitRingInSet(item: Item, chaosSet: ChaosSet, itemIndex: number, stashIndex: number): ChaosSet {
    const chaosItem: ChaosItem = this.toChaosItem(item, itemIndex, stashIndex);
    if(this)
    if (!chaosSet.leftRing) {
      return {
        ...chaosSet,
        leftRing: chaosItem
      }
    }
    if (!chaosSet.rightRing) {
      return {
        ...chaosSet,
        rightRing: chaosItem
      }
    }
  }

  canRingFitInSet(item: Item, chaosSet: ChaosSet) {
    if (this.getItemCategory(item) !== EItemCategory.ring) {
      return false
    }

    if (!chaosSet.leftRing || !chaosSet.rightRing) {
      return true;
    }

    return false;
  }

  fitWeaponInSet(item: Item, chaosSet: ChaosSet, selectedItemIndex: number, selectedStashIndex: number): ChaosSet {
    const chaosItem: ChaosItem = {
      item,
      selectedItemIndex,
      selectedStashIndex
    };

    if (this.getItemType(item) === EItemType.twoHandedWeapon) {
      return {
        ...chaosSet,
        leftWeapon: chaosItem
      };
    }

    if (!chaosSet.leftWeapon) {
      return {
        ...chaosSet,
        leftWeapon: chaosItem
      };
    }

    return {
      ...chaosSet,
      rightWeapon: chaosItem
    };
  }

  canWeaponFitInSet(item: Item, chaosSet: ChaosSet) {
    if (this.getItemCategory(item) !== EItemCategory.weapon) {
      return false;
    }

    if (this.getItemType(item) === EItemType.twoHandedWeapon && (chaosSet.rightWeapon || chaosSet.leftWeapon)) {
      return false;
    }
    if (chaosSet.rightWeapon && chaosSet.leftWeapon) {
      return false;
    }

    if ((chaosSet.rightWeapon && this.getItemType(chaosSet.rightWeapon.item) === EItemType.twoHandedWeapon)
      || (chaosSet.leftWeapon && this.getItemType(chaosSet.leftWeapon.item) === EItemType.twoHandedWeapon)) {
      return false;
    }

    return true;
  }

  getItemYieldQuantity(item: Item) {
    if (this.isItemAChaosItem(item) && item.identified === false) {
      return 2;
    }
    if (this.isItemAChaosItem(item) && item.identified === true) {
      return 1;
    }

    return 0;
  }

  isItemAChaosItem(item: Item) {
    return item.ilvl >= 60
      && item.frameType === 2
      && (
        this.getItemCategory(item) === EItemCategory.amulet
        || this.getItemCategory(item) === EItemCategory.ring
        || this.getItemType(item) === EItemType.helmet
        || this.getItemCategory(item) === EItemCategory.belt
        || this.getItemType(item) === EItemType.gloves
        || this.getItemType(item) === EItemType.boots
        || this.getItemType(item) === EItemType.bodyArmour
        || this.getItemCategory(item) === EItemCategory.weapon
        // || this.getItemCategory(item) === 'Shields'
        // || this.getItemCategory(item) === 'Quivers'
      )
  }

  getItemType(item: Item) {
    const match = item.icon.match(/https:\/\/web\.poecdn\.com\/image\/Art\/2DItems\/\w+\/(\w+)/);

    return match[1];
  }

  getItemCategory(item) {
    const match = item.icon.match(/https:\/\/web\.poecdn\.com\/image\/Art\/2DItems\/(\w+)/);

    return match[1];
  }



  getHighlightedItemsIndex(stashTab: StashTab, stashIndex: number, chaosSet: ChaosSet): number[] {
    const itemsIndex = [];
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
    return itemsIndex;
  }

  getChaosSetStat(stashTabs: StashTab[]) {
    const chaosSetItemsStat: ChaosSetStat = {
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
      ring: {
        count: 0,
        items: []
      },
      weapon: {
        count: 0,
        items: []
      },
      belt: {
        count: 0,
        items: []
      },
      amulet: {
        count: 0,
        items: []
      }

    };
    
    stashTabs.forEach((stashTab, stashTabIndex) => {
      stashTab.items.forEach((item, itemIndex) => {
        if (this.isItemAChaosItem(item)) {
          const chaosItem = this.toChaosItem(item, itemIndex, stashTabIndex);

          if (this.getItemCategory(item) === 'Amulets') {
            chaosSetItemsStat.amulet.count++;
            chaosSetItemsStat.amulet.items.push(chaosItem);
          }
          if (this.getItemCategory(item) === 'Rings') {
            chaosSetItemsStat.ring.count++;
            chaosSetItemsStat.ring.items.push(chaosItem);
          }
          if (this.getItemType(item) === 'Helmets') {
            chaosSetItemsStat.helmet.count++;
            chaosSetItemsStat.helmet.items.push(chaosItem);
          }
          if (this.getItemCategory(item) === 'Belts') {
            chaosSetItemsStat.belt.count++;
            chaosSetItemsStat.belt.items.push(chaosItem);
          }
          if (this.getItemType(item) === 'Gloves') {
            chaosSetItemsStat.gloves.count++;
            chaosSetItemsStat.gloves.items.push(chaosItem);
          }
          if (this.getItemType(item) === 'Boots') {
            chaosSetItemsStat.boot.count++;
            chaosSetItemsStat.boot.items.push(chaosItem);
          }
          if (this.getItemType(item) === 'BodyArmours') {
            chaosSetItemsStat.bodyArmour.count++;
            chaosSetItemsStat.bodyArmour.items.push(chaosItem);
          }
          if (this.getItemCategory(item) === 'Shields') {
            chaosSetItemsStat.weapon.count++;
            chaosSetItemsStat.weapon.items.push(chaosItem);
          }
          if (this.getItemCategory(item) === 'Weapons') {
            chaosSetItemsStat.weapon.count++;
            chaosSetItemsStat.weapon.items.push(chaosItem);
          }
        }
      });      
    });
    return chaosSetItemsStat;
  }

}
