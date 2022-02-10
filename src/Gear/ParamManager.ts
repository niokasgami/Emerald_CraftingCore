/* eslint-disable @typescript-eslint/ban-ts-comment */
import {PluginManager, SceneManager} from "rmmz";

interface CoreParameters
{
    openDevTools: boolean;
}

/**
 * the class who handle plugin parameters and parse them.
 */
class ParamManager
{

    private static _parameters: Record<string, unknown> = {};

    protected constructor()
    {
        throw new Error("this is a static class");
    }

    /**
     * init the Gear engine
     * @internal
     */
    public static init()
    {
        const rawParams = this.find();
        const params: CoreParameters = this.register("Gear", rawParams);
        if (params.openDevTools)
        {
            SceneManager.showDevTools();
        }
    }

    /**
     * registers plugins parameters under a namespace and return
     * the parsed value
     * @param {string} namespace - the plugin namespace
     * @param {string} rawParams - the raw param to parse
     * @returns {any} - the parsed parameters
     */
    public static register(namespace: string, rawParams: string): any
    {
        if (this.exists(namespace))
        {
            throw new Error(`the plugin ${namespace} already exist in the context!`);
        }
        this._parameters[namespace] = this.parse(rawParams);
        return this._parameters[namespace];
    }

    /**
     * find the current active plugin and return it's raw parameters
     * @returns {string}
     */
    public static find(): string
    {
        // @ts-ignore
        const currentScript = document.currentScript.src.match(/.+\/(.+)\.js/)[1];
        return PluginManager.parameters(currentScript);
    }

    /**
     * Check if the said  plugin is already registered or not
     * @param {string} namespace - the plugin namespace
     * @returns {boolean}
     */
    public static exists(namespace: string): boolean
    {
        return this._parameters.hasOwnProperty(namespace);
    }

    /**
     * check if the plugin filename is properly named.
     * It's used to avoid name clashing or improper naming who will cause bug
     * @param {string} name - the plugin filename
     */
    public static checkPluginValidity(name: string)
    {
        // @ts-ignore         // method by InVictor
        const currentScript = document.currentScript.src.match(/.+\/(.+)\.js/)[1];
        if (currentScript !== `${name}.js`)
        {
            throw new Error(`Plugin ${currentScript} should be named ${name + ".js"}`);
        }
    }

    /**
     * recursively parse the parameters and return an JSON object
     * @param {string} parameters
     * @returns {Record<string, unknown>}
     */
    public static parse(parameters: string): Record<string, unknown>
    {
        function parseParameters(object)
        {
            try
            {
                return JSON.parse(object, (key, value) =>
                {
                    try
                    {
                        return parseParameters(value)
                    } catch (e)
                    {
                        return value
                    }
                })
            } catch (e)
            {
                return object
            }
        }

        return parseParameters(JSON.stringify(parameters))
    }

}

ParamManager.init();
export {ParamManager}