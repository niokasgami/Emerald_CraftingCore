import {Game_Crafting} from "./Game_Crafting";
import {$gameParty, Game_Actor} from "rmmz";

class Game_BloodCrafting extends Game_Crafting
{

    private _actorId: number;

    constructor()
    {
        super();
    }

    public override initialize(...args)
    {
        super.initialize(...args);
    }

    public actors(): Game_Actor[]
    {
        return $gameParty.allMembers();
    }

    public actor(id: number): Game_Actor
    {
        return $gameParty.allMembers()[id];
    }

    // TEMP : normally it would be structured inside of your pluginParameters and fetch through the this._recipe
    public override onCraft(id: number)
    {
        const sacrifices = [
            {
                cost: 100, // 100 hp will be debited
                type: "HP"
            },
            {
                cost: 10, // 10 mp will be debited
                type: "MP"
            }
        ];
        for (let i = 0; i < sacrifices.length; i++)
        {
            const actor = this.actor(this._actorId);
            if (sacrifices[i].type === "HP")
            {
                actor.gainHp(-sacrifices[i].cost);
            }
            if (sacrifices[i].type === "MP")
            {
                actor.gainMp(-sacrifices[i].cost);
            }
        }
    }

    // on results doesnt change since u get items
}