import {Rectangle, RPG, Window_Selectable} from "rmmz";
import {Game_Crafting} from "../objects";
import {CraftingRecipe} from "../core/interfaces";
import DataItem = RPG.DataItem;
import DataArmor = RPG.DataArmor;
import DataWeapon = RPG.DataWeapon;

type itemComponent = DataItem | DataArmor | DataWeapon;

enum CategoryType
{
    ALL,
    ITEM,
    ARMOR,
    WEAPON
    // todo: later maybe include skills and classes?
}

// TODO : make sure that it work with recipeList and not data since we filthering here.
/**
 * The window for selecting an crafting recipe on the recipes screen.
 */
class Window_CraftingList extends Window_Selectable
{

    protected _data: Game_Crafting;
    protected _recipeList: CraftingRecipe[];
    protected _category: CategoryType;

    /**
     * the window for selecting an crafting recipe on the recipes screen.
     * @param {Rectangle} rect - the window dimension
     */
    constructor(rect: Rectangle)
    {
        super(rect);
    }

    public override initialize(rect: Rectangle)
    {
        super.initialize(rect);
        this._data = null;
        this._recipeList = [];
        this._category = CategoryType.ALL;
    }

    public override maxCols(): number
    {
        return 1;
    }

    public override maxItems(): number
    {
        return this._recipeList.length;
    }

    public setupData(data: Game_Crafting)
    {
        this._data = data;
    }

    /**
     * return the current active recipe
     * @returns {CraftingRecipe}
     */
    public recipe(): CraftingRecipe
    {
        return this.recipeAt(this.index());
    }

    public recipeAt(index: number): CraftingRecipe
    {
        return this._recipeList && index >= 0 ? this._recipeList[index] : null;
    }

    public setCategory(category: CategoryType)
    {
        this._category = category;
    }

    public override isCurrentItemEnabled(): boolean
    {
        const recipe1 = this.recipe();
        const index = this._data.findIndexByName(recipe1.header.name);
        return this._data.canCraft(index);
    }


    public includes(recipe: CraftingRecipe): boolean
    {
        switch (this._category)
        {
            case CategoryType.ITEM:
                return this._data.isItem(recipe);
            case CategoryType.WEAPON:
                return this._data.isWeapon(recipe);
            case CategoryType.ARMOR:
                return this._data.isArmor(recipe);
            default:
                return false;
        }
    }

    public makeRecipeList()
    {
        if (this._category === CategoryType.ALL)
        {
            this._recipeList = this._data.recipes();
        }
        this._recipeList = this._data.recipes().filter(recipe =>
        {
            this.includes(recipe);
        })
    }

    public override drawItem(index: number)
    {
        super.drawItem(index);
        const recipe = this.recipeAt(index);
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isCurrentItemEnabled());
        this.drawItemName(recipe.header, rect.x, rect.y, rect.width);
        this.changePaintOpacity(true);
    }

    public override updateHelp()
    {
        this.setHelpWindowItem(this.recipe().header);
    }

    public override refresh()
    {
        this.makeRecipeList();
        super.refresh();
    }

    /**
     * created due to possible change in array size between Game_Crafting and the current
     * recipes list.
     * @returns {number}
     */
    public trueRecipeIndex(): number
    {
        const name = this._recipeList[this.index()].header.name;
        return this._data.findIndexByName(name);
    }
}

export {Window_CraftingList}