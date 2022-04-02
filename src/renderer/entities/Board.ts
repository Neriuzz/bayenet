import ClickGesture from "../gestures/ClickGesture";
import DragGesture from "../gestures/DragGesture";
import KeyGesture from "../gestures/KeyGesture";
import Vector2D from "../util/Vector2D";
import World from "../World";
import WorldState from "../WorldState";

export default class Board {
	public dragging = false;

	private initialPosition = new Vector2D(0, 0);
	private currentPosition = new Vector2D(0, 0);
	private dragStartPosition: Vector2D | null = null;

	private state = WorldState.instance;

	constructor (private world: World) {}

	public onClick() {
		if (this.state.edgeBeingCreated) {
			this.world.removeEntity(this.state.edgeBeingCreated);
			this.state.edgeBeingCreated = null;
		}
		this.state.clearSelected();
	}
	
	public onDoubleClick(clickGesture: ClickGesture) {
		this.world.createNode(clickGesture.position);
	}

	public onDragStart(dragGesture: DragGesture) {
		this.dragging = true;
		this.dragStartPosition = dragGesture.position;
		this.initialPosition = new Vector2D(this.currentPosition.x, this.currentPosition.y);
	}

	public onDrag(dragGesture: DragGesture) {
		let deltaPosition = new Vector2D(dragGesture.position.x - this.dragStartPosition!.x, dragGesture.position.y - this.dragStartPosition!.y);
		this.currentPosition = new Vector2D(this.initialPosition!.x + deltaPosition.x, this.initialPosition!.y + deltaPosition.y);
		this.world.camera.position = this.currentPosition;
	}

	public onDragEnd() {
		this.dragging = false;
		this.dragStartPosition = null;
	}

	// public onMouseWheel(event: WheelEvent) {
	// 	console.log(event);
	// 	this.world.camera.context.scale(2, 2);
	// }

	public onKeyDown(keyGesture: KeyGesture) {
		if (keyGesture.key == "Delete" && this.state.amountSelected > 0) {
			this.state.removeAllClickables();
			return;
		}

		if (keyGesture.key == "a" && keyGesture.ctrl) {
			if (this.state.amountSelected == this.world.clickables.length)
				this.state.clearSelected();
			else
				this.state.selectAllClickables();
			return;
		}
	}
}