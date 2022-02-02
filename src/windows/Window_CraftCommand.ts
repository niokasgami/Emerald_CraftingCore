import {Rectangle, TextManager, Window_Command} from "rmmz";


/**
 * The window for confirming crafting or cancel.
 */
class Window_CraftCommand extends Window_Command<any>{

    /**
     * the window for confirming crafting or cancel
     * @param {Rectangle} rect - the window dimensions
     */
    constructor(rect: Rectangle) {
        super(rect);
    }

    public override initialize(rect: Rectangle) {
        super.initialize(rect);
        this.openness = 0;
    }

    public override makeCommandList() {
        this.addCommand("Craft","craft");
        this.addCommand("Cancel","cancel");
    }
}

export {Window_CraftCommand}

