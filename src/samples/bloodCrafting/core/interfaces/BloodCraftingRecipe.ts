import {ItemType} from "../../../../core";
import {BloodCraftingType} from "./BloodCraftingType";

export interface BloodCraftingRecipe
{
    header: {
        name: string;
        icondIndex: number;
        description: string;
        type: ItemType;
    }
    conditions: CraftingConditions[];
    results: CraftingResults[];
}

export interface CraftingConditions
{
    type: BloodCraftingType;
    cost: number;
}


export interface CraftingResults
{
    id: number;
    type: ItemType;
    amount: number;
}