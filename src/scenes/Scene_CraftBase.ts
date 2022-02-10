import {Scene_MenuBase} from "rmmz";
import {Game_Crafting} from "../objects";


abstract class Scene_CraftBase extends Scene_MenuBase
{

    protected _crafting: Game_Crafting;
    protected abstract _id: number;

    protected constructor()
    {
        super();
    }

    public initialize()
    {
        super.initialize();
        this._crafting = new Game_Crafting();
    }

    public create()
    {
        super.create();
    }

    /**
     * the method that start the crafting
     */
    public abstract craft(): void;

    /**
     * the method that is called while the results.
     */
    public abstract result(): void;

    /**
     * the current active recipe id
     * @returns {number}
     */
    public abstract id(): number;
}

export {Scene_CraftBase}