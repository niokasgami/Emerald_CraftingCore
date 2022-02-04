/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Config, CraftingConditions, CraftingRecipe, CraftingResults, ItemType} from "../core";
import {$dataArmors, $dataItems, $gameParty, RPG} from "rmmz";

type Inventory = RPG.DataItem[] | RPG.DataArmor[] | RPG.DataWeapon[];
type ItemComponent = RPG.DataItem | RPG.DataArmor | RPG.DataWeapon;

/* eslint-disable prefer-rest-params */
/**
 * The game object class who handle crafting processing
 * It can be used as is for basic crafting behaviour. Although, it's
 * preferable if you extend the class via inheritance to create your own crafting behaviours
 */
class Game_Crafting
{

    protected _recipes: CraftingRecipe[];

    constructor()
    {
        this.initialize(...arguments);
    }

    public initialize(...args)
    {
        this.buildRecipesList();
    }

    /**
     * build the recipes list
     * by default the function will use the parameters from the core plugins
     * So when extending, it's good to reassign the this._recipes or to use your own
     * variable
     */
    public buildRecipesList()
    {
        this._recipes = Config.PARAMS.recipes;
    }

    /**
     * return the current party inventory
     * @returns {Inventory}
     */
    public inventory(): Inventory
    {
        return $gameParty.items();
    }

    /**
     * return the specified crafting recipe
     * @param {number} id - the recipe index
     * @returns {CraftingRecipe}
     */
    public recipe(id: number): CraftingRecipe
    {
        return this._recipes[id];
    }

    /**
     * return the specified recipe name
     * @param {number} id - the recipe index
     * @returns {string}
     */
    public name(id: number): string
    {
        return this._recipes[id].header.name;
    }

    /**
     * return the specified recipe icon index
     * @param {number} id - the recipe index
     * @returns {number}
     */
    public icon(id: number): number
    {
        return this._recipes[id].header.iconIndex;
    }

    /**
     * return the specified recipe recipeType
     * @param {number} id - the recipe index
     * @returns {ItemType}
     */
    public recipeType(id: number): ItemType
    {
        return this._recipes[id].header.type;
    }

    /**
     * return the conditions list of a specified recipe
     * @param {number} id - the recipe index
     * @returns {CraftingConditions[]}
     */
    public conditions(id: number): CraftingConditions[]
    {
        return this._recipes[id].conditions
    }

    /**
     * return a specific condition of a recipe
     * @param {number} id - the recipe index
     * @param {number} conditionId - the condition index
     * @returns {CraftingConditions}
     */
    public condition(id: number, conditionId: number): CraftingConditions
    {
        return this._recipes[id].conditions[conditionId];
    }

    /**
     * return a list of result for a recipe
     * @param {number} id - the recipe index
     * @returns {CraftingResults[]}
     */
    public results(id: number): CraftingResults[]
    {
        return this._recipes[id].results;
    }

    /**
     * return a specific result of a recipe
     * @param {number} id - the recipe index
     * @param resultId - the result index
     * @returns {CraftingResults}
     */
    public result(id: number, resultId: number): CraftingResults
    {
        return this._recipes[id].results[resultId];
    }

    /**
     * check wheter a recipe can be crafted.
     * when creating a new child class, if you have custom conditions
     * you can override this function and implement your own.
     * @param {number} id - the recipe index
     * @returns {boolean}
     */
    public canCraft(id: number): boolean
    {
        const {conditions} = this._recipes[id];
        return conditions.every((condition) =>
        {
            return this.inventory().some((item) =>
            {
                return item.id === condition.id && $gameParty.numItems(item) >= condition.amount;
            });
        });
    }

    /**
     * check if the recipe is of type item
     * @param {number} id - the recipe index
     * @returns {boolean}
     */
    public isItem(id: number): boolean
    {
        return this._recipes[id].header.type === ItemType.ITEM;
    }

    /**
     * check if the recipe is of type weapon
     * @param {number} id -  the recipe index
     * @returns {boolean}
     */
    public isWeapon(id: number): boolean
    {
        return this._recipes[id].header.type === ItemType.WEAPON;
    }

    /**
     * check if the recipe is of type armor
     * @param {number} id - recipe index
     * @returns {boolean}
     */
    public isArmor(id: number): boolean
    {
        return this._recipes[id].header.type === ItemType.ARMOR;
    }

    /**
     * the function called when you start the crafting.
     * when extending the class for custom crafting, overriding this function is advised
     * @param {number} id - the recipe index
     */
    public onCraft(id: number): void
    {
        const {conditions} = this._recipes[id];
        for (let i = 0; i < conditions.length; i++)
        {
            const item = this.fetchItemData(this.condition(id, i), conditions[i].id);
            $gameParty.loseItem(item, conditions[i].amount, false);
        }
        this.onResults(id);
    }

    /**
     * the function called when the item is ready to show results
     * when extending this class for custom crafting, overriding this function is advised.
     * @param {number} id - the recipe index
     */
    public onResults(id: number): void
    {
        const {results} = this._recipes[id];
        for (let i = 0; i < results.length; i++)
        {
            const item = this.fetchItemData(this.result(id, i), results[i].id);
            $gameParty.gainItem(item, results[i].amount);
        }
        this.onEndCrafting();
    }

    /**
     * The function called when the crafting is done
     * when extending this class for custom crafting, overriding this function is advised.
     */
    public onEndCrafting(): void
    {
        console.log("crafting done!");
    }

    /**
     *  fetch the item data depending on it defined type
     * @param {CraftingResults | CraftingConditions} item - the item data
     * @param {number} id - the item id
     * @returns {ItemComponent}
     */
    public fetchItemData(item: CraftingResults | CraftingConditions, id: number): ItemComponent
    {
        switch (item.type)
        {
            case ItemType.ITEM:
                return $dataItems[id];
                break;
            case ItemType.ARMOR:
                return $dataArmors[id];
                break;
            case ItemType.WEAPON:
                return $dataArmors[id];
                break;
            default:
                throw new Error("no such item in the database!");
        }
    }

    /**
     * fetch a recipe based on it recipe name
     * @param {string} name - the recipe name
     * @returns {number}
     */
    public findIndexByName(name: string): number
    {
        let index = 0;
        for (let i = 0; i < this._recipes.length; i++)
        {
            if (this._recipes[i].header.name === name)
            {
                index = i;
                break;
            }
        }
        return index;
    }
}

export {Game_Crafting}