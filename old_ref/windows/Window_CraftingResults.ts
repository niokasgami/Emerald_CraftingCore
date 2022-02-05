import {$dataArmors, $dataItems, $dataWeapons, Rectangle, RPG, Window_Base} from "rmmz";
import {CraftingResults, ItemType} from "../core/interfaces";
import DataItem = RPG.DataItem;


interface CraftingResultData
{
    name: string;
    iconIndex: number;
    amount: number
}

class Window_CraftingResults extends Window_Base
{

    protected _text: string;
    protected _data: CraftingResultData[];

    constructor(rect: Rectangle)
    {
        super(rect);
    }

    public override initialize(rect: Rectangle)
    {
        super.initialize(rect);
        this._text = "";
        this._data = [];
    }

    public setData(data: CraftingResults[])
    {
        for (let i = 0; i < data.length; i++)
        {
            const results: DataItem = this.fetchItem(data[i].id, data[i].type);
            this._data.push({
                name: results.name,
                iconIndex: results.iconIndex,
                amount: data[i].amount
            });
        }
    }

    /**
     * convert the results into an item.
     * @note in the TS file for some reason the function wouldn't return properly
     * @param {number} id
     * @param {ItemType} type
     * @returns {any}
     * @private
     */
    private fetchItem(id: number, type: ItemType): any
    {
        switch (type)
        {
            case ItemType.WEAPON:
                return $dataWeapons[id];
            case ItemType.ITEM:
                return $dataItems[id];
            case ItemType.ARMOR:
                return $dataArmors[id];
            default:
                return $dataItems[id];
        }
    }

}