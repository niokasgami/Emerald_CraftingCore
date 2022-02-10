import {Config, CraftingRecipe, ItemType} from "../core";
import {$gameCraft} from "../Globals";


interface recipeBook
{
    learned: boolean;
    id: number;
}

class Game_SystemCrafting
{
    private _recipeBookFlags: boolean[][];
    private _params: CraftingRecipe[];

    constructor()
    {
        // eslint-disable-next-line prefer-rest-params
        this.initialize(...arguments);
    }

    public initialize(...args)
    {
        this._recipeBookFlags = [[], [], []];
        this._params = Config.PARAMS.recipes;
    }

    public addToRecipeBook(type: ItemType, dataId: number)
    {
        if (!this._recipeBookFlags)
        {
            this.clearRecipeBook();
        }
        const typeIndex = this.recipeBookTypeToIndex(type);
        if (typeIndex >= 0)
        {
            this._recipeBookFlags[typeIndex][dataId] = true;
        }
    }

    public removeFromRecipeBook(type: ItemType, dataId: number)
    {
        if (this._recipeBookFlags)
        {
            const typeIndex = this.recipeBookTypeToIndex(type);
            if (typeIndex >= 0)
            {
                this._recipeBookFlags[typeIndex][dataId] = false;
            }
        }
    }

    public clearRecipeBook()
    {
        this._recipeBookFlags = [[], [], []];
    }

    public recipeBookTypeToIndex(type: ItemType): number
    {
        switch (type)
        {
            case ItemType.ITEM:
                return 0;
            case ItemType.WEAPON:
                return 1;
            case ItemType.ARMOR:
                return 2;
            default:
                return -1;
        }
    }

    public isInRecipeBook(recipe: number): boolean
    {
        if (this._recipeBookFlags && recipe)
        {
            let typeIndex = -1;
            if ($gameCraft.isItem(recipe))
            {
                typeIndex = 0;
            }
            if (typeIndex >= 0)
            {
                return !!this._recipeBookFlags[typeIndex][recipe];
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
}