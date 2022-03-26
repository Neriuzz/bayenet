import Edge from "./entities/Edge";
import Node from "./entities/Node";
import IClickable from "./interfaces/IClickable";
import IDraggable from "./interfaces/IDraggable";
import IHoverable from "./interfaces/IHoverable";

export default class WorldState {
	private static _instance: WorldState;

	// State variables
	public dragging: boolean = false;
	public edgeBeingCreated: Edge | null = null;
	public nodeCreatingEdge: Node | null = null;

	public clickables: IClickable[] = [];
	
	public clickable: IClickable | null = null;
	public draggable: IDraggable | null = null;
	public hoverable: IHoverable | null = null;

	private constructor() {}

	public static get instance() {
		if (!WorldState._instance)
			WorldState._instance = new WorldState();
		
		return WorldState._instance;
	}
}