import Vector2D from "./Vector2D";

export default class Camera {
	private _mouseDown: boolean = false;
	
	private _initialPosition: Vector2D;
	private _currentPosition: Vector2D;
	private _mousePosition: Vector2D;
	private _dragStartPosition: Vector2D | null = null;

	constructor(private _canvas: HTMLCanvasElement, private _context: CanvasRenderingContext2D) {

		// Set initial and current positions
		this._currentPosition = new Vector2D(0, 0);
		this._initialPosition = new Vector2D(0, 0);
		this._mousePosition = new Vector2D(0, 0);

		// Register event listeners for the camera
		this.registerEventListeners();
	}

	private registerEventListeners() {
		this._canvas.addEventListener("mousedown", (e: MouseEvent) => this.onMouseDown(e));
		this._canvas.addEventListener("mouseup", (e: MouseEvent) => this.onMouseUp(e));
		this._canvas.addEventListener("mousemove", (e: MouseEvent) => this.onMouseMove(e));
	}

	private onMouseDown(e: MouseEvent) {
		e.preventDefault();
		this._mouseDown = true;
		this._dragStartPosition = new Vector2D(e.clientX, e.clientY);
		this._initialPosition = new Vector2D(this._currentPosition.x, this._currentPosition.y);
	}

	private onMouseUp(e: MouseEvent) {
		e.preventDefault();
		this._mouseDown = false;
		this._dragStartPosition = null;
	}
	
	private onMouseMove(e: MouseEvent) {
		e.preventDefault();
		this._mousePosition = new Vector2D(e.clientX, e.clientY);
		if (!this._mouseDown)
			return;
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

	public get mousePosition(): Vector2D {
		return this._mousePosition;
	}
}
