import {ItemType} from "./ItemType";

export interface CraftingRecipe {
    header: {
        name: string;
        iconIndex: number;
        description : string;
        type: ItemType;
    }
    conditions: CraftingConditions[];
    results: CraftingResults[];
}

export interface CraftingConditions {
    id: number;
    type: ItemType;
    amount: number;
}

export interface CraftingResults {
    id: number;
    type: ItemType;
    amount: number;
}

