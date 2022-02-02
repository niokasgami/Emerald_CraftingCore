

// an sample class who use the basic crafting system
import {Scene_CraftBase} from "./Scene_CraftBase";
import {Graphics, Rectangle, SoundManager, Window_Help} from "rmmz";
import {Window_CraftCommand, Window_CraftingList} from "../windows";

class Scene_SampleCraft extends Scene_CraftBase {

    protected _recipeListWindow: Window_CraftingList;
    protected _confirmWindow: Window_CraftCommand;

    constructor() {
        super();
    }

    public override create() {
        super.create();
        this.createAllWindows();
    }

    public createAllWindows(){
        this.createHelpWindow();
        this.createRecipeListWindow();
        this.createConfirmWindow();
    }

    public createHelpWindow(){
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    }

    public createRecipeListWindow(){
        const rect = this.recipeListWindowRect();
        this._recipeListWindow = new Window_CraftingList(rect);
        this._recipeListWindow.setHelpWindow(this._helpWindow);
    }

    public recipeListWindowRect(): Rectangle{
        return  new Rectangle(1,1,1,1);
    }

    public createConfirmWindow(){
        const rect = this.confirmWindowRect();
        this._confirmWindow = new Window_CraftCommand(rect);
        this._confirmWindow.setHandler("craft",this.commandOnCraftConfirm.bind(this));
        this.addWindow(this._confirmWindow);
    }

    public confirmWindowRect(): Rectangle {
        const x = Graphics.width / 2;
        const y = Graphics.height / 2;
        return new Rectangle(x,y,100,100); // TODO : check if it's accurate?

    }

    public commandOnCraftConfirm(){
        this._confirmWindow.close
        this._recipeListWindow.refresh();
        this.craft();
    }
    /**
     * return the recipeID
     * @returns {number}
     */
    public id(): number {
        return this._recipeListWindow.trueRecipeIndex();
    }


    public craft(): void {
        SoundManager.playShop(); // TEMP;
        this.crafting.onCraft(this.id());
        this.result();
    }

    public result(): void {
    }
}