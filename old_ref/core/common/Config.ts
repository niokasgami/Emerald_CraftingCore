import {Gem} from "../../../libs/Gemstone";
import {PluginParameters} from "../interfaces";

class Config
{
    public static readonly pluginName = "emerald-craftingCore";
    public static PARAMS: PluginParameters;

    public static init()
    {
        const rawParams = Gem.ParamManager.find();
        this.PARAMS = Gem.ParamManager.register(this.pluginName, rawParams);
    }
}

export {Config}