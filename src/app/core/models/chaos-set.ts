import { Item } from './stash-tab';
export interface ChaosSet {
  head?: ChaosItem;
  leftWeapon?: ChaosItem;
  rightWeapon?: ChaosItem;
  bodyArmour?: ChaosItem;
  belt?: ChaosItem;
  leftRing?: ChaosItem;
  gloves?: ChaosItem;
  rightRing?: ChaosItem;
  amulet?: ChaosItem;
  boots?: ChaosItem;
  recipe?: Recipe;
  isComplete?: boolean;
}
export interface Recipe {
  quantity: number;
  type: string;
}
export interface ChaosSet {
  head?: ChaosItem;
  leftWeapon?: ChaosItem;
  rightWeapon?: ChaosItem;
  bodyArmour?: ChaosItem;
  belt?: ChaosItem;
  leftRing?: ChaosItem;
  gloves?: ChaosItem;
  rightRing?: ChaosItem;
  amulet?: ChaosItem;
  boots?: ChaosItem;
  recipe?: Recipe;
  isComplete?: boolean;
}

export interface ChaosItem {
  selectedStashIndex: number;
  selectedItemIndex: number;
  item: Item;

}
