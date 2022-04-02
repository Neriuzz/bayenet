import Edge from "./entities/Edge";
import IClickable from "./interfaces/IClickable";
import IDraggable from "./interfaces/IDraggable";
import IHoverable from "./interfaces/IHoverable";
import Vector2D from "./util/Vector2D";
import World from "./World";

export default class WorldState {
	private static _instance: WorldState;

	private world: World | null = null;

	// State variables
	public dragging: boolean = false;
	public edgeBeingCreated: Edge | null = null;

	public mousePosition = new Vector2D(0, 0);

	private constructor() {}

	public static get instance(): WorldState {
		if (!WorldState._instance)
			WorldState._instance = new WorldState();
		
		return WorldState._instance;
	}

	public registerWorld(world: World) {
		this.world = world;
	}

	public clearSelected(omit?: number) {
		this.world!.clickables.forEach(clickable => {
			if (omit !== clickable.id)
				clickable.selected = false;
		});
	}

	public selectAllClickables() {
		this.world!.clickables.forEach(clickable => clickable.selected = true);
	}

	public removeAllClickables() {
		this.world!.clickables.forEach(clickable => this.world!.removeEntity(clickable));
	}

	public get amountSelected() {
		return this.world!.clickables.filter(clickable => clickable.selected).length;
	}

	public get currentlySelected(): IClickable | undefined {
		return this.world!.clickables.find(clickable => clickable.selected);
	}

	public get currentlyDragging(): IDraggable | undefined {
		return this.world!.draggables.find(draggable => draggable.dragging);
	}

	public get currentlyHovering(): IHoverable | undefined {
		return this.world!.hoverables.find(hoverable => hoverable.hovering);
	}
}