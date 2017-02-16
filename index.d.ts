/// <reference types="node" />

import * as dgram from "dgram";

export interface Multi {
    keyvalue(key: string, value: any, flag?: string): Multi;
    gauge(key: string, value: any, flag?: string): Multi;
    timer(key: string, value: any, flag?: string): Multi;
    counter(key: string, value: any, flag?: string): Multi;
    set(key: string, value: any, flag?: string): Multi;

    send(data: string): void;
}

export function keyvalue(key: string, value: any, flag?: string): void;
export function gauge(key: string, value: any, flag?: string): void;
export function timer(key: string, value: any, flag?: string): void;
export function counter(key: string, value: any, flag?: string): void;
export function set(key: string, value: any, flag?: string): void;

export function send(data: string): void;
export function multi(prefix?: string): Multi;
