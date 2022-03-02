import Vector2D from "./Vector2D";

export default class Camera {
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;

	private mouseDown: boolean = false;
	
	private initialPosition: Vector2D;
	private currentPosition: Vector2D;
	private dragStartPosition: Vector2D | null = null;

	constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		// Register canvas and context
		this.canvas = canvas;
		this.context = context;

		// Set initial and current positions
		this.currentPosition = new Vector2D(0, 0);
		this.initialPosition = new Vector2D(0, 0);

		// Register event listeners for the camera
		this.registerEventListeners();
	}

	private registerEventListeners() {
		this.canvas.addEventListener("mousedown", (e: MouseEvent) => this.onMouseDown(e));
		this.canvas.addEventListener("mouseup", (e: MouseEvent) => this.onMouseUp(e));
		this.canvas.addEventListener("mousemove", (e: MouseEvent) => this.onMouseMove(e));
	}

	private onMouseDown(e: MouseEvent) {
		e.preventDefault();
		this.mouseDown = true;
		this.dragStartPosition = new Vector2D(e.clientX, e.clientY);
		this.initialPosition = new Vector2D(this.currentPosition.x, this.currentPosition.y);
	}

	private onMouseUp(e: MouseEvent) {
		e.preventDefault();
		this.mouseDown = false;
		this.dragStartPosition = null;
	}
	
	private onMouseMove(e: MouseEvent) {
		e.preventDefault();
		if (!this.mouseDown)
			return;
		let deltaPosition = new Vector2D(e.clientX - this.dragStartPosition!.x, e.clientY - this.dragStartPosition!.y);
		this.currentPosition = new Vector2D(this.initialPosition.x + deltaPosition.x, this.initialPosition.y + deltaPosition.y);
	}

	public getOffset(): Vector2D {
		return this.currentPosition;
	}

	public clearScreen() {
		this.context.setTransform(1, 0, 0, 1, 0, 0);
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.translate(this.currentPosition.x, this.currentPosition.y);
	}

	public getCurrentPosition(): Vector2D {
		return this.currentPosition;
	}

	public getCanvas(): HTMLCanvasElement {
		return this.canvas;
	}

	public getCanvasBounds(): Vector2D {
		return new Vector2D(this.canvas.width, this.canvas.height);
	}
}
