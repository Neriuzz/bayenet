import DragGesture from "../gestures/DragGesture";
import IDraggable from "../interfaces/IDraggable";
import Vector2D from "../util/Vector2D";

export default abstract class DraggableEntity implements IDraggable {
	public draggable = true;
	public dragging = false;
	public zIndex = 1;

	protected initialPosition: Vector2D;
	protected dragStartPosition: Vector2D | null = null;

	constructor(public id: number, protected currentPosition: Vector2D) {
		this.initialPosition = new Vector2D(this.currentPosition.x, this.currentPosition.y);
	}

	public onDragStart(dragGesture: DragGesture) {
		this.dragging = true;
		this.dragStartPosition = dragGesture.position;
		this.initialPosition = new Vector2D(this.currentPosition.x, this.currentPosition.y);
	}

	public onDrag(dragGesture: DragGesture) {
		this.zIndex = dragGesture.zIndex || this.zIndex;
		let deltaPosition = new Vector2D(dragGesture.position.x - this.dragStartPosition!.x, dragGesture.position.y - this.dragStartPosition!.y);
		this.currentPosition = new Vector2D(this.initialPosition.x + deltaPosition.x, this.initialPosition.y + deltaPosition.y);
	}

	public onDragEnd(dragGesture: DragGesture) {
		this.dragging = false;
		this.dragStartPosition = null;
		this.zIndex = dragGesture.zIndex || this.zIndex;
	}

	public get position(): Vector2D {
		return this.currentPosition;
	}

	public abstract isMouseOver(position: Vector2D): boolean
};