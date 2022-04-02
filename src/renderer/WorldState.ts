import Edge from "./entities/Edge";
import Node from "./entities/Node";
import IClickable from "./interfaces/IClickable";
import IDraggable from "./interfaces/IDraggable";
import IEntity from "./interfaces/IEntity";
import IHoverable from "./interfaces/IHoverable";
import Vector2D from "./util/Vector2D";
import World from "./World";

export default class WorldState {
	private static _instance: WorldState;

	// State variables
	public dragging: boolean = false;
	public edgeBeingCreated: Edge | null = null;
	public nodeCreatingEdge: Node | null = null;

	private selected: IClickable[] = [];
	private previousStates: IEntity[][] = [];
	
	public currentlySelected: IClickable | null = null;
	public currentlyDragging: IDraggable | null = null;
	public currentlyHovering: IHoverable | null = null;

	public mousePosition = new Vector2D(0, 0);

	private constructor() {}

	public static get instance(): WorldState {
		if (!WorldState._instance)
			WorldState._instance = new WorldState();
		
		return WorldState._instance;
	}

	public clearSelected() {
		this.selected.forEach(clickable => clickable.selected = false);
		this.selected = [];
	}

	public removeFromSelected(clickable: IClickable) {
		this.selected = this.selected.filter(_clickable => _clickable.id !== clickable.id);
		this.currentlySelected = null;
	}

	public addToSelected(clickable: IClickable) {
		this.selected.push(clickable);
		this.currentlySelected = clickable;
	}

	public selectAllClickables(world: World) {
		this.selected = world.clickables;
		this.selected.forEach(clickable => clickable.selected = true);
	}

	public removeAllClickables(world: World) {
		this.selected.forEach(clickable => world.removeEntity(clickable));
		this.selected = [];
	}

	public get amountSelected(): number {
		return this.selected.length;
	}

	public saveState(world: World) {
		this.previousStates.push([...world.entities.map(entity => entity.copy())]);
	}

	public restoreState(world: World) {
		let previousState = this.previousStates.pop();
		if (previousState) {
			world.entities = [...previousState.map(entity => entity.copy())];
			this.selected = world.clickables.filter(clickable => clickable.selected);
		}
	}
}