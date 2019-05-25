import { NightenvExecuteFn } from "nightenv";
interface Display {
    day: string;
    night: string;
}
interface NightenvOsxConfiguration {
    displays: Display[];
}
export declare const execute: NightenvExecuteFn<NightenvOsxConfiguration>;
export {};
