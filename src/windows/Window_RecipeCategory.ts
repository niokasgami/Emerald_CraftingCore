import {Rectangle, Window_HorzCommand} from "rmmz";

class Window_RecipeCategory extends Window_HorzCommand<any>
{

    constructor(rect: Rectangle)
    {
        super(rect);
    }

    public initialize(rect: Rectangle)
    {
        super.initialize(rect);
    }

    public maxCols(): number
    {
        return 4;
    }
}