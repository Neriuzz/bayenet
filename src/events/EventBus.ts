import { EventEmitter } from "events";

export default class EventBus {

	private static _instance: EventBus;

	private eventEmitter: EventEmitter = new EventEmitter();

	private constructor() {}

	public static get instance(): EventBus {
		if (!EventBus._instance)
			EventBus._instance = new EventBus();

		return EventBus._instance;
	}

	public on(event: string | symbol, callback: (...args: any[]) => void) {
		this.eventEmitter.on(event, callback);
	}

	public emit(event: string | symbol, ...args: any[]) {
		this.eventEmitter.emit(event, ...args);
	}

	public stopListening(event: string | symbol, callback: (...args: any[]) => void) {
		this.eventEmitter.removeListener(event, callback);
	}

};