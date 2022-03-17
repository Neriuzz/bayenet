import Vector2D from "./util/Vector2D";

export default class Camera {
	
	public dragging = false;
	private _initialPosition = new Vector2D(0, 0);
	private _currentPosition = new Vector2D(0, 0);
	private _dragStartPosition: Vector2D | null = null;

	constructor(private _canvas: HTMLCanvasElement, private _context: CanvasRenderingContext2D) {}

	public onDragStart(e: MouseEvent) {
		this.dragging = true;
		this._dragStartPosition = new Vector2D(e.clientX, e.clientY);
		this._initialPosition = new Vector2D(this._currentPosition.x, this._currentPosition.y);
	}

	public onDragEnd(e: MouseEvent) {
		this.dragging = false;
		this._dragStartPosition = null;
	}
	
	public onDrag(e: MouseEvent) {
		let deltaPosition = new Vector2D(e.clientX - this._dragStartPosition!.x, e.clientY - this._dragStartPosition!.y);
		this._currentPosition = new Vector2D(this._initialPosition.x + deltaPosition.x, this._initialPosition.y + deltaPosition.y);
	}

	public clearScreen() {
		this._context.setTransform(1, 0, 0, 1, 0, 0);
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._context.translate(this._currentPosition.x, this._currentPosition.y);
	}

	public get currentPosition(): Vector2D {
		return this._currentPosition;
	}

	public get canvasBounds(): Vector2D {
		return new Vector2D(this._canvas.width, this._canvas.height);
	}
}
