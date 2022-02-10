import {Point} from "rmmz";

class Utils
{
    private static _mouseCoords = new Point(0, 0);

    protected constructor()
    {
        throw new Error("this is a static class");
    }

    public static getMousePosition(): Point
    {
        return this._mouseCoords;
    }

    public static updateMouseCoords(x: number, y: number)
    {
        this._mouseCoords.x = x;
        this._mouseCoords.y = y;
    }

    public static convertToRGB(r: number, g: number, b: number): string
    {
        return `rgb(${r},${g},${b})`;
    }

    public static convertListToMap(array: { key: string }[]): Record<string, unknown>
    {
        const object = {};
        for (let i = 0; i < array.length; i++)
        {
            if (!array[i].hasOwnProperty("key"))
            {
                throw new Error("your parameter list struct does not contain the property 'key'");
            }
            const key = array[i].key;
            object[key] = array[i];
            delete object[key].key;
        }
        return object;
    }
}

export {Utils}