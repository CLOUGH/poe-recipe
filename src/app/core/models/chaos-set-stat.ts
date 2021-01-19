import { ChaosItem } from './chaos-set';
export interface ChaosSetStat {
    bodyArmour:SetStat;
    amulet:SetStat;
    helmet: SetStat;
    boot: SetStat;
    belt: SetStat;
    gloves: SetStat;
    ring: SetStat;
    weapon: SetStat;
}

export interface SetStat {
    count: number;
    items: ChaosItem [];
}