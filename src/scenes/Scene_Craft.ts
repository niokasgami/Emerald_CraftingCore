import {Scene_CraftBase} from "./Scene_CraftBase";
import {Graphics, Rectangle, Window_HorzCommand} from "rmmz";


class Scene_Craft extends Scene_CraftBase
{

    protected _id: number;
    protected _categoryWindow: Window_HorzCommand<any>

    constructor()
    {
        super();
    }

    public initialize()
    {
        super.initialize();
        this._id = 0;
    }

    public create()
    {
        super.create();
    }

    protected createAllWindows()
    {
        this.createCategoryWindow();
    }

    protected createCategoryWindow()
    {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_HorzCommand<any>(rect);
    }

    protected categoryWindowRect(): Rectangle
    {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    }

    public craft(): void
    {
    }

    public id(): number
    {
        return this._id;
    }

    public result(): void
    {
    }

}