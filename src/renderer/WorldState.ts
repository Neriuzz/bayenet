import Edge from "./entities/Edge";
import Node from "./entities/Node";
import IClickable from "./interfaces/IClickable";
import IDraggable from "./interfaces/IDraggable";
import IHoverable from "./interfaces/IHoverable";
import World from "./World";

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

	public clearClickables() {
		this.clickables.forEach(clickable => clickable.selected = false);
		this.clickables = [];
	}

	public removeClickable(clickable: IClickable) {
		this.clickables = this.clickables.filter(_clickable => _clickable.id !== clickable.id);
		this.clickable = null;
	}

	public addClickable(clickable: IClickable) {
		this.clickables.push(clickable);
		this.clickable = clickable;
	}

	public selectAllClickables(world: World) {
		world.clickables.forEach(clickable => clickable.selected = true);
		this.clickables = world.clickables;
	}

	public removeAllClickables(world: World) {
		this.clickables.forEach(clickable => world.removeEntity(clickable));
		this.clickables = [];
	}
}