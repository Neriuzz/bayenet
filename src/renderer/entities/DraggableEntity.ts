import Vector2D from "../util/Vector2D";

export default abstract class DraggableEntity {
	public dragging = false;

	protected _initialPosition: Vector2D;
	protected _dragStartPosition: Vector2D | null = null;

	constructor(protected _currentPosition: Vector2D) {
		this._initialPosition = new Vector2D(this._currentPosition.x, this._currentPosition.y);
	}

	public onDragStart(event: MouseEvent) {
		this.dragging = true;
		this._dragStartPosition = new Vector2D(event.clientX, event.clientY);
		this._initialPosition = new Vector2D(this._currentPosition.x, this._currentPosition.y);
	}

	public onDrag(event: MouseEvent) {
		let deltaPosition = new Vector2D(event.clientX - this._dragStartPosition!.x, event.clientY - this._dragStartPosition!.y);
		this._currentPosition = new Vector2D(this._initialPosition.x + deltaPosition.x, this._initialPosition.y + deltaPosition.y);
	}

	public onDragEnd(event: MouseEvent) {
		this.dragging = false;
		this._dragStartPosition = null;
	}

	public get currentPosition(): Vector2D {
		return this._currentPosition;
	}
};