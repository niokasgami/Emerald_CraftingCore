import {PluginParameters} from "../interfaces";

class Config
{
    public static readonly pluginName = "gear-craftingCore-sample1";
    public static PARAMS: PluginParameters;

    public static init(): void
    {
        const rawParams = Gem.ParamManager.find();
        this.PARAMS = Gem.ParamManager.register(this.pluginName, rawParams);
    }
}

export {Config}