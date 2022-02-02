import {Scene_MenuBase} from "rmmz";
import {Game_Crafting} from "../objects";

/**
 * the super class who handle all the the crafting scenes.
 */
abstract class Scene_CraftBase extends Scene_MenuBase{

    protected crafting :Game_Crafting;

    /**
     * the super class of all the crafting scenes.
     * @protected
     */
    protected constructor() {
        super();
    }

    public override initialize() {
        super.initialize();
        this.crafting = new Game_Crafting();
    }

    public override create() {
        super.create();
    }

    abstract id(): number;

    /**
     * the method to call while crafting
     */
    abstract craft(): void;
    abstract result(): void;

}
export {Scene_CraftBase}