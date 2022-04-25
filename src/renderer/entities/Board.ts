
import EventBus from "../../events/EventBus";

import Camera from "../Camera";
import { ClickGesture, DragGesture, KeyGesture } from "../gestures";
import Vector2D from "../util/Vector2D";

export default class Board {
	public dragging = false;

	private initialPosition = new Vector2D(0, 0);
	private currentPosition = new Vector2D(0, 0);
	private dragStartPosition: Vector2D | null = null;

	private eventBus = EventBus.instance;

	public readonly camera: Camera;

	constructor (public readonly canvas: HTMLCanvasElement, public readonly context: CanvasRenderingContext2D) {
		this.camera = new Camera(this.canvas, this.context);
	}

	public onClick(clickGesture: ClickGesture) {
		this.eventBus.emit("toggleSidebar");

		if (clickGesture.world.edgeBeingCreated)
			clickGesture.world.undo();
		
		clickGesture.world.deselectAllClickables();
	}
	
	public onDoubleClick(clickGesture: ClickGesture) {
		clickGesture.world.createNode(clickGesture.position);
	}

	public onDragStart(dragGesture: DragGesture) {
		this.dragging = true;
		this.dragStartPosition = dragGesture.position;
		this.initialPosition = new Vector2D(this.currentPosition.x, this.currentPosition.y);
	}

	public onDrag(dragGesture: DragGesture) {
		const deltaPosition = new Vector2D(dragGesture.position.x - this.dragStartPosition!.x, dragGesture.position.y - this.dragStartPosition!.y);
		this.currentPosition = new Vector2D(this.initialPosition!.x + deltaPosition.x, this.initialPosition!.y + deltaPosition.y);
		this.camera.position = this.currentPosition;
	}

	public onDragEnd() {
		this.dragging = false;
		this.dragStartPosition = null;
	}

	public onKeyDown(keyGesture: KeyGesture) {
		if (keyGesture.key == "Delete" && keyGesture.world.numberOfClickablesSelected > 0) {
			keyGesture.world.removeAllSelectedClickables();
			return;
		}

		if (keyGesture.key == "a" && keyGesture.ctrl) {
			if (keyGesture.world.numberOfClickablesSelected == keyGesture.world.clickablesSize)
				keyGesture.world.deselectAllClickables();
			else
				keyGesture.world.selectAllClickables();
			return;
		}

		if (keyGesture.key == "z" && keyGesture.ctrl)
			keyGesture.world.undo();
	}
}