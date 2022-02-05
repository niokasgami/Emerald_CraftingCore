import {Game_Crafting} from "../../objects";
import {BloodCraftingRecipe, BloodCraftingType, Config} from "./core";
import {$gameParty, Game_Actor} from "rmmz";


/**
 * A internal sample project to show how to implement your own custom crafting behavior using
 * the crafting core
 */
class Game_BloodCrafting extends Game_Crafting
{
    protected _bloodRecipes: BloodCraftingRecipe[];

    constructor()
    {
        super();
    }

    public initialize(...args)
    {
        super.initialize(...args);
    }

    public buildRecipesList()
    {
        this._bloodRecipes = Config.PARAMS.recipes;
    }

    public actors(): Game_Actor[]
    {
        return $gameParty.allMembers();
    }

    public actor(id: number): Game_Actor
    {
        return $gameParty.allMembers()[id];
    }

    /**
     * check whether the actor stat is high enough for the recipe cost
     * @param {number} id
     * @param {number} actorIndex
     * @returns {boolean}
     */
    public canCraft(id: number, actorIndex: number): boolean
    {
        const {conditions} = this._bloodRecipes[id];
        return conditions.every((condition) =>
        {
            const stat = this.fetchStatData(condition.type, actorIndex);
            return stat > condition.cost;
        });
    }

    public fetchStatData(type: BloodCraftingType, id: number): number
    {
        switch (type)
        {
            case BloodCraftingType.HP:
                return this.actor(id).hp;
            case BloodCraftingType.MP:
                return this.actor(id).mp;
            default:
                return 10;
        }
    }

    public onCraft(id: number, actorId)
    {
        const {conditions} = this._bloodRecipes[id];
        for (let i = 0; i < conditions.length; i++)
        {
            const actor = this.actor(actorId);
            const cost = conditions[i].cost;

            switch (conditions[i].type)
            {
                case BloodCraftingType.HP:
                    actor.gainHp(-cost);
                    break;
                case BloodCraftingType.MP:
                    actor.gainMp(-cost);
                    break;
            }
        }
        // on result doesnt change so no need to overrride it
        this.onResults(id);
    }

}