/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from "events";

export enum CameraEvent {
    RESET_ZOOM = "RESET_ZOOM",
    INVERT_SCROLL = "INVERT_SCROLL"
}

export enum NetworkEvent {
    ADD_EVIDENCE = "ADD_EVIDENCE",
    CLEAR_EVIDENCE = "CLEAR_EVIDENCE",
    EVIDENCE_CLEARED = "EVIDENCE_CLEARED",
    INFER_ALL = "INFER_ALL",
    LOAD_NETWORK = "LOAD_NETWORK",
    SAVE_NETWORK = "SAVE_NETWORK",
    NETWORK_LOADED = "NETWORK_LOADED",
    NODE_CREATED = "NODE_CREATED",
    EDGE_CREATED = "EDGE_CREATED",
    NODE_DELETED = "NODE_DELETED",
    EDGE_DELTED = "EDGE_DELETED"
}

export enum UserEvent {
    TOGGLE_NODE_INFORMATION = "TOGGLE_NODE_INFORMATION"
}
export default class EventBus {
    private static _instance: EventBus;

    private eventEmitter: EventEmitter = new EventEmitter();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static get instance(): EventBus {
        if (!EventBus._instance) EventBus._instance = new EventBus();

        return EventBus._instance;
    }

    public on(event: string | number, callback: (...args: any[]) => void) {
        this.eventEmitter.on(event, callback);
    }

    public emit(event: string | number, ...args: any[]) {
        this.eventEmitter.emit(event, ...args);
    }

    public stopListening(event: string | number, callback: (...args: any[]) => void) {
        this.eventEmitter.removeListener(event, callback);
    }
}
