declare namespace Gem
{

    export class ParamManager
    {
        public static register(namespace: string, rawParams: string): any;

        public static find(): string;

        public static exists(namespace: string): boolean;

        public static checkPluginValidity(name: string): void;
    }

    export class Utils
    {
        private constructor();

        // public static getMousePosition(): Point;

        public static updateMousePose(x: number, y: number): void;

        public static convertToRGB(r: number, g: number, b: number): string;

        public static convertListToMap<T>(array: any[]): T;

        // public static loadCustom(dir: string, filename: string): Bitmap;
    }
}
