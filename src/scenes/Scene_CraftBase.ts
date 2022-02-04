import {Scene_MenuBase} from "rmmz";
import {Game_Crafting} from "../objects";


abstract class Scene_CraftBase extends Scene_MenuBase
{

    protected _crafting: Game_Crafting;

    protected constructor()
    {
        super();
    }

    public override initialize()
    {
        super.initialize();
        this._crafting = new Game_Crafting();

    }

    public override create()
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
}

export {Scene_CraftBase}