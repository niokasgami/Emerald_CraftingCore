import {CraftingRecipe} from "./CraftingRecipe";

/**
 * the filtered recipe book map
 */
export interface RecipeBookData
{
    items: CraftingRecipe[];
    weapons: CraftingRecipe[];
    armors: CraftingRecipe[];
}