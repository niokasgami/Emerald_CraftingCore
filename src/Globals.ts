import {Game_Crafting} from "./objects";
import {DataManager} from "rmmz";

/**
 * the global variable for accessing the Game_Crafting instance
 * @type {Game_Crafting}
 */
export let $gameCraft: Game_Crafting = null;


const aliasCraft = DataManager.createGameObjects;
DataManager.createGameObjects = function ()
{
    aliasCraft.call(this);
    $gameCraft = new Game_Crafting();
};