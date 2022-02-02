import {$dataArmors, $dataItems, $gameParty, RPG} from "rmmz";
import {CraftingConditions, CraftingRecipe, CraftingResults, ItemType} from "../core/interfaces";
import {Config} from "../core/common";

type Inventory = RPG.DataItem[] | RPG.DataArmor[] | RPG.DataWeapon[];
type ItemComponent = RPG.DataItem | RPG.DataArmor | RPG.DataWeapon;

/**
 * the object class handling crafting.
 * It can be use as is for basic crafting options
 * It's better to use it as an parent class for more advanced crafting.
 */
class Game_Crafting {

    protected _recipes: CraftingRecipe[];

    constructor() {
        this.initialize(...arguments);
    }

    public initialize(...args) {
        this.buildRecipesList();
    }

    /**
     * build the recipes list.
     * by default it use the parameters from the core plugins
     * to build it's recipes.
     * so when extending it's good to reassign the this._recipes
     * when doing custom structure.
     */
    public buildRecipesList() {
        this._recipes = Config.PARAMS.recipes;
    }

    /**
     * return the current party inventory
     * @returns {RPG.DataItem[]}
     */
    public inventory(): Inventory {
        return $gameParty.items();
    }

    /**
     * return the crafting recipe list
     * @returns {CraftingRecipe[]}
     */
    public recipes(): CraftingRecipe[] {
        return this._recipes;
    }

    /**
     * return an crafting recipe
     * @param {number} id - the recipe index
     * @returns {CraftingRecipe}
     */
    public recipe(id: number): CraftingRecipe {
        return this._recipes[id];
    }

    /**
     * the recipe name
     * @param {number} id - the recipe id
     * @returns {string}
     */
    public name(id: number): string {
        return this._recipes[id].header.name;
    }

    /**
     * the recipe icon
     * @param {number} id - the recipe id
     * @returns {number}
     */
    public icon(id: number): number {
        return  this._recipes[id].header.iconIndex;
    }

    /**
     * return the conditions list of an recipe
     * @param {number} id - the recipe index
     * @returns {CraftingConditions[]}
     */
    public conditions(id: number): CraftingConditions[] {
        return this._recipes[id].conditions;
    }

    /**
     * return the condition of an recipe
     * @param id - the recipe index
     * @param index - the condition index
     * @returns {CraftingConditions}
     */
    public condition(id, index): CraftingConditions {
        return this._recipes[id].conditions[index];
    }

    /**
     * return an recipe crafting results list
     * @param {number} id - the recipe index
     * @returns {CraftingResults[]}
     */
    public results(id: number): CraftingResults[] {
        return this._recipes[id].results;
    }

    /**
     * return the result of an recipe
     * @param {number} id - the recipe index
     * @param {number} index - the result index
     * @returns {CraftingResults}
     */
    public result(id: number, index: number): CraftingResults {
        return this._recipes[id].results[index];
    }

    /**
     * return if an specific recipes can be crafted
     * When creating new child class if you have custom crafting system you can use this
     * function to do so.
     * @param {number} id - the recipe id
     * @returns {boolean}
     */
    public canCraft(id: number): boolean {
        const {conditions} = this._recipes[id];

        return conditions.every((condition) => {
            return this.inventory().some((item) => {
                return item.id === condition.id && $gameParty.numItems(item) >= condition.amount;
            });
        });
    }

    /**
     * return true if the recipes is of type item
     * @param {CraftingRecipe} recipe - the recipe to analyse
     * @returns {boolean}
     */
    public isItem(recipe: CraftingRecipe): boolean {
        return recipe.header.type === ItemType.ITEM;
    }

    /**
     * return true if the recipes is of type weapon
     * @param {CraftingRecipe} recipe - the recipe to analyse
     * @returns {boolean}
     */
    public isWeapon(recipe: CraftingRecipe): boolean {
        return recipe.header.type === ItemType.WEAPON;
    }

    /**
     * return true if the recipes is of type armor
     * @param {CraftingRecipe} recipe - the recipe to analyse
     * @returns {boolean}
     */
    public isArmor(recipe: CraftingRecipe): boolean {
        return recipe.header.type === ItemType.ARMOR;
    }

    /**
     * function who craft the item.
     * When extending the class for custom crafting, overriding this function is advised
     * @param {number} id - the recipe id
     */
    public onCraft(id: number) {
        const recipe = this._recipes[id].conditions;
        for (let i = 0; i < recipe.length; i++) {
            const item = this.fetchItemData(this.condition(id, i), recipe[i].id);
            $gameParty.loseItem(item, recipe[i].amount, false);
        }
        this.onResults(id);
    }

    /**
     * function called when the item is done to be crafted.
     * when extending the class for custom crafting overriding this class is advised
     * @param {number} id - the recipe id
     */
    public onResults(id: number) {
        const {results} = this._recipes[id];
        for (let i = 0; i < results.length; i++) {
            const item = this.fetchItemData(this.result(id, i), results[i].id);
            $gameParty.gainItem(item, results[i].amount);
        }
    }

    /**
     * return the item data.
     * @param {CraftingResults | CraftingConditions} item - the item to parse
     * @param {number} id - the item id
     * @returns {RPG.DataArmor | RPG.DataItem | RPG.DataWeapon}
     */
    public fetchItemData(item: CraftingResults | CraftingConditions, id: number): ItemComponent {
        switch (item.type) {
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
     * help find the recipes via name when an recipes list has been changed
     * @param {string} name
     * @returns {number}
     */
    public findIndexByName(name: string): number {
        for(let i =0; i < this._recipes.length; i++){
            if(this._recipes[i].header.name === name){
                return i;
            }
        }
    }
}

export {Game_Crafting}
