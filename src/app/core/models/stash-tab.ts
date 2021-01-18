export interface StashTab {
  numTabs?: number;
  tabs?: Tab[];
  items?: Item[];
  currencyLayout?: CurrencyLayout[];
  quadLayout?: Boolean;
  currentTab?: Tab;
}

export interface CurrencyLayout{
  h: number;
  w: number;
  x: number;
  y: number;
}

export interface Tab {
  color: {
    b: number;
    g: number;
    r: number;
  }
  i: number;
  id: string;
  n: string;
  selected: Boolean;
  srcC: string;
  srcL: string;
  srcR: string;
  type: string;
}

export interface Item {
  fractured: boolean;
  descrText?: string;
  explicitMods?: string[];
  flavourText?: string[];
  frameType?: number;
  h?: number;
  icon?: string;
  id?: string;
  identified?: boolean;
  ilvl?: number;
  implicitMods?: string[];
  inventoryId?: string;
  league?: string;
  name?: string;
  properties?: ItemProperty[];
  requirements: ItemRequirement[];
  socketedItems: any[];
  sockets: [{group: 0, attr: "D", sColour: "G"}];
  typeLine?: string;
  verified?: boolean;
  synthesised?: boolean;
  w?: number;
  x?: number;
  y?: number;
}
export interface ItemProperty {
  displayMode?: number;
  name?: string;
  type?: string;
  values?: any[];
}

export interface ItemRequirement {
  name?: string;
  values?: any[];
  displayMode?: number;
}

export interface ItemSocket {
  attr?: string;
  group?: number;
  sColour?: string;
}
