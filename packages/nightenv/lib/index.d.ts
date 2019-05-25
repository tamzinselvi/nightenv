export interface NightenvOptions {
    isNight: boolean;
}
export declare type NightenvExecuteFn<NightenvConfiguration = Object> = (configuration: NightenvConfiguration, options: NightenvOptions) => Promise<NightenvConfiguration>;
export interface NightenvModule<NightenvConfiguration = Object> {
    execute: NightenvExecuteFn<NightenvConfiguration>;
}
export declare enum CronJobStatus {
    PreInstalled = 0,
    Installed = 1
}
export declare const crontabTemplate: (nodeBin: string, updateBin: string) => string;
export declare const configurationTemplate: (daytime?: number, nighttime?: number) => string;
export declare function installCronJob(): Promise<CronJobStatus>;
export * from "./util";
