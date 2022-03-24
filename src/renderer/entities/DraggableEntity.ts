import DragGesture from "../gestures/DragGesture";
import IDraggable from "../interfaces/IDraggable";
import Vector2D from "../util/Vector2D";

export default abstract class DraggableEntity implements IDraggable {
	public draggable = true;
	public dragging = false;
	public zIndex = 1;

	protected _initialPosition: Vector2D;
	protected _dragStartPosition: Vector2D | null = null;

	constructor(public id: number, protected _currentPosition: Vector2D) {
		this._initialPosition = new Vector2D(this._currentPosition.x, this._currentPosition.y);
	}

	public onDragStart(dragGesture: DragGesture) {
		this.dragging = true;
		this._dragStartPosition = dragGesture.position;
		this._initialPosition = new Vector2D(this._currentPosition.x, this._currentPosition.y);
	}

	public onDrag(dragGesture: DragGesture) {
		this.zIndex = dragGesture.zIndex || this.zIndex;
		let deltaPosition = new Vector2D(dragGesture.position.x - this._dragStartPosition!.x, dragGesture.position.y - this._dragStartPosition!.y);
		this._currentPosition = new Vector2D(this._initialPosition.x + deltaPosition.x, this._initialPosition.y + deltaPosition.y);
	}

	public onDragEnd(dragGesture: DragGesture) {
		this.dragging = false;
		this._dragStartPosition = null;
		this.zIndex = dragGesture.zIndex || this.zIndex;
	}

	public get currentPosition(): Vector2D {
		return this._currentPosition;
	}

	public abstract isMouseOver(cameraPosition: Vector2D, mousePosition: Vector2D): boolean
};