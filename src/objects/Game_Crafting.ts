/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Config, CraftingConditions, CraftingRecipe, CraftingResults, ItemType, RecipeBookData} from "../core";
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
    /**
     * all the recipes in the games
     * it doesn't split the recipes in their respective categories
     * @type {CraftingRecipe[]}
     * @protected
     */
    protected _recipes: CraftingRecipe[];

    /**
     * the variable that split and separate all the recipe by type
     * It's used for map the recipes in different category.
     * @type {RecipeBookData}
     * @protected
     */
    protected readonly _recipeBookData: RecipeBookData = {
        items: [],
        weapons: [],
        armors: []
    }

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

        for (const recipe of this._recipes)
        {
            const {type} = recipe.header;
            switch (type)
            {
                case ItemType.ITEM:
                    this._recipeBookData.items.push(recipe);
                    break;
                case ItemType.WEAPON:
                    this._recipeBookData.weapons.push(recipe);
                    break;
                case ItemType.ARMOR:
                    this._recipeBookData.armors.push(recipe);
            }
        }
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
     * return the whole unfiltered list
     * @returns {CraftingRecipe[]}
     */
    public recipes(): CraftingRecipe[]
    {
        return this._recipes;
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
     * return a filtered list recipe 'book' object
     * @returns {RecipeBookData}
     */
    public recipeBook(): RecipeBookData
    {
        return this._recipeBookData;
    }

    /**
     * return a specific category of the recipe book
     * @param {ItemType} type
     * @returns {CraftingRecipe[]}
     */
    public recipeBookByIndex(type: ItemType): CraftingRecipe[]
    {
        switch (type)
        {
            case ItemType.ITEM:
                return this._recipeBookData.items;
            case ItemType.WEAPON:
                return this._recipeBookData.weapons;
            case ItemType.ARMOR:
                return this._recipeBookData.armors;
        }
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
     * check whether a recipe can be crafted.
     * when creating a new child class, if you have custom conditions
     * you can override this function and implement your own.
     * @param {number} id - the recipe index
     * @returns {boolean}
     */
    public canCraft(id: number, ...args): boolean
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
    public onCraft(id: number, ...args): void
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
    public onResults(id: number, ...args): void
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
    public onEndCrafting(...args): void
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
            case ItemType.ARMOR:
                return $dataArmors[id];
            case ItemType.WEAPON:
                return $dataArmors[id];
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